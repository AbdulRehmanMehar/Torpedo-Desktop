module.exports =  {
  root: true,
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:sonarjs/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  overrides: [
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    "react",
    "sonarjs",
    "unused-imports",
    "@typescript-eslint"
  ],
  rules: {
    "semi": 0,
    "dot-notation": 0,
    "@typescript-eslint/semi": 0,
    "react/react-in-jsx-scope": 0,
    "eslint/no-explicit-any": 0,
    "@typescript-eslint/triple-slash-reference": 0,
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "sonarjs/cognitive-complexity": 0,
    "sonarjs/no-identical-expressions": 2
  }
}