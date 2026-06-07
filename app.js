import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";

let selectedFile = null;

const dropzone =
document.getElementById("dropzone");

const status =
document.getElementById("status");

dropzone.addEventListener(
"dragover",
e=>{
e.preventDefault();
});

dropzone.addEventListener(
"drop",
e=>{

e.preventDefault();

selectedFile =
e.dataTransfer.files[0];

dropzone.innerText =
selectedFile.name;

});

document
.getElementById("extractBtn")
.addEventListener(
"click",
async()=>{

if(!selectedFile){

alert("Choose PDF");

return;
}

status.innerText =
"Processing...";

const arrayBuffer =
await selectedFile.arrayBuffer();

const pdf =
await pdfjsLib.getDocument({
data:arrayBuffer
}).promise;

let extracted = 0;

for(
let p=1;
p<=pdf.numPages;
p++
){

const page =
await pdf.getPage(p);

const ops =
await page.getOperatorList();

for(
let i=0;
i<ops.fnArray.length;
i++
){

if(
ops.fnArray[i]===85
){

extracted++;

}
}

}

status.innerText =
`Found ${extracted} embedded images.

(Embedded-image detection only.)`;

});
