const fs = require('fs').promises;
const path = require('path');

async function addRepo(filePath){
    const repoPath = path.resolve(process.cwd(),"VersionControl");
    const staggingPath = path.join(repoPath, "stagging");

    try{
        await fs.mkdir(staggingPath,{recursive:true});
        const fileName = path.basename(filePath);
        await fs.copyFile(filePath,path.join(staggingPath,fileName));
        console.log(`File ${fileName} added to stagging area!`);
    }catch(err){
        console.error("Error adding to repository",err);
    }
}

module.exports = {addRepo};