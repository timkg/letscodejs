/*global $, Raphael, wwp:true, console*/
wwp = {};

(function() {
	"use strict";

	var paper, $canvas;

	wwp.initializeDrawingArea = function(drawingAreaElement) {
		var prevX, prevY, endX, endY, borderTopWidth, borderLeftWidth, marginTop, marginLeft;

		paper = new Raphael(drawingAreaElement);
		$canvas = $(drawingAreaElement);

		$canvas.unbind('click'); // clean up any previous event listeners to allow multiple calling of this function
		$canvas.on('click', function(event) {
			var relativePosition = wwp.elementPositionFromPagePosition($canvas, event.pageX, event.pageY);
			endX = relativePosition.x;
			endY = relativePosition.y;
			if (prevX) {
				wwp.drawLine(prevX, prevY, endX, endY);
			}
			prevX = endX;
			prevY = endY;
		});

//		var prevX, prevY, isDragging;
//
//		$(document).on('mousedown', function() {
//			isDragging = true;
//		});
//		$(document).on('mouseup', function() {
//			isDragging = false;
//		});
//
//		$canvas.on('mousemove', function(event) {
//			// TODO in test - account for padding, border, margin
//			var divPageX = $canvas.offset().left;
//			var divPageY = $canvas.offset().top;
//
//			var relativeX = event.pageX - divPageX;
//			var relativeY = event.pageY - divPageY;
//
//			if (!prevX) {
//				prevX = relativeX;
//				prevY = relativeY;
//				return false; // only start drawing on second mousemove event
//			}
//
//			if (isDragging) {
//				wwp.drawLine(prevX, prevY, relativeX, relativeY);
//			}
//
//			prevX = relativeX;
//			prevY = relativeY;
//		});

		return paper;
	};

	wwp.drawLine = function(startX, startY, endX, endY) {
		paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
	};

	/**
	 * Calculates relative coordinates on element from absolute coordinates on page
	 * @param $element
	 * @param pageX
	 * @param pageY
	 * @return {Object}
	 */
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
	}

}());