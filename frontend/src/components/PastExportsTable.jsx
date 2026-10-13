
import { useState } from "react";
import { Download, FileText, RefreshCw } from "lucide-react";
import api from "../services/api";

const getReportId = (report) => report?._id || report?.id;

const getFormat = (format) =>
    String(format || "CSV").trim().toLowerCase();

const isExcelFormat = (format) =>
    ["excel", "xlsx", "xls"].includes(getFormat(format));

const getFileExtension = (format) =>
    isExcelFormat(format) ? "xlsx" : "csv";

const getMimeType = (format) =>
    isExcelFormat(format)
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv;charset=utf-8;";

const getErrorMessage = async (error) => {
    const data = error?.response?.data;

    if (data instanceof Blob) {
        try {
            const text = await data.text();
            const parsed = JSON.parse(text);
            return parsed.message || "Unable to download this report.";
        } catch {
            return "Unable to download this report.";
        }
    }

    return (
        data?.message ||
        error?.message ||
        "Unable to download this report."
    );
};

const PastExportsTable = ({ exports = [], onRefresh }) => {
    const [downloadingId, setDownloadingId] = useState(null);
    const [downloadError, setDownloadError] = useState("");

    const handleDownload = async (report) => {
        const reportId = getReportId(report);

        if (!reportId) {
            setDownloadError("This report does not have a valid ID.");
            return;
        }

        if (downloadingId !== null) return;

        setDownloadingId(reportId);
        setDownloadError("");

        let objectUrl;

        try {
            const response = await api.get(
                `/api/reports/${encodeURIComponent(reportId)}/download`,
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], {
                type: getMimeType(report.format),
            });

            objectUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = objectUrl;

            link.download =
                report.fileName ||
                `ecotrack-report-${reportId}.${getFileExtension(
                    report.format
                )}`;

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Report download failed:", error);
            setDownloadError(await getErrorMessage(error));
        } finally {
            if (objectUrl) {
                window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
            }

            setDownloadingId(null);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                    {exports.length} report
                    {exports.length !== 1 ? "s" : ""} found
                </p>

                {onRefresh && (
                    <button
                        type="button"
                        onClick={onRefresh}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                )}
            </div>

            {downloadError && (
                <div
                    role="alert"
                    className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    <p>{downloadError}</p>

                    <button
                        type="button"
                        onClick={() => setDownloadError("")}
                        className="font-medium underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {exports.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center">
                    <FileText className="mx-auto mb-3 h-10 w-10 text-gray-400" />

                    <p className="font-medium text-gray-700">
                        No past exports found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Generate a report to see it listed here.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full min-w-[650px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Period
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Format
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Sections
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {exports.map((report, index) => {
                                const reportId = getReportId(report);
                                const rowKey = reportId || `report-${index}`;
                                const isDownloading =
                                    downloadingId === reportId;

                                return (
                                    <tr
                                        key={rowKey}
                                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            {report.period || "N/A"}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className="rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
                                                {report.format || "CSV"}
                                            </span>
                                        </td>

                                        <td className="max-w-xs px-4 py-4 text-sm text-gray-600">
                                            {Array.isArray(report.sections)
                                                ? report.sections.join(", ")
                                                : report.sections || "N/A"}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                                {report.status || "Available"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDownload(report)
                                                }
                                                disabled={
                                                    !reportId ||
                                                    downloadingId !== null
                                                }
                                                className="flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Download className="h-4 w-4" />

                                                {isDownloading
                                                    ? "Downloading..."
                                                    : "Download"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PastExportsTable;
