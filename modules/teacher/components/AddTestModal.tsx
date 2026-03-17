import { TestInput } from "@/app/types";
import { Plus, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (tests: TestInput[]) => Promise<void>;
    isSubmitting: boolean;
}

// State modal tashqarisida bo'lgani yaxshi
const DEFAULT_TESTS: TestInput[] = Array(5).fill(null).map(() => ({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correct_answer: 1
}));

export const AddTestModal = ({ isOpen, onClose, onSubmit, isSubmitting }: Props) => {
    const [testList, setTestList] = useState<TestInput[]>(DEFAULT_TESTS);

    const handleChange = (index: number, field: keyof TestInput, value: string | number) => {
        setTestList(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const internalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit(testList);
            setTestList(DEFAULT_TESTS); // Faqat muvaffaqiyatli bo'lsa tozalash
        } catch (error) {
            console.error("Xatolik yuz berdi:", error);
            // Agar 401 bo'lsa, bu yerda handled qilish mumkin
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Background overlay */}
            <div
                className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md"
                onClick={() => !isSubmitting && onClose()}
            />

            <div className="relative bg-[#0f172a] border border-white/10 w-full max-w-4xl rounded-[3rem] p-4 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">

                <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#0f172a] z-10 py-2">
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
                        Yangi Testlar <span className="text-blue-500">(5 ta)</span>
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <Plus size={32} className="rotate-45" />
                    </button>
                </div>

                <form onSubmit={internalSubmit} className="space-y-10">
                    {testList.map((test, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-[2rem] border border-white/5 relative group hover:border-blue-500/30 transition-all">
                            <span className="absolute -top-4 left-6 bg-blue-600 text-white px-5 py-1.5 rounded-xl font-black italic text-xs">
                                SAVOL #{index + 1}
                            </span>

                            <div className="mt-3">
                                <textarea
                                    rows={2}
                                    value={test.question}
                                    placeholder="Test savolini yozing..."
                                    onChange={e => handleChange(index, 'question', e.target.value)}
                                    className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {[1, 2, 3, 4].map(num => (
                                    <div key={num} className={`flex items-center gap-4 p-2 rounded-2xl border transition-all ${test.correct_answer === num ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[#020617] border-white/5'
                                        }`}>
                                        <input
                                            type="radio"
                                            name={`correct_${index}`}
                                            checked={test.correct_answer === num}
                                            onChange={() => handleChange(index, 'correct_answer', num)}
                                            className="w-5 h-5 accent-emerald-500 cursor-pointer"
                                        />
                                        <input
                                            placeholder={`Variant ${num}`}
                                            value={test[`option${num as 1 | 2 | 3 | 4}`]}
                                            onChange={e => handleChange(index, `option${num as 1 | 2 | 3 | 4}`, e.target.value)}
                                            className="bg-transparent border-none outline-none text-sm text-white w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="sticky bottom-0 bg-gradient-to-t from-[#0f172a] to-transparent pt-4">
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full py-4 cursor-pointer rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" /> SAQLANMOQDA...</>
                            ) : (
                                <><CheckCircle2 size={20} /> BARCHA TESTLARNI SAQLASH</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};