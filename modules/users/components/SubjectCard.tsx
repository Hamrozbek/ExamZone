import { UseSubject } from "@/app/types";
import { BookOpen } from "lucide-react";

interface Props {
    subject: UseSubject;
    onStart: (subject: UseSubject) => void;
}

export const SubjectCard = ({ subject, onStart }: Props) => (
    <div className="group bg-white/5 border border-white/10 p-6 rounded-[2.5rem] hover:border-blue-500/50 transition-all">
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
            <BookOpen size={26} />
        </div>
        <h3 className="text-xl font-black uppercase mb-4 tracking-tight">{subject.name}</h3>
        <button
            onClick={() => onStart(subject)}
            className="w-full bg-white text-black py-3 cursor-pointer rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all"
        >
            TESTNI BOSHLASH
        </button>
    </div>
);