module.exports = {
    "env": {
        "browser": true
    },
    "extends": [
        "eslint:recommended",
    ],
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-console": [
            "warn", { "allow": ["warn", "error"] } 
        ],
        "no-undef": [
            "warn"
        ],
        "no-unused-vars": [
            "warn"
        ],
        "semi": [
            "error",
            "never"
        ]
    },
    "overrides": [
        {
          "files": ["*-example.js","*.second.js"],
          "rules": {
            "no-unused-expressions": "off"
          }
        }
      ]
};