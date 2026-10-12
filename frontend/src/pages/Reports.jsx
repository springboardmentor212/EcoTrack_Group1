import { useState } from "react";
import { FileText, Download, Calendar } from "lucide-react";
import PastExportsTable from "../components/PastExportsTable";

const Reports = () => {
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [format, setFormat] = useState("CSV");


const [sections, setSections] = useState({
    users: true,
    carbon: true,
    challenges: true,
    goals: true,
});

const [pastExports, setPastExports] = useState([]);

const sectionLabels = {
    users: "User Statistics",
    carbon: "Carbon Footprint Data",
    challenges: "Challenge Participation",
    goals: "Sustainability Goals",
};

const handleSectionChange = (section) => {
    setSections((previous) => ({
        ...previous,
        [section]: !previous[section],
    }));
};

const handleExport = () => {
    if (!fromDate || !toDate) {
        alert("Please select both From and To dates.");
        return;
    }

    if (fromDate > toDate) {
        alert("From date cannot be after To date.");
        return;
    }

    const selectedSections = Object.keys(sections).filter(
        (section) => sections[section]
    );

    if (selectedSections.length === 0) {
        alert("Please select at least one report section.");
        return;
    }

    if (format !== "CSV") {
        alert("Excel export is not available yet. Please select CSV.");
        return;
    }

    const rows = [
        ["EcoTrack Platform Report"],
        ["From Date", fromDate],
        ["To Date", toDate],
        [],
        ["Report Section", "Status"],
        ...selectedSections.map((section) => [
            sectionLabels[section],
            "Selected",
        ]),
    ];

    const csvContent = rows
        .map((row) =>
            row
                .map((value) => {
                    const escaped = String(value ?? "").replace(/"/g, '""');
                    return `"${escaped}"`;
                })
                .join(",")
        )
        .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `ecotrack-report-${fromDate}-to-${toDate}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    const newExport = {
        id: Date.now(),
        period: `${fromDate} to ${toDate}`,
        format: "CSV",
        sections: selectedSections
            .map((section) => sectionLabels[section])
            .join(", "),
        status: "Downloaded",
    };

    setPastExports((previous) => [newExport, ...previous]);
};

return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-[var(--color-slate)]">
                Platform Reports
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
                Generate and export EcoTrack platform reports.
            </p>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-sky-100 p-3">
                    <FileText className="h-6 w-6 text-sky-600" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                        Export Report
                    </h2>
                    <p className="text-sm text-[var(--color-muted)]">
                        Choose a date range and report sections.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="fromDate"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        From Date
                    </label>

                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            id="fromDate"
                            type="date"
                            value={fromDate}
                            max={toDate || undefined}
                            onChange={(event) =>
                                setFromDate(event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="toDate"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        To Date
                    </label>

                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            id="toDate"
                            type="date"
                            value={toDate}
                            min={fromDate || undefined}
                            onChange={(event) =>
                                setToDate(event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-gray-700">
                    Export Format
                </p>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setFormat("CSV")}
                        className={`rounded-lg border px-5 py-2 text-sm font-medium ${
                            format === "CSV"
                                ? "border-sky-600 bg-sky-50 text-sky-700"
                                : "border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        CSV
                    </button>

                    <button
                        type="button"
                        onClick={() => setFormat("Excel")}
                        className={`rounded-lg border px-5 py-2 text-sm font-medium ${
                            format === "Excel"
                                ? "border-sky-600 bg-sky-50 text-sky-700"
                                : "border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Excel
                    </button>
                </div>

                {format === "Excel" && (
                    <p className="mt-2 text-sm text-amber-600">
                        Excel export is not implemented yet. Please select CSV.
                    </p>
                )}
            </div>

            <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-gray-700">
                    Include Report Sections
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Object.entries(sectionLabels).map(([key, label]) => (
                        <label
                            key={key}
                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                        >
                            <input
                                type="checkbox"
                                checked={sections[key]}
                                onChange={() => handleSectionChange(key)}
                                className="h-4 w-4 accent-sky-600"
                            />
                            <span className="text-sm text-gray-700">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <button
                type="button"
                onClick={handleExport}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 font-medium text-white transition hover:bg-sky-700 sm:w-auto"
            >
                <Download className="h-5 w-5" />
                Export Report
            </button>
        </section>

        <PastExportsTable exports={pastExports} />
    </div>
);


};

export default Reports;
