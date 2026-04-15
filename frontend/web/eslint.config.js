import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,

  // ── Components & pages: enforce data-access boundaries ────────────────────
  //
  // Data flow: component → query/mutation hook → service → AbstractServices → API
  // Components must not call services or axios directly.
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@tanstack/react-query",
              message:
                "[arch] Use @repo/frontend/hooks/useQuery instead of @tanstack/react-query directly.",
            },
          ],
          patterns: [
            {
              group: ["axios", "axios/*"],
              message:
                "[arch] Do not import axios in components. Use service classes that extend AbstractServices.",
            },
            {
              group: [
                "../services/*",
                "../../services/*",
                "../../../services/*",
                "**/services/*.service",
              ],
              message:
                "[arch] Components must not call services directly. Use hooks from queries/ or mutations/ instead.",
            },
          ],
        },
      ],
    },
  },

  // ── Query/mutation hooks: no direct axios ─────────────────────────────────
  {
    files: ["queries/**/*.ts", "mutations/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@tanstack/react-query",
              message:
                "[arch] Use @repo/frontend/hooks/useQuery instead of @tanstack/react-query directly.",
            },
          ],
          patterns: [
            {
              group: ["axios", "axios/*"],
              message:
                "[arch] Do not import axios in hooks. Use service classes that extend AbstractServices.",
            },
          ],
        },
      ],
    },
  },
];
