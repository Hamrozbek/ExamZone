"use client";

// use state 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// components 
import { AdminDashboard, TeacherDashboard, UserDashboard } from "@/modules";

export default function Dashboard() {
    const [role, setRole] = useState<string | null>(null);
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
            const userName = (loggedUser?.username || loggedUser?.name || "").toLowerCase();
            const userRole = loggedUser?.role?.toLowerCase();

            if (userName === "superadmin" || userRole === "admin") {
                setRole("admin");
            } else if (userRole === "teacher") {
                setRole("teacher");
            } else {
                setRole("student");
            }
        } catch (error) {
            console.error("Dashboard error:", error);
            localStorage.clear();
            router.push("/auth/login");
        }
    }, [router]);

    return (
        <main>
            {role === "admin" && <AdminDashboard />}
            {role === "teacher" && <TeacherDashboard />}
            {role === "student" && <UserDashboard />}
        </main>
    );
}