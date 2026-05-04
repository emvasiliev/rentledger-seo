"use client";

import { useState, useCallback } from "react";

const CURRENT_YEAR = new Date().getFullYear();

const EXPENSE_FIELDS = [
  { key: "advertising",          label: "Advertising" },
  { key: "autoAndTravel",        label: "Auto and travel" },
  { key: "cleaning",             label: "Cleaning and maintenance" },
  { key: "commissions",          label: "Commissions" },
  { key: "insurance",            label: "Insurance" },
  { key: "legalAndProfessional", label: "Legal and other professional fees" },
  { key: "managementFees",       label: "Management fees" },
  { key: "mortgageInterest",     label: "Mortgage interest (paid to banks)" },
  { key: "otherInterest",        label: "Other interest" },
  { key: "repairs",              label: "Repairs" },
  { key: "supplies",             label: "Supplies" },
  { key: "taxes",                label: "Taxes" },
  { key: "utilities",            label: "Utilities" },
  { key: "depreciation",         label: "Depreciation expense or depletion" },
  { key: "otherExpenses",        label: "Other expenses" },
] as const;

type ExpenseKey = (typeof EXPENSE_FIELDS)[number]["key"];
type ExpenseMap = Record<ExpenseKey, string>;

interface Property {
  id: string;
  address: string;
  daysRented: string;
  daysPersonalUse: string;
  rentsReceived: string;
  expenses: ExpenseMap;
}

function emptyExpenses(): ExpenseMap {
  return Object.fromEntries(EXPENSE_FIELDS.map((f) => [f.key, ""])) as ExpenseMap;
}

function newProperty(id: string): Property {
  return {
    id,
    address: "",
    daysRented: "",
    daysPersonalUse: "",
    rentsReceived: "",
    expenses: emptyExpenses(),
  };
}

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function formatNet(n: number) {
  return n >= 0 ? formatUSD(n) : `(${formatUSD(Math.abs(n))})`;
}

function sumExpenses(expenses: ExpenseMap): number {
  return Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0);
}

export default function ScheduleECalculator() {
  const [taxYear, setTaxYear] = useState(CURRENT_YEAR);
  const [properties, setProperties] = useState<Property[]>([newProperty("1")]);

  const addProperty = () =>
    setProperties((p) => [...p, newProperty(String(Date.now()))]);

  const removeProperty = (id: string) =>
    setProperties((p) => p.filter((x) => x.id !== id));

  const updateField = useCallback(
    (id: string, field: keyof Omit<Property, "id" | "expenses">, value: string) =>
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      ),
    []
  );

  const updateExpense = useCallback(
    (id: string, key: ExpenseKey, value: string) =>
      setProperties((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, expenses: { ...p.expenses, [key]: value } } : p
        )
      ),
    []
  );

  const computed = properties.map((prop) => {
    const income = parseFloat(prop.rentsReceived) || 0;
    const totalExpenses = sumExpenses(prop.expenses);
    return { income, totalExpenses, net: income - totalExpenses };
  });

  const grandIncome = computed.reduce((s, c) => s + c.income, 0);
  const grandExpenses = computed.reduce((s, c) => s + c.totalExpenses, 0);
  const grandNet = grandIncome - grandExpenses;

  const hasAnyData = computed.some((c) => c.income > 0 || c.totalExpenses > 0);

  return (
    <div className="space-y-10">

      {/* Year selector */}
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

      {/* Properties */}
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

        <div className="space-y-6">
          {properties.map((prop, i) => {
            const c = computed[i];
            const showSummary = c.income > 0 || c.totalExpenses > 0;
            return (
              <div key={prop.id} className="rounded-xl border border-gray-200 bg-gray-50 p-5">

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
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

                {/* Address + usage days */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-5">
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Property address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4321 Maple Drive, Orlando, FL 32801"
                      value={prop.address}
                      onChange={(e) => updateField(prop.id, "address", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Days rented at fair price
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="365"
                      placeholder="e.g. 365"
                      value={prop.daysRented}
                      onChange={(e) => updateField(prop.id, "daysRented", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Days personal use
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="365"
                      placeholder="e.g. 0"
                      value={prop.daysPersonalUse}
                      onChange={(e) => updateField(prop.id, "daysPersonalUse", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
                    />
                  </div>
                </div>

                {/* Income */}
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Income</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Rents received (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="e.g. 24000"
                          value={prop.rentsReceived}
                          onChange={(e) => updateField(prop.id, "rentsReceived", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expenses */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Expenses</h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {EXPENSE_FIELDS.map((field) => (
                      <div key={field.key}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {field.label}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={prop.expenses[field.key]}
                            onChange={(e) => updateExpense(prop.id, field.key, e.target.value)}
                            className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152_60%_46%)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Per-property summary */}
                {showSummary && (
                  <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Rents received</div>
                        <div className="font-semibold text-gray-900">{formatUSD(c.income)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Total expenses</div>
                        <div className="font-semibold text-gray-900">{formatUSD(c.totalExpenses)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Net income / (loss)</div>
                        <div className={`font-bold text-lg ${c.net >= 0 ? "text-[hsl(152_60%_36%)]" : "text-red-600"}`}>
                          {formatNet(c.net)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state hint */}
      {!hasAnyData && (
        <p className="text-sm text-gray-500">
          Enter rent received or expenses to calculate your Schedule E income.
        </p>
      )}

      {/* Grand total — only when 2+ properties have data */}
      {hasAnyData && properties.length > 1 && (
        <div className="rounded-xl border border-[hsl(152_60%_85%)] bg-[hsl(152_60%_96%)] p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {taxYear} Total — All Properties
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-xs text-gray-500 mb-1">Total rents received</div>
              <div className="font-semibold text-gray-900">{formatUSD(grandIncome)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Total expenses</div>
              <div className="font-semibold text-gray-900">{formatUSD(grandExpenses)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Net income / (loss)</div>
              <div className={`font-bold text-xl ${grandNet >= 0 ? "text-[hsl(152_60%_36%)]" : "text-red-600"}`}>
                {formatNet(grandNet)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversion CTA */}
      {hasAnyData && (
        <div className="rounded-xl bg-[hsl(218_28%_22%)] p-5 text-center">
          <p className="text-base font-semibold text-white">
            Track your Schedule E income and expenses automatically.
          </p>
          <p className="mt-1 text-sm text-white/80">
            RentLedger syncs rent payments and categorizes expenses year-round — so tax time takes minutes, not days.
          </p>
          <a
            href="https://app.rentledger.ca"
            className="mt-4 inline-block rounded-lg bg-[hsl(152_60%_36%)] px-6 py-3 text-sm font-semibold text-white hover:bg-[hsl(152_60%_44%)]"
          >
            Track this in RentLedger →
          </a>
        </div>
      )}
    </div>
  );
}
