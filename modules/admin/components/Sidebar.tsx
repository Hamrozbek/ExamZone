import { Users, GraduationCap, LogOut } from "lucide-react";

interface SidebarProps {
    selectedRole: "student" | "teacher";
    setSelectedRole: (role: "student" | "teacher") => void;
    onLogout: () => void;
}

export const Sidebar = ({ selectedRole, setSelectedRole, onLogout }: SidebarProps) => (
    <aside className="w-64 bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2.5rem] flex flex-col p-6 justify-between shrink-0 shadow-2xl">
        <div>
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
                    <span className="font-black text-white text-xl">A</span>
                </div>
                <h2 className="text-xl font-black tracking-tighter capitalize">Admin Panel</h2>
            </div>

            <nav className="space-y-3">
                <button
                    onClick={() => setSelectedRole("student")}
                    className={`w-full flex items-center gap-4 cursor-pointer p-3 rounded-2xl transition-all ${selectedRole === "student" ? "bg-white text-[#030925] shadow-xl" : "hover:bg-white/5 text-white/50"}`}
                >
                    <Users size={22} />
                    <span className="font-bold">Talabalar</span>
                </button>
                <button
                    onClick={() => setSelectedRole("teacher")}
                    className={`w-full flex items-center gap-4 cursor-pointer p-3 rounded-2xl transition-all ${selectedRole === "teacher" ? "bg-white text-[#030925] shadow-xl" : "hover:bg-white/5 text-white/50"}`}
                >
                    <GraduationCap size={22} />
                    <span className="font-bold">Ustozlar</span>
                </button>
            </nav>
        </div>

        <button
            onClick={onLogout}
            className="flex items-center cursor-pointer gap-3 p-3 text-red-400 hover:bg-red-500/10 font-bold rounded-2xl transition-all border border-red-500/20"
        >
            <LogOut size={22} />
            <span>Chiqish</span>
        </button>
    </aside>
);