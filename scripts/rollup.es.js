import { pkg, createConfig } from "./rollup.base";

const env = process.env;
const baseConfig = createConfig();
const targetConfig = Object.assign({}, baseConfig, {
  output: Object.assign(
    {},
    baseConfig.output,
    {
      format: "es",
      file: `${env.DEST || pkg.main}.mjs`,
    }
  )
});

export default targetConfig;
