export default {
  babel: {
    compileEnhancements: false,
  },
  extensions: ['ts'],
  require: ['ts-node/register', './test/_setup-browser-env.ts'],
};
