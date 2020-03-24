/** @type {import('@jest/types/build/Config').InitialOptions} */
module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/*.ts', '!**/*.d.ts'],
  coverageDirectory: './coverage/'
}
