/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _script__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./script */ \"./src/script.js\");\n\n(0,_script__WEBPACK_IMPORTED_MODULE_0__.MakeSpinningVinyl)();\n\n//# sourceURL=webpack://bt-music-player/./src/index.js?");

/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MakeSpinningVinyl\": () => (/* binding */ MakeSpinningVinyl)\n/* harmony export */ });\n// console.log(\"hiya sport\");\nvar MakeSpinningVinyl = function MakeSpinningVinyl() {\n  var canvas = document.querySelector(\"canvas\");\n  canvas.width = window.innerWidth;\n  canvas.height = window.innerHeight;\n  var context = canvas.getContext(\"2d\");\n  function drawVinyl(rotationInDegrees) {\n    var radius = 200;\n    var centerX = canvas.width / 2;\n    var centerY = canvas.height / 2;\n    var whiteCircleRadius = radius / 2.5;\n    var blackSmallCircleRadius = whiteCircleRadius / 30;\n    var arcSpace = radius - whiteCircleRadius;\n    var arcNumber = 30;\n    context.save();\n    context.translate(centerX, centerY);\n    context.rotate(rotationInDegrees);\n    context.translate(-centerX, -centerY);\n\n    // big black circle\n    context.beginPath();\n    context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);\n    context.fillStyle = \"black\";\n    context.fill();\n\n    // draw image function\n    var image = new Image();\n    image.src = \"/4af22c0.jpg\";\n    image.onload = function () {\n      //image sizing\n      var aspectRatio = image.naturalWidth / image.naturalHeight;\n      var maxWidth = whiteCircleRadius * 2;\n      var maxHeight = whiteCircleRadius * 2;\n      var width = maxWidth;\n      var height = width / aspectRatio;\n      if (height > maxHeight) {\n        height = maxHeight;\n        width = height * aspectRatio;\n      }\n      // masking\n      var clipX = centerX - whiteCircleRadius;\n      var clipY = centerY - whiteCircleRadius;\n      context.save();\n      context.beginPath();\n      context.arc(centerX, centerY, whiteCircleRadius, 0, Math.PI * 2, false);\n      context.clip();\n      context.drawImage(image, clipX, clipY, width, height);\n      context.restore();\n    };\n\n    //white circle in the center of the big black circle\n    context.beginPath();\n    context.arc(centerX, centerY, whiteCircleRadius, 0, Math.PI * 2, false);\n    context.lineWidth = 10;\n    context.fillStyle = \"white\";\n    context.fill();\n\n    // draw image function call\n    image.onload();\n\n    // small black circle in the center\n    context.beginPath();\n    context.arc(centerX, centerY, blackSmallCircleRadius, 0, Math.PI * 2, false);\n    context.fillStyle = \"black\";\n    context.fill();\n\n    //  arcs\n    function drawArcs(numberOfArcs, startAngle) {\n      var arcStart = startAngle;\n      var arcLength = arcStart + 0.7;\n      var arcNumber = numberOfArcs;\n      var arcDistance = arcSpace / numberOfArcs;\n      for (var i = 0; i < arcNumber; i++) {\n        var arcRadius = whiteCircleRadius + i * arcDistance;\n        context.beginPath();\n        context.arc(centerX, centerY, arcRadius, startAngle, arcLength, false);\n        context.strokeStyle = \"white\";\n        context.lineWidth = 1;\n        context.stroke();\n      }\n    }\n    drawArcs(arcNumber, 0);\n    drawArcs(arcNumber, Math.PI);\n  }\n  // drawVinyl();\n\n  // animate function\n  function animate() {\n    context.clearRect(0, 0, canvas.width, canvas.height);\n    var count = 10;\n    count++;\n    drawVinyl(count * 0.001);\n    window.requestAnimationFrame(animate);\n  }\n  animate();\n};\n\n//# sourceURL=webpack://bt-music-player/./src/script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;