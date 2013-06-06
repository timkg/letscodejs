/*global $, Raphael, wwp:true, console*/
wwp = {};

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

		handleMouseEvents($canvas);
		handleTouchEvents($canvas);
		return paper;
	};

	function startDrag($elm, pageX, pageY) {
		startPos = wwp.elementPositionFromPagePosition($elm, pageX, pageY);
	}

	function continueDrag($elm, pageX, pageY) {
		if (!startPos) {
			return;
		}
		var currentPos = wwp.elementPositionFromPagePosition($elm, pageX, pageY);
		wwp.drawLine(startPos.x, startPos.y, currentPos.x, currentPos.y);
		startPos = currentPos;
	}

	function endDrag() {
		startPos = null;
	}

	/**
	 * Handles mouse interaction with the drawing area
	 * @param $elm
	 */
	function handleMouseEvents($elm) {

		// clean up any previous event listeners to only respond to drawing
		$elm.off('mousedown mouseleave mousemove mouseup');

		$elm.on('mousedown', function (event) {
			event.preventDefault(); // prevent text from being selected when draw leaves area
			startDrag($elm, event.pageX, event.pageY);
		});

		$elm.on('mousemove', function (event) {
			if (!startPos) { return; }
			continueDrag($elm, event.pageX, event.pageY);
		});

		$elm.on('mouseleave', function (event) {
			endDrag();
		});

		$elm.on('mouseup', function () {
			endDrag();
		});
	}

	/**
	 * Handle touch interaction with the drawing area
	 * @param $elm
	 */
	function handleTouchEvents($elm) {
		var startPos, currentPos;

		$elm.on('touchstart', function (event) {
			event.preventDefault(); // prevent scrolling

			// only draw with one finger - cancel on + fingers
			if (event.originalEvent.touches.length === 1) {
				startDrag($elm, event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
			} else {
				endDrag();
			}
		});

		$elm.on('touchend', function (event) {
			endDrag();
		});

		$elm.on('touchmove', function (event) {
			continueDrag($elm, event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
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