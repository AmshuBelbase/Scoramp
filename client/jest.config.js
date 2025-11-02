module.exports = {
  testEnvironment: "jsdom",
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },  
  // Mock CSS and other static file imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)', // Allow axios to be transformed
  ],
};