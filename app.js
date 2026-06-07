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
scale:2.5
});

const canvas=
document.createElement(
"canvas"
);

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

const d=
img.data;

const rowDark=
[];

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

const bright=
(
d[i]+
d[i+1]+
d[i+2]
)/3;

if(
bright<220
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
rowDark[y] > 50 &&
start===null
){

start=y;

}

if(
rowDark[y] <= 50 &&
start!==null
){

regions.push([
start,
y
]);

start=null;

}

}

let imgNum=1;

for(
const region
of regions
){

let minY=
region[0]-120;

let maxY=
region[1]+120;

minY=
Math.max(
0,
minY
);

maxY=
Math.min(
canvas.height,
maxY
);

const cropHeight=
maxY-minY;

if(
cropHeight<150
){

continue;

}

const crop=
document.createElement(
"canvas"
);

crop.width=
canvas.width;

crop.height=
cropHeight;

crop
.getContext("2d")
.drawImage(

canvas,

0,
minY,

canvas.width,
cropHeight,

0,
0,

canvas.width,
cropHeight

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
"400px";

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
document.createElement(
"br"
));

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
