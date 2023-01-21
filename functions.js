import {config} from "dotenv";
import fs from "fs";
config();

const _env = process.env;
const chromePath = _env.CHROME_PATH;


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
const deleteFile = path => {
    fs.unlink("./public/" + path + ".html", (err) => {
        if(err) throw err
    })
}

const extractVerificationCode = str => {
    const pattern = /\d+/igm;
    return str.match(pattern)[0];
}


export const pushToGithub = async (path,callback) => {
    //commit : mesage => : Api
    //delit file and run call back after pushing to github
   // deleteFile(path);
   // callback();
}