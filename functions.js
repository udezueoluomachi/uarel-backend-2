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
   let repoUrl = "https://github.com/udezueoluomachi/uarel"
   let cloneCmd = ` git clone ${repoUrl}.git`;
   let navToClone = " cd uarel";
   let setOrigin = ` git remote add base ${repoUrl}.git && git remote set-url --push base https://udezueoluomachi:${_env.GITHUB_P_ACCESS_TOKEN}@github.com/udezueoluomachi/uarel.git `;
   let pushCmd = ` dir && git add . && git commit -m ": Api" && git push base main`;

   exec(cloneCmd, (err, stdout, stderr) => {
        if(err) throw err;
        console.log(stdout);
        console.log(stderr);
        moveFile(path, () => {
            exec(navToClone, (err, stdout, stderr) => {
                if(err) throw err;
                console.log(stdout);
                console.log(stderr);
                exec(setOrigin, (err, stdout, stderr) => {
                    if(err) throw err;
                    console.log(stdout);
                    console.log(stderr);
                    exec(pushCmd, (err, stdout, stderr) => {
                        if(err) throw err;
                        console.log(stdout);
                        console.log(stderr);
                        exec(" cd ..", (err, stdout, stderr) => {
                            if(err) throw err;
                            console.log(stdout);
                            console.log(stderr);
                            fs.rmdir("./uarel", (err) => {
                                if(err) throw err;
                                callback();
                            })
                        })
                    })
                })
            })
        })
   })
}