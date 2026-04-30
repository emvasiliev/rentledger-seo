export default function Disclaimer() {
  return (
    <div className="my-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      <p className="font-semibold">⚠️ Important Disclaimer</p>
      <p className="mt-1">
        This content is for informational purposes only and does not constitute legal, tax, or
        financial advice. Tax laws change frequently — always verify with the{" "}
        <a
          href="https://www.canada.ca/en/revenue-agency.html"
          className="underline hover:text-amber-900"
          target="_blank"
          rel="noopener noreferrer"
        >
          CRA
        </a>{" "}
        and{" "}
        <a
          href="https://www.irs.gov"
          className="underline hover:text-amber-900"
          target="_blank"
          rel="noopener noreferrer"
        >
          IRS
        </a>{" "}
        or consult a qualified cross-border tax accountant before making decisions.
      </p>
    </div>
  );
}
