import { FileText, CheckCircle } from "lucide-react";

export default function PastExportsTable({ exports = [] }) {
return ( <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"> <div className="mb-5"> <h2 className="text-lg font-semibold text-[var(--color-slate)]">
Past Exports </h2> <p className="mt-1 text-sm text-[var(--color-muted)]">
View reports exported during this session. </p> </div>

        {exports.length === 0 ? (
            <div className="py-10 text-center">
                <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="font-medium text-gray-600">
                    No past exports available yet.
                </p>
                <p className="mt-1 text-sm text-gray-400">
                    Export a report to see it listed here.
                </p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-500">
                            <th className="px-4 py-3">Period</th>
                            <th className="px-4 py-3">Format</th>
                            <th className="px-4 py-3">Sections</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {exports.map((report) => (
                            <tr
                                key={report.id}
                                className="border-b border-gray-100 last:border-0"
                            >
                                <td className="px-4 py-4 text-gray-700">
                                    {report.period}
                                </td>
                                <td className="px-4 py-4 text-gray-700">
                                    {report.format}
                                </td>
                                <td className="px-4 py-4 text-gray-600">
                                    {report.sections}
                                </td>
                                <td className="px-4 py-4">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-green-700">
                                        <CheckCircle className="h-4 w-4" />
                                        {report.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </section>
);


}
