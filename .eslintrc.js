export default {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@next/next/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  rules: {
    // Essential React rules
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-fragments": "prefer-fragment",
    "react/jsx-no-undef": "error",
    "react/display-name": "warn",
    "react/self-closing-comp": "error",
    "react/no-unescaped-entities": "error",

    // Essential React Hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn", // Can be strict if you're confident

    // Other recommended rules
    "no-unused-vars": "error",
    "no-console": "warn",
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "prefer-const": "error",
  },
};
