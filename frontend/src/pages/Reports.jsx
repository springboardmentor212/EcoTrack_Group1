
import { useEffect, useState } from "react";
import { FileText, Download, Calendar } from "lucide-react";
import api from "../services/api";
import PastExportsTable from "../components/PastExportsTable";

const sectionLabels = {
    users: "User Statistics",
    carbon: "Carbon Footprint Data",
    challenges: "Challenge Participation",
    goals: "Sustainability Goals",
};

const formatReports = (reports) =>
    reports.map((report) => ({
        ...report,
        id: report._id,
        period: `${String(report.fromDate ?? "").slice(0, 10)} to ${String(
            report.toDate ?? ""
        ).slice(0, 10)}`,
        sections: (report.sections ?? [])
            .map((section) => sectionLabels[section] ?? section)
            .join(", "),
        status: "Available",
    }));

const getReportsFromResponse = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.reports)) {
        return data.reports;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
};

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
    const [loading, setLoading] = useState(false);
    const [exportsLoading, setExportsLoading] = useState(true);

    // Load previous exports when the page opens.
    useEffect(() => {
        let ignore = false;

        const loadExports = async () => {
            try {
                const response = await api.get("/api/reports");

                if (ignore) return;

                const reports = getReportsFromResponse(response.data);
                setPastExports(formatReports(reports));
            } catch (error) {
                if (!ignore) {
                    console.error(
                        "Failed to fetch past exports:",
                        error
                    );
                }
            } finally {
                if (!ignore) {
                    setExportsLoading(false);
                }
            }
        };

        loadExports();

        return () => {
            ignore = true;
        };
    }, []);

    const handleSectionChange = (section) => {
        setSections((previous) => ({
            ...previous,
            [section]: !previous[section],
        }));
    };

    // Refresh export history.
    const fetchExports = async () => {
        try {
            const response = await api.get("/api/reports");
            const reports = getReportsFromResponse(response.data);

            setPastExports(formatReports(reports));
        } catch (error) {
            console.error("Failed to refresh past exports:", error);
        }
    };

    // Generate and download a report.
    const handleExport = async () => {
        if (!fromDate || !toDate) {
            alert("Please select both From Date and To Date.");
            return;
        }

        if (fromDate > toDate) {
            alert("From Date cannot be after To Date.");
            return;
        }

        const selectedSections = Object.keys(sections).filter(
            (section) => sections[section]
        );

        if (selectedSections.length === 0) {
            alert("Please select at least one report section.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/api/reports", {
                fromDate,
                toDate,
                format,
                sections: selectedSections,
            });

            const report = response.data?.report;

            if (!report?._id) {
                throw new Error(
                    "The server did not return a report ID."
                );
            }

            const downloadResponse = await api.get(
                `/api/reports/${report._id}/download`,
                {
                    responseType: "blob",
                }
            );

            const mimeType =
                format === "Excel"
                    ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    : "text/csv;charset=utf-8;";

            const blob = new Blob([downloadResponse.data], {
                type: mimeType,
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download =
                report.fileName ||
                `ecotrack-report-${fromDate}-to-${toDate}.${
                    format === "Excel" ? "xlsx" : "csv"
                }`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);

            await fetchExports();

            alert("Report generated and downloaded successfully!");
        } catch (error) {
            console.error("Report export failed:", error);

            alert(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to generate the report. Please try again."
            );
        } finally {
            setLoading(false);
        }
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
                            Choose a date range, format, and sections.
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
                            aria-pressed={format === "CSV"}
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
                            aria-pressed={format === "Excel"}
                            className={`rounded-lg border px-5 py-2 text-sm font-medium ${
                                format === "Excel"
                                    ? "border-sky-600 bg-sky-50 text-sky-700"
                                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Excel
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="mb-3 text-sm font-medium text-gray-700">
                        Include Report Sections
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {Object.entries(sectionLabels).map(
                            ([key, label]) => (
                                <label
                                    key={key}
                                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={sections[key]}
                                        onChange={() =>
                                            handleSectionChange(key)
                                        }
                                        className="h-4 w-4 accent-sky-600"
                                    />

                                    <span className="text-sm text-gray-700">
                                        {label}
                                    </span>
                                </label>
                            )
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleExport}
                    disabled={loading}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                    <Download className="h-5 w-5" />
                    {loading ? "Generating..." : "Export Report"}
                </button>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                        Past Exports
                    </h2>

                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                        Previously generated reports.
                    </p>
                </div>

                {exportsLoading ? (
                    <p className="py-6 text-center text-sm text-gray-500">
                        Loading past exports...
                    </p>
                ) : (
                    <PastExportsTable
                        exports={pastExports}
                        onRefresh={fetchExports}
                    />
                )}
            </section>
        </div>
    );
};

export default Reports;