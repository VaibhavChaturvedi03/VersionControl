const fs = require("fs").promises;
const path = require("path");
const {v4:uuidv4} = require("uuid");

async function commitRepo(message){
    const repoPath = path.resolve(process.cwd(), "VersionControl");
    const stagedPath = path.join(repoPath,"stagging");
    const commitPath = path.join(repoPath,"commits");
    try{
        const commitID = uuidv4();
        const commitDir = path.join(commitPath, commitID);
        await fs.mkdir(commitDir,{recursive:true});

        const files = await fs.readdir(stagedPath);
        for(const file of files){
            await fs.copyFile(path.join(stagedPath,file), path.join(commitDir,file));
        }

        await fs.writeFile(path.join(commitDir,"commit.json)"),JSON.stringify({message,date:new Date().toISOString()}));
        console.log(`Committed with ID: ${commitID} created with message: ${message}`);
    }catch(err){
        console.error("Error during commit:", err);
    }
}

module.exports = { commitRepo };