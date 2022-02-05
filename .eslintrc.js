module.exports = {
    "root": true,
    "env": {
        "node": true
    },
    "extends": [
        `plugin:vue/essential`,
        `eslint:recommended`,
        `@vue/typescript`
    ],
    "parserOptions": {
        "parser": `@typescript-eslint/parser`
    },
    "rules": {
        indent: [`error`, 4, { SwitchCase: 1 }],
        'space-before-function-paren': [`error`, `never`],
        quotes: [`error`, `backtick`],
        'vue/html-quotes': [`error`, `single`],
        camelcase: `off`,
        "vue/html-closing-bracket-newline": [`error`, {
            "singleline": `never`,
            "multiline": `never`,
        }],
        "vue/html-end-tags": `error`,
        "vue/html-indent": [`error`, 4, {
            "attribute": 1,
            "baseIndent": 0,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": [],
        }],
        "vue/html-self-closing": [1, {
            "html": {
                "void": `never`,
                "normal": `never`,
                "component": `never`,
            },
            "svg": `always`,
            "math": `always`,
        }],
        "object-curly-spacing": ["error", "always"]
    }
}
