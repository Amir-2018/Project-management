import React, { useState } from 'react';
import { Task, TaskStatus } from '../models';
import TaskDetailModal from './TaskDetailModal';

interface TasksViewProps {
    tasks: Task[];
    onAddTask: () => void;
    onUpdateStatus: (taskId: string, status: TaskStatus) => void;
    onAddComment: (taskId: string, text: string) => void;
    onAddAttachment: (taskId: string, file: File) => void;
    onBack: () => void;
}

const TasksView: React.FC<TasksViewProps> = ({
    tasks,
    onAddTask,
    onUpdateStatus,
    onAddComment,
    onAddAttachment,
    onBack
}) => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [dropTargetStatus, setDropTargetStatus] = useState<TaskStatus | null>(null);

    const columns: TaskStatus[] = ['To Do', 'In Progress', 'Done', 'Finished'];

    const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
    };

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
        e.preventDefault();
        setDropTargetStatus(status);
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragLeave = () => {
        setDropTargetStatus(null);
    };

    const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
        e.preventDefault();
        setDropTargetStatus(null);
        const taskId = e.dataTransfer.getData('taskId') || draggedTaskId;
        if (taskId) {
            onUpdateStatus(taskId, status);
        }
        setDraggedTaskId(null);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        title="Back to Projects"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Board</h2>
                        <p className="text-gray-500 text-sm">Visualize and manage tasks for this project.</p>
                    </div>
                </div>
                <button
                    onClick={onAddTask}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                    <span className="text-xl">+</span> Add Task
                </button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 h-full min-w-max">
                    {columns.map((status) => (
                        <div
                            key={status}
                            onDragOver={(e) => handleDragOver(e, status)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, status)}
                            className={`w-80 flex flex-col rounded-2xl p-4 transition-colors ${dropTargetStatus === status ? 'bg-indigo-50 border-2 border-dashed border-indigo-200' : 'bg-gray-100/50 border-2 border-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-4 px-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-700">{status}</h3>
                                    <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-400">
                                        {getTasksByStatus(status).length}
                                    </span>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                                </button>
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                {getTasksByStatus(status).map((task) => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task.id)}
                                        onClick={() => handleTaskClick(task)}
                                        className={`bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-indigo-300 transition-all cursor-pointer group ${draggedTaskId === task.id ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${task.priority === 'High' ? 'bg-red-100 text-red-600' :
                                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>

                                        <div className="flex justify-between items-center">
                                            <div className="flex -space-x-1">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-indigo-600">
                                                    {task.assignee?.charAt(0) || 'U'}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-400">
                                                {task.comments.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                                        <span className="text-[10px] font-medium">{task.comments.length}</span>
                                                    </div>
                                                )}
                                                {task.attachments.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                        <span className="text-[10px] font-medium">{task.attachments.length}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={onAddTask}
                                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-bold hover:bg-gray-200/50 hover:border-gray-300 transition-all"
                                >
                                    + Add New Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onAddComment={(text) => onAddComment(selectedTask.id, text)}
                    onAddAttachment={(file) => onAddAttachment(selectedTask.id, file)}
                    onUpdateStatus={(status) => onUpdateStatus(selectedTask.id, status)}
                />
            )}
        </div>
    );
};

export default TasksView;
