import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    Connection,
    Node,
    Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Save, Trash2 } from 'lucide-react';
import { apiService } from '../../services/api';

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Input Code' },
        position: { x: 250, y: 5 },
    },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function WorkflowBuilder() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [workflowName, setWorkflowName] = useState('My Workflow');
    const [isRunning, setIsRunning] = useState(false);

    const [results, setResults] = useState<Record<string, any>>({});
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - (reactFlowWrapper.current?.getBoundingClientRect().left || 0),
                y: event.clientY - (reactFlowWrapper.current?.getBoundingClientRect().top || 0),
            });

            const newNode: Node = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes],
    );

    const handleSave = async () => {
        if (reactFlowInstance) {
            const flow = reactFlowInstance.toObject();
            try {
                await apiService.createWorkflow(
                    workflowName,
                    JSON.stringify(flow.nodes),
                    JSON.stringify(flow.edges)
                );
                alert('Workflow saved successfully!');
            } catch (error) {
                console.error('Failed to save workflow:', error);
                alert('Failed to save workflow');
            }
        }
    };

    const handleRun = async () => {
        if (!reactFlowInstance) return;
        setIsRunning(true);
        setResults({});

        try {
            const flow = reactFlowInstance.toObject();
            // Create workflow first (or update) - for MVP we just create new one to get ID
            // In a real app we'd manage ID persistence
            const workflow = await apiService.createWorkflow(
                workflowName,
                JSON.stringify(flow.nodes),
                JSON.stringify(flow.edges)
            );

            const { execution_id } = await apiService.runWorkflow(workflow.id);

            // Poll for completion
            const pollInterval = setInterval(async () => {
                try {
                    const statusData = await apiService.getWorkflowExecution(execution_id);
                    if (statusData.status === 'completed' || statusData.status === 'failed') {
                        clearInterval(pollInterval);
                        setIsRunning(false);
                        if (statusData.results) {
                            // Parse results if string
                            const parsedResults = typeof statusData.results === 'string'
                                ? JSON.parse(statusData.results)
                                : statusData.results;
                            setResults(parsedResults);
                        }
                    }
                } catch (e) {
                    console.error("Polling error", e);
                    clearInterval(pollInterval);
                    setIsRunning(false);
                }
            }, 1000);

        } catch (error) {
            console.error('Failed to run workflow:', error);
            setIsRunning(false);
            alert('Failed to run workflow');
        }
    };

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden relative">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                        className="bg-transparent text-white font-bold text-lg focus:outline-none border-b border-transparent focus:border-indigo-500 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                    >
                        <Save size={18} />
                        Save
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className={`flex items-center gap-2 px-4 py-2 ${isRunning ? 'bg-indigo-500/50' : 'bg-indigo-500 hover:bg-indigo-600'} text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20`}
                    >
                        <Play size={18} className={isRunning ? 'animate-spin' : ''} />
                        {isRunning ? 'Running...' : 'Run Workflow'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex relative">
                {/* Sidebar */}
                <div className="w-64 border-r border-white/10 bg-white/5 p-4 flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Nodes</h3>

                    <div className="space-y-2">
                        <div
                            className="p-3 bg-slate-800 rounded-lg border border-white/10 cursor-move hover:border-indigo-500/50 transition-all flex items-center gap-3"
                            onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'input')}
                            draggable
                        >
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-medium text-white">Input</span>
                        </div>

                        <div
                            className="p-3 bg-slate-800 rounded-lg border border-white/10 cursor-move hover:border-indigo-500/50 transition-all flex items-center gap-3"
                            onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'ai_explain')}
                            draggable
                        >
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-sm font-medium text-white">AI Explain</span>
                        </div>

                        <div
                            className="p-3 bg-slate-800 rounded-lg border border-white/10 cursor-move hover:border-indigo-500/50 transition-all flex items-center gap-3"
                            onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'ai_review')}
                            draggable
                        >
                            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                            <span className="text-sm font-medium text-white">AI Review</span>
                        </div>

                        <div
                            className="p-3 bg-slate-800 rounded-lg border border-white/10 cursor-move hover:border-indigo-500/50 transition-all flex items-center gap-3"
                            onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'output')}
                            draggable
                        >
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-sm font-medium text-white">Output</span>
                        </div>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 h-full" ref={reactFlowWrapper}>
                    <ReactFlowProvider>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onNodeClick={onNodeClick}
                            fitView
                            className="bg-slate-900"
                        >
                            <Controls className="bg-white/10 border border-white/10 text-white fill-white" />
                            <Background color="#4f46e5" gap={16} size={1} className="opacity-10" />
                            {selectedNode && (
                                <Panel position="top-right" className="bg-slate-800 p-4 rounded-lg border border-white/10 w-80 max-h-[500px] overflow-y-auto shadow-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-white">{selectedNode.data.label}</h3>
                                        <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                                        {results[selectedNode.id] ? (
                                            typeof results[selectedNode.id] === 'string' ? results[selectedNode.id] : JSON.stringify(results[selectedNode.id], null, 2)
                                        ) : (
                                            selectedNode.type === 'input' ? (
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Input Code:</label>
                                                    <textarea
                                                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white text-xs font-mono"
                                                        rows={5}
                                                        defaultValue={selectedNode.data.input || ''}
                                                        onChange={(e) => {
                                                            selectedNode.data.input = e.target.value;
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <span className="italic opacity-50">No output yet. Run the workflow.</span>
                                            )
                                        )}
                                    </div>
                                </Panel>
                            )}
                        </ReactFlow>
                    </ReactFlowProvider>
                </div>
            </div>
        </div>
    );
}
