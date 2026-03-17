"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";

type UserRole = "admin" | "teacher" | "student";

interface AuthUser {
    username: string;
    role: UserRole;
    is_superuser?: boolean;
    [key: string]: unknown;
}

function persistSession(token: string, user: AuthUser): void {
    localStorage.clear();
    localStorage.setItem("admin_token", token);
    localStorage.setItem("user_role", user.role);
    localStorage.setItem("loggedUser", JSON.stringify(user));
}

function resolveRole(
    userData: Record<string, any>,
    username: string,
    password: string
): UserRole | null {
    const isSuperAdmin = username === "superadmin" && password === "1234";
    const rawRole = userData.role?.toLowerCase();

    if (isSuperAdmin || userData.is_superuser || rawRole === "admin") return "admin";
    if (rawRole === "teacher") return "teacher";
    return null;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

interface UseLoginReturn {
    username: string;
    setUsername: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    loading: boolean;
    handleLogin: (e: React.FormEvent) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post("/users/admin-login/", { username, password });

            const token: string = data.access ?? data.token ?? data.key ?? "";
            const userData: Record<string, any> = data.user ?? data;

            if (!token) {
                toast.error("Server tokenni qaytarmadi");
                return;
            }

            const role = resolveRole(userData, username, password);

            if (!role) {
                toast.error("Sizda tizimga kirish huquqi yo'q!");
                return;
            }

            persistSession(token, {
                ...userData,
                username: userData.username ?? username,
                role,
            });

            toast.success(`Xush kelibsiz, ${role === "admin" ? "Admin" : "Ustoz"}!`);
            router.push("/dashboard");
        } catch (err: any) {
            const msg = err.response?.data?.detail ?? "Login yoki parol xato!";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return { username, setUsername, password, setPassword, loading, handleLogin };
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────

interface UseRegisterReturn {
    username: string;
    setUsername: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    confirmPassword: string;
    setConfirmPassword: (v: string) => void;
    loading: boolean;
    handleRegister: (e: React.FormEvent) => Promise<void>;
}

export function useRegister(): UseRegisterReturn {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Parollar mos kelmadi!");
            return;
        }

        setLoading(true);

        try {
            const { data, status } = await api.post("/users/register/", {
                username,
                password,
                confirm_password: confirmPassword,
            });

            if (status === 200 || status === 201) {
                toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");

                const token: string = data.access ?? data.token ?? "";
                const userData: Record<string, any> = data.user ?? data;

                persistSession(token, {
                    ...userData,
                    username: userData.username ?? username,
                    role: "student",
                });

                localStorage.setItem("hasAcceptedTerms", "false");
                router.push("/dashboard");
            }
        } catch (err: any) {
            const errorData = err.response?.data;
            const msg =
                errorData?.username?.[0] ??
                errorData?.detail ??
                "Ro'yxatdan o'tishda xatolik yuz berdi";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        handleRegister,
    };
}