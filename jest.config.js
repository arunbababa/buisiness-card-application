export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleNameMapper: {
      "\\.(css|less)$": "identity-obj-proxy",
    },
    globals: {
        "ts-jest": {
          tsconfig: "<rootDir>/tsconfig.app.json", // tsconfig を指定
        },
      },
  };
  
  