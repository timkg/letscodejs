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
			var relativePosition = wwp.relativeOffset($canvas, event.pageX, event.pageY);
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

	wwp.relativeOffset = function($element, pageX, pageY) {
		var borderLeftWidth, marginLeft, borderTopWidth, marginTop, relativeX, relativeY;

		borderLeftWidth = parseInt($element.css('border-left-width'), 10);
		marginLeft = parseInt($element.css('margin-left'), 10);
		borderTopWidth = parseInt($element.css('border-top-width'), 10);
		marginTop = parseInt($element.css('margin-top'), 10);

		relativeX = pageX - ($element.offset().left + borderLeftWidth + marginLeft);
		relativeY = pageY - ($element.offset().top + borderTopWidth + marginTop);
		return {x: relativeX, y: relativeY};
	};

}());