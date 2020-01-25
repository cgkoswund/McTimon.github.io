
var maxWidth = document.documentElement.clientWidth;
var maxHeight = document.documentElement.clientHeight;
var xr = maxWidth*0.08;
var yr = xr*398/257;
var cx = 0;
var cy = 0;


//function place_circles() {
//    var xmlns = "http://www.w3.org/2000/svg";
//    var svgElem = document.createElementNS(xmlns, "svg");
//    svgElem.setAttributeNS(null, "id", "svgElement");
//    svgElem.setAttributeNS(null, "width", maxWidth);
//    svgElem.setAttributeNS(null, "height", maxHeight);
//    svgElem.style.display = "block";
//    
//    var circle = document.createElementNS(xmlns, "circle");
//    circle.setAttributeNS(null, "id", "circle");
//    circle.setAttributeNS(null, "cx", r);
//    circle.setAttributeNS(null, "cy", r);
//    circle.setAttributeNS(null, "r", r);
//    circle.setAttributeNS(null, "stroke", "#ffa479");
//    circle.setAttributeNS(null, "stroke-width", "1");
//    circle.setAttributeNS(null, "fill", "#ffa479");
//    svgElem.appendChild(circle);
//
//    var svgContainer = document.getElementById("svgContainer");
//    svgContainer.appendChild(svgElem);
//    
//}
function recalc_bounds() {
    maxWidth = document.documentElement.clientWidth;
    maxHeight = document.documentElement.clientHeight;
    xr = maxWidth*0.08;
    yr = xr*398/257;
}

function animate_circle() {
//    place_circles() ;
    
    var elem = document.getElementById("bob");
    var isMovingRight = true;
    var isMovingDown = true;

    var id = setInterval(frame, 7);
    function frame() {

        recalc_bounds();
        //x cooordinates animate
        if (isMovingRight){            
            cx += 1;
            elem.style.left = cx + "px";
            if(cx>(maxWidth-xr)){isMovingRight = false;}
            
        } else if(!isMovingRight){
            cx -= 1;
            elem.style.left = cx + "px";
            if(cx<0){
                isMovingRight = true;
                
            }
        }
        
//        //y coordinates animate
        if (isMovingDown) {
            cy += 1;
            elem.style.top = cy + "px";
            
            if(cy>(maxHeight-yr)){
                    isMovingDown = false;

                                }
            
        } else if(!isMovingDown){
            cy -= 1;
            elem.style.top = cy + "px";
            if(cy<0){
                isMovingDown = true;
            }
        }
        
        
    }
    
}

window.onload = animate_circle;

//if (window.attachEvent) {
//    window.attachEvent('onresize', function () {
//        recalc_bounds();
//        });
//}else if(window.addEventListener){
//            window.addEventListener('resize', function(){
////                alert('add event listener - resize');
//            recalc_bounds();
//        }, true);
//        }