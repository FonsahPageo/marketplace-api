export default {
    testEnvironment: 'node',
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    globalTeardown: '<rootDir>/tests/teardown.js',
    transform: {
        '^.+\\.[t|j]sx?$': 'babel-jest'
    },
};