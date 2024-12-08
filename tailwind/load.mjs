import { writeFileSync } from "fs";
const url = "https://bin.ajam.dev/x86_64_Linux/METADATA.AIO.json";

(async () => {
  /**
   * @type {{ pkg: string, build_date: string, family: string, sha: string, id: string?, name: string, version: string, category: string, size: string, type: "base" | "bin" | "pkg" }[]}
   */
  const response = [];

  /**
   * @type {Map<string, { type: "base" | "bin" | "pkg", index: number }>}
   */
  const set = new Map();

  const resp = await fetch(url).then((res) => res.json());

  resp.base.forEach((data, index) => {
    response.push({
      name: data.pkg,
      pkg: data.pkg_name,
      family: data.pkg_family,
      version: data.version,
      sha: data.shasum,
      type: "base",
      size: data.size,
      category: data.category,
      id: "N/A",
      build_date: data.build_date,
    });

    set.set(data.shasum, { type: "base", index });
  });
  resp.bin.forEach((data, index) => {
    response.push({
      name: data.pkg,
      pkg: data.pkg_name,
      family: data.pkg_family,
      sha: data.shasum,
      version: data.version,
      type: "bin",
      size: data.size,
      category: data.category,
      id: "N/A",
      build_date: data.build_date,
    });

    set.set(data.shasum, { type: "bin", index });
  });
  resp.pkg.forEach((data, index) => {
    response.push({
      name: data.pkg,
      pkg: data.pkg_name,
      family: data.pkg_family,
      version: data.version,
      sha: data.shasum,
      type: "pkg",
      size: data.size,
      category: data.category,
      id: data.pkg_id,
      build_date: data.build_date,
    });

    set.set(data.shasum, { type: "pkg", index });
  });

  response.sort((a, b) => a.name.localeCompare(b.name));

  writeFileSync("./src/metadata.json", JSON.stringify(response, null, 2));
})();
