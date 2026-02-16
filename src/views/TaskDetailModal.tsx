import React, { useState } from 'react';
import { X, Upload, FileText, Send, Calendar, User, Tag, ArrowUpCircle, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Task, Comment, Attachment, Member } from '../models';

interface TaskDetailModalProps {
    task: Task;
    members: Member[];
    isOpen: boolean;
    onClose: () => void;
    onAddComment: (text: string) => void;
    onAddAttachment: (file: File) => void;
    onUpdateStatus: (status: Task['status']) => void;
    onUpdateTask: (updates: Partial<Task>) => void;
    onDelete: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
    task,
    members,
    isOpen,
    onClose,
    onAddComment,
    onAddAttachment,
    onUpdateStatus,
    onUpdateTask,
    onDelete
}) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);
    const [editAssignee, setEditAssignee] = useState(task.assignee);
    const [editPriority, setEditPriority] = useState(task.priority);
    const [newComment, setNewComment] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Sync state when task changes or modal opens
    React.useEffect(() => {
        if (isOpen) {
            setEditTitle(task.title);
            setEditDescription(task.description);
            setEditAssignee(task.assignee);
            setEditPriority(task.priority);
            setIsEditing(false);
        }
    }, [isOpen, task]);

    if (!isOpen) return null;

    const handleSave = () => {
        onUpdateTask({
            title: editTitle,
            description: editDescription,
            assignee: editAssignee,
            priority: editPriority
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
                            {isEditing ? (
                                <div className="relative">
                                    <select
                                        value={editPriority}
                                        onChange={(e) => setEditPriority(e.target.value as any)}
                                        className="appearance-none px-4 py-2 pr-10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="Highest">{t('tasks.priority.highest')}</option>
                                        <option value="High">{t('tasks.priority.high')}</option>
                                        <option value="Medium">{t('tasks.priority.medium')}</option>
                                        <option value="Low">{t('tasks.priority.low')}</option>
                                        <option value="Lowest">{t('tasks.priority.lowest')}</option>
                                    </select>
                                    <Tag className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                </div>
                            ) : (
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${task.priority === 'Highest' ? 'bg-rose-50 text-rose-600' :
                                    task.priority === 'High' ? 'bg-red-50 text-red-600' :
                                        task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                            task.priority === 'Low' ? 'bg-emerald-50 text-emerald-600' :
                                                'bg-slate-50 text-slate-600'
                                    }`}>
                                    <Tag className="w-3 h-3" /> {t(`tasks.priority.${task.priority.toLowerCase()}`)} {t('modals.detail.priority_suffix')}
                                </span>
                            )}
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
                            onClick={onDelete}
                            className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl transition-all group"
                            title={t('common.delete')}
                        >
                            <Trash2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </button>
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
                                <div className="relative w-fit">
                                    <select
                                        value={editAssignee}
                                        onChange={(e) => setEditAssignee(e.target.value)}
                                        className="appearance-none w-full min-w-[200px] bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-6 py-4 pr-12 text-sm font-bold text-slate-700 uppercase tracking-tight cursor-pointer transition-all"
                                    >
                                        <option value="">{t('modals.task.unassigned')}</option>
                                        {members.map(member => (
                                            <option key={member.id} value={member.name}>{member.name}</option>
                                        ))}
                                    </select>
                                    <User className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                </div>
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
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[0.98]' : 'border-slate-100 hover:border-indigo-200 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-indigo-50'
                                    }`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            onAddAttachment(files[0]);
                                        }
                                    }}
                                    className="hidden"
                                />
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
                                        className={`w-full border rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none appearance-none cursor-pointer shadow-sm transition-all ${
                                            task.status === 'To Do' ? 'bg-slate-50 border-slate-100 text-slate-600' :
                                            task.status === 'In Progress' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                            task.status === 'Done' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                            task.status === 'Finished' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                                            'bg-white border-slate-100'
                                        }`}
                                    >
                                        <option value="To Do" className="bg-white text-slate-600">{t('tasks.todo')}</option>
                                        <option value="In Progress" className="bg-white text-blue-600">{t('tasks.in_progress')}</option>
                                        <option value="Done" className="bg-white text-emerald-600">{t('tasks.done')}</option>
                                        <option value="Finished" className="bg-white text-indigo-600">{t('tasks.finished')}</option>
                                    </select>
                                    <ArrowUpCircle className={`w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 rotate-180 pointer-events-none transition-colors ${
                                        task.status === 'To Do' ? 'text-slate-400' :
                                        task.status === 'In Progress' ? 'text-blue-400' :
                                        task.status === 'Done' ? 'text-emerald-400' :
                                        task.status === 'Finished' ? 'text-indigo-400' :
                                        'text-indigo-400'
                                    }`} />
                                </div>
                            </section>


                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default TaskDetailModal;
