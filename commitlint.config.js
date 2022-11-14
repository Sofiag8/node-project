module.exports = {extends: ['@commitlint/config-conventional'],   formatter: '@commitlint/format',  rules: {
    'type-enum': ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'revert'],
  },
};
