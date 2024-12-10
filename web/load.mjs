import { mkdirSync, writeFileSync } from "fs";
import crypto from "node:crypto";

const edgeX86 = "https://bin.pkgforge.dev/x86_64-Linux/METADATA.AIO.json";
const edgeArm64 = "https://bin.pkgforge.dev/aarch64-Linux/METADATA.AIO.json";

const stableX86 =
  "https://bincache.pkgforge.dev/x86_64-Linux/METADATA.AIO.json";
const stableArm64 =
  "https://bincache.pkgforge.dev/aarch64-Linux/METADATA.AIO.json";

const community = "https://soarpkgs.pkgforge.dev/metadata/METADATA.json";

const writeValue = (data, fileHash, branch, arch, pkgs) => {
  const astroFile = `---
import Layout from "../../../../../layouts/Layout.astro";
import App from "../../../../../components/app.tsx";

const data = ${JSON.stringify(data)};

const logs = await fetch(data.build_log)
  .then((res) => {
    if (!res.ok) {
      throw new Error(\`\${res.status}: \${res.statusText}\`);
    }
    return res.text();
  })
  .catch((e) => {
    return "✖️ Unable to fetch build logs!\n" + e;
  });
---

<Layout>
  <App data={data} logs={logs} client:only />
</Layout>`;

  mkdirSync(`./src/pages/app/${branch}/${arch}/${data.pkg_family}`, {
    recursive: true,
  });
  writeFileSync(
    `./src/pages/app/${branch}/${arch}/${data.pkg_family}/${fileHash}.astro`,
    astroFile
  );
};
const run = async (url, branch, arch) => {
  /**
   * @type {{ pkg: string, build_date: string, family: string, sha: string, id: string?, name: string, version: string, category: string, size: string, sizeNum: number, type: "base" | "bin" | "pkg" }[]}
   */
  const response = [];

  /**
   * @type {Map<string, { type: "base" | "bin" | "pkg", index: number }>}
   */
  const set = new Map();

  /**
   * @type {{ [key: string]: { name: string, hash: string }}}
   */
  const familyMap = {};

  const resp = await fetch(url).then((res) => res.json());

  if (branch === "com") {
    resp.forEach((data, index) => {
      const fileHash = crypto
        .createHash("md5")
        .update(`${data.pkg_name}${data.shasum}`)
        .digest("hex");

      response.push({
        name: data.pkg,
        pkg: data.pkg_name,
        family: data.pkg_family,
        version: data.version,
        sha: data.shasum,
        type: "base",
        size: data.size,
        sizeNum: genSize(data.size),
        category: data.category,
        id: "N/A",
        build_date: data.build_date,
        url: `/${branch}/${arch}/${data.pkg_family}/${fileHash}`,
        familyUrl: `/${branch}/${arch}/${data.pkg_family}`,
      });

      if (familyMap[data.pkg_family]) {
        familyMap[data.pkg_family].push(data);
      } else {
        familyMap[data.pkg_family] = [data];
      }

      writeValue(data, fileHash, branch, arch, familyMap[data.pkg_family]);
      set.set(data.shasum, { type: "base", index });
    });
  } else {
    resp.base.forEach((data, index) => {
      const fileHash = crypto
        .createHash("md5")
        .update(`${data.pkg_name}${data.shasum}`)
        .digest("hex");

      response.push({
        name: data.pkg,
        pkg: data.pkg_name,
        family: data.pkg_family,
        version: data.version,
        sha: data.shasum,
        type: "base",
        size: data.size,
        sizeNum: genSize(data.size),
        category: data.category,
        id: "N/A",
        build_date: data.build_date,
        url: `/${branch}/${arch}/${data.pkg_family}/${fileHash}`,
        familyUrl: `/${branch}/${arch}/${data.pkg_family}`,
      });

      if (familyMap[data.pkg_family]) {
        familyMap[data.pkg_family].push(data);
      } else {
        familyMap[data.pkg_family] = [data];
      }
      writeValue(data, fileHash, branch, arch, familyMap[data.pkg_family]);
      set.set(data.shasum, { type: "base", index });
    });
    resp.bin.forEach((data, index) => {
      const fileHash = crypto
        .createHash("md5")
        .update(`${data.pkg_name}${data.shasum}`)
        .digest("hex");

      response.push({
        name: data.pkg,
        pkg: data.pkg_name,
        family: data.pkg_family,
        sha: data.shasum,
        version: data.version,
        type: "bin",
        size: data.size,
        sizeNum: genSize(data.size),
        category: data.category,
        id: "N/A",
        build_date: data.build_date,
        url: `/${branch}/${arch}/${data.pkg_family}/${fileHash}`,
        familyUrl: `/${branch}/${arch}/${data.pkg_family}`,
      });

      if (familyMap[data.pkg_family]) {
        familyMap[data.pkg_family].push(data);
      } else {
        familyMap[data.pkg_family] = [data];
      }

      writeValue(data, fileHash, branch, arch, familyMap[data.pkg_family]);
      set.set(data.shasum, { type: "bin", index });
    });
    resp.pkg.forEach((data, index) => {
      const fileHash = crypto
        .createHash("md5")
        .update(`${data.pkg_name}${data.shasum}`)
        .digest("hex");

      response.push({
        name: data.pkg,
        pkg: data.pkg_name,
        family: data.pkg_family,
        version: data.version,
        sha: data.shasum,
        type: "pkg",
        size: data.size,
        sizeNum: genSize(data.size),
        category: data.category,
        id: data.pkg_id,
        build_date: data.build_date,
        url: `/${branch}/${arch}/${data.pkg_family}/${fileHash}`,
        familyUrl: `/${branch}/${arch}/${data.pkg_family}`,
      });

      if (familyMap[data.pkg_family]) {
        familyMap[data.pkg_family].push(data);
      } else {
        familyMap[data.pkg_family] = [data];
      }
      writeValue(data, fileHash, branch, arch, familyMap[data.pkg_family]);
      set.set(data.shasum, { type: "pkg", index });
    });
  }

  response.sort((a, b) => a.name.localeCompare(b.name));

  writeFileSync(
    `./src/metadata_${branch}_${arch}.json`,
    JSON.stringify(response)
  );
};

(async () => {
  console.log("⏲️ Downloading Stable x86");
  await run(stableX86, "stable", "x86");

  console.log("⏲️ Downloading Stable aarc64");
  await run(stableArm64, "stable", "aarch64");

  console.log("⏲️ Downloading Edge x86");
  await run(edgeX86, "edge", "x86");

  console.log("⏲️ Downloading Edge aarch64");
  await run(edgeArm64, "edge", "aarch64");

  console.log("⏲️ Downloading Community");
  //await run(community, "com", "univ");
})();

const genSize = (data) => {
  try {
    return eval(
      data
        .replace("GB", "*1000*1000*1000")
        .replace("MB", "*1000*1000")
        .replace("KB", "*1000")
        .replace("B", "")
    );
  } catch (_) {
    return 0;
  }
};
