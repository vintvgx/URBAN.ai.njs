module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx)$": ["babel-jest"],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
