class DrawCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext('2d');
        this.shapes = [];
    }

    addShape = function(shape) {
        this.shapes.push(shape);
    }

    draw = function() {
        const ctx = this.ctx;
        const shapes = this.shapes;

        // Draw all shapes in the shapes array
        let l = shapes.length;
        for (let i = 0; i < l; i++) {
            shapes[i].draw(ctx);
        }
    }
}

class Shape {
    constructor(x, y, w, h, fill) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 10;
        this.h = h || 10;
        this.fill = fill || '#AAAAAA';
    }

    draw = function(ctx) { }
}

class RedRect extends Shape {
    constructor(x, y, w, h, fill) {
        super(x,y,w,h,fill);
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 10;
        this.h = h || 10;
        this.fill = fill || '#FF0000';
    }

    draw = function(ctx) {
        ctx.fillStyle = this.fill;
        ctx.fillRect( this.x, this.y, this.w, this.h);
    }
}

class Circle extends Shape {
    constructor(x, y, r, sa, ea) {
        super(x,y,10,10,'#FF0000');
        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 10;
        this.sa = sa || 0;
        this.ea = ea || 2*Math.PI;
    }

    draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, this.sa, this.ea);
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
    }
}

function btnRectClick()
{
    drawCanvas.addShape(new RedRect(100,10,50,50));
    drawCanvas.draw();
}

function btnCircClick()
{
    drawCanvas.addShape(new Circle(60,110,50,0,2*Math.PI));
    drawCanvas.draw();
}

function main() {
    let myCan = document.getElementById( 'myCanvas');
    drawCanvas = new DrawCanvas(myCan);

    // drawCanvas.addShape(new RedRect(100,10,50,50));
    // drawCanvas.addShape(new Circle(60,110,50,0,2*Math.PI));
    // drawCanvas.draw();
}

main();