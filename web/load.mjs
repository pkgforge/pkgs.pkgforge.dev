import { writeFileSync } from "fs";

const edgeX86 = "https://bin.pkgforge.dev/x86_64-Linux/METADATA.AIO.json";
const edgeArm64 = "https://bin.pkgforge.dev/aarch64-Linux/METADATA.AIO.json";

const stableX86 =
  "https://bincache.pkgforge.dev/x86_64-Linux/METADATA.AIO.json";
const stableArm64 =
  "https://bincache.pkgforge.dev/aarch64-Linux/METADATA.AIO.json";

const community = "https://soarpkgs.pkgforge.dev/metadata/METADATA.json";

const run = async (url, branch, arch) => {
  /**
   * @type {{ pkg: string, build_date: string, family: string, sha: string, id: string?, name: string, version: string, category: string, size: string, sizeNum: number, type: "base" | "bin" | "pkg" }[]}
   */
  const response = [];

  /**
   * @type {Map<string, { type: "base" | "bin" | "pkg", index: number }>}
   */
  const set = new Map();

  const resp = await fetch(url).then((res) => res.json());

  if (branch === "com") {
    resp.forEach((data, index) => {
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
      });

      set.set(data.shasum, { type: "base", index });
    });
  } else {
    resp.base.forEach((data, index) => {
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
        sizeNum: genSize(data.size),
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
        sizeNum: genSize(data.size),
        category: data.category,
        id: data.pkg_id,
        build_date: data.build_date,
      });

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
