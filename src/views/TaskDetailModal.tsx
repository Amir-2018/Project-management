import React, { useState } from 'react';
import { X, Upload, FileText, Send, Calendar, User, Tag, ArrowUpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Task, Comment, Attachment } from '../models';

interface TaskDetailModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onAddComment: (text: string) => void;
    onAddAttachment: (file: File) => void;
    onUpdateStatus: (status: Task['status']) => void;
    onUpdateTask: (updates: Partial<Task>) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
    task,
    isOpen,
    onClose,
    onAddComment,
    onAddAttachment,
    onUpdateStatus,
    onUpdateTask
}) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);
    const [editAssignee, setEditAssignee] = useState(task.assignee);
    const [newComment, setNewComment] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // Sync state when task changes or modal opens
    React.useEffect(() => {
        if (isOpen) {
            setEditTitle(task.title);
            setEditDescription(task.description);
            setEditAssignee(task.assignee);
            setIsEditing(false);
        }
    }, [isOpen, task]);

    if (!isOpen) return null;

    const handleSave = () => {
        onUpdateTask({
            title: editTitle,
            description: editDescription,
            assignee: editAssignee
        });
        setIsEditing(false);
    };

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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
                    <div className="space-y-4 flex-1 mr-8">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${task.priority === 'High' ? 'bg-red-50 text-red-600' :
                                task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                                    'bg-blue-50 text-blue-600'
                                }`}>
                                <Tag className="w-3 h-3" /> {task.priority} {t('modals.detail.priority_suffix')}
                            </span>
                            <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest">#TASK-{task.id}</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="text-3xl font-black text-slate-800 tracking-tight uppercase leading-none w-full bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2"
                            />
                        ) : (
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase leading-none">{task.title}</h2>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            {isEditing ? t('modals.detail.save_changes') : t('tasks.edit')}
                        </button>
                        <button onClick={onClose} className="text-slate-300 hover:text-slate-600 p-3 hover:bg-white rounded-2xl transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
                    {/* Main Content */}
                    <div className="flex-[2] p-8 space-y-10 border-r border-slate-50">
                        <section>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t('modals.detail.description')}</h3>
                            {isEditing ? (
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={5}
                                    className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl px-6 py-4 text-sm font-medium text-slate-600 leading-relaxed"
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {task.description || t('projects.no_description')}
                                </p>
                            )}
                        </section>

                        <section>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t('modals.task.assign_to')}</h3>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editAssignee}
                                    onChange={(e) => setEditAssignee(e.target.value)}
                                    className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2 text-sm font-bold text-slate-700"
                                    placeholder={t('modals.task.title_placeholder')}
                                />
                            ) : (
                                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-50 w-fit">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm uppercase">
                                        {task.assignee?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{task.assignee || t('modals.task.unassigned')}</span>
                                </div>
                            )}
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('modals.detail.attachments')}</h3>
                            </div>
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[0.98]' : 'border-slate-100 hover:border-indigo-200 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-indigo-50'
                                    }`}
                            >
                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 mb-4 shadow-xl shadow-indigo-100/50">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{t('modals.detail.drop_files')}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{t('modals.detail.browse')}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {task.attachments.map((file) => (
                                    <div key={file.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-white group hover:border-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-50">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-slate-800 truncate uppercase tracking-tight">{file.name}</p>
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{file.type} • {(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="flex-1 bg-slate-50/30 p-8 flex flex-col min-w-[320px]">
                        <div className="flex-1 space-y-10">
                            <section>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t('modals.task.status')}</h3>
                                <div className="relative">
                                    <select
                                        value={task.status}
                                        onChange={(e) => onUpdateStatus(e.target.value as Task['status'])}
                                        className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none appearance-none cursor-pointer shadow-sm transition-all"
                                    >
                                        <option value="To Do">{t('tasks.todo')}</option>
                                        <option value="In Progress">{t('tasks.in_progress')}</option>
                                        <option value="Done">{t('tasks.done')}</option>
                                        <option value="Finished">{t('tasks.finished')}</option>
                                    </select>
                                    <ArrowUpCircle className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 rotate-180 text-indigo-400 pointer-events-none" />
                                </div>
                            </section>

                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('modals.detail.activity')}</h3>
                                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black">{task.comments.length}</span>
                                </div>
                                <div className="space-y-6">
                                    {task.comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-4 group/comment">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-indigo-100">
                                                {comment.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{comment.userName}</span>
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter flex items-center gap-1">
                                                        <Calendar className="w-2.5 h-2.5" /> {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 text-sm text-slate-600 font-medium shadow-sm group-hover/comment:shadow-md transition-shadow">
                                                    {comment.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {task.comments.length === 0 && (
                                        <div className="text-center py-8">
                                            <Send className="w-8 h-8 text-slate-100 mx-auto mb-3" />
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('modals.detail.no_activity')}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <div className="relative">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={t('modals.detail.placeholder')}
                                    className="w-full bg-white border border-slate-100 rounded-[1.5rem] px-6 py-5 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none shadow-sm placeholder:text-slate-300 transition-all"
                                    rows={3}
                                />
                                <button
                                    onClick={() => {
                                        if (newComment.trim()) {
                                            onAddComment(newComment);
                                            setNewComment('');
                                        }
                                    }}
                                    className="mt-3 w-full bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group"
                                >
                                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> {t('modals.detail.post')}
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
