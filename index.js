const request = require("request");
const cheerio = require("cheerio");
const fs = require('fs');


const url ="https://www.nhm.ac.uk/discover/dino-directory/name/name-az-all.html";

request(url,cb);

function cb(err,response,html){
    if(err){
        console.log(err);
    }else{
        extractHTML(html);
    }
}

function extractHTML(html){
    let $ = cheerio.load(html);
    let gotoArray = [];
    let anchorArr = $(".dinosaurfilter--all-list a");
    let dinoNameArr = $(".dinosaurfilter--all-list a .dinosaurfilter--name")

    for(let i=0;i<anchorArr.length;i++){
        let obj = {};
        obj.url = "https://www.nhm.ac.uk/"+$(anchorArr[i]).attr("href");
        obj.name = $(dinoNameArr[i]).text().trim();
        gotoArray.push(obj);
    }
  
    fs.writeFileSync("alldinourl.json",JSON.stringify(gotoArray))
}