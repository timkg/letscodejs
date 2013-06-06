/*global $, Raphael, wwp:true, console*/
wwp = {};

(function() {
	"use strict";

	var paper, $canvas;

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

	/**
	 * Handles mouse interaction with the drawing area
	 * @param $elm
	 */
	function handleMouseEvents($elm) {
		var startPos, currentPos;
		$elm.off('mousedown mouseleave mousemove mouseup'); // clean up any previous event listeners to allow multiple calling of this function

		$elm.on('mousedown', function (event) {
			startPos = wwp.elementPositionFromPagePosition($elm, event.pageX, event.pageY);
			event.preventDefault(); // prevent text from being selected when draw leaves area
		});

		$elm.on('mouseleave', function (event) {
			startPos = null;
		});

		$elm.on('mousemove', function (event) {
			if (!startPos) {
				return;
			}

			currentPos = wwp.elementPositionFromPagePosition($elm, event.pageX, event.pageY);
			if (startPos) {
				wwp.drawLine(startPos.x, startPos.y, currentPos.x, currentPos.y);
			}
			startPos = currentPos;
		});

		$(document.body).on('mouseup', function () {
			startPos = null;
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
			event = event.originalEvent;
			startPos = wwp.elementPositionFromPagePosition($elm, event.pageX, event.pageY);
		});

		$elm.on('touchend', function (event) {
			startPos = null;
		});

		$elm.on('touchmove', function (event) {
			if (!startPos) { return; }
			event = event.originalEvent;
			currentPos = wwp.elementPositionFromPagePosition($elm, event.pageX, event.pageY);
			if (startPos) {
				wwp.drawLine(startPos.x, startPos.y, currentPos.x, currentPos.y);
			}
			startPos = currentPos;
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
	 * Calculates relative coordinates on element from absolute coordinates on page
	 * @param $element
	 * @param pageX
	 * @param pageY
	 * @return {Object}
	 */
	// TODO - accept jQuery event object
	wwp.elementPositionFromPagePosition = function($element, pageX, pageY) {
		var relativeX, relativeY, contentOffset;
		contentOffset = wwp.contentOffset($element);

		relativeX = pageX - ($element.offset().left + contentOffset.x);
		relativeY = pageY - ($element.offset().top + contentOffset.y);
		return {x: relativeX, y: relativeY};
	};

	/**
	 * Calculates absolute page coordinates from relative element coordinates
	 * @param $element
	 * @param elementX
	 * @param elementY
	 * @return {Object}
	 */
	wwp.pagePositionFromElementPosition = function($element, elementX, elementY) {
		var pageX, pageY, contentOffset;
		contentOffset = wwp.contentOffset($element);

		pageX = elementX + ($element.offset().left + contentOffset.x);
		pageY = elementY + ($element.offset().top + contentOffset.y);
		return {x: pageX, y: pageY};
	};


	/**
	 *
	 * @param $element
	 * @param elementX
	 * @param elementY
	 * @return {Object}
	 */
	wwp.viewportPositionFromElementPosition = function($element, elementX, elementY) {
		var viewportX, viewportY, contentOffset;
		contentOffset = wwp.contentOffset($element);

		viewportX = elementX + ($element[0].getBoundingClientRect().left + contentOffset.x);
		viewportY = elementY + ($element[0].getBoundingClientRect().top + contentOffset.y);
		return {x: viewportX, y: viewportY};
	};

	/**
	 * Calculates px between element topleft border edge and topleft content egde
	 * @param $element
	 * @return {Object}
	 */
	wwp.contentOffset = function($element) {
		var borderLeftWidth, paddingLeft, borderTopWidth, paddingTop;

		borderLeftWidth = parseInt($element.css('border-left-width'), 10);
		paddingLeft = parseInt($element.css('padding-left'), 10);
		borderTopWidth = parseInt($element.css('border-top-width'), 10);
		paddingTop = parseInt($element.css('padding-top'), 10);

		return {x: borderLeftWidth + paddingLeft, y: borderTopWidth + paddingTop};
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