const { cpSync, existsSync, mkdirSync } = require("fs");
const { join } = require("path");

const root = join(__dirname, "..");
const source = join(root, "public");
const target = join(root, "dist", "public");

if (!existsSync(source)) {
  console.warn("copy-public: no existe la carpeta public/");
  process.exit(0);
}

mkdirSync(join(root, "dist"), { recursive: true });
cpSync(source, target, { recursive: true });
console.log("copy-public: public/ → dist/public/");
