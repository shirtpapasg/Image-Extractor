import * as pdfjsLib from
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

let file=null;

const drop=document.getElementById("drop");
const input=document.getElementById("pdfInput");
const status=document.getElementById("status");
const results=document.getElementById("results");

drop.onclick=()=>input.click();

input.onchange=(e)=>{

file=e.target.files[0];

if(file){

drop.innerHTML=file.name;

}

};

document
.getElementById("extract")
.onclick=async()=>{

if(!file){

alert("Choose PDF first");

return;

}

results.innerHTML="";

const buffer=
await file.arrayBuffer();

const pdf=
await pdfjsLib
.getDocument({
data:buffer
})
.promise;

let imgCount=0;

for(let p=1;p<=pdf.numPages;p++){

status.innerHTML=
`Scanning page ${p}/${pdf.numPages}`;

const page=
await pdf.getPage(p);

const viewport=
page.getViewport({
scale:2
});

const canvas=
document.createElement("canvas");

canvas.width=
viewport.width;

canvas.height=
viewport.height;

const ctx=
canvas.getContext("2d");

await page.render({
canvasContext:ctx,
viewport:viewport
}).promise;

const imgData=
ctx.getImageData(
0,
0,
canvas.width,
canvas.height
);

const data=
imgData.data;

let minX=canvas.width;
let minY=canvas.height;
let maxX=0;
let maxY=0;

for(
let y=0;
y<canvas.height;
y++
){

for(
let x=0;
x<canvas.width;
x++
){

const i=
(y*canvas.width+x)*4;

const brightness=
(
data[i]+
data[i+1]+
data[i+2]
)/3;

if(brightness<240){

if(x<minX)minX=x;
if(y<minY)minY=y;

if(x>maxX)maxX=x;
if(y>maxY)maxY=y;

}

}

}

const width=
maxX-minX;

const height=
maxY-minY;

if(
width>100 &&
height>100
){

const crop=
document.createElement(
"canvas"
);

crop.width=width;
crop.height=height;

crop
.getContext("2d")
.drawImage(
canvas,
minX,
minY,
width,
height,
0,
0,
width,
height
);

imgCount++;

const div=
document.createElement(
"div"
);

div.className="card";

const img=
document.createElement(
"img"
);

img.src=
crop.toDataURL(
"image/png"
);

img.style.maxWidth=
"220px";

div.innerHTML=
`<h3>Image ${imgCount}</h3>`;

div.appendChild(img);

results.appendChild(div);

}

}

status.innerHTML=
`Done. Extracted ${imgCount} cropped images`;

};
