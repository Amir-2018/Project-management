import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel,
    cancelLabel,
    type = 'danger'
}) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                        <AlertCircle className="w-10 h-10" />
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">
                        {title}
                    </h3>

                    <p className="text-slate-400 font-medium leading-relaxed mb-10">
                        {message}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-5 rounded-2xl bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100"
                        >
                            {cancelLabel || t('modals.confirm.cancel')}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs text-white transition-all shadow-xl ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-100'}`}
                        >
                            {confirmLabel || t('modals.confirm.delete')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
