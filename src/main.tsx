import paper from 'paper';

import img from './image.png';
import imgGrey from './image_grey.png';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
paper.setup(canvas);
const tool = new paper.Tool();

const bg = new paper.Raster(imgGrey)
bg.onLoad = () => {
    bg.scaling = new paper.Point(0.5, 0.5);
    bg.position = new paper.Point(paper.view.viewSize.divide(2.0))
}

new paper.Layer();

const imgColor = new paper.Raster(img)
imgColor.onLoad = () => {
    imgColor.scaling = new paper.Point(0.5, 0.5);
    imgColor.position = new paper.Point(paper.view.viewSize.divide(2.0))
}

const path = new paper.Path();
path.applyMatrix = false;
path.scaling = new paper.Point(0.0001, 0.0001);
path.clipMask = true;

const start = new paper.Point(0, 0);
path.moveTo(start);
path.lineTo(start.add([ 300, -50 ]));
path.lineTo(start.add([ 200, 200 ]));
path.closePath();
path.smooth();

const pointer = new paper.Layer();
const innerPointer = new paper.Shape.Circle(new paper.Point(0, 0), 12);
innerPointer.fillColor = new paper.Color('white');

const outerPointer = new paper.Shape.Circle(new paper.Point(0, 0), 10);
outerPointer.fillColor = new paper.Color('#FF7D5B')

let lastMousePos : paper.Point | null = null;

tool.onMouseMove = function(event: paper.MouseEvent) {
    if (!lastMousePos) {
        path.position = event.point;
        path.visible = true;
    }

    lastMousePos = event.point;
}

paper.view.onFrame = ({ time, delta }) => {
    if (lastMousePos) {
        const scale = 1 + 0.05 * Math.sin(time * 1.5);
        path.scaling = new paper.Point(scale, scale);
        path.rotation = time * 10;

        const diff = lastMousePos.subtract(path.position)

        path.position = path.position.add(diff.multiply(delta * 12));

        pointer.position = lastMousePos;
    }
}
