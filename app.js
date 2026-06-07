const padding = 120;

minX =
Math.max(
0,
minX-padding
);

minY =
Math.max(
0,
minY-padding
);

maxX =
Math.min(
canvas.width,
maxX+padding
);

maxY =
Math.min(
canvas.height,
maxY+padding
);

const w=maxX-minX;
const h=maxY-minY;

if(

w<180 ||
h<180 ||

count<5000

){

continue;

}
