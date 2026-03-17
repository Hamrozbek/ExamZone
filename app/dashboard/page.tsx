"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; 
import { AdminDashboard, TeacherDashboard, UserDashboard } from "@/modules";

export default function Dashboard() {
    const [role, setRole] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true); 
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedUser");
        const token = localStorage.getItem("admin_token");

        if (!storedUser || !token) {
            router.push("/auth/login");
            return;
        }

        try {
            const loggedUser = JSON.parse(storedUser);
            const userRole = (loggedUser?.role || "student").toLowerCase();
            const userName = (loggedUser?.username || "").toLowerCase();

            if (userRole === "admin" || userName === "superadmin") {
                setRole("admin");
            } else if (userRole === "teacher") {
                setRole("teacher");
            } else {
                setRole("student");
            }
        } catch (error) {
            console.error("Dashboard auth error:", error);
            localStorage.clear();
            router.push("/auth/login");
        } finally {
            setIsChecking(false); 
        }
    }, [router]);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-[#030925] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-blue-500" size={48} />
                <p className="text-blue-500/50 font-bold tracking-widest text-xs uppercase">Ruxsat tekshirilmoqda...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#030925]">
            {role === "admin" && <AdminDashboard />}
            {role === "teacher" && <TeacherDashboard />}
            {role === "student" && <UserDashboard />}
        </main>
    );
}