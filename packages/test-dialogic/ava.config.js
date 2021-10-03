export default {
  babel: {
    compileEnhancements: false,
  },
  extensions: {
    ts: "module",
  },
  nonSemVerExperiments: {
    configurableModuleFormat: true,
  },
  nodeArguments: ["--loader=ts-node/esm"],
  require: ["ts-node/register", "./test/_setup-browser-env.ts"],
};
