/*global $, Raphael, wwp:true, console*/
window.wwp = window.wwp || {};

(function() {
	"use strict";

	var paper, $canvas, WWPCanvas, startPos;

	/**
	 * Kicks off Raphael and wraps the drawing area into our DOM abstraction
	 * @param drawingAreaElement
	 * @return {Raphael}
	 */
	wwp.initializeDrawingArea = function(drawingAreaElement) {

		paper = new Raphael(drawingAreaElement);
		$canvas = $(drawingAreaElement);
		WWPCanvas = new wwp.DomElement($canvas);

		handleMouseEvents(WWPCanvas);
		handleTouchEvents(WWPCanvas);
		return paper;
	};

	/**
	 * Handles mouse interaction with the drawing area
	 * @param WWPElm
	 */
	function handleMouseEvents(WWPElm) {

		WWPElm.on('mousedown', startDrag);
		WWPElm.on('mousemove', continueDrag);
		WWPElm.on('mouseleave', endDrag);
		WWPElm.on('mouseup', endDrag);
	}

	/**
	 * Handle touch interaction with the drawing area
	 * @param WWPElm
	 */
	function handleTouchEvents(WWPElm) {

		WWPElm.onTouch('touchstart', function (event, offset) {
			// only draw with one finger - cancel on + fingers
			if (event.originalEvent.touches.length === 1) {
				startDrag(event, offset);
			}
			else {
				endDrag();
			}
		});
		WWPElm.onTouch('touchend', endDrag);
		WWPElm.onTouch('touchmove', continueDrag);
	}


	/**
	 * Drawing UI logic - save start position for continuous dragging
	 * @param offset
	 */
	function startDrag(event, offset) {
		event.preventDefault(); // prevent text from being selected when draw leaves area
		startPos = offset;
	}

	/**
	 * Drawing UI logic - draw line from start position to current position
	 * @param offset
	 */
	function continueDrag(event, offset) {
		if (!startPos) { return; }
		wwp.drawLine(startPos.x, startPos.y, offset.x, offset.y);
		startPos = offset;
	}

	/**
	 * Drawing UI logic - stop drawing by setting startPos to null, invalidating calls to continueDrag
	 */
	function endDrag() {
		startPos = null;
	}

	/**
	 * Drawing logic - draw a line for the given coordinates
	 * @param startX
	 * @param startY
	 * @param endX
	 * @param endY
	 * @return {*|Array}
	 */
	wwp.drawLine = function(startX, startY, endX, endY) {
		return paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
	};

}());