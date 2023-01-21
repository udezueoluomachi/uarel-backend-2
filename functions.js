import {config} from "dotenv";
import fs from "fs";
import {exec} from "child_process";
config();

const _env = process.env;

const randomString = () => {
    const str = "qwertyuiopasdfghjklzxcvbnm";
    let newStr = "";
    for(let i = 0; i < 7; i++) {
        newStr += str[Math.floor(Math.random() * 7)]
    }
    return newStr;
}

export const writeFile = (url, callback) => {
    let _path = randomString();
    fs.writeFile("./public/" + _path + ".html", 
    `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="0; url=${url}">
        <title>Redirecting to ${url}</title>
    </head>
    <body>
        <p>Redirecting to ${url}</p>
    </body>
    </html>
    `, (err) => {
        if(err) throw err;
        callback(_path)
    })
}

const moveFile = (path, callback) => {
    fs.rename("./public/" + path + ".html", "./uarel/s/" + path + ".html", (err) => {
        if(err) throw err;
        callback();
    })
}

export const pushToGithub = (path,callback) => {
    //commit : mesage => : Api
    //delit file and run call back after pushing to github
   // deleteFile(path);
   // callback();
   let repoUrl = "https://github.com/udezueoluomachi/uarel"
   let cloneCmd = ` git clone ${repoUrl}`;
   let navToClone = " cd uarel";
   let pushCmd = ` git add . & git commit -m ": Api" & git push origin main`;

   exec(cloneCmd, (err, stdout, stderr) => {
        if(err) throw err;
        console.log(stdout);
        moveFile(path, () => {
            exec(navToClone, (err, stdout, stderr) => {
                if(err) throw err;
                console.log(stdout);
            })
        })
   })
}