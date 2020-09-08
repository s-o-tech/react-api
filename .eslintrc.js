module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ["standard", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "no-var": "error",
    "prefer-const": "error",
  },
};
