const shell = require("shelljs");

const githubPath = "../../../gh-pages/svelte";

shell.rm("-rf", `${githubPath}/*`);
shell.cp("-R", "public/*", githubPath);
