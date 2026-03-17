"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("loggedUser");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === "admin") router.push("/dashboard");
      else if (parsedUser.role === "teacher") router.push("/dashboard");
      else router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  return null; 
}



// 1.import qilgan joylarni bitta qilib destruction index.tsx file ochish hammasi shu chaqirish kerak , shettan btta qilib export qilish kerak
// 2.Next Folder stukturani togirlash kerak, AdminPanel- admin-panel , role ishlash kerak bolsa, logikani boshqacharoq qilsh kerak 
// 3.Role Cookies bilan ishlab , adminPanel, userPanel ularni hammasi module folderda boladi, rolega qarab chiqarish moduleni
// 4.API request berish uchun alohida service folder bolishi kerak, client component bolib qolgan, use client 
// 5.Bir marta kirgandagi vaziyat uchun Server Request berish kerak , Server Componentda bolshi kerka 
// 6.Click, Eventlar, Search, Change, .... Client Component qilsanggiz boladi 
// 7.Create , Update, Delete logikasi bolsa, Server Actions qilish kerak boladi
// 8.Kamroq code , reusable qilish kerak hamma codelarni , AI codelarni tashab senior code qilib ber desez yozib beradi, kamroq qilib
// 9.Componentlar, modulega , index file oching, 
// 10.Design olaman, desanggiz Cloud AI oling, 