import { X } from "lucide-react";

export const StudentModal = ({ user, stats, loading, onClose }: any) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose}></div>
        <div className="bg-[#0c132e] border border-white/10 w-full max-w-2xl rounded-[3rem] p-8 shadow-2xl relative z-10 animate-in zoom-in duration-300">
            <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-purple-600 flex items-center justify-center text-3xl shadow-xl shadow-purple-600/20 text-white">🎓</div>
                <div>
                    <h2 className="text-3xl font-black capitalize tracking-tighter text-white">{user.username}</h2>
                    <p className="text-purple-400 font-bold tracking-[0.2em] text-[10px] mt-1 uppercase italic">ID: {user.id} | Talaba Profili</p>
                </div>
                <button onClick={onClose} className="ml-auto w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-all"><X size={24} /></button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-white">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-600/10 p-6 rounded-3xl border border-purple-500/20">
                        <p className="text-purple-400 text-[10px] font-black uppercase mb-2">Jami urinishlar</p>
                        <p className="font-black text-3xl">{stats ? stats.length : 0} ta</p>
                    </div>
                    <div className="bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20">
                        <p className="text-blue-400 text-[10px] font-black uppercase mb-2">Eng so'nggi ball</p>
                        <p className="font-black text-3xl">
                            {stats && stats.length > 0 ? stats[0].correct_answers : 0}
                        </p>
                    </div>
                </div>

                <div className="bg-white/5 rounded-3xl border border-white/10 p-6">
                    <p className="text-white/30 text-[10px] font-black uppercase mb-4 tracking-widest text-left">Test topshirish tarixi</p>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                            </div>
                        ) : stats && stats.length > 0 ? (
                            stats.map((res: any) => {
                                // Foizni hisoblash: (To'g'ri javob / Umumiy savollar) * 100
                                const total = res.correct_answers + res.incorrect_answers;
                                const percentage = total > 0 ? Math.round((res.correct_answers / total) * 100) : 0;

                                return (
                                    <div key={res.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
                                        <div className="flex flex-col gap-1 text-left">
                                            {/* Fan nomi */}
                                            <span className="text-sm font-bold uppercase tracking-tight">{res.subject_name}</span>
                                            <span className="text-[10px] text-white/40 italic">
                                                {new Date(res.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                {/* Natija foizda */}
                                                <span className={`block text-lg font-black ${percentage >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {percentage}%
                                                </span>
                                                <span className="block text-[10px] text-white/40 font-bold uppercase">
                                                    {res.correct_answers} to'g'ri / {res.incorrect_answers} xato
                                                </span>
                                            </div>
                                            <div className={`w-1.5 h-10 rounded-full ${res.is_passed ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`} />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-white/20 text-xs italic uppercase">Hali test topshirilmagan</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
);