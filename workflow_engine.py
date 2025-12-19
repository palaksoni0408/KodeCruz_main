import json
import asyncio
import logging
from typing import Dict, List, Any
from datetime import datetime
from sqlalchemy.orm import Session
import models
from ai_engine import (
    explain_code,
    review_code,
    generate_tests,
    refactor_code
)

logger = logging.getLogger(__name__)

class WorkflowEngine:
    def __init__(self, db: Session):
        self.db = db

    async def execute_workflow(self, execution_id: str):
        execution = self.db.query(models.WorkflowExecution).filter(
            models.WorkflowExecution.id == execution_id
        ).first()
        
        if not execution:
            logger.error(f"Execution {execution_id} not found")
            return

        workflow = execution.workflow
        nodes = json.loads(workflow.nodes)
        edges = json.loads(workflow.edges)
        
        # Simple topological sort or just find start node
        # For MVP, assuming linear chain or simple DAG
        
        execution.status = "running"
        execution.started_at = datetime.utcnow()
        self.db.commit()

        results = {}
        context = {}  # Store outputs from nodes

        try:
            # Build adjacency list
            adj = {node['id']: [] for node in nodes}
            for edge in edges:
                adj[edge['source']].append(edge['target'])
            
            # Find start node (node with no incoming edges)
            incoming = {node['id']: 0 for node in nodes}
            for edge in edges:
                incoming[edge['target']] += 1
            
            queue = [node for node in nodes if incoming[node['id']] == 0]
            
            while queue:
                current_node = queue.pop(0)
                node_id = current_node['id']
                node_type = current_node['type']
                node_data = current_node['data']
                
                logger.info(f"Executing node {node_id} ({node_type})")
                
                # Data Flow: Get input from previous node
                incoming_edges = [e for e in edges if e['target'] == node_id]
                if incoming_edges:
                    # For MVP, just take the first incoming edge's source output
                    source_id = incoming_edges[0]['source']
                    incoming_data = context.get(source_id)
                    
                    # If incoming data exists and node doesn't have explicit input override
                    if incoming_data and not node_data.get('input'):
                        node_data['input'] = incoming_data

                # Execute Node Logic
                output = await self._execute_node(node_type, node_data, context)
                results[node_id] = output
                context[node_id] = output
                
                # Add neighbors
                for neighbor_id in adj[node_id]:
                    incoming[neighbor_id] -= 1
                    if incoming[neighbor_id] == 0:
                        neighbor_node = next(n for n in nodes if n['id'] == neighbor_id)
                        queue.append(neighbor_node)

            execution.status = "completed"
            execution.results = json.dumps(results)
            execution.completed_at = datetime.utcnow()
            
        except Exception as e:
            logger.error(f"Workflow execution failed: {str(e)}")
            execution.status = "failed"
            execution.error = str(e)
            execution.completed_at = datetime.utcnow()
        
        self.db.commit()

    async def _execute_node(self, node_type: str, data: Dict, context: Dict) -> Any:
        # Get input from previous node if linked
        input_text = data.get('input', '')
        
        # If input is a reference to another node's output (e.g., "{{node_1.output}}")
        # For MVP, we'll just take the output of the immediate predecessor if input is empty
        # or implement a simple variable substitution
        
        if node_type == 'input':
            return input_text
            
        elif node_type == 'ai_explain':
            # Assuming input_text is code. Providing defaults for other params.
            return explain_code(language="python", topic="General", level="Beginner", code=input_text)
            
        elif node_type == 'ai_review':
            return review_code(code=input_text, language="python")
            
        elif node_type == 'ai_test':
            return generate_tests(code=input_text, language="python", framework="pytest")
            
        elif node_type == 'ai_refactor':
            return refactor_code(code=input_text, language="python", refactor_type="general")
            
        return None
