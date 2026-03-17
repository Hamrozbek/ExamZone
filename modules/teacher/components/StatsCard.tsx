import { BookOpen } from "lucide-react";

interface StatsProps {
    count: number;
    avg: number;
}

export const StatsCard = ({ count, avg }: StatsProps) => {
    const getColor = (val: number) => val < 60 ? 'text-rose-500' : val < 90 ? 'text-yellow-500' : 'text-emerald-500';
    const getBgColor = (val: number) => val < 60 ? 'bg-rose-500' : val < 90 ? 'bg-yellow-500' : 'bg-emerald-500';

    return (
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl">
                <BookOpen className="absolute -right-4 -bottom-4 text-white/10" size={140} />
                <p className="text-blue-100/70 font-bold text-xs uppercase tracking-widest">O'quvchilar soni</p>
                <h2 className="text-5xl font-black text-white mt-2">{count}</h2>
            </div>

            <div className="bg-[#0f172a] border border-white/5 p-8 rounded-[2.5rem] shadow-lg">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">O'rtacha o'zlashtirish</p>
                <h3 className={`text-5xl font-black ${getColor(avg)}`}>{avg}%</h3>
                <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${getBgColor(avg)}`} style={{ width: `${avg}%` }} />
                </div>
            </div>
        </div>
    );
};