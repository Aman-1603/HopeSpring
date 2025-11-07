import React from "react";
import { Download } from "lucide-react";

const annualReports = [
  { label: "Annual Report 2022-2023", href: "/files/reports/AnnualReport_2022-2023.pdf" },
  { label: "Annual Report 2021-2022", href: "/files/reports/AnnualReport_2021-2022.pdf" },
  { label: "Annual Report 2020-2021", href: "/files/reports/AnnualReport_2020-2021.pdf" },
  { label: "Annual Report 2019-2020", href: "/files/reports/AnnualReport_2019-2020.pdf" },
  { label: "Annual Report 2018-2019", href: "/files/reports/AnnualReport_2018-2019.pdf" },
  { label: "Annual Report 2017-2018", href: "/files/reports/AnnualReport_2017-2018.pdf" },
  { label: "Annual Report 2016-2017", href: "/files/reports/AnnualReport_2016-2017.pdf" },
];

const auditedStatements = [
  { label: "Audited Financial Statements 2022-2023", href: "/files/reports/AFS_2022-2023.pdf" },
  { label: "Audited Financial Statements 2021-2022", href: "/files/reports/AFS_2021-2022.pdf" },
  { label: "Audited Financial Statements 2020-2021", href: "/files/reports/AFS_2020-2021.pdf" },
];

const ListLink = ({ label, href }) => (
  <li className="group flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[15px] text-slate-800 underline-offset-4 hover:underline"
    >
      {label}
    </a>
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-slate-600 hover:text-slate-900"
      aria-label={`Download ${label}`}
    >
      <Download className="h-4 w-4" />
    </a>
  </li>
);

export default function Reports() {
  return (
    <main className="text-gray-900">
      {/* Page title */}
      <header className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-extrabold">Reports</h1>
      </header>

      {/* Big heading */}
      <section className="mx-auto max-w-4xl px-4 pb-2 text-center">
        <h2 className="text-2xl font-extrabold text-slate-800">Financial Reports</h2>
      </section>

      {/* Accordions */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        {/* Annual Reports */}
        <details open className="rounded-2xl border border-gray-200 bg-white">
          <summary className="cursor-pointer select-none rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold tracking-wide text-slate-700">
            Annual Reports
          </summary>
          <div className="px-4 pb-4 pt-2">
            <ul className="divide-y divide-transparent">
              {annualReports.map((r) => (
                <ListLink key={r.label} {...r} />
              ))}
            </ul>
          </div>
        </details>

        {/* Spacer */}
        <div className="h-4" />

        {/* Audited Financial Statements */}
        <details className="rounded-2xl border border-gray-200 bg-white">
          <summary className="cursor-pointer select-none rounded-2xl px-4 py-3 text-sm font-semibold tracking-wide text-slate-700">
            Audited Financial Statements
          </summary>
          <div className="px-4 pb-4 pt-2">
            <ul className="divide-y divide-transparent">
              {auditedStatements.map((r) => (
                <ListLink key={r.label} {...r} />
              ))}
            </ul>
          </div>
        </details>
      </section>
    </main>
  );
}
