const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;
let currentPath = path.join(__dirname, "styles");
let targetPath = path.join(__dirname, "project-dist");

function assembleCssBundle(){
  fs.rm(path.join(targetPath, "bundle.css"), {recursive: true}, () => {
    fs.writeFile(path.join(targetPath, "bundle.css"), "",  (err) => {
      if (err) throw err;
    });
    fs.readdir(currentPath, {withFileTypes: true}, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        if (file.isFile() && path.extname(file.name)==".css"){
          let currentStream = fs.createReadStream(path.join(currentPath, file.name), "utf-8");
          let data = "";
          currentStream.on("data", (chunk) => {data += chunk});
          currentStream.on("end", () => {
            fs.appendFile(path.join(targetPath, "bundle.css"), data, (err) => {
              if (err) throw err;
            })
          });
        }
      })
    })
  })
}

assembleCssBundle();