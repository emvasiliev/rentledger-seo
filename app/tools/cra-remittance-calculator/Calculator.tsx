"use client";

import { useState, useCallback } from "react";

interface Property {
  id: string;
  name: string;
  monthlyRent: string;
  hasDeposit: boolean;
  depositAmount: string;
  depositMonth: string; // YYYY-MM — month deposit was RECEIVED (cash basis)
  depositAppliedMonth: string; // YYYY-MM — last month of tenancy (for display only)
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CURRENT_YEAR = new Date().getFullYear();

function newProperty(id: string): Property {
  return {
    id,
    name: "",
    monthlyRent: "",
    hasDeposit: false,
    depositAmount: "",
    depositMonth: `${CURRENT_YEAR}-01`,
    depositAppliedMonth: `${CURRENT_YEAR}-12`,
  };
}

function formatCAD(n: number) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 2 });
}

function monthLabel(yyyyMm: string) {
  const [y, m] = yyyyMm.split("-");
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

export default function Calculator() {
  const [taxYear, setTaxYear] = useState(CURRENT_YEAR);
  const [properties, setProperties] = useState<Property[]>([newProperty("1")]);
  const [useNR6, setUseNR6] = useState(false);
  const [monthlyExpenses, setMonthlyExpenses] = useState("");

  const addProperty = () =>
    setProperties((p) => [...p, newProperty(String(Date.now()))]);

  const removeProperty = (id: string) =>
    setProperties((p) => p.filter((x) => x.id !== id));

  const updateProperty = useCallback(
    (id: string, field: keyof Property, value: string | boolean) =>
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      ),
    []
  );

  // ── calculation ──────────────────────────────────────────────────────────────

  const expenses = parseFloat(monthlyExpenses) || 0;

  interface MonthRow {
    monthKey: string;          // YYYY-MM
    label: string;
    grossRent: number;
    depositNotes: string[];
    taxableRent: number;       // gross minus expenses if NR6
    owing: number;             // 25% of taxableRent
    dueDate: string;
  }

  const rows: MonthRow[] = MONTHS.map((_, idx) => {
    const mm = String(idx + 1).padStart(2, "0");
    const monthKey = `${taxYear}-${mm}`;

    let grossRent = 0;
    const depositNotes: string[] = [];

    for (const prop of properties) {
      const rent = parseFloat(prop.monthlyRent) || 0;
      grossRent += rent;

      if (prop.hasDeposit) {
        const depAmt = parseFloat(prop.depositAmount) || 0;
        if (prop.depositMonth === monthKey && depAmt > 0) {
          grossRent += depAmt;
          depositNotes.push(
            `+${formatCAD(depAmt)} deposit from ${prop.name || "property"} (credited to ${monthLabel(prop.depositAppliedMonth)})`
          );
        }
      }
    }

    const taxableRent = useNR6 ? Math.max(0, grossRent - expenses) : grossRent;
    const owing = taxableRent * 0.25;

    // due date = 15th of next month
    const nextMonthDate = new Date(taxYear, idx + 1, 15);
    const dueDate = nextMonthDate.toLocaleDateString("en-CA", {
      month: "long", day: "numeric", year: "numeric",
    });

    return { monthKey, label: MONTHS[idx], grossRent, depositNotes, taxableRent, owing, dueDate };
  });

  const totalGross = rows.reduce((s, r) => s + r.grossRent, 0);
  const totalOwing = rows.reduce((s, r) => s + r.owing, 0);
  const hasAnyDeposit = properties.some((p) => p.hasDeposit);

  return (
    <div className="space-y-10">

      {/* ── Year selector ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tax year</label>
          <select
            value={taxYear}
            onChange={(e) => setTaxYear(parseInt(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
          >
            {[CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            type="button"
            onClick={() => setUseNR6((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useNR6 ? "bg-[hsl(218_28%_22%)]" : "bg-gray-300"
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              useNR6 ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
          <span className="text-sm font-medium text-gray-700">
            NR6 filed — withhold on <strong>net</strong> rent
          </span>
        </div>
      </div>

      {/* ── NR6 expense input ─────────────────────────────────────────────── */}
      {useNR6 && (
        <div className="rounded-lg border border-[hsl(152_60%_85%)] bg-[hsl(152_60%_96%)] p-4">
          <p className="mb-3 text-sm text-[hsl(222_30%_12%)]">
            With an approved NR6, withholding is 25% of <strong>net</strong> rent (gross minus
            eligible monthly expenses). Enter your estimated total monthly expenses across all
            properties below.
          </p>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Total monthly expenses (CAD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                min="0"
                placeholder="e.g. 2000"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                className="rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Properties ────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Properties</h2>
          <button
            type="button"
            onClick={addProperty}
            className="rounded-lg bg-[hsl(218_28%_22%)] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(218_28%_30%)]"
          >
            + Add property
          </button>
        </div>

        <div className="space-y-4">
          {properties.map((prop, i) => (
            <div key={prop.id} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-medium text-gray-800">Property {i + 1}</h3>
                {properties.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProperty(prop.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Property name / address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 762 Carmella, Ottawa"
                    value={prop.name}
                    onChange={(e) => updateProperty(prop.id, "name", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Monthly rent (CAD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 2200"
                      value={prop.monthlyRent}
                      onChange={(e) => updateProperty(prop.id, "monthlyRent", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
                    />
                  </div>
                </div>
              </div>

              {/* Deposit toggle */}
              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prop.hasDeposit}
                    onChange={(e) => updateProperty(prop.id, "hasDeposit", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[hsl(152_60%_36%)]"
                  />
                  <span className="text-sm text-gray-700">
                    Last-month deposit collected
                  </span>
                </label>

                {prop.hasDeposit && (
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 pl-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Deposit amount (CAD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="e.g. 2200"
                          value={prop.depositAmount}
                          onChange={(e) => updateProperty(prop.id, "depositAmount", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Month deposit was received
                      </label>
                      <input
                        type="month"
                        value={prop.depositMonth}
                        onChange={(e) => updateProperty(prop.id, "depositMonth", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Month deposit is credited to
                      </label>
                      <input
                        type="month"
                        value={prop.depositAppliedMonth}
                        onChange={(e) => updateProperty(prop.id, "depositAppliedMonth", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {prop.hasDeposit && prop.depositAmount && (
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-xs text-amber-800">
                  CRA cash-basis rule: the {formatCAD(parseFloat(prop.depositAmount) || 0)} deposit
                  is taxable in <strong>{monthLabel(prop.depositMonth)}</strong> (when received),
                  not in {monthLabel(prop.depositAppliedMonth)} (when credited).
                  The 15th remittance for {monthLabel(prop.depositMonth)} must include this amount.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Results table ─────────────────────────────────────────────────── */}
      {properties.some((p) => parseFloat(p.monthlyRent) > 0) && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {taxYear} Monthly Remittance Schedule
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Month</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Gross rent</th>
                  {useNR6 && (
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Net rent</th>
                  )}
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    25% owing
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Due to CRA</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr
                    key={row.monthKey}
                    className={row.depositNotes.length > 0 ? "bg-amber-50" : "hover:bg-gray-50"}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{row.label}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {formatCAD(row.grossRent)}
                    </td>
                    {useNR6 && (
                      <td className="px-4 py-3 text-right text-gray-700">
                        {formatCAD(row.taxableRent)}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right font-semibold text-[hsl(152_60%_36%)]">
                      {formatCAD(row.owing)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.dueDate}</td>
                    <td className="px-4 py-3 text-xs text-amber-700">
                      {row.depositNotes.join(" · ")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                  <td className="px-4 py-3 text-gray-900">{taxYear} Total</td>
                  <td className="px-4 py-3 text-right text-gray-900">{formatCAD(totalGross)}</td>
                  {useNR6 && <td className="px-4 py-3" />}
                  <td className="px-4 py-3 text-right text-[hsl(152_60%_36%)]">{formatCAD(totalOwing)}</td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>

          {hasAnyDeposit && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <strong>Deposit rows highlighted in yellow</strong> — CRA requires Part XIII
              withholding on the month the deposit was <em>received</em>, not the month it is
              credited to the tenant. This is the cash-basis rule under the Income Tax Act.
            </div>
          )}

          <div className="mt-6 rounded-xl border border-[hsl(152_60%_85%)] bg-[hsl(152_60%_96%)] p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm text-[hsl(222_30%_12%)] font-medium">
                  Total {taxYear} Part XIII remittance
                </div>
                <div className="text-3xl font-bold text-[hsl(222_30%_12%)] mt-1">
                  {formatCAD(totalOwing)}
                </div>
                <div className="text-xs text-[hsl(152_60%_36%)] mt-1">
                  Due in 12 monthly installments by the 15th of the following month
                </div>
              </div>
              <div className="text-sm text-[hsl(222_30%_12%)] space-y-1">
                <div>Account type: <strong>NR</strong></div>
                <div>Payment method: CRA My Account or wire to Receiver General</div>
                <div>Keep NR receipts — required for Section 216 return</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
