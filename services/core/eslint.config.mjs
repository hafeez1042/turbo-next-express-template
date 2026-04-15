import { backendConfig } from "@repo/eslint-config/backend";

/**
 * Architectural boundary rules for services/core.
 *
 * Layer order (top → bottom):
 *   routes → controllers → services → repositories → models
 *
 * Each layer may only import from the layer directly below it.
 * Skipping layers is a hard error caught by lint.
 */
export default [
  ...backendConfig,

  // ── Controllers: only allowed to import from services ─────────────────────
  {
    files: ["src/controllers/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../models/*", "../../models/*", "**/models/**"],
              message:
                "[arch] Controllers must not import models directly. Call the service layer instead.",
            },
            {
              group: ["../repositories/*", "../../repositories/*", "**/repositories/**"],
              message:
                "[arch] Controllers must not import repositories directly. Call the service layer instead.",
            },
            {
              group: ["sequelize", "sequelize/*"],
              message:
                "[arch] Controllers must not import Sequelize. Use service → repository.",
            },
          ],
        },
      ],
    },
  },

  // ── Services: only allowed to import from repositories ────────────────────
  {
    files: ["src/services/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../models/*", "../../models/*", "**/models/**"],
              message:
                "[arch] Services must not import models directly. Use the repository layer instead.",
            },
            {
              group: ["sequelize", "sequelize/*"],
              message:
                "[arch] Services must not import Sequelize. Use the repository instead.",
            },
          ],
        },
      ],
    },
  },

  // ── Routes: only allowed to import from controllers ───────────────────────
  {
    files: ["src/routes/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../models/*", "../../models/*", "**/models/**"],
              message: "[arch] Routes must not import models.",
            },
            {
              group: ["../repositories/*", "../../repositories/*", "**/repositories/**"],
              message: "[arch] Routes must not import repositories.",
            },
            {
              group: ["../services/*", "../../services/*", "**/services/**"],
              message:
                "[arch] Routes must not import services directly. Import controllers only.",
            },
            {
              group: ["sequelize", "sequelize/*"],
              message: "[arch] Routes must not import Sequelize.",
            },
          ],
        },
      ],
    },
  },
];
