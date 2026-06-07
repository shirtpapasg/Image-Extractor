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

alert("Choose PDF");

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

const visited=
new Uint8Array(
canvas.width*
canvas.height
);

let imgNum=1;

function bright(i){

return (
d[i]+
d[i+1]+
d[i+2]
)/3;

}

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

const idx=
y*canvas.width+x;

if(
visited[idx]
) continue;

visited[idx]=1;

const pixel=
idx*4;

if(
bright(pixel)>230
) continue;

let q=[[x,y]];

let minX=x;
let maxX=x;

let minY=y;
let maxY=y;

let count=0;

while(q.length){

const [cx,cy]=q.pop();

count++;

const neigh=[

[cx+1,cy],
[cx-1,cy],
[cx,cy+1],
[cx,cy-1]

];

for(
const [nx,ny]
of neigh
){

if(
nx<0||
ny<0||
nx>=canvas.width||
ny>=canvas.height
) continue;

const ni=
ny*canvas.width+nx;

if(
visited[ni]
) continue;

visited[ni]=1;

const p4=
ni*4;

if(
bright(p4)>230
) continue;

if(nx<minX)minX=nx;
if(nx>maxX)maxX=nx;

if(ny<minY)minY=ny;
if(ny>maxY)maxY=ny;

q.push([nx,ny]);

}

}

const w=maxX-minX;
const h=maxY-minY;

if(

w<120 ||
h<120 ||

w/h>8 ||

count<5000

){

continue;

}

const crop=
document.createElement(
"canvas"
);

crop.width=w;

crop.height=h;

crop
.getContext("2d")
.drawImage(

canvas,

minX,
minY,

w,
h,

0,
0,

w,
h

);

const card=
document.createElement(
"div"
);

card.className=
"card";

const image=
document.createElement(
"img"
);

image.src=
crop.toDataURL(
"image/png"
);

image.style.maxWidth=
"220px";

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

card.innerHTML=
`<h3>Page${p}Img${imgNum}</h3>`;

card.appendChild(image);

card.appendChild(
document.createElement("br")
);

card.appendChild(link);

results.appendChild(
card
);

imgNum++;

}

}

}

status.innerHTML=
"Done";

};
