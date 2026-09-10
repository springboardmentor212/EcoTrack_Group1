// 

import { Search, Bell, Sparkles} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function UserDashboard() {
    return (
        <div className="flex h-screen bg-[var(--color-background)]">
            <Sidebar userName="Trapti" userTag="Eco Warrior" userInitial="T" />

            <main className="flex-1 overflow-y-auto h-screen p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Welcome Back, Trapti</h1>
                        <p className="text-sm text-[var(--color-slate)] mt-1">
                            Today is Thursday, Oct 24 - Let's hit your green targets today!
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate)]"/>
                            <input
                            placeholder="Search sustainability data..."
                            className="pl-9 pr-4 py-2 rounded-lg border border-[var(-color-slate)] text-sm outline-none w-64"
                            />
                        </div>
                        <Bell size={20} className="text-[var(--color-slate)]" />
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                    </div>
                </div>
            </main>
        </div>
    )
}