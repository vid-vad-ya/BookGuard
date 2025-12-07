// node scripts/img-to-dataurl.js
const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "..", "src", "assets", "logo.png"); // adjust if different
const b = fs.readFileSync(p);
const base64 = b.toString("base64");
console.log("data:image/png;base64," + base64);
