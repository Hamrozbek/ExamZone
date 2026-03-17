"use client";

import api from "@/lib/api";

// useState 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { User } from "@/app/types";
import { LogoutModal, StudentModal, TeacherModal, UserTable, Sidebar } from "@/modules/admin";

export default function AdminDashboard() {
    const router = useRouter();

    const [students, setStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<"student" | "teacher">("student");
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState<any | null>(null);
    const [studentStats, setStudentStats] = useState<any[]>([]);
    const [teacherStats, setTeacherStats] = useState<any | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users/panel-users/");
            setStudents(response.data);
        } catch (error) {
            toast.error("Ma'lumotlarni yuklashda xatolik!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, []);
    useEffect(() => {
        if (viewingUser) {
            if (viewingUser.role === "teacher") {
                fetchTeacherStats(viewingUser.username);
            } else {
                // Student username orqali statistika olish
                fetchStudentStats(viewingUser.username);
            }
        }
    }, [viewingUser]);

    const fetchTeacherStats = async (username: string) => {
        try {
            setStatsLoading(true);

            const subRes = await api.get(`/exams/subjects/`);
            const allSubjects = Array.isArray(subRes.data) ? subRes.data : (subRes.data?.results || []);

            const subject = allSubjects.find((s: any) => s.teacher === username);

            if (subject) {
                const resRes = await api.get(`/exams/results/`);
                const allResults = Array.isArray(resRes.data) ? resRes.data : (resRes.data?.results || []);

                const filteredResults = allResults.filter((r: any) => r.subject === subject.id);

                setTeacherStats({
                    subjectName: subject.name,
                    studentsCount: filteredResults.length,
                    results: filteredResults
                });
            }
        } catch (error) {
            console.error("Teacher stats error:", error);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchStudentStats = async (viewingUsername: string) => {
        try {
            setStatsLoading(true);
            const response = await api.get(`/exams/results/`);
            const allResults = Array.isArray(response.data) ? response.data : (response.data?.results || []);

            const filtered = allResults.filter((r: any) =>
                r.student_name === viewingUsername
            );

            console.log(`${viewingUsername} uchun filtrlangan natijalar:`, filtered);

            setStudentStats(filtered.sort((a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ));
        } catch (error) {
            console.error("Xatolik:", error);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleRoleChange = async (userName: string, newRole: string) => {
        const loadingToast = toast.loading("Amal bajarilmoqda...");
        try {
            await api.post("/users/assign-teacher/", { username: userName, role: newRole });
            setStudents(prev => prev.map(u => u.username === userName ? { ...u, role: newRole } : u));
            toast.success("O'zgartirildi!", { id: loadingToast });
        } catch (error) { toast.error("Xatolik!", { id: loadingToast }); }
    };

    const handleConfirmLogout = () => {
        localStorage.clear();
        router.push("/auth/login");
        toast.success("Tizimdan chiqdingiz");
    };

    const filteredUsers = students.filter(u => selectedRole === "student" ? (u.role === "student" || u.role === "user") : u.role === "teacher");

    return (
        <div className="bg-[#030925] min-h-screen">
            <div className="flex h-screen text-white font-sans p-4 gap-4 overflow-hidden max-w-[1600px] mx-auto">
                <Sidebar selectedRole={selectedRole} setSelectedRole={setSelectedRole} onLogout={() => setIsLogoutModalOpen(true)} />

                <main className="flex-1 flex flex-col gap-4 overflow-hidden text-center">
                    <header className="bg-white/5 backdrop-blur-lg border border-white/10 px-7 pb-5 pt-4 rounded-[2.5rem] flex justify-between items-center shadow-xl">
                        <div className="text-left">
                            <h1 className="text-2xl font-black tracking-tight">{selectedRole === "student" ? "Talabalar Ro'yxati" : "Ustozlar Ro'yxati"}</h1>
                            <p className="text-white/30 text-xs font-bold tracking-[0.2em] mt-1 uppercase italic">Tizim boshqaruvi</p>
                        </div>
                        {selectedRole === "teacher" && (
                            <button onClick={() => router.push("/dashboard/add-subject")} className="bg-blue-600 hover:bg-blue-50 text-white hover:text-blue-600 cursor-pointer px-8 py-4 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95">
                                <Plus size={18} /> YANGI FAN QO'SHISH
                            </button>
                        )}
                    </header>

                    <div className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
                        <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                            {loading ? (
                                <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-500" /></div>
                            ) : (
                                <UserTable users={filteredUsers} onUserClick={setViewingUser} onRoleChange={handleRoleChange} />
                            )}
                        </div>
                    </div>
                </main>

                <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} />

                {viewingUser?.role === "teacher" && (
                    <TeacherModal user={viewingUser} stats={teacherStats} onClose={() => { setViewingUser(null); setTeacherStats(null); }} />
                )}

                {(viewingUser && (viewingUser.role === "student" || viewingUser.role === "user")) && (
                    <StudentModal user={viewingUser} stats={studentStats} loading={statsLoading} onClose={() => { setViewingUser(null); setStudentStats([]); }} />
                )}
            </div>
        </div>
    );
}


