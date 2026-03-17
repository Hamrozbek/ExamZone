import { X } from "lucide-react";

export const TeacherModal = ({ user, stats, onClose }: any) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#030925]/90 backdrop-blur-xl" onClick={onClose}></div>
        <div className="bg-[#0c132e] border border-white/10 w-full max-w-2xl rounded-[3rem] p-8 z-10 shadow-2xl relative animate-in zoom-in duration-300">
            <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center text-3xl shadow-xl shadow-blue-600/20 text-white">👨‍🏫</div>
                <div>
                    <h2 className="text-3xl font-black capitalize tracking-tighter text-white">{user.username}</h2>
                    <p className="text-blue-400 font-bold tracking-[0.2em] text-[10px] mt-1 uppercase italic">Ustoz Profili</p>
                </div>
                <button onClick={onClose} className="ml-auto w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-red-500 transition-all"><X size={24} /></button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-white">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20">
                        <p className="text-blue-400 text-[10px] font-black uppercase mb-2">Birlashtirilgan Fan</p>
                        <p className="font-bold text-lg">{stats?.subjectName || "Fan yo'q"}</p>
                    </div>
                    <div className="bg-emerald-600/10 p-6 rounded-3xl border border-emerald-500/20">
                        <p className="text-emerald-400 text-[10px] font-black uppercase mb-2">Jami Studentlar</p>
                        <p className="font-black text-3xl">{stats?.studentsCount || 0}</p>
                    </div>
                </div>

                <div className="bg-white/5 rounded-3xl border border-white/10 p-6">
                    <p className="text-white/30 text-[10px] font-black uppercase mb-4 tracking-widest">O'quvchilar Natijalari</p>
                    <div className="space-y-2">
                        {stats?.results && stats.results.length > 0 ? (
                            stats.results.map((res: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-bold uppercase">{res.student_name}</span>
                                        <span className="text-[10px] text-white/30">{new Date(res.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-emerald-400 font-black">{res.correct_answers} ta to'g'ri</span>
                                        <span className="block text-[10px] text-white/20">{res.subject_name}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl text-white/20 text-xs italic">Hali natijalar yo'q</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
);