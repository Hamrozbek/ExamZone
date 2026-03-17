import { StudentResult } from "@/app/types";
import { ClipboardList } from "lucide-react";

interface Props {
    students: StudentResult[];
}

export const ResultsTable = ({ students }: Props) => {
    return (
        <div className="lg:col-span-8">
            <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-white/5">
                    <ClipboardList className="text-blue-500" size={24} />
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
                        O'quvchilar Natijalari
                    </h3>
                </div>
                <div className="overflow-x-auto p-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {students.length > 0 ? (
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                                    <th className="px-6">O'quvchi ismi</th>
                                    <th className="px-6">Natija</th>
                                    <th className="px-6 text-center">Holat</th>
                                    <th className="px-6 text-right">Sana</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((res) => {
                                    const total = res.correct_answers + res.incorrect_answers;
                                    const percent = total > 0 ? Math.round((res.correct_answers / total) * 100) : 0;

                                    return (
                                        <tr key={res.id} className="bg-white/5 hover:bg-white/10 transition-all group text-sm">
                                            <td className="px-6 py-2 rounded-l-2xl font-bold uppercase group-hover:text-blue-400">
                                                {res.student_name}
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className={`font-black ${percent >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {percent}%
                                                </div>
                                                <div className="text-[10px] text-slate-500">{res.correct_answers} / {total} ball</div>
                                            </td>
                                            <td className="px-6 py-2 text-center">
                                                <span className={`text-[10px] px-2 py-1 rounded-lg border font-black italic ${res.is_passed
                                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                    }`}>
                                                    {res.is_passed ? "O'TDI" : "YIQILDI"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-2 rounded-r-2xl text-right font-mono">
                                                <div className="text-xs text-slate-200">{new Date(res.created_at).toLocaleDateString()}</div>
                                                <div className="text-[10px] text-slate-500 italic">
                                                    {new Date(res.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-20 text-center text-slate-600 font-black uppercase tracking-[0.2em] italic text-sm">
                            Hozircha natijalar mavjud emas
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};