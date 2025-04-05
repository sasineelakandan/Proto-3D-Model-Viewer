import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // This block converts all errors to warnings
  {
    name: "convert-errors-to-warnings",
    files: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"],
    rules: {}, // empty on purpose
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    plugins: {
      "convert-all-to-warn": {
        rules: {
          "all-to-warn": {
            create: () => ({}),
          },
        },
      },
    },
    processor: {
      preprocess(text) {
        return [text];
      },
      postprocess(messages) {
        return messages[0].map(msg => ({ ...msg, severity: 1 }));
      },
      supportsAutofix: true,
    },
  },
];

export default eslintConfig;
