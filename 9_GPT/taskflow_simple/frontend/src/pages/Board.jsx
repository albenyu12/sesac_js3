import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns';
import { api } from '../api';
import classNames from 'classnames';
import { Lightning, Note, CheckCircle, PushPin, PencilSimple, ChartBar, ArrowLeft, Trash, Plus } from '@phosphor-icons/react';

export function Board({ projectId, onBack, onViewGantt }) {
    const [loading, setLoading] = useState(true);
    const [board, setBoard] = useState(null);
    const [err, setErr] = useState('');
    const [newTitleByCol, setNewTitleByCol] = useState({});
    const [selectedTask, setSelectedTask] = useState(null); // For Task Modal

    async function load() {
        setLoading(true);
        setErr('');
        try {
            const data = await api.board(projectId);
            Object.keys(data.tasksByColumn).forEach(colId => {
                data.tasksByColumn[colId].sort((a, b) => a.ord - b.ord);
            });
            setBoard(data);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [projectId]);

    async function addTask(columnId) {
        const title = (newTitleByCol[columnId] || '').trim();
        if (!title) return;
        await api.createTask(columnId, { title });
        setNewTitleByCol((p) => ({ ...p, [columnId]: '' }));
        load();
    }

    async function onDragEnd(result) {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const destColId = destination.droppableId;
        await api.moveTask(draggableId, {
            toColumnId: destColId,
            toOrder: destination.index + 1
        });
        load();
    }

    async function saveTaskDetails() {
        if (!selectedTask) return;
        await api.updateTask(selectedTask.id, {
            title: selectedTask.title,
            description: selectedTask.description,
            startDate: selectedTask.startDate,
            dueDate: selectedTask.dueDate
        });
        setSelectedTask(null);
        load();
    }

    async function deleteTask(taskId) {
        if (!confirm('삭제하시겠습니까?')) return;
        await api.deleteTask(taskId);
        if (selectedTask?.id === taskId) setSelectedTask(null);
        load();
    }


    if (loading && !board) return <div className="container py-12 text-center text-gray-500">Loading...</div>;
    if (err) return <div className="container py-12 text-red-500">Error: {err}</div>;
    if (!board) return null;

    // Column styles based on order or name
    const getColStyle = (name) => {
        if (name.toLowerCase() === 'todo') return 'bg-orange-50/50 border-orange-100';
        if (name.toLowerCase() === 'doing') return 'bg-blue-50/50 border-blue-100';
        if (name.toLowerCase() === 'done') return 'bg-green-50/50 border-green-100';
        return 'bg-gray-50/50 border-gray-200';
    };

    const getHeaderColor = (name) => {
        if (name.toLowerCase() === 'todo') return 'text-orange-700 bg-orange-100';
        if (name.toLowerCase() === 'doing') return 'text-blue-700 bg-blue-100';
        if (name.toLowerCase() === 'done') return 'text-green-700 bg-green-100';
        return 'text-gray-700 bg-gray-100';
    };

    const getStatusIcon = (colName) => {
        const n = colName.toLowerCase();
        if (n === 'todo') return <Note size={20} weight="duotone" className="text-orange-600" />;
        if (n === 'doing') return <Lightning size={20} weight="duotone" className="text-blue-600" />;
        if (n === 'done') return <CheckCircle size={20} weight="duotone" className="text-green-600" />;
        return <PushPin size={20} weight="duotone" className="text-gray-600" />;
    };

    return (
        <div className="container h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Kanban Board</h1>
                    <h2 className="text-lg text-gray-500 font-medium">
                        {board.project?.name || 'Untitled Project'}
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button className="btn flex items-center gap-2" onClick={onViewGantt}>
                        <ChartBar size={18} /> Gantt Chart
                    </button>
                    <button className="btn flex items-center gap-2" onClick={onBack}>
                        <ArrowLeft size={18} /> Back
                    </button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 h-full w-full items-start overflow-x-auto pb-4">
                    {board.columns.map((col) => (
                        <div className={`flex-1 min-w-[300px] flex flex-col rounded-xl border ${getColStyle(col.name)} transition-colors duration-300 max-h-full`} key={col.id}>
                            <div className="p-4 rounded-t-xl sticky top-0 z-10 backdrop-blur-sm">
                                <h3 className="font-bold flex justify-between items-center text-gray-800">
                                    <span className="flex items-center gap-2">
                                        {getStatusIcon(col.name)} {col.name}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getHeaderColor(col.name)}`}>
                                        {board.tasksByColumn[col.id]?.length || 0}
                                    </span>
                                </h3>
                            </div>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={classNames("p-3 flex-1 overflow-y-auto min-h-[100px] relative", {
                                            "bg-black/5": snapshot.isDraggingOver
                                        })}
                                    >
                                        {(!board.tasksByColumn[col.id] || board.tasksByColumn[col.id].length === 0) && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none opacity-60">
                                                <Note size={32} weight="light" className="mb-2" />
                                                <p className="text-sm">Add a task to get started</p>
                                            </div>
                                        )}

                                        {(board.tasksByColumn[col.id] || []).map((t, index) => (
                                            <Draggable key={t.id} draggableId={t.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => setSelectedTask(t)}
                                                        className={classNames(
                                                            "bg-white p-4 mb-3 rounded-xl shadow-sm border border-transparent hover:shadow-lg hover:border-pastel-purple/50 transition-all duration-200 cursor-pointer group",
                                                            { "rotate-2 shadow-xl ring-2 ring-pastel-purple/50 z-50": snapshot.isDragging }
                                                        )}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                                                            {t.title}
                                                        </h4>
                                                        <div className="flex gap-2 text-xs text-gray-400">
                                                            {t.startDate && <span>S: {t.startDate}</span>}
                                                            {t.dueDate && <span>E: {t.dueDate}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            {/* Only allow adding tasks to Todo column (assuming 'Todo' is the name or ord 1) */}
                            {col.name.toLowerCase() === 'todo' && (
                                <div className="p-3 border-t border-black/5 mt-auto">
                                    <div className="flex gap-2">
                                        <input
                                            className="input text-sm py-2"
                                            placeholder="+ New Task"
                                            value={newTitleByCol[col.id] || ''}
                                            onChange={(e) => setNewTitleByCol((p) => ({ ...p, [col.id]: e.target.value }))}
                                            onKeyDown={(e) => e.key === 'Enter' && addTask(col.id)}
                                        />
                                        <button className="btn primary text-sm py-2 px-3 shadow-md hover:shadow-lg transition-all flex items-center justify-center" onClick={() => addTask(col.id)}>
                                            <Plus size={16} weight="bold" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </DragDropContext>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTask(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4 flex justify-between">
                            Edit Task
                            <button className="text-gray-400 hover:text-gray-600" onClick={() => setSelectedTask(null)}>
                                <span className="text-xl">×</span>
                            </button>
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    className="input"
                                    value={selectedTask.title}
                                    onChange={e => setSelectedTask({ ...selectedTask, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="input min-h-[100px] resize-none"
                                    value={selectedTask.description || ''}
                                    onChange={e => setSelectedTask({ ...selectedTask, description: e.target.value })}
                                    placeholder="Add detailed description..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={selectedTask.startDate || ''}
                                        onChange={e => setSelectedTask({ ...selectedTask, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={selectedTask.dueDate || ''}
                                        onChange={e => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-6">
                                <button className="text-red-500 hover:text-red-700 text-sm font-medium px-2" onClick={() => deleteTask(selectedTask.id)}>Delete Task</button>
                                <div className="flex gap-2">
                                    <button className="btn" onClick={() => setSelectedTask(null)}>Cancel</button>
                                    <button className="btn primary" onClick={saveTaskDetails}>Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
