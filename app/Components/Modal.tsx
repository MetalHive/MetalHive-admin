"use client";
import { useState } from "react";
import { MODAL_CONFIG, ModalConfigItem, DropdownConfig  } from "../dashboard/modals/modalConfig";

type Props = {
  type: string; // key of modal in config
  isOpen: boolean;
  onClose: () => void;
};

export function Modal({ type, isOpen, onClose }: Props) {
  const config: ModalConfigItem = MODAL_CONFIG[type];
  const [step, setStep] = useState<"FORM" | "RESULT">("FORM");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: "success" | "error";
    header: string;
    subtext: string;
  } | null>(null);

  // track dropdown values dynamically
  const [selected, setSelected] = useState<Record<string, string>>(
    () =>
      config?.dropdowns?.reduce((acc, dd) => {
        acc[dd.name] = "";
        return acc;
      }, {} as Record<string, string>) || {}
  );

  if (!isOpen || !config) return null;

  const handleSubmit = async () => {
    // basic validation
    if (config.dropdowns?.some((dd) => !selected[dd.name])) return;

    setLoading(true);
    try {
      const res = await fetch(config.api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();

      // Build success messages using template placeholders
      const replacePlaceholders = (template: string) =>
        template.replace(/\{\{(.*?)\}\}/g, (_, key) => selected[key] || "");

      const header = config.successHeader
        ? replacePlaceholders(config.successHeader)
        : "Success";
      const subtext = config.successSubtext
        ? replacePlaceholders(config.successSubtext)
        : "Operation completed successfully";

      setResult({ status: "success", header, subtext });
      setStep("RESULT");
    } catch (err) {
      setResult({
        status: "error",
        header: "Something went wrong",
        subtext: "Please try again.",
      });
      setStep("RESULT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        {step === "FORM" && (
          <>
            <h2 className="text-lg font-semibold mb-2">{config.header}</h2>
            {config.subtext && (
              <p className="text-sm text-gray-600 mb-4">{config.subtext}</p>
            )}

               {/* render dropdowns dynamically */}
            {config.dropdowns?.map((dd: DropdownConfig) => (
              <div key={dd.name} className="mb-3">
                {dd.label && (
                  <label className="block text-sm font-medium mb-1">
                    {dd.label}
                  </label>
                )}
                <select
                  value={selected[dd.name]}
                  onChange={(e) =>
                    setSelected((prev) => ({
                      ...prev,
                      [dd.name]: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border p-2"
                >
                 
                  {dd.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  config.dropdowns?.some((dd) => !selected[dd.name])
                }
                className={`rounded-md px-4 py-2 text-sm text-white ${
                  config.confirmVariant === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : config.confirmVariant === "warning"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } disabled:opacity-50`}
              >
                {loading ? "Processing..." : config.confirmText || "Submit"}
              </button>
            </div>
          </>
        )}

        {step === "RESULT" && result && (
          <>
            <h2
              className={`text-lg font-semibold mb-2 ${
                result.status === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {result.header}
            </h2>
            <p className="text-sm text-gray-600 mb-4">{result.subtext}</p>
            <button
              onClick={() => {
                setStep("FORM");
                setResult(null);
                onClose();
              }}
              className="w-full rounded bg-black text-white p-2"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
