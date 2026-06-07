import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";

let file = null;

const drop = document.getElementById("drop");
const status = document.getElementById("status");

drop.addEventListener("dragover", e=>{
    e.preventDefault();
});

drop.addEventListener("drop", e=>{
    e.preventDefault();

    file = e.dataTransfer.files[0];

    drop.innerHTML = file.name;
});

document
.getElementById("extract")
.onclick = async ()=>{

    if(!file){
        alert("Drop PDF first");
        return;
    }

    status.innerHTML = "Loading PDF...";

    try{

        const buffer =
        await file.arrayBuffer();

        const pdf =
        await pdfjsLib.getDocument({
            data:buffer
        }).promise;

        status.innerHTML =
        `Loaded ${pdf.numPages} pages`;

        let total = 0;

        for(let i=1;i<=pdf.numPages;i++){

            status.innerHTML =
            `Checking page ${i}/${pdf.numPages}`;

            const page =
            await pdf.getPage(i);

            const images =
            page.objs;

            total += Object.keys(images).length;
        }

        status.innerHTML =
        `Finished. PDF pages: ${pdf.numPages}`;

    }catch(err){

        console.error(err);

        status.innerHTML =
        "Error. Open console.";

    }

};
