"use client";
import api from "@/lib/api";

// useState 
import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut, Loader2, Plus } from "lucide-react";
import { StudentResult, Subject, TestInput } from "@/app/types";
import { AddTestModal, ResultsTable } from "@/modules/teacher";


export default function TeacherDashboard() {
    const [teacherName, setTeacherName] = useState("");
    const [mySubject, setMySubject] = useState<Subject | null>(null);
    const [myStudents, setMyStudents] = useState<StudentResult[]>([]);

    // Loading boshlang'ichda false bo'ladi
    const [loading, setLoading] = useState(false);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const loadData = useCallback(async (shouldShowLoading = false) => {
        try {
            if (shouldShowLoading) setLoading(true);

            const loggedUserString = localStorage.getItem("loggedUser");
            if (!loggedUserString) return;

            const loggedUser = JSON.parse(loggedUserString);
            setTeacherName(loggedUser.username || "");

            // 1. Fanlarni olish
            const subjectsRes = await api.get("/exams/subjects/");
            const allSubjects = Array.isArray(subjectsRes.data) ? subjectsRes.data : (subjectsRes.data?.results || []);

            const subject = allSubjects.find((s: any) => s.teacher === loggedUser.username);

            if (subject) {
                setMySubject(subject);
                localStorage.setItem("mySubject", JSON.stringify(subject));

                const resultsRes = await api.get(`/exams/results/?subject=${subject.id}`);
                const resultsData = Array.isArray(resultsRes.data) ? resultsRes.data : (resultsRes.data?.results || []);

                setMyStudents(resultsData);
                localStorage.setItem("myStudents", JSON.stringify(resultsData));
            }
        } catch (error) {
            toast.error("Ma'lumotlarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    }, []);

    // useEffect ichida tekshirish
    useEffect(() => {
        const localStudents = localStorage.getItem("myStudents");
        const localSubject = localStorage.getItem("mySubject");

        if (localStudents && localSubject) {
            setMyStudents(JSON.parse(localStudents));
            setMySubject(JSON.parse(localSubject));
            loadData(false);
        } else {
            loadData(true);
        }
    }, [loadData]);

    const handleAddBulkTests = async (tests: TestInput[]): Promise<void> => {
        if (!mySubject) {
            toast.error("Fan aniqlanmadi");
            return;
        }

        try {
            setIsSubmitting(true);

            for (const test of tests) {
                if (!test.question.trim()) continue;

                const questionRes = await api.post("/exams/questions/", {
                    subject: mySubject.id,
                    text: test.question,
                });

                const questionId = questionRes.data.id;

                const options = [
                    { text: test.option1, isCorrect: test.correct_answer === 1 },
                    { text: test.option2, isCorrect: test.correct_answer === 2 },
                    { text: test.option3, isCorrect: test.correct_answer === 3 },
                    { text: test.option4, isCorrect: test.correct_answer === 4 },
                ];

                const optionPromises = options.map(opt =>
                    api.post("/exams/choices/", {
                        question: questionId,
                        text: opt.text,
                        is_correct: opt.isCorrect
                    })
                );

                await Promise.all(optionPromises);
            }

            toast.success("5 ta test muvaffaqiyatli saqlandi!");
            setIsAddModalOpen(false);
            await loadData(false);

        } catch (err: any) {
            console.error("Xatolik:", err);
            toast.error("Testlarni saqlashda xatolik yuz berdi");
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const avg = useMemo(() => {
        if (!myStudents.length) return 0;
        const total = myStudents.reduce((acc, curr) => {
            const sum = curr.correct_answers + curr.incorrect_answers;
            return acc + (sum > 0 ? (curr.correct_answers / sum) * 100 : 0);
        }, 0);
        return Math.round(total / myStudents.length);
    }, [myStudents]);

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-blue-500 font-bold uppercase tracking-widest">
            <Loader2 className="animate-spin" size={48} /> YUKLANMOQDA...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] p-4 md:p-8 text-slate-200">
            <div className="max-w-7xl mx-auto">
                <header className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-6 md:p-10 mb-8 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            Salom, <span className="text-blue-500">{teacherName.toUpperCase()}</span> !
                        </h1>
                        <p className="text-slate-400 text-lg mt-2 italic">Fan: {mySubject?.name || "---"}</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setIsAddModalOpen(true)} className="flex cursor-pointer items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl font-black text-xs tracking-widest transition-all">
                            <Plus size={18} /> 5 TA TEST QO'SHISH
                        </button>
                        <button onClick={() => setIsLogoutModalOpen(true)} className="bg-rose-500/10 cursor-pointer hover:bg-rose-500/20 border border-rose-500/20 p-4 rounded-2xl text-rose-500 transition-all">
                            <LogOut size={24} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl">
                            <BookOpen className="absolute -right-4 -bottom-4 text-white/10" size={140} />
                            <p className="text-blue-100/70 font-bold text-xs uppercase tracking-widest">O'quvchilar soni</p>
                            <h2 className="text-4xl font-black text-white mt-2">{myStudents.length}</h2>
                        </div>

                        <div className="bg-[#0f172a] border border-white/5 p-8 rounded-[2.5rem] shadow-lg">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">O'rtacha o'zlashtirish</p>
                            <h3 className={`text-4xl font-black ${avg < 60 ? 'text-rose-500' : avg < 90 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                                {avg}%
                            </h3>
                            <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${avg < 60 ? 'bg-rose-500' : avg < 90 ? 'bg-yellow-500' : 'bg-emerald-500'}`} style={{ width: `${avg}%` }} />
                            </div>
                        </div>
                    </div>

                    <ResultsTable students={myStudents} />
                </div>

                <AddTestModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddBulkTests}
                    isSubmitting={isSubmitting}
                />

                {isLogoutModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
                        <div className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter">Chiqmoqchimisiz?</h3>
                            <div className="flex gap-4">
                                <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-4 rounded-2xl bg-white/5 font-bold text-xs uppercase cursor-pointer">Yo'q</button>
                                <button onClick={() => {
                                    localStorage.clear();
                                    sessionStorage.removeItem("teacher_panel_loaded"); // Logoutda reset qilamiz
                                    router.push("/");
                                }} className="flex-1 py-4 rounded-2xl bg-rose-500 font-black text-xs uppercase cursor-pointer">Ha</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


