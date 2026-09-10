// 

import { Search, Bell, Sparkles} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function UserDashboard() {
    return (
        <div className="flex h-screen bg-[var(--color-background)]">
            <Sidebar userName="Trapti" userTag="Eco Warrior" userInitial="T" />
        </div>
    )
}