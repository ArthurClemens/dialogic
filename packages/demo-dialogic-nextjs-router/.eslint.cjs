const OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = {
  extends: ["next/core-web-vitals", "prettier"],
  plugins: [
    "react",
    "@typescript-eslint",
    "simple-import-sort",
    "prettier",
    "import",
  ],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    "prettier/prettier": ERROR,
    // ESLint rules
    "no-useless-computed-key": ERROR,
    "no-underscore-dangle": OFF,
    "arrow-parens": OFF,
    "no-nested-ternary": OFF,
    "import/prefer-default-export": OFF,
    "eol-last": [ERROR, "always"],
    "import/extensions": [ERROR, { json: "always" }],
    "import/no-unresolved": ERROR,
    "no-console": ["warn", { allow: ["error", "info"] }],

    // Sorting rules
    "simple-import-sort/imports": ERROR,
    "sort-imports": OFF,
    "import/order": OFF,
    "import/first": ERROR,
    "import/newline-after-import": ERROR,
    "import/no-duplicates": ERROR,

    // TypeScript rules
    "no-unused-vars": OFF,
    "@typescript-eslint/no-unused-vars": [
      WARN,
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/explicit-function-return-type": OFF,
  },
};
