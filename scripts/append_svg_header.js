const fs = require('fs');
const mainFolder = './28/';

let files = fs.readdirSync(mainFolder);

// let fileContent = fs.readFileSync(mainFolder + "/accessibility_outline_28.svg", "utf8");
// for( let file of files ) {
//     console.log(file)
//     let fileContent = fs.readFileSync(mainFolder + file, "utf8");
//     if (fileContent.match(/<\?xml version="1.0" encoding="UTF-8"\?>/)) continue;
//     fs.writeFileSync(mainFolder + file, `<?xml version="1.0" encoding="UTF-8"?>` + fileContent)
// }
for( let file of files ) {
    console.log(file)
    let fileContent = fs.readFileSync(mainFolder + file, "utf8");
    if (fileContent.match(/modified_outline/)) continue;
    // fileContent = fileContent.replace(/modified_outline/, 'outline')

    fileContent = fileContent.replaceAll(/outline/g, 'modified_outline')
    fs.writeFileSync(mainFolder + file, fileContent)
}

// console.log(fileContent);


// // append_svg_header.js
// fs.writeFileSync("test.svg", `<?xml version="1.0" encoding="UTF-8"?>` + fileContent)