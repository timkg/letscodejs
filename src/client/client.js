/*global $, Raphael, wwp:true, console*/
window.wwp = window.wwp || {};

(function() {
	"use strict";

	var paper, $canvas, startPos;

	/**
	 *
	 * @param drawingAreaElement
	 * @return {Raphael}
	 */
	wwp.initializeDrawingArea = function(drawingAreaElement) {

		paper = new Raphael(drawingAreaElement);
		$canvas = $(drawingAreaElement);

		handleMouseEvents(new wwp.DomElement($canvas));
		handleTouchEvents(new wwp.DomElement($canvas));
		return paper;
	};

	function startDrag(elm, pageX, pageY) {
		startPos = elm.elementPositionFromPagePosition(pageX, pageY);
	}

	function continueDrag(elm, pageX, pageY) {
		if (!startPos) {
			return;
		}
		var currentPos = elm.elementPositionFromPagePosition(pageX, pageY);
		wwp.drawLine(startPos.x, startPos.y, currentPos.x, currentPos.y);
		startPos = currentPos;
	}

	function endDrag() {
		startPos = null;
	}

	/**
	 * Handles mouse interaction with the drawing area
	 * @param WWPElm
	 */
	function handleMouseEvents(WWPElm) {

		// clean up any previous event listeners to only respond to drawing
		WWPElm.element.off('mousedown mouseleave mousemove mouseup');

		WWPElm.element.on('mousedown', function (event) {
			event.preventDefault(); // prevent text from being selected when draw leaves area
			startDrag(WWPElm, event.pageX, event.pageY);
		});

		WWPElm.element.on('mousemove', function (event) {
			if (!startPos) { return; }
			continueDrag(WWPElm, event.pageX, event.pageY);
		});

		WWPElm.element.on('mouseleave', function (event) {
			endDrag();
		});

		WWPElm.element.on('mouseup', function () {
			endDrag();
		});
	}

	/**
	 * Handle touch interaction with the drawing area
	 * @param WWPElm
	 */
	function handleTouchEvents(WWPElm) {
		var startPos, currentPos;

		WWPElm.element.on('touchstart', function (event) {
			event.preventDefault(); // prevent scrolling

			// only draw with one finger - cancel on + fingers
			if (event.originalEvent.touches.length === 1) {
				startDrag(WWPElm, event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
			} else {
				endDrag();
			}
		});

		WWPElm.element.on('touchend', function (event) {
			endDrag();
		});

		WWPElm.element.on('touchmove', function (event) {
			continueDrag(WWPElm, event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
		});
	}

	/**
	 *
	 * @param startX
	 * @param startY
	 * @param endX
	 * @param endY
	 * @return {*|Array}
	 */
	wwp.drawLine = function(startX, startY, endX, endY) {
		return paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
	};



	/**
	 * given an array with 4 coordinates, returns SVG path string (MX,YLX,Y)
	 * @param coordinates
	 * @return {String}
	 */
	wwp.coordinateArrayToPath = function(coordinates) {
		return 'M' + coordinates[0] + ',' + coordinates[1] + 'L' + coordinates[2] + ',' + coordinates[3];
	};

	/**
	 * given an SVG path string (MX,YLX,Y), returns array with 4 coordinates
	 * @param coordinates
	 * @return {String}
	 */
	wwp.svgPathToCoordinateArray = function(svgPath) {
		svgPath = svgPath.substr(1); // get rid of 'M'
		var parts = svgPath.split('L'), coordinates = {};
		coordinates.start = parts[0];
		coordinates.end = parts[1];

		coordinates.start = coordinates.start.split(',');
		coordinates.end = coordinates.end.split(',');

		return [coordinates.start[0], coordinates.start[1], coordinates.end[0], coordinates.end[1]];
	};

}());