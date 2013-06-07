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

		handleDragEvents(WWPCanvas);
		return paper;
	};

	/**
	 * Handles User interaction with the drawing area
	 * @param WWPElm
	 */
	function handleDragEvents(WWPElm) {

		WWPElm.on('mousedown', handleStartDrag);
		WWPElm.on('mousemove', handleContinueDrag);
		WWPElm.on('mouseleave', handleEndDrag);
		WWPElm.on('mouseup', handleEndDrag);

		WWPElm.onSingleTouch('touchstart', handleStartDrag);
		WWPElm.onMultiTouch('touchstart', handleEndDrag);
		WWPElm.onTouch('touchend', handleEndDrag);
		WWPElm.onTouch('touchmove', handleContinueDrag);
	}

	/**
	 * Drawing UI behaviour - connect event listeners to drawing functions
	 *
	 */

	function handleStartDrag(event, offset) {
		// prevent text selection w/ mouse or scrolling w/ touch
		event.preventDefault();
		startDrag(offset);
	}

	function handleContinueDrag(event, offset) {
		continueDrag(offset);
	}

	function handleEndDrag(event, offset) {
		endDrag();
	}


	/**
	 * Programmatic drawing logic
	 *
	 */

	function startDrag(offset) {
		startPos = offset;
	}

	function continueDrag(offset) {
		if (!startPos) { return; }
		wwp.drawLine(startPos.x, startPos.y, offset.x, offset.y);
		startPos = offset;
	}

	function endDrag() {
		startPos = null;
	}

	wwp.drawLine = function(startX, startY, endX, endY) {
		return paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
	};

}());