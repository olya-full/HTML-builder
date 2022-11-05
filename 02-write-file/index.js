const fs = require("fs");
const path = require("path");
const { stdout, stdin } = process;

fs.writeFile(path.join(__dirname, "text.txt"), "", (err) => {
  if (err) throw err;
});

let currentPath = path.join(__dirname, "text.txt");
stdout.write("Please put in what you would like to save into the text file. \n");
let writeStream = fs.createWriteStream(currentPath);

process.on("SIGINT", () => {
  stdout.write("Thanks for adding info to the text file!");
  process.exit();
});

stdin.on("data", (data) => {
  if (data.toString().trim() == "exit"){
    stdout.write("Thanks for adding info to the text file!");
    process.exit();
  };
  writeStream.write(data);
});