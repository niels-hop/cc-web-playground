import { readFile } from "fs/promises";
import { join } from "path";

async function readConfig() {
  try {
    // Read the package.json file
    const packageJsonPath = join(__dirname, "package.json");
    const contents = await readFile(packageJsonPath, "utf-8");

    // Parse and pretty-print the JSON
    const packageData = JSON.parse(contents);
    console.log("Package.json contents:");
    console.log(JSON.stringify(packageData, null, 2));
  } catch (error) {
    console.error("Error reading package.json:", error);
    process.exit(1);
  }
}

readConfig();
