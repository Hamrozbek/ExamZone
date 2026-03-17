import { UserTableProps } from "@/app/types";


export const UserTable = ({ users, onUserClick, onRoleChange }: UserTableProps) => (
    <table className="w-full text-left border-separate border-spacing-y-2 px-4">
        <thead>
            <tr className="text-white/30 text-[10px] capitalize tracking-[0.2em] font-black">
                <th className="p-3">Foydalanuvchi</th>
                <th className="p-3 text-right">Rolni boshqarish</th>
            </tr>
        </thead>
        <tbody>
            {users.map((u, index) => (
                <tr key={u.id || index}
                    onClick={() => onUserClick(u)}
                    className="bg-white/5 hover:bg-white/10 transition-all cursor-pointer group rounded-2xl"
                >
                    <td className="px-3 py-2 rounded-l-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                                {u.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-sm tracking-tight">{u.username}</span>
                        </div>
                    </td>
                    <td className="p-3 text-right rounded-r-2xl" onClick={(e) => e.stopPropagation()}>
                        <select
                            value={u.role}
                            onChange={(e) => onRoleChange(u.username, e.target.value)}
                            className="bg-[#030925] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white outline-none cursor-pointer"
                        >
                            <option value="student">Talaba</option>
                            <option value="teacher">Ustoz</option>
                        </select>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);