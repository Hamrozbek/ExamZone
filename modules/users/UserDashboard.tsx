"use client";

import api from "@/lib/api";

// useState 
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut, Loader2 } from "lucide-react";

// API va Tiplar
import { Choice, Question, UseSubject } from "@/app/types";
import { SubjectCard, TestInterface, TestResult } from "@/modules/users";


export default function UserDashboard() {
  // --- STATE ---
  const [mySubjects, setMySubjects] = useState<UseSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<UseSubject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const router = useRouter();

  // --- MA'LUMOTLARNI YUKLASH ---
  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/exams/subjects/");
      setMySubjects(response.data);
    } catch (error) {
      toast.error("Fanlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSubjects(); }, [loadSubjects]);

  // --- TEST MANTIQI ---
  const startTest = async (subject: UseSubject) => {
    try {
      setLoading(true);
      const [qRes, cRes] = await Promise.all([
        api.get<Question[]>("/exams/questions/"),
        api.get<Choice[]>("/exams/choices/")
      ]);

      const subjectQuestions = qRes.data.filter((q) => q.subject === subject.id);

      if (subjectQuestions.length === 0) {
        toast.error("Bu fanda hozircha savollar yo'q");
        return;
      }

      const enriched = subjectQuestions.map((q) => ({
        ...q,
        options: cRes.data.filter((c) => c.question === q.id)
      }));

      setQuestions(enriched);
      setSelectedSubject(subject);
      setTestStarted(true);
      setCurrentQuestion(0);
      setAnswers({});
      setShowResult(false);
    } catch (error) {
      toast.error("Testni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (choice: Choice) => {
    const questionId = questions[currentQuestion].id.toString();
    const newAnswers = { ...answers, [questionId]: choice.id };
    setAnswers(newAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitFinalTest(newAnswers);
    }
  };

  const submitFinalTest = async (finalAnswers: Record<string, number>) => {
    if (!selectedSubject) return;
    try {
      setLoading(true);
      const response = await api.post(`/exams/subjects/${selectedSubject.id}/submit/`, {
        answers: finalAnswers
      });

      const correctCount = response.data.correct_answers || 0;
      const scorePercentage = Math.round((correctCount / questions.length) * 100);

      setFinalScore(scorePercentage);
      setShowResult(true);
      setTestStarted(false);
    } catch (error) {
      toast.error("Natijani yuborishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  // --- TIZIMDAN CHIQISH ---
  const handleExit = () => {
    localStorage.clear();
    router.push("/");
  };

  // --- RENDER ---
  if (loading) return (
    <div className="min-h-screen bg-[#030925] flex flex-col items-center justify-center">
      <Loader2 className="text-blue-500 animate-spin mb-4" size={48} />
      <p className="text-blue-500 font-black tracking-widest uppercase text-xs">Yuklanmoqda...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030925] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* 1. NATIJA EKRANI */}
        {showResult ? (
          <TestResult
            score={finalScore}
            subjectName={selectedSubject?.name || ""}
            onClose={() => {
              localStorage.clear();
              router.push("/");
            }}
          />
        ) : !testStarted ? (
          /* 2. FANLAR RO'YXATI */
          <>
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase">Fanlar</h1>
                <p className="text-slate-500 text-sm mt-1">O'zingizga kerakli yo'nalishni tanlang</p>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-4 bg-rose-500/10 cursor-pointer text-rose-500 rounded-2xl border border-rose-500/20 hover:bg-rose-500/20 transition-all"
              >
                <LogOut size={24} />
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mySubjects.map((s) => (
                <SubjectCard key={s.id} subject={s} onStart={startTest} />
              ))}
            </div>
          </>
        ) : (
          /* 3. TEST JARAYONI */
          <TestInterface
            question={questions[currentQuestion]}
            currentNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            subjectName={selectedSubject?.name || ""}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      {/* LOGOUT MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl">
            <h3 className="text-xl font-black text-white mb-6 uppercase">Chiqmoqchimisiz?</h3>
            <div className="flex gap-3">
              <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-4 rounded-xl bg-white/5 font-bold text-xs uppercase">Yo'q</button>
              <button onClick={handleExit} className="flex-1 py-4 rounded-xl bg-rose-500 font-black text-xs uppercase text-white shadow-lg shadow-rose-500/20">Ha, chiqish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



