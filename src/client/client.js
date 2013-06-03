/*global $, Raphael, wwp:true, console*/
wwp = {};

(function() {
	"use strict";

	var paper, $canvas;

	wwp.initializeDrawingArea = function(drawingAreaElement) {
		var prevX, prevY, endX, endY, borderTopWidth, borderLeftWidth, marginTop, marginLeft;

		paper = new Raphael(drawingAreaElement);
		$canvas = $(drawingAreaElement);

		// get values used to normalize position of click event in relation to target border and margin
		// NOTE - calculating these here means faster performance, but client-side alterations
		// of the drawing container require new call to this function to keep dimensions in sync
		// TODO - remove duplication with _client_test.js, function relativeOffset()
		borderTopWidth = parseInt($canvas.css('border-top-width'), 10);
		borderLeftWidth = parseInt($canvas.css('border-left-width'), 10);
		marginTop = parseInt($canvas.css('margin-top'), 10);
		marginLeft = parseInt($canvas.css('margin-left'), 10);

		$canvas.unbind('click'); // clean up any previous event listeners to allow multiple calling of this function
		$canvas.on('click', function(event) {
			endX = event.pageX - $canvas.offset().left - borderLeftWidth - marginLeft;
			endY = event.pageY - $canvas.offset().top - borderTopWidth - marginTop;
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

}());