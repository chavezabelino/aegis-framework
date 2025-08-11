module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/snapshot-tests/**/*.test.ts', '<rootDir>/tests/replay-diff-tests/**/*.test.ts'],
};
