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

for(
let p=1;
p<=pdf.numPages;
p++
){

status.innerHTML=
`Scanning page ${p}/${pdf.numPages}`;

const page=
await pdf.getPage(p);

const viewport=
page.getViewport({
scale:2.2
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

const img=
ctx.getImageData(
0,
0,
canvas.width,
canvas.height
);

const d=img.data;

let rowDark=[];

for(
let y=0;
y<canvas.height;
y++
){

let dark=0;

for(
let x=0;
x<canvas.width;
x++
){

const i=
(y*canvas.width+x)*4;

const b=
(
d[i]+
d[i+1]+
d[i+2]
)/3;

if(
b<220
){

dark++;

}

}

rowDark.push(dark);

}

let regions=[];

let start=null;

for(
let y=0;
y<rowDark.length;
y++
){

if(
rowDark[y] > 120 &&
start===null
){

start=y;

}

if(
rowDark[y] <= 120 &&
start!==null
){

regions.push([
start,
y
]);

start=null;

}

}

let merged=[];

for(
const r of regions
){

if(
merged.length===0
){

merged.push(r);

continue;

}

const prev=
merged[
merged.length-1
];

if(

r[0]-prev[1]

< 220

){

prev[1]=r[1];

}else{

merged.push(r);

}

}

let imgNum=1;

for(
const region
of merged
){

let minY=
Math.max(
0,
region[0]-150
);

let maxY=
Math.min(
canvas.height,
region[1]+150
);

const h=
maxY-minY;

if(
h<250
) continue;

const crop=
document.createElement(
"canvas"
);

crop.width=
canvas.width;

crop.height=
h;

crop
.getContext("2d")
.drawImage(

canvas,

0,
minY,

canvas.width,
h,

0,
0,

canvas.width,
h

);

const image=
document.createElement(
"img"
);

image.src=
crop.toDataURL(
"image/png"
);

image.style.maxWidth=
"450px";

const link=
document.createElement(
"a"
);

link.href=
image.src;

link.download=
`Page${p}Img${imgNum}.png`;

link.innerText=
`Download Page${p}Img${imgNum}`;

const card=
document.createElement(
"div"
);

card.className=
"card";

card.innerHTML=
`<h3>Page${p}Img${imgNum}</h3>`;

card.appendChild(
image
);

card.appendChild(
document.createElement("br")
);

card.appendChild(
link
);

results.appendChild(
card
);

imgNum++;

}

}

status.innerHTML=
"Done";

};
