const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
//canvas
const { createCanvas, loadImage } = require('canvas');

let OW = 400;//outer width
let ML = 0;//margin left
let IW = 400;//inner width
let LH = 19;//line height
let MT = -2;//margin top
let MB = -2;
let FONT = "14px Whitney";
let MAX_LINES = 10;

let Xcanvas = createCanvas(OW,200);
let Xctx = Xcanvas.getContext("2d");
Xctx.font = FONT;
let getLines = function(str,w){
    let result = [];
    let breakPoint = 0;
    for(let i = 0; i < str.length; i++){
        if(str[i] === "\n"){
            result.push(str.slice(breakPoint,i));
            breakPoint = i+1;
        }
        let substr = str.slice(breakPoint,i+1);
        if(Xctx.measureText(substr).width > w){
            result.push(str.slice(breakPoint,i));
            breakPoint = i;
        }
    }
    result.push(str.slice(breakPoint,str.length));
    return result;
};



//example 1 discord bot usign encoded url

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

let insults = [
    "wtf",
    "wow buddy, that's too offensive",
    "shut up and pack your belongings, no one wants you here"
];

let generateImage = function(lines){
    let width = OW;
    let height = lines.length*LH+MT+MB;
    let canvas = createCanvas(width,height);
    let ctx = canvas.getContext("2d");
    ctx.font = FONT;
    ctx.textBaseline = "hanging";
    ctx.fillStyle = "#36393f";
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle = "#dcddde";
    for(let i = 0; i < lines.length; i++){
        let line = lines[i];
        ctx.fillText(line, ML, i*LH+MT);
    }
    //returns a buffer
    return canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
};

let generateImages = function(str){
    let lines = getLines(str,IW);
    let images = [];
    for(let i = 0; i < lines.length; i+= MAX_LINES){
        let sublines = lines.slice(i,i+MAX_LINES);
        console.log(sublines);
        images.push(generateImage(sublines));
    }
    console.log(images);
    return images;
};

client.on("message", msg => {
    let str = msg.content;
    if (str.slice(0,2) === "//") {
        str = str.slice(2);
        if(Math.random()>0.8 && process.env.INSULT.toLowerCase === "true"){
            msg.reply(insults[Math.floor(Math.random()*insults.length)]);
            return false;
        }
        console.log(`author: ${msg.author.username}\n`+
                    `channel: ${msg.channel.name}\n`+
                    `guild: ${msg.channel.guild.name}\n`+
                    `time: ${new Date()}\n`+
                    `contents: ${str}`);
        console.log("");
        //drawing the message content to canvas
        let imageBuffers = generateImages(str);
        //new Discord.Message(client, {files: [canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })]}, msg.channel);
        //msg.reply("",{files: [canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })]});
        msg.channel.send(msg.author.username+" said:");
        for(let i = 0; i < imageBuffers.length; i++){
            let buff = imageBuffers[i];
            console.log("sending the image #"+(i+1));
            msg.channel.send("",{files: [buff]});
        }
        //msg.channel.send(msg.author.username+" said:",{files: imageBuffers});
        /*
        .Attachments.Add(new Attachment(){
            ContentUrl = canvas.toDataURL();
        });
        */
        //msg.delete();
    }
});

client.login(process.env.TOKEN);




//other example
/*

const out = fs.createWriteStream(__dirname + '/test.png')
const stream = canvas.createPNGStream()
stream.pipe(out)
out.on('finish', () =>  console.log('The PNG file was created.'))
*/
