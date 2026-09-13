import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function UserDashboardLayout() {
    return (
        <div className="flex h-screen bg-[var(--color-background)]">
            <Sidebar userName="Trapti" userTag="Eco Warrior" userInitial="T" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar ecoScore={88} />
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
}