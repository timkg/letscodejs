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
		return paper;
	};

	/**
	 *
	 * @param $elm
	 */
	function handleMouseEvents($elm) {
		var startPos, currentPos;
		$elm.off('click mousedown mouseup'); // clean up any previous event listeners to allow multiple calling of this function

		$elm.on('mousedown', function (event) {
			startPos = wwp.elementPositionFromPagePosition($elm, event.pageX, event.pageY);
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