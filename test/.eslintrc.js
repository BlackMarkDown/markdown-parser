module.exports = {
  env: {
    mocha: true,
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
  },
  globals: {
    describe: true,
    it: true,
    expect: true,
  },
}
