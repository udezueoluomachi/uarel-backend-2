import {config} from "dotenv";
import fs from "fs";
import {exec} from "child_process";
import rimraf from "rimraf";
import {join} from "path";
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

const run = (cmd, callback) => {
    exec(cmd, (err, stdout, stderr) => {
        if(err) throw err;
        console.log("stdout : %s\nstderr : %s", stdout, stderr);
        callback();
    })
}

export const pushToGithub = (path,callback) => {
   let repoUrl = "https://github.com/udezueoluomachi/uarel"
   let cloneCmd = ` git clone ${repoUrl}.git`;
   let gitC = "git -C ./uarel";
   let setOrigin = ` ${gitC} remote set-url --push origin https://udezueoluomachi:${_env.GITHUB_P_ACCESS_TOKEN}@github.com/udezueoluomachi/uarel.git && ${gitC} config credential.https://github.com.username udezueoluomachi && ${gitC} config credential.helper store`;
   let pushCmd = ` ${gitC} add . && ${gitC} commit -m ": Api" && ${gitC} push origin main`;

   run(cloneCmd, () => {
    moveFile(path, () => {
        run(`${setOrigin} && ${pushCmd}`, () => {
            rimraf("./uarel",{})
            .then( err => {
                if(err) throw err;
                callback();
            })
        })
    })
   })
};