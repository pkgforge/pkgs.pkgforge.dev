import { readdirSync, readFileSync, writeFileSync } from "node:fs";

readdirSync("./src/pages/repo/").forEach((repo) => {
  readdirSync(`./src/pages/repo/${repo}/`).forEach((arch) => {
    /**
     * @type {Object[]}
     */
    const apps = JSON.parse(
      readFileSync(`./src/pages/repo/${repo}/${arch}/_apps.json`).toString()
    );

    apps.forEach((app) => {
      const [, , , , , , pkg_family, pkg] = app.pkg_webpage.split("/");

      writeFileSync(
        `./dist/repo/${repo}/${arch}/${pkg_family}/${pkg}/raw.json`,
        JSON.stringify(app, null, 2)
      );
    });
  });
});
