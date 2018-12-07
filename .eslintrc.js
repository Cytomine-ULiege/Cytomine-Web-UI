module.exports = {
    "root": true,
    "env": {
        "node": true
    },
    "extends": [
        "plugin:vue/essential",
        "eslint:recommended"
    ],
    rules: {
        "indent": ["error", 4, {"SwitchCase": 1}],
        "quotes": ["error", "double", {"avoidEscape": true}],
        "brace-style": ["error", "stroustrup"],
        "array-bracket-spacing": ["error", "never"],
        "camelcase": ["error", {"properties": "always"}],
        "semi": ["error", "always"],
        "no-console": ["off"]
    },
    "parserOptions": {
        "parser": "babel-eslint"
    }
};
