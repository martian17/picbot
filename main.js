const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
//canvas
const { createCanvas, loadImage } = require('canvas');

let OW = 700;//outer width
let ML = 10;//margin left
let IW = 600;//inner width
let LH = 30;//line height
let MT = 5;//margin top
let MB = 5;
let FONT = "30px Impact";

let Xcanvas = createCanvas(OW,200);
let Xctx = canvas.getContext("2d");
Xctx.font = FONT;
let getLines = function(str,w){
    let result = [];
    let breakPoint = 0;
    for(let i = 0; i < str.length; i++){
        if(str[i] === "\n"){
            result.push(str.slice(breakPoint,i-1));
            breakPoint = i+1;
        }
        let substr = str.slice(breakPoint,i+1);
        if(Xctx.measureText(substr).width > w){
            result.push(str.slice(breakPoint,i));
            breakPoint = i+1;
        }
    }
    return result;
};


//example 1 discord bot usign encoded url

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    let str = msg.content;
    if (str.slice(0,2) === "//") {
        str = str.slice(2);
        //drawing the message content to canvas
        let lines = getLines(str,IW);
        let width = OW;
        let height = lines.length*LH+MT+MB;
        let canvas = createCanvas(width,height);
        let ctx = canvas.getContext("2d");
        ctx.font = FONT;
        ctx.fillStyle = "#36393f";
        ctx.fillRect(0,0,OW,200);
        ctx.fillStyle = "#dcddde";
        for(let i = 0; i < lines.length; i++){
            let line = lines[i];
            canvas.fillText(line, LM, i*LH+MT);
        }
        msg.reply(canvas.toDataURL());
    }
});

client.login(process.env.token);






const out = fs.createWriteStream(__dirname + '/test.png')
const stream = canvas.createPNGStream()
stream.pipe(out)
out.on('finish', () =>  console.log('The PNG file was created.'))
