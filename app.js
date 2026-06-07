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

alert(
"Choose PDF first"
);

return;

}

results.innerHTML = "";

status.innerHTML =
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

let count = 0;

for(
let p=1;
p<=pdf.numPages;
p++
){

status.innerHTML =
`Checking page ${p}/${pdf.numPages}`;

const page =
await pdf.getPage(p);

const opList =
await page.getOperatorList();

for(
let i=0;
i<opList.fnArray.length;
i++
){

if(
opList.fnArray[i] === 85
){

count++;

const div =
document.createElement("div");

div.className =
"card";

div.innerHTML =
`
<h3>
Image ${count}
</h3>
<p>
Embedded image found
</p>
`;

results.appendChild(div);

}

}

}

status.innerHTML =
`Done. Found ${count} embedded images.`;

}
catch(err){

console.error(err);

status.innerHTML =
"Error. Open console.";

}

}
);
