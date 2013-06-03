/*global $, Raphael, wwp:true*/
wwp = {};

(function() {
	"use strict";

	var paper;

	wwp.initializeDrawingArea = function(drawingAreaElement) {
		var prevX, prevY, isDragging;

		paper = new Raphael(drawingAreaElement);
		var $canvas = $(drawingAreaElement);

		$(document).on('mousedown', function() {
			isDragging = true;
		});
		$(document).on('mouseup', function() {
			isDragging = false;
		});

		$canvas.on('mousemove', function(event) {
			// TODO in test - account for padding, border, margin
			var divPageX = $canvas.offset().left;
			var divPageY = $canvas.offset().top;

			var relativeX = event.pageX - divPageX;
			var relativeY = event.pageY - divPageY;

			if (!prevX) {
				prevX = relativeX;
				prevY = relativeY;
				return false; // only start drawing on second mousemove event
			}

			if (isDragging) {
				wwp.drawLine(prevX, prevY, relativeX, relativeY);
			}

			prevX = relativeX;
			prevY = relativeY;
		});
		return paper;
	};

	wwp.drawLine = function(startX, startY, endX, endY) {
		paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
	};

}());