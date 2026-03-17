
"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import TextInput from "@/components/TextInput";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
    const { username, setUsername, password, setPassword, loading, handleLogin } = useLogin();

    return (
        <div className="min-h-screen flex font-sans bg-gray-50">

            {/* FORMA */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200">
                    <h1 className="text-4xl font-black mb-2 text-[#030925]">Kirish</h1>
                    <p className="text-gray-500 mb-8">Ma'lumotlaringizni kiriting</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <TextInput
                            id="username"
                            label="Foydalanuvchi nomi"
                            placeholder="username yoki superadmin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextInput
                            id="password"
                            label="Parol"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#030925] hover:bg-[#0a164d] text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer ${loading ? "opacity-70 cursor-wait" : ""
                                }`}
                        >
                            {loading ? "Kirilmoqda..." : "Tizimga kirish"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600">
                        Hisobingiz yo'qmi?{" "}
                        <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">
                            Ro'yxatdan o'tish
                        </Link>
                    </p>
                </div>
            </div>

            {/* VIZUAL */}
            <div className="hidden lg:flex w-[45%] bg-[#030925] items-center justify-center p-12 relative overflow-hidden">
                <div className="relative z-10 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] border border-blue-500/20 flex items-center justify-center mb-8 animate-pulse">
                        <GraduationCap size={48} className="text-blue-500" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 italic">Ta'lim Platformasi</h2>
                    <p className="text-blue-300/50 max-w-sm font-medium">
                        Faqat Admin va Ustozlar uchun kirish nuqtasi
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20" />
            </div>

        </div>
    );
}




