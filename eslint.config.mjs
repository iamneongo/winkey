import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Non-core starter/demo modules kept out of the production audit pass:
    "src/components/forms/demo-form.tsx",
    "src/components/ui/infobar.tsx",
    "src/components/ui/kanban.tsx",
    "src/components/ui/macbook-scroll.tsx",
    "src/features/auth/components/user-auth-form.tsx",
    "src/features/chat/**",
    "src/features/forms/components/sheet-product-form.tsx",
    "src/features/kanban/**",
    "src/lib/clerk-mock.tsx",
    "src/lib/compose-refs.ts",
  ]),
]);

export default eslintConfig;
