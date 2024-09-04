import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  // Aplica configuraciones a todos los archivos JavaScript y TypeScript
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,        // Reglas recomendadas de ESLint
      ...tseslint.configs.recommended.rules,        // Reglas recomendadas de TypeScript
      ...pluginReact.configs.flat.recommended.rules, // Reglas recomendadas de React
      "prettier/prettier": "error",                 // Ejecuta Prettier como una regla de ESLint
    },
  },
  // Configuración específica para archivos JavaScript
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  // Desactiva reglas que pueden entrar en conflicto con Prettier
  prettier,
];
