var r = 5;
var maxWidth = document.documentElement.clientWidth;
var maxHeight = document.documentElement.clientHeight;
var noOfBalls = 24;

function place_circles() {
    var xmlns = "http://www.w3.org/2000/svg";
    var svgElems = document.createElementNS(xmlns, "svg");
    svgElems.setAttributeNS(null, "id", "svgElements");
    svgElems.setAttributeNS(null, "width", maxWidth);
    svgElems.setAttributeNS(null, "height", maxHeight);
    svgElems.style.display = "block";
    
    
    //add many balls
    var oneSvgElement;
    for (var i = 0; i < noOfBalls;i++){
        
        oneSvgElement = document.createElementNS(xmlns, "circle");
        oneSvgElement.setAttributeNS(null, "id", "circle_" + i);
        oneSvgElement.setAttributeNS(null, "cx", r);
        oneSvgElement.setAttributeNS(null, "cy", r);
        oneSvgElement.setAttributeNS(null, "r", r);
        oneSvgElement.setAttributeNS(null, "stroke", "#ffa479");
        oneSvgElement.setAttributeNS(null, "stroke-width", "1");
        oneSvgElement.setAttributeNS(null, "fill", "#ffa479");
        svgElems.appendChild(oneSvgElement);
    }

    //draw lines for all
    for(var i = 0; i < noOfBalls; i++){
        for(var j = (i + 1); j < (noOfBalls - 1); j++){
            oneSvgElement = document.createElementNS(xmlns, "line");
            oneSvgElement.setAttributeNS(null, "id", "line_" + i + "_" + j );
            oneSvgElement.setAttributeNS(null, "x1", r);
            oneSvgElement.setAttributeNS(null, "y1", r);
            oneSvgElement.setAttributeNS(null, "x2", r);
            oneSvgElement.setAttributeNS(null, "y2", r);
            oneSvgElement.setAttributeNS(null, "stroke", "aqua");
            oneSvgElement.setAttributeNS(null, "stroke-width", "1");
            oneSvgElement.setAttributeNS(null, "fill", "#aqua");
            svgElems.appendChild(oneSvgElement);
        }
    }
    var svgContainer = document.getElementById("svgContainer");
    svgContainer.appendChild(svgElems);
    
}
function recalc_bounds() {
    maxWidth = document.documentElement.clientWidth;
    maxHeight = document.documentElement.clientHeight;
    var svgElem = document.getElementById("svgElements");
    svgElem.setAttributeNS(null, "width", maxWidth);
    svgElem.setAttributeNS(null, "height", maxHeight);
}
function reflect_circle() {
    
}

//EVERYTHING ABOVE HERE WORKING PERFECTLY
function animate_circle() {
    place_circles() ;
    var secondCircle;
    var currentLine;
    
    var circles = new Object();
//    var lines = new Object();
    var cxRand;
    var cyRand;
    var speed;
    for(var i = 0; i<noOfBalls;i++){
        cxRand = (Math.random()*1920);
        cyRand = (Math.random()*1080);
        circles["circle_"+i]={"isMovingDown":true,
                              "isMovingRight":true,
                              "elem":document.getElementById("circle_"+i),
                              "cx":cxRand,
                              "cy":cyRand
                        
                             };
    }
    
//    
//    for(var i = 0; i < noOfBalls; i++){
//        for(var j = (i + 1); j < (noOfBalls - 1); j++){
//            lines["line_"+i+"_"+j]={"elem":document.getElementById("line_"+i+"_"+j)
//                            
//                                   }
//        }
//    }

    var id = setInterval(frame, 30);
    function frame() {
        
            recalc_bounds();
        //elem1 x cooordinates animate
        
        for(var i = 0; i<noOfBalls;i++){
            speed = 1;//(Math.random()*15)-3;
            var currentCircle = circles["circle_"+i];
            if(currentCircle.isMovingRight){
                
                currentCircle.cx += speed;
                if(currentCircle.cx>(maxWidth-r)){currentCircle.isMovingRight = false;}
            }else if(!currentCircle.isMovingRight){
                currentCircle.cx -= speed;
                if(currentCircle.cx<r){currentCircle.isMovingRight = true;}

            }
            
            if(currentCircle.isMovingDown){
                
                currentCircle.cy += speed;
                if(currentCircle.cy>(maxHeight-r)){currentCircle.isMovingDown = false;}
            }else if(!currentCircle.isMovingDown){
                currentCircle.cy -= speed;
                if(currentCircle.cy<r){currentCircle.isMovingDown = true;}

            }
            
            for(var j = (i + 1); j < (noOfBalls - 1); j++){
                secondCircle = circles["circle_"+j];
                currentLine = document.getElementById("line_"+i+"_"+j);
                setLineAttributes(currentLine,currentCircle.cx,secondCircle.cx,currentCircle.cy,secondCircle.cy);
            }
            var currentCircleElem = circles["circle_"+i].elem;
            setCircleAttributes(currentCircleElem,currentCircle.cx,currentCircle.cy);
            
        }
        
    }
    
}
    
    function setLineAttributes(lineElement,x1,x2,y1,y2){
        if((Math.abs(x1-x2)>(maxHeight/5))||(Math.abs(y1-y2)>(maxWidth/5))){
            //x1 = x2 = y1 = y2 = -500;
            lineElement.style.opacity = "0";
        }
        else{
            lineElement.style.opacity = "1";
        }
        
        lineElement.setAttributeNS(null, "x1", x1);
        lineElement.setAttributeNS(null, "x2", x2);
        lineElement.setAttributeNS(null, "y1", y1);
        lineElement.setAttributeNS(null, "y2", y2);
        
            
    }

    function setCircleAttributes(circleElement,cx,cy){
        circleElement.setAttributeNS(null, "cx", cx);
        circleElement.setAttributeNS(null, "cy", cy);
    }

window.onload = animate_circle;

if (window.attachEvent) {
    window.attachEvent('onresize', function () {
        recalc_bounds();
        });
}else if(window.addEventListener){
            window.addEventListener('resize', function(){
//                alert('add event listener - resize');
            recalc_bounds();
        }, true);
        }