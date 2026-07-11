import React from "react";
import { Sparkles } from "lucide-react";

/**
 * Center-column state for areas/pages that are not built yet.
 * Pass `sectionName` to show which area is coming soon (e.g. "Dịch vụ").
 */
export function ComingSoonState({ sectionName }: { sectionName?: string }) {
  const heading = sectionName ?? "Coming soon";
  const description = sectionName
    ? `WinKey đang hoàn thiện khu vực “${sectionName}”. Vui lòng quay lại sau.`
    : "WinKey đang hoàn thiện nội dung cho khu vực này. Vui lòng quay lại sau.";

  return (
    <section className="min-h-[420px] flex flex-col items-center justify-center text-center bg-white border border-gray-100 rounded-2xl px-6 py-16 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
        <Sparkles className="w-7 h-7 text-blue-600" aria-hidden="true" />
      </div>
      {sectionName && (
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
          Coming soon
        </p>
      )}
      <h2 className="text-xl font-bold text-gray-900 mb-2">{heading}</h2>
      <p className="max-w-sm text-sm leading-relaxed text-gray-500">{description}</p>
    </section>
  );
}
