# 🌊 Workflow Builder Guide

The **Workflow Builder** allows you to chain together multiple AI capabilities to create powerful automation pipelines.

## 🚀 Getting Started

1.  **Login** to the application.
2.  Click on the **Workflows** button in the sidebar (Git Branch icon).

## 🛠️ Building a Workflow

The builder uses a drag-and-drop interface:

1.  **Add Nodes**:
    *   On the left sidebar, you will see a list of available nodes:
        *   🔵 **Input**: Start your workflow here. Enter code or text.
        *   🟣 **AI Explain**: Explains the input code.
        *   🩷 **AI Review**: Reviews the input code for errors and improvements.
        *   🟢 **Output**: Displays the final result.
    *   **Drag** a node from the sidebar and **drop** it onto the canvas.

2.  **Connect Nodes**:
    *   Click and drag from the **handle** (small dot) of one node to the handle of another node.
    *   **Flow**: `Input` -> `AI Node` -> `Output`.
    *   Example: Connect `Input` source handle to `AI Explain` target handle. Then connect `AI Explain` source handle to `Output` target handle.

3.  **Configure Input**:
    *   Click on the **Input Node** to select it (if configurable options are added in future).
    *   Currently, the Input Node has a default text box. **Type your code** or text into the input field within the node.

## ▶️ Running the Workflow

1.  Once your nodes are connected, click the **Run Workflow** button in the top toolbar.
2.  The button will show "Running..." and a spinner.
3.  Wait for the execution to complete.

## 📊 Viewing Results

1.  When execution finishes, the results will be displayed.
2.  (Future Feature) You can click on individual nodes to see their specific output.
3.  Check the **Dashboard** to see the activity log of your workflow execution.

## 💡 Example Workflow

**Goal**: Explain a Python function.

1.  Drag **Input Node**.
    *   Enter: `def hello(): print("world")`
2.  Drag **AI Explain Node**.
3.  Drag **Output Node**.
4.  Connect: `Input` -> `AI Explain` -> `Output`.
5.  Click **Run**.
6.  The AI will generate an explanation for your code!
