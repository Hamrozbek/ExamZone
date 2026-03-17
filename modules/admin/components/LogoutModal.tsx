import { AlertCircle } from "lucide-react";

export const LogoutModal = ({ isOpen, onClose, onConfirm }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#030925]/90 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-[#0c132e] border border-white/10 w-full max-w-sm rounded-[2.5rem] p-8 z-10 shadow-2xl text-center relative animate-in zoom-in duration-200 text-white">
                <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-2xl font-black mb-2">Chiqish?</h2>
                <p className="text-white/40 text-sm mb-8 font-medium">Haqiqatan ham chiqib ketmoqchimisiz?</p>
                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-xs transition-all uppercase">Bekor qilish</button>
                    <button onClick={onConfirm} className="flex-1 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-black text-xs transition-all shadow-lg shadow-red-600/20 uppercase">Ha, chiqish</button>
                </div>
            </div>
        </div>
    );
};