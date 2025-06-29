import { writeFileSync } from "fs";

const binArm64 = "https://meta.pkgforge.dev/bincache/aarch64-Linux.json";
const binX86 = "https://meta.pkgforge.dev/bincache/x86_64-Linux.json";

const pkgcacheArm64 = "https://meta.pkgforge.dev/pkgcache/aarch64-Linux.json";
const pkgcacheX86 = "https://meta.pkgforge.dev/pkgcache/x86_64-Linux.json";

const soarpkgs = "https://meta.pkgforge.dev/soarpkgs/INDEX.json";

const pkgforgeCargoArm64 = "https://meta.pkgforge.dev/external/pkgforge-cargo/aarch64-Linux.json"
const pkgforgeCargoX86 = "https://meta.pkgforge.dev/external/pkgforge-cargo/x86_64-Linux.json"
const pkgforgeCargoloongAarch64 = "https://meta.pkgforge.dev/external/pkgforge-cargo/loongarch64-Linux.json"
const pkgforgeCargoRiscv64 = "https://meta.pkgforge.dev/external/pkgforge-cargo/riscv64-Linux.json"

const pkgforgeGoArm64 = "https://meta.pkgforge.dev/external/pkgforge-go/aarch64-Linux.json"
const pkgforgeGoX86 = "https://meta.pkgforge.dev/external/pkgforge-go/x86_64-Linux.json"
const pkgforgeGoloongAarch64 = "https://meta.pkgforge.dev/external/pkgforge-go/loongarch64-Linux.json"
const pkgforgeGoRiscv64 = "https://meta.pkgforge.dev/external/pkgforge-go/riscv64-Linux.json"

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

  resp.forEach((data) => {
    response.push(data);

    // Store original external URL for pkgforge-cargo and pkgforge-go
    if (branch === "pkgforge-cargo" || branch === "pkgforge-go") {
      data.external_webpage = data.pkg_webpage; // Store the original external URL
      // Override with internal URL for page generation
      data.pkg_webpage = `https://pkgs.pkgforge.dev/repo/${branch}/${arch}/${data.pkg_id}/${data.pkg_name || data.pkg}`;
    } else if (!data.pkg_webpage) {
      console.log(
        `⚠️ Auto guessed pkg_webpage for ${branch}-${arch}/${data.pkg_id}/${data.pkg_name || data.pkg}`
      );
      data.pkg_webpage = `https://pkgs.pkgforge.dev/repo/${branch}/${arch}/${data.pkg_id}/${data.pkg_name || data.pkg}`;
    }

    const key = `${data.category}/${data.pkg_id}`;

    if (familyMap[key]) {
      familyMap[key].push([data.pkg_name || data.pkg, data.pkg_webpage]);
    } else {
      familyMap[key] = [[data.pkg_name || data.pkg, data.pkg_webpage]];
    }
  });

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
      response.map((data) => {
        // For pkgforge-cargo and pkgforge-go, use the category directly since URLs are standardized
        // let category;
        // if (branch === "pkgforge-cargo" || branch === "pkgforge-go") {
        //   category = data.category
        // } else {
        //   const [, , , , , extractedCategory] = data.pkg_webpage.split("/");
        //   category = extractedCategory;
        // }

        const [, , , , , category] = data.pkg_webpage.split("/");

        return {
          "name": data.pkg_name || data.pkg,
          "pkg": data.pkg,
          "family": data.pkg_id,
          "version": data.version,
          "sha": data.shasum,
          "type": data.pkg_type || "none",
          "size": data.size,
          "sizeNum": genSize(data.size),
          "category": data.category,
          "id": "N/A",
          "Build Date": data.build_date,
          "url": data.pkg_webpage,
          "familyUrl": `/${branch}/${category}/${data.pkg_id}`,
          // Include external_webpage for pkgforge-cargo and pkgforge-go
          ...(data.external_webpage && { external_webpage: data.external_webpage }),
        };
      })
    )
  );
};

(async () => {
  console.log("⏲️ Downloading bincache aarch64");
  await run(binArm64, "bincache", "aarch64-linux");

  console.log("⏲️ Downloading bincache x86_64");
  await run(binX86, "bincache", "x86_64-linux");

  console.log("⏲️ Downloading soarpkgs");
  await run(soarpkgs, "soarpkgs", "[category]");

  console.log("⏲️ Downloading pkgcache aarch64");
  await run(pkgcacheArm64, "pkgcache", "aarch64-linux");

  console.log("⏲️ Downloading pkgcache x86_64");
  await run(pkgcacheX86, "pkgcache", "x86_64-linux");

  console.log("⏲️ Downloading pkgforge-cargo aarch64");
  await run(pkgforgeCargoArm64, "pkgforge-cargo", "aarch64-linux");

  console.log("⏲️ Downloading pkgforge-cargo x86_64");
  await run(pkgforgeCargoX86, "pkgforge-cargo", "x86_64-linux");

  console.log("⏲️ Downloading pkgforge-cargo loongarch64");
  await run(pkgforgeCargoloongAarch64, "pkgforge-cargo", "loongarch64-linux");

  console.log("⏲️ Downloading pkgforge-cargo riscv64");
  await run(pkgforgeCargoRiscv64, "pkgforge-cargo", "riscv64-linux");

  console.log("⏲️ Downloading pkgforge-go aarch64");
  await run(pkgforgeGoArm64, "pkgforge-go", "aarch64-linux");

  console.log("⏲️ Downloading pkgforge-go x86_64");
  await run(pkgforgeGoX86, "pkgforge-go", "x86_64-linux");

  console.log("⏲️ Downloading pkgforge-go loongarch64");
  await run(pkgforgeGoloongAarch64, "pkgforge-go", "loongarch64-linux");

  console.log("⏲️ Downloading pkgforge-go riscv64");
  await run(pkgforgeGoRiscv64, "pkgforge-go", "riscv64-linux");

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
