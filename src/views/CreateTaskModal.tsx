import React, { useState } from 'react';
import { X, Plus, Calendar, Tag, User, Layers, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Task, TaskStatus, Member } from '../models';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: Omit<Task, 'id' | 'projectId'>) => void;
    members: Member[];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSubmit, members }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'>('Medium');
    const [status, setStatus] = useState<TaskStatus>('To Do');
    const [assigneeId, setAssigneeId] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const member = members.find(m => m.id === assigneeId);
        onSubmit({
            title,
            description,
            priority,
            status,
            assignee: member?.name || t('modals.task.unassigned'),
            comments: [],
            attachments: []
        });
        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">{t('modals.task.create')}</h2>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{t('modals.task.create_subtitle')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-300 hover:text-slate-600 p-3 hover:bg-white rounded-2xl transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('modals.task.title')}</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('modals.task.title_placeholder')}
                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium placeholder:text-slate-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('modals.task.description')}</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('modals.task.description_placeholder')}
                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all h-32 resize-none font-medium placeholder:text-slate-300"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('modals.task.priority')}</label>
                            <div className="relative">
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as any)}
                                    className="w-full px-6 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none bg-white cursor-pointer"
                                >
                                    <option value="Highest">{t('tasks.priority.highest')}</option>
                                    <option value="High">{t('tasks.priority.high')}</option>
                                    <option value="Medium">{t('tasks.priority.medium')}</option>
                                    <option value="Low">{t('tasks.priority.low')}</option>
                                    <option value="Lowest">{t('tasks.priority.lowest')}</option>
                                </select>
                                <Tag className="w-3.5 h-3.5 absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('modals.task.status')}</label>
                            <div className="relative">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className={`w-full px-6 py-4 rounded-2xl border focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer ${
                                        status === 'To Do' ? 'bg-slate-50 border-slate-100 text-slate-600' :
                                        status === 'In Progress' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                        status === 'Done' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                        status === 'Finished' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                                        'bg-white border-slate-100'
                                    }`}
                                >
                                    <option value="To Do" className="bg-white text-slate-600">{t('tasks.todo')}</option>
                                    <option value="In Progress" className="bg-white text-blue-600">{t('tasks.in_progress')}</option>
                                    <option value="Done" className="bg-white text-emerald-600">{t('tasks.done')}</option>
                                    <option value="Finished" className="bg-white text-indigo-600">{t('tasks.finished')}</option>
                                </select>
                                <Layers className={`w-3.5 h-3.5 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                                    status === 'To Do' ? 'text-slate-400' :
                                    status === 'In Progress' ? 'text-blue-400' :
                                    status === 'Done' ? 'text-emerald-400' :
                                    status === 'Finished' ? 'text-indigo-400' :
                                    'text-slate-300'
                                }`} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('modals.task.assign_to')}</label>
                        <div className="relative">
                            <select
                                value={assigneeId}
                                onChange={(e) => setAssigneeId(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest appearance-none bg-white cursor-pointer"
                            >
                                <option value="">{t('modals.task.unassigned')}</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                            <User className="w-3.5 h-3.5 absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 rounded-2xl border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
                        >
                            {t('modals.task.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group"
                        >
                            {t('modals.task.create_button')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
