/** @type {import('jest').Config} */
export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["js", "ts", "json", "node"],
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
