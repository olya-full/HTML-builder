const fs = require("fs");
const path = require("path");
const { stdout } = process;

let currentPath = path.join(__dirname, "text.txt");
let currentStream = fs.createReadStream(currentPath, "utf-8");

let data = "";
currentStream.on("data", (chunk) => {data += chunk});
currentStream.on("end", () => {stdout.write(data)});


