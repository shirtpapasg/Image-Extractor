import * as pdfjsLib from
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

let file = null;

const drop =
document.getElementById("drop");

const input =
document.getElementById("pdfInput");

const status =
document.getElementById("status");

const results =
document.getElementById("results");

drop.addEventListener(
"click",
()=>{

input.click();

}
);

input.addEventListener(
"change",
e=>{

file =
e.target.files[0];

if(file){

drop.innerHTML =
file.name;

}

}
);

document
.getElementById("extract")
.addEventListener(
"click",
async()=>{

if(!file){

alert("Choose PDF first");

return;

}

results.innerHTML="";

status.innerHTML=
"Loading PDF...";

try{

const buffer =
await file.arrayBuffer();

const pdf =
await pdfjsLib
.getDocument({
data:buffer
})
.promise;

let count=0;

for(
let p=1;
p<=pdf.numPages;
p++
){

status.innerHTML =
`Rendering page ${p}/${pdf.numPages}`;

const page =
await pdf.getPage(p);

const viewport =
page.getViewport({
scale:2
});

const canvas =
document.createElement(
"canvas"
);

const ctx =
canvas.getContext("2d");

canvas.width =
viewport.width;

canvas.height =
viewport.height;

await page.render({
canvasContext:ctx,
viewport:viewport
}).promise;

count++;

const card =
document.createElement(
"div"
);

card.className =
"card";

const img =
document.createElement(
"img"
);

img.src =
canvas.toDataURL(
"image/png"
);

img.download =
`Image_${count}.png`;

const link =
document.createElement(
"a"
);

link.href =
img.src;

link.download =
`Image_${count}.png`;

link.innerText =
"Download PNG";

card.innerHTML =
`<h3>Page ${p}</h3>`;

card.appendChild(
img
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

}

status.innerHTML =
`Done. Generated ${count} images.`;

}
catch(err){

console.error(err);

status.innerHTML =
"Error. Open console.";

}

}
);
