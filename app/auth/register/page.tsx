"use client";

import Link from "next/link";
import { Rocket } from "lucide-react";
import TextInput from "@/components/TextInput";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterPage() {
  const {
    username, setUsername,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading, handleRegister,
  } = useRegister();

  return (
    <div className="min-h-screen flex font-sans bg-gray-50">

      {/* VIZUAL */}
      <div className="hidden lg:flex w-[45%] bg-[#030925] items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 flex items-center justify-center mb-8 animate-bounce">
            <Rocket size={48} className="text-indigo-400" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 italic">Platformaga qo'shiling</h2>
          <p className="text-indigo-200/50 max-w-sm">
            Yangi foydalanuvchilar uchun. Kiring va o'z bilimingizni sinab ko'ring.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20" />
      </div>

      {/* FORMA */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200">
          <h1 className="text-4xl font-black mb-2 text-[#030925]">Registratsiya</h1>
          <p className="text-gray-400 mb-8">Ma'lumotlarni kiriting</p>

          <form onSubmit={handleRegister} className="space-y-5">
            <TextInput
              id="username"
              label="Foydalanuvchi nomi (Username)"
              placeholder="Masalan: bek_01"
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
            <TextInput
              id="confirmPassword"
              label="Parolni tasdiqlang"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#030925] hover:bg-[#0a164d] text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer ${loading ? "opacity-50 cursor-wait" : ""
                }`}
            >
              {loading ? "Ulanmoqda..." : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500">
            Akkauntingiz bormi?{" "}
            <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">
              Kirish
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
