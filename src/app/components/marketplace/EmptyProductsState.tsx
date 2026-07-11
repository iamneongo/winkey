import React from "react";
import { PackageOpen } from "lucide-react";

/**
 * Center-column state for a valid area that simply has no products to show.
 * Distinct from ComingSoonState (used for areas that aren't built yet).
 */
export function EmptyProductsState({
  title = "Chưa có sản phẩm",
  description = "Danh mục này hiện chưa có sản phẩm. Vui lòng quay lại sau."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="min-h-[360px] flex flex-col items-center justify-center text-center bg-white border border-gray-100 rounded-2xl px-6 py-16 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
        <PackageOpen className="w-7 h-7 text-gray-400" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="max-w-sm text-sm leading-relaxed text-gray-500">{description}</p>
    </section>
  );
}
