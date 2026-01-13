import { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, parseISO, isValid } from 'date-fns';
import classNames from 'classnames';
import { ArrowLeft, CaretLeft, CaretRight, Note, Lightning, CheckCircle, PushPin } from '@phosphor-icons/react';

export function GanttChart({ projectId, onBack }) {
    const [loading, setLoading] = useState(true);
    const [board, setBoard] = useState(null);
    const [err, setErr] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Default Jan 2026

    const startDate = useMemo(() => startOfMonth(currentDate), [currentDate]);
    const endDate = useMemo(() => endOfMonth(currentDate), [currentDate]);

    const days = useMemo(() => eachDayOfInterval({ start: startDate, end: endDate }), [startDate, endDate]);

    async function load() {
        setLoading(true);
        setErr('');
        try {
            const data = await api.board(projectId);
            setBoard(data);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [projectId]);

    // ... (keep existing helper functions saveTaskDetails, deleteTask, getColColor, getBarColor)

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

    const getColColor = (colId) => {
        const col = board.columns.find(c => c.id === colId);
        if (!col) return 'bg-gray-200 text-gray-700 border-gray-300';
        const name = col.name.toLowerCase();
        if (name === 'todo') return 'bg-orange-100 text-orange-700 border-orange-200';
        if (name === 'doing') return 'bg-blue-100 text-blue-700 border-blue-200';
        if (name === 'done') return 'bg-green-100 text-green-700 border-green-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getBarColor = (colId) => {
        const col = board.columns.find(c => c.id === colId);
        if (!col) return 'bg-gray-400';
        const name = col.name.toLowerCase();
        if (name === 'todo') return 'bg-orange-400';
        if (name === 'doing') return 'bg-blue-400';
        if (name === 'done') return 'bg-green-400';
        return 'bg-gray-400';
    };

    const getStatusIcon = (colName) => {
        const n = (colName || '').toLowerCase();
        if (n === 'todo') return <Note size={14} weight="duotone" className="text-orange-600" />;
        if (n === 'doing') return <Lightning size={14} weight="duotone" className="text-blue-600" />;
        if (n === 'done') return <CheckCircle size={14} weight="duotone" className="text-green-600" />;
        return <PushPin size={14} weight="duotone" className="text-gray-600" />;
    };

    if (loading) return <div className="container py-12 text-center text-gray-500">Loading...</div>;
    if (err) return <div className="container py-12 text-red-500">Error: {err}</div>;
    if (!board) return null;

    const allTasks = Object.values(board.tasksByColumn)
        .flat()
        .filter(task => {
            // Filter tasks that overlap with the current month
            const tStart = task.startDate ? parseISO(task.startDate) : null;
            const tEnd = task.dueDate ? parseISO(task.dueDate) : (task.endDate ? parseISO(task.endDate) : tStart);

            if (!tStart || !tEnd) return false;

            // Check for overlap: taskStart <= monthEnd AND taskEnd >= monthStart
            return tStart <= endDate && tEnd >= startDate;
        })
        .sort((a, b) => {
            // Strict sorting by start date, then due date, then title
            if (a.startDate !== b.startDate) {
                if (!a.startDate) return 1;
                if (!b.startDate) return -1;
                return a.startDate.localeCompare(b.startDate);
            }
            if (a.dueDate !== b.dueDate) {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return a.dueDate.localeCompare(b.dueDate);
            }
            return a.title.localeCompare(b.title);
        });

    const moveMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    return (
        <div className="container h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Project Schedule</h2>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <button className="hover:text-gray-800" onClick={() => moveMonth(-1)}>
                            <CaretLeft size={16} />
                        </button>
                        <span>{format(currentDate, 'MMMM yyyy')}</span>
                        <button className="hover:text-gray-800" onClick={() => moveMonth(1)}>
                            <CaretRight size={16} />
                        </button>
                    </div>
                </div>
                <button className="btn flex items-center gap-2" onClick={onBack}>
                    <ArrowLeft size={18} /> Back to Board
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1">
                <div className="overflow-auto flex-1 relative">
                    <table className="min-w-max border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-50 shadow-sm">
                            <tr>
                                <th className="p-3 text-left w-64 border-b border-r border-gray-100 font-semibold text-gray-600 sticky left-0 bg-gray-50 z-50">Task</th>
                                {days.map(d => (
                                    <th key={d.toString()} className="min-w-[40px] border-b border-r border-gray-100 text-center text-xs text-gray-500 p-1">
                                        {format(d, 'd')}
                                        <div className="text-[10px] font-normal">{format(d, 'EEE')}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {allTasks.map(task => {
                                const tStart = task.startDate ? parseISO(task.startDate) : null;
                                const tEnd = task.dueDate ? parseISO(task.dueDate) : (task.endDate ? parseISO(task.endDate) : tStart);
                                const colName = board.columns.find(c => c.id === task.columnId)?.name || 'Unknown';

                                return (
                                    <tr
                                        key={task.id}
                                        className="group cursor-pointer hover:bg-gray-50/50"
                                        onClick={() => setSelectedTask(task)}
                                    >
                                        <td className="p-3 border-b border-r border-gray-100 sticky left-0 bg-white group-hover:bg-gray-50 z-40 transition-colors">
                                            <div className="font-medium text-sm truncate w-60 flex items-center gap-2">
                                                <span className="text-xs">{getStatusIcon(colName)}</span>
                                                {task.title}
                                            </div>
                                            <div className="text-xs text-gray-400 pl-6">{task.startDate} ~ {task.dueDate}</div>
                                        </td>
                                        {days.map(d => {
                                            let isActive = false;
                                            let isStart = false;
                                            let isEnd = false;

                                            if (tStart && isValid(tStart) && tEnd && isValid(tEnd)) {
                                                const dTime = d.getTime();
                                                const sTime = new Date(tStart).setHours(0, 0, 0, 0);
                                                const eTime = new Date(tEnd).setHours(0, 0, 0, 0);

                                                if (dTime >= sTime && dTime <= eTime) {
                                                    isActive = true;
                                                    if (dTime === sTime) isStart = true;
                                                    if (dTime === eTime) isEnd = true;
                                                }
                                            }

                                            return (
                                                <td key={d.toString()} className="border-b border-r border-gray-50 p-0 h-10 relative">
                                                    {isActive && (
                                                        <div
                                                            className={classNames(
                                                                "h-6 mx-0.5 rounded-sm opacity-80 transition-all hover:opacity-100 hover:scale-105 shadow-sm",
                                                                getBarColor(task.columnId),
                                                                {
                                                                    "rounded-l-md": isStart,
                                                                    "rounded-r-md": isEnd
                                                                }
                                                            )}
                                                            title={`${task.title} (${task.status})`}
                                                        ></div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTask(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4 flex justify-between">
                            Edit Task
                            <button className="text-gray-400 hover:text-gray-600" onClick={() => setSelectedTask(null)}>✕</button>
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
