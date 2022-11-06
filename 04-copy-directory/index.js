const fs = require("fs");
const path = require("path");
let currentPath = path.join(__dirname, "files");
let targetPath = path.join(__dirname, "files-copy");

function copyDir(){
  fs.rm(targetPath, {recursive: true}, () => {
    fs.mkdir(targetPath, {recursive: true}, (err) => {
      if (err) return;
    });
  
    fs.readdir(currentPath, { withFileTypes: true }, (err, items) => {
      if (err) return;
      items.forEach((item) => {
        if (item.isFile()){
          let currentFile = path.join(__dirname, "files", item.name);
          fs.writeFile(path.join(__dirname, "files-copy", item.name), "",  (err) => {
            if (err) throw err;
          });
          let targetFile = path.join(__dirname, "files-copy", item.name);
          fs.copyFile(currentFile, targetFile, (err) => {
            if (err) return;
          });
        }
      })
    })
  });

  
}

copyDir();