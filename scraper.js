const request = require("request");
const cheerio = require("cheerio");
const fs = require('fs');

const rawdata = fs.readFileSync("alldinourl.json");

let parsed = JSON.parse(rawdata);

for(let i=0;i<parsed.length;i++){
     request(parsed[i].url,cb)
}

function cb(err,response,html){

    if(err){
        console.log(err);
    }else{
        extractHTML(html);
    }
}

function extractHTML(html){
    let $ = cheerio.load(html);
    let pronunciation = $(".dinosaur--name-description .dinosaur--pronunciation").text();
    let namemeaning = $(".dinosaur--name-description .dinosaur--meaning").text();
    let dinoimg = $(".dinosaur--image-container .dinosaur--image").attr("src");
    let dinocompareimg = "https://www.nhm.ac.uk/"+$(".dinosaur--comparison .dinosaur--comparison-dino img").attr("src");
    let humancompareimg = $(".dinosaur--comparison .dinosaur--comparison-human img").attr("src");
    let typeofdinosaur = $(".dinosaur--description.dinosaur--list dd a").text();
    let dinolength = $(".dinosaur--description.dinosaur--list").children("dd").last().text();
    let dinoinfoArr = $(".dinosaur--info-container .dinosaur--info.dinosaur--list dd a");
    let dinoinfoobj={};
    for(let i=0;i<dinoinfoArr.length;i++){
        if(i===1){
            dinoinfoobj.timealive = $(dinoinfoArr[i]).text();
            dinoinfoobj.timealive= dinoinfoobj.timealive+" "+$(dinoinfoArr[i])[0].nextSibling?.nodeValue;
        }else if(i===0){
            dinoinfoobj.diet = $(dinoinfoArr[i]).text();
        }else if(i===2){
            dinoinfoobj.foundin = $(dinoinfoArr[i]).text();
        }
    }
    let dinodesc=[]
    let dinodescrArr = $(".dinosaur--content-container p i");
    for(let i=0;i<dinodescrArr.length;i++){
        let str = $(dinodescrArr[i]).text()+" ";
        str+=$(dinodescrArr[i])[0].nextSibling?.nodeValue;
        dinodesc.push(str)
    }
    dinoinfoobj.dinodesc = [...dinodesc]
    let taxonomicdetArr = $(".dinosaur--taxonomy-container dl dd");
    for(let i=0;i<taxonomicdetArr.length;i++){
        if(i===0){
            dinoinfoobj.taxonomy = $(dinoinfoArr[i]).text();
        }else if(i===1){
            dinoinfoobj.namedBy = $(dinoinfoArr[i]).text();
        }else if(i===2){
            dinoinfoobj.typeSpecies = $(dinoinfoArr[i]).text();
        }
    }
    dinoinfoobj = {...dinoinfoobj,pronunciation,namemeaning,dinoimg,dinocompareimg,humancompareimg,typeofdinosaur,dinolength}
    const fileData = fs.readFileSync("finaldinores.json","utf8");
    const parsed = [...JSON.parse(fileData)];
    parsed.push(dinoinfoobj);
    fs.writeFileSync("finaldinores.json",JSON.stringify(parsed));
};
