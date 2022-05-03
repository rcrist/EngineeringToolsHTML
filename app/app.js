// Global variables
let myState;

class DrawCanvas {
    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext('2d');
        this.shapes = [];

        this.rect = canvas.getBoundingClientRect();
        //console.log("Canvas.pos: " + this.rect.x + "," + this.rect.y);

        this.shapes = [];   // the collection of shapes to be drawn
        this.dragging = false; // Keep track of when we are dragging

        // the current selected object.
        this.selection = null;

        // Line drawing flag
        this.lineDrawing = false;

        // Keep track of where in the object we clicked
        this.dragoffx = 0;
        this.dragoffy = 0;

        myState = this;

        canvas.addEventListener('mousedown', function(e) {
            myState.mouseDown(e);
        }, true);
        canvas.addEventListener('mousemove', function(e) {
            myState.mouseMove(e);
        }, true);
        canvas.addEventListener('mouseup', function(e) {
            myState.mouseUp(e);
        }, true);

        this.drawGrid(this.ctx);

        this.selectionColor = '#CC0000';
        this.selectionWidth = 2;

        // Line drawing attributes
        this.NewLine = null;
        this.NewPt1 = {x: 0, y: 0};
        this.NewPt2 = {x: 0, y: 0};
    }

    addShape = function(shape) {
        this.shapes.push(shape);
    }

    clear = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGrid(this.ctx);
    }

    // Draw the list of shapes on the canvas
    draw = function() {
        let ctx = this.ctx;
        let shapes = this.shapes;

        // draw all shapes
        let l = shapes.length;
        for (let i = 0; i < l; i++) {
            shapes[i].draw(ctx);
        }

        // draw selection ring
        // right now this is just a stroke along the edge of the selected Shape
        if (this.selection != null) {
            ctx.strokeStyle = this.selectionColor;
            ctx.lineWidth = this.selectionWidth;
            var mySel = this.selection;
            ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
        }
    }

    mouseDown = function(e) {
        let pos = this.getPos(e);
        let obj = {x: pos.x, y: pos.y};
        this.SnapToGrid(obj);
        let mx = obj.x;
        let my = obj.y;

        if (!this.lineDrawing) {
            let shapes = this.shapes;
            let l = shapes.length;
            for (let i = l - 1; i >= 0; i--) {
                if (shapes[i].contains(mx, my)) {
                    let mySel = shapes[i];

                    // Capture shape for mouseMove operation
                    this.dragoffx = mx - mySel.x;
                    this.dragoffy = my - mySel.y;
                    this.dragging = true;
                    this.selection = mySel;
                    this.clear();
                    this.draw();
                    return;
                }
            }
        }
        if (this.lineDrawing)
        {
            this.NewPt1 = {x: mx, y: my};
            this.NewPt2 = {x: mx+50, y: my};
            this.NewLine = new Line(this.NewPt1, this.NewPt2);
            this.dragging = true;
            drawCanvas.addShape(this.NewLine);
        }

        // Unselect any selected object
        if (this.selection) {
            this.selection = null;
            this.clear();
            this.draw();
        }
    }

    mouseMove = function(e) {
        if (this.dragging) {
            let mouse = this.getPos(e);
            let x = mouse.x;
            let y = mouse.y;
            let obj = {x: x, y: y};
            this.SnapToGrid(obj);
            mouse.x = obj.x;
            mouse.y = obj.y;

            if (!this.lineDrawing) {
                // Drag using the mouse position on the shape
                this.selection.x = mouse.x - this.dragoffx;
                this.selection.y = mouse.y - this.dragoffy;

                // Clear the canvas and redraw the shape in the drag position
                this.clear();
                this.draw();
            }
            if (this.lineDrawing)
            {
                if (this.NewLine == null) return;
                this.NewLine.Pt2 = {x: mouse.x, y: mouse.y};
                this.clear();
                this.draw();
            }
        }
    }

    mouseUp = function(e) {
        this.dragging = false;
        this.lineDrawing = false;
    }

    // Convert the mouse position from document coordinates to canvas coordinates
    getPos = function(e) {
        let offsetX = 0, offsetY = 0, mx, my;

        mx = e.pageX - this.rect.x;
        my = e.pageY - this.rect.y;

        // We return a JavaScript object with x and y defined
        return {x: mx, y: my};
    }

    drawGrid = function(ctx) {
        for (let x = 0; x < 1000; x += 10)
        {
            for (let y = 0; y < 1000; y += 10)
            {
                ctx.fillStyle = '#FFFFFF'
                ctx.fillRect(x,y,1,1);
            }
        }
        this.draw();
    }

   SnapToGrid = function(obj)
   {
       let grid_gap = 10;
       obj.x = grid_gap * Math.round(obj.x / grid_gap);
       obj.y = grid_gap * Math.round(obj.y / grid_gap);
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

    contains = function(mx, my) {
        // Hit test to verify that the mouse position is within the shape "bounding box"
        // defined by a rectangle (x, y, w, h)
        return  (this.x <= mx) && (this.x + this.w >= mx) &&
                (this.y <= my) && (this.y + this.h >= my);
    }
}

class RedRect extends Shape {
    constructor(x, y, w, h, fill) { // 100, 10, 50, 50
        super(x,y,w,h,fill);
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 10;
        this.h = h || 10;
        this.fill = fill || '#0000FF';
    }

    draw = function(ctx) {
        ctx.fillStyle = this.fill;
        ctx.fillRect( this.x, this.y, this.w, this.h);
    }
}

class Circle extends Shape {
    constructor(x, y, r, sa, ea) {
        super(x,y,r*2,r*2,'#FF0000');
        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 10;
        this.sa = sa || 0;
        this.ea = ea || 2*Math.PI;
    }

    draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x+this.r, this.y+this.r, this.r, this.sa, this.ea);
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
    }
}

class Triangle extends Shape {
    constructor(x, y) {
        super(x,y,50,50,'#FF0000');
        this.x = x || 0;
        this.y = y || 0;
        this.w = 50;
        this.h = 50;
    }

    draw = function(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x,this.y+this.h);
        ctx.lineTo(this.x + 25, this.y);
        ctx.lineTo(this.x + this.w, this.y+this.h);
        ctx.lineTo(this.x,this.y+this.h);
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.closePath();
    }
}

class Line extends Shape {
    constructor(Pt1, Pt2) {
        super(Pt1.x, Pt1.y,0,10,'#ffffff');
        this.Pt1 = Pt1;
        this.Pt2 = Pt2;
        this.fill = '#ffffff';
    }

    draw = function(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.Pt1.x, this.Pt1.y);
        ctx.lineTo(this.Pt2.x, this.Pt2.y);
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.closePath();
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

function btnTriClick()
{
    drawCanvas.addShape(new Triangle(200,200));
    drawCanvas.draw();
}

function btnLineModeClick()
{
    // drawCanvas.addShape(new Line({x: 30, y:30},{x: 100, y:100}));
    // drawCanvas.draw();
    myState.lineDrawing = !myState.lineDrawing;
}

function main() {
    let myCan = document.getElementById( 'myCanvas');
    drawCanvas = new DrawCanvas(myCan);
}

main();