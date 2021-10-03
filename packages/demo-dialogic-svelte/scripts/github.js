import shell from "shelljs";

const githubPath = "../../../gh-pages/svelte";

shell.rm("-rf", `${githubPath}/*`);
shell.cp("-R", "dist/*", githubPath);
