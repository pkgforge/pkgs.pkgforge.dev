import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

readdirSync("./src/pages/repo/").forEach((repo) => {
  readdirSync(`./src/pages/repo/${repo}/`).forEach((arch) => {
    /**
     * @type {Object[]}
     */
    const apps = JSON.parse(
      readFileSync(`./src/pages/repo/${repo}/${arch}/_apps.json`).toString()
    );

    apps.forEach((app) => {
      const [, , , , , category, ...pkg] = app.pkg_webpage.split("/");
      const filePath = `./dist/repo/${repo}/${category}/${pkg.join("/")}/raw.json`;
      
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, JSON.stringify(app, null, 2));
    });
  });
});
