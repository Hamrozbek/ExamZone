"use client";
// api 
import api from "@/lib/api";

//use state 
import { useState, useEffect } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface User {
    username: string;
    role: string;
}

interface Subject {
    id: number;
    name: string;
    teacher: string;
}

export default function AddSubjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subjectName, setSubjectName] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState("");

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const [usersRes, subjectsRes] = await Promise.all([
                    api.get("/users/panel-users/"),
                    api.get("/exams/subjects/")
                ]);

                if (isMounted) {
                    const userData = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.results || []);
                    setTeachers(userData.filter((u: User) => u.role?.toLowerCase() === "teacher"));

                    const subjectData = Array.isArray(subjectsRes.data) ? subjectsRes.data : (subjectsRes.data?.results || []);
                    setSubjects(subjectData);
                }
            } catch (err) {
                if (isMounted) toast.error("Ma'lumotlarni yuklab bo'lmadi");
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const isTeacherBusy = selectedTeacher
        ? subjects.some(s => s.teacher === selectedTeacher)
        : false;

    const isSubmitDisabled = loading ||
        isTeacherBusy ||
        !selectedTeacher ||
        !subjectName.trim() ||
        subjects.length === 0;

    const handleSave = async () => {
        if (!subjectName.trim() || !selectedTeacher) {
            return toast.error("Barcha maydonlarni to'ldiring!");
        }

        if (isTeacherBusy) {
            return toast.error("Bu ustoz band! Iltimos, boshqa ustoz tanlang.");
        }

        setLoading(true);
        try {
            await api.post("/exams/subjects/", {
                name: subjectName,
                teacher: selectedTeacher,
            });
            toast.success("Fan muvaffaqiyatli biriktirildi!");
            router.push("/dashboard");
        } catch (err) {
            toast.error("Saqlashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030925] text-white p-6 flex items-center justify-center">
            <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">

                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => router.back()} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/50">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter">Fan Biriktirish</h1>
                </div>

                <div className="space-y-6">
                    {/* Fan nomi */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/30 uppercase ml-2">Fan Nomi</label>
                        <input
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            placeholder="Masalan: Matematika"
                            className="w-full bg-[#030925] border border-white/10 rounded-2xl p-4 font-bold outline-none focus:ring-2 ring-blue-600 transition-all"
                        />
                    </div>

                    {/* Ustoz tanlash */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/30 uppercase ml-2">Ustoz Tanlash</label>
                        <select
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                            className={`w-full bg-[#030925] border ${isTeacherBusy ? 'border-red-500/50 ring-2 ring-red-500/10' : 'border-white/10'} rounded-2xl p-4 font-bold outline-none cursor-pointer transition-all`}
                        >
                            <option value="">Tanlang...</option>
                            {teachers.map((t) => {
                                const busy = subjects.some(s => s.teacher === t.username);
                                return (
                                    <option
                                        key={t.username}
                                        value={t.username}
                                        className={busy ? "text-slate-500 italic" : "text-white"}
                                    >
                                        {t.username} {busy ? " — (BAND)" : ""}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Bandlik haqida ogohlantirish */}
                    {isTeacherBusy && (
                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
                            <AlertCircle size={18} />
                            <p className="text-xs font-bold uppercase tracking-tight">
                                Bu ustozga allaqachon fan biriktirilgan!
                            </p>
                        </div>
                    )}

                    {/* Saqlash tugmasi */}
                    <button
                        onClick={handleSave}
                        disabled={isSubmitDisabled} // Tayyor o'zgaruvchidan foydalanamiz
                        className="w-full bg-blue-600 cursor-pointer hover:bg-blue-500 disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed py-4 rounded-2xl font-black text-sm tracking-widest transition-all mt-4 shadow-lg shadow-blue-600/20"
                    >
                        {loading ? "YUKLANMOQDA..." : "FANNI TASDIQLASH"}
                    </button>
                </div>
            </div>
        </div>
    );
}