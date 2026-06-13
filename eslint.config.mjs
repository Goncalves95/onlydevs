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
  ]),
  {
    rules: {
      // `//` prefix is intentional terminal-aesthetic UI text throughout the app
      "react/jsx-no-comment-textnodes": "off",
      // Valid mount-time patterns: setMounted, setMenuOpen(false) on route change, etc.
      "react-hooks/set-state-in-effect": "off",
      // Allow _-prefixed variables for intentional discard (e.g. `const { password: _, ...rest } = user`)
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_",
      }],
    },
  },
]);

export default eslintConfig;
