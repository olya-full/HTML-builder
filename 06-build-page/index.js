const fs = require("fs");
const path = require("path");

let currentAssetsPath = path.join(__dirname, "assets");
let currentComponentsPath = path.join(__dirname, "components");
let currentStylesPath = path.join(__dirname, "styles");
let targetFolderPath = path.join(__dirname, "project-dist");
let targetAssetsPath = path.join(__dirname, "project-dist", "assets");

function createPage(){
  fs.rm(targetFolderPath, {recursive: true}, () => {
    fs.mkdir(targetFolderPath, {recursive: true}, (err) => {
      if (err) return;
    });

    createHtml();
    assembleCssBundle();
    copyDirectory();
  });
}

function createHtml(){
  fs.writeFile(path.join(targetFolderPath, "index.html"), "", (err) => {
    if (err) throw err;
  });

  let templatePath = path.join(__dirname, "template.html");
  let htmlPath = path.join(targetFolderPath, "index.html");
  let readStream = fs.createReadStream(templatePath, "utf-8");
  let writeStream = fs.createWriteStream(htmlPath);

  let content = "";
  readStream.on("data", (content) => {
    // reading the contents of "components" folder
    fs.readdir(currentComponentsPath, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      let counter = 0;
      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name)==".html"){
          let fileReadStream = fs.createReadStream(path.join(currentComponentsPath, file.name), "utf-8");
          fileReadStream.on("data", (chunk) => {
            content = content.replace(`{{${path.basename(file.name).split(".")[0]}}}`, chunk);
            counter++;
            if (counter == files.length){
              writeStream.write(content);
            }
          });
        }
      });
    });
  });  
}

function assembleCssBundle(){
  fs.rm(path.join(targetFolderPath, "style.css"), {recursive: true}, () => {
    fs.writeFile(path.join(targetFolderPath, "style.css"), "",  (err) => {
      if (err) throw err;
    });
    fs.readdir(currentStylesPath, {withFileTypes: true}, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        if (file.isFile() && path.extname(file.name)==".css"){
          let currentStyleStream = fs.createReadStream(path.join(currentStylesPath, file.name), "utf-8");
          let data = "";
          currentStyleStream.on("data", (chunk) => {data += chunk});
          currentStyleStream.on("end", () => {
            fs.appendFile(path.join(targetFolderPath, "style.css"), data, (err) => {
              if (err) throw err;
            })
          });
        }
      })
    })
  })
}

function copyDirectory(){
  fs.rm(targetAssetsPath, {recursive: true}, () => {
    fs.mkdir(targetAssetsPath, {recursive: true}, (err) => {
      if (err) return;
    });
  
    fs.readdir(currentAssetsPath, { withFileTypes: true }, (err, items) => {
      if (err) return;
      items.forEach((item) => {
        if (item.isDirectory()){
          let currentDirectory = path.join(currentAssetsPath, item.name);
          let targetDirectory = path.join(targetAssetsPath, item.name);
          fs.rm(targetDirectory, {recursive: true}, () => {
            fs.mkdir(targetDirectory, {recursive: true}, (err) => {
              if (err) return;
            });

            fs.readdir(currentDirectory, { withFileTypes: true }, (err, files) => {
              if (err) return;
              files.forEach((file) => {
                if (file.isFile()){
                  let currentFile = path.join(currentDirectory, file.name);
                  fs.writeFile(path.join(targetDirectory, file.name), "",  (err) => {
                    if (err) throw err;
                  });
                  let targetFile = path.join(targetDirectory, file.name);
                  fs.copyFile(currentFile, targetFile, (err) => {
                    if (err) return;
                  });
                }
              })
            })
          });
        }
      })
    })
  });  
}

createPage();