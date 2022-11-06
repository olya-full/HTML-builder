const fs = require("fs");
const path = require("path");
const { stdout } = process;

fs.readdir(path.join(__dirname, "secret-folder"), { withFileTypes: true }, (err, files) => {
  if (err){
    return;
  } else {

    files.forEach((file) => {
      if (file.isFile()) {
        let currentPath = path.join(__dirname, "secret-folder", file.name);
        fs.stat(currentPath, (err, stats) => {
          if (err){
            return;
          } else {
            let info = [];
            info.push(path.basename(file.name).split(".")[0]);
            info.push(path.extname(file.name).slice(1));
            info.push(Math.ceil(stats.size/1024) + "kb");
            stdout.write(info.join(" - "));
            stdout.write("\n");
          }
        });
      }
    });
  }
})