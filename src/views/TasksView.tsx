import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, MessageSquare, Paperclip, Plus, Layout } from 'lucide-react';
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
                        className="p-2 hover:bg-indigo-50 rounded-full transition-all text-indigo-600 group"
                        title="Back to Projects"
                    >
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Board</h2>
                        <p className="text-slate-400 font-medium text-sm">Visualize and manage tasks for this project.</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 h-full">
                    {columns.map((status) => (
                        <div
                            key={status}
                            onDragOver={(e) => handleDragOver(e, status)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, status)}
                            className={`flex-1 min-w-[300px] flex flex-col rounded-[2rem] p-6 transition-all duration-300 ${dropTargetStatus === status ? 'bg-indigo-50 border-2 border-dashed border-indigo-200' : 'bg-slate-50 border-2 border-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-6 px-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">{status}</h3>
                                    <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 shadow-sm">
                                        {getTasksByStatus(status).length}
                                    </span>
                                </div>
                                <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                                {getTasksByStatus(status).map((task) => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task.id)}
                                        onClick={() => handleTaskClick(task)}
                                        className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group ${draggedTaskId === task.id ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${task.priority === 'High' ? 'bg-red-50 text-red-600' :
                                                task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                                                    'bg-blue-50 text-blue-600'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        <h4 className="font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors tracking-tight uppercase text-sm">{task.title}</h4>
                                        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed font-medium">{task.description}</p>

                                        <div className="flex justify-between items-center">
                                            <div className="flex -space-x-1">
                                                <div className="w-8 h-8 rounded-xl bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm uppercase">
                                                    {task.assignee?.charAt(0) || 'U'}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-300">
                                                {task.comments.length > 0 && (
                                                    <div className="flex items-center gap-1.5 group/icon">
                                                        <MessageSquare className="w-4 h-4 group-hover/icon:text-indigo-500 transition-colors" />
                                                        <span className="text-[10px] font-black">{task.comments.length}</span>
                                                    </div>
                                                )}
                                                {task.attachments.length > 0 && (
                                                    <div className="flex items-center gap-1.5 group/icon">
                                                        <Paperclip className="w-4 h-4 group-hover/icon:text-indigo-500 transition-colors" />
                                                        <span className="text-[10px] font-black">{task.attachments.length}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={onAddTask}
                                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add New Task
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
