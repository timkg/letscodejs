/*global $, Raphael, wwp:true, console*/
wwp = {};

(function() {
	"use strict";

	var paper, $canvas;

	wwp.initializeDrawingArea = function(drawingAreaElement) {
		var lastX, lastY, isDragging, pos;

		paper = new Raphael(drawingAreaElement);
		$canvas = $(drawingAreaElement);

		$canvas.off('click mousedown mouseup'); // clean up any previous event listeners to allow multiple calling of this function

		$canvas.on('mousedown', function(event) {
			isDragging = true;
			pos = wwp.elementPositionFromPagePosition($canvas, event.pageX, event.pageY);
			lastX = pos.x;
			lastY = pos.y;
		});

		$canvas.on('mousemove', function(event) {
			pos = wwp.elementPositionFromPagePosition($canvas, event.pageX, event.pageY);
			if (isDragging) {
				wwp.drawLine(lastX, lastY, pos.x, pos.y);
			}
			lastX = pos.x;
			lastY = pos.y;
		});

		$(document.body).on('mouseup', function() {
			isDragging = false;
		});

		return paper;
	};

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

}());