const shell = require("shelljs");

const githubPath = "../../../gh-pages/react";

shell.rm("-rf", `${githubPath}/*`);
shell.cp("-R", "dist/*", githubPath);
