import { CheckCircle } from "lucide-react";

interface Props {
    score: number;
    subjectName: string;
    onClose: () => void;
}

export const TestResult = ({ score, subjectName, onClose }: Props) => (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-white">
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl">
            <CheckCircle size={80} className="mx-auto text-emerald-500 mb-6" />
            <h2 className="text-xl font-bold uppercase mb-2">{subjectName} natijasi</h2>
            <div className={`text-8xl font-black mb-10 ${score >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {score}%
            </div>
            <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-blue-700 transition-all"
            >
                ASOSIY SAHIFA
            </button>
        </div>
    </div>
);