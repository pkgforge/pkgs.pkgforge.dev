import { writeFileSync } from "fs";

const binArm64 = "https://meta.pkgforge.dev/bincache/aarch64-Linux.json";
const binX86 = "https://meta.pkgforge.dev/bincache/x86_64-Linux.json";

const community = "https://soarpkgs.pkgforge.dev/metadata/METADATA.json";
const run = async (url, branch, arch) => {
  /**
   * @type {{ pkg: string, build_date: string, family: string, sha: string, id: string?, name: string, version: string, category: string, size: string, sizeNum: number, type: "base" | "bin" | "pkg" }[]}
   */
  const response = [];

  /**
   * @type {{ [key: string]: { name: string, hash: string }[] }}
   */
  const familyMap = {};

  const resp = await fetch(url).then((res) => res.json());

  if (branch === "com" || branch == "community") {
    resp.forEach((data) => {
      data.pkg_family = data.pkg_id || "community";

      response.push(data);

      if (familyMap[data.pkg_family]) {
        familyMap[data.pkg_family].push(data.pkg);
      } else {
        familyMap[data.pkg_family] = [data.pkg];
      }
    });
  } else {
    resp.forEach((data) => {
      response.push(data);

      if (familyMap[data.pkg_family]) {
        familyMap[data.pkg_family].push(data.pkg);
      } else {
        familyMap[data.pkg_family] = [data.pkg];
      }
    });
  }

  response.sort((a, b) =>
    (a.pkg_name || a.pkg).localeCompare(b.pkg_name || b.pkg)
  );

  writeFileSync(
    `./src/pages/repo/${branch}/${arch}/_family.json`,
    JSON.stringify(familyMap, null, 2)
  );
  writeFileSync(
    `./src/pages/repo/${branch}/${arch}/_apps.json`,
    JSON.stringify(response, null, 2)
  );
  writeFileSync(
    `./src/metadata_${branch}_${arch}.json`,
    JSON.stringify(
      response.map((data) => ({
        name: data.pkg_name || data.pkg,
        pkg: data.pkg,
        family: data.pkg_family || data.pkg_id,
        version: data.version,
        sha: data.shasum,
        type: "base",
        size: data.size,
        sizeNum: genSize(data.size),
        category: data.category,
        id: "N/A",
        build_date: data.build_date,
        url: `/${branch}/${arch}/${data.pkg_family}/${data.pkg}`,
        familyUrl: `/${branch}/${arch}/${data.pkg_family}`,
      }))
    )
  );
};

(async () => {
  console.log("⏲️ Downloading bincache aarch64");
  await run(binArm64, "bincache", "aarch64-linux");

  console.log("⏲️ Downloading bincache x86_64");
  await run(binX86, "bincache", "x86_64-linux");

  // console.log("⏲️ Downloading Community");
  // await run(community, "community", "universal-linux");

  // console.log("⏲️ Downloading Edge x86_64");
  // await run(edgeX86, "edge", "x86_64-linux");

  // console.log("⏲️ Downloading Edge aarch64");
  // await run(edgeArm64, "edge", "aarch64-linux");

  // console.log("⏲️ Downloading Stable x86_64");
  // await run(stableX86, "stable", "x86_64-linux");

  // console.log("⏲️ Downloading Stable aarch64");
  // await run(stableArm64, "stable", "aarch64-linux");
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
