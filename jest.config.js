export default {
    transform: {
      "^.+\\.js$": "babel-jest" // Jest가 ESM을 변환하도록 설정
    },
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1"
    }
  };
  