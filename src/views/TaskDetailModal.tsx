import React, { useState } from 'react';
import { Task, Comment, Attachment } from '../models';

interface TaskDetailModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onAddComment: (text: string) => void;
    onAddAttachment: (file: File) => void;
    onUpdateStatus: (status: Task['status']) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
    task,
    isOpen,
    onClose,
    onAddComment,
    onAddAttachment,
    onUpdateStatus
}) => {
    const [newComment, setNewComment] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    if (!isOpen) return null;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onAddAttachment(files[0]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-start bg-gray-50/50">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${task.priority === 'High' ? 'bg-red-100 text-red-600' :
                                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-blue-100 text-blue-600'
                                }`}>
                                {task.priority} Priority
                            </span>
                            <span className="text-gray-400 text-sm">#TASK-{task.id}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex">
                    {/* Main Content */}
                    <div className="flex-[2] p-6 border-r space-y-8">
                        <section>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {task.description || 'No description provided for this task.'}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Attachments</h3>
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                </div>
                                <p className="text-sm font-medium text-gray-700">Drop files here to upload</p>
                                <p className="text-xs text-gray-400 mt-1">or click to browse from computer</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {task.attachments.map((file) => (
                                    <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 group hover:border-indigo-200 transition-colors">
                                        <div className="w-10 h-10 bg-white rounded flex items-center justify-center border text-indigo-500">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                            <p className="text-[10px] text-gray-400 uppercase">{file.type} • {(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="flex-1 bg-gray-50/30 p-6 flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto space-y-6">
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Status</h3>
                                <select
                                    value={task.status}
                                    onChange={(e) => onUpdateStatus(e.target.value as Task['status'])}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                    <option value="Finished">Finished</option>
                                </select>
                            </section>

                            <section className="flex-1">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Activity</h3>
                                <div className="space-y-4">
                                    {task.comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                                                {comment.userName.charAt(0)}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-800">{comment.userName}</span>
                                                    <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-snug">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="mt-6 pt-6 border-t">
                            <div className="relative">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                    rows={3}
                                />
                                <button
                                    onClick={() => {
                                        if (newComment.trim()) {
                                            onAddComment(newComment);
                                            setNewComment('');
                                        }
                                    }}
                                    className="mt-2 w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
                                >
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
