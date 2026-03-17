import { Choice, Question } from "@/app/types";

interface Props {
    question: Question;
    currentNumber: number;
    totalQuestions: number;
    subjectName: string;
    onAnswer: (choice: Choice) => void;
}

export const TestInterface = ({ question, currentNumber, totalQuestions, subjectName, onAnswer }: Props) => (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-5 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300"
                style={{ width: `${(currentNumber / totalQuestions) * 100}%` }} />

            <div className="flex justify-between mb-4 text-[10px] font-black uppercase tracking-widest">
                <span className="text-blue-500">{subjectName}</span>
                <span className="text-slate-500">{currentNumber} / {totalQuestions}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">{question.text}</h2>

            <div className="grid grid-cols-1 gap-4">
                {question.options?.map((opt, idx) => (
                    <button
                        key={opt.id}
                        onClick={() => onAnswer(opt)}
                        className="w-full text-left p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-blue-600 hover:border-blue-500 transition-all font-bold flex items-center gap-4 group"
                    >
                        <span className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm group-hover:bg-white/20">
                            {String.fromCharCode(65 + idx)}
                        </span>
                        {opt.text}
                    </button>
                ))}
            </div>
        </div>
    </div>
);