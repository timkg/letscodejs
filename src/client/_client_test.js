(function() {
	/*global describe, it, expect, afterEach, beforeEach, wwp, $, Raphael */
	"use strict";

	describe('Drawing area', function() {

		var drawingArea, paper;

		var DRAWING_AREA_HEIGHT = 300;
		var DRAWING_AREA_WIDTH = 600;

		beforeEach(function() {
			drawingArea = $('<div></div>')
				.css({
					height: DRAWING_AREA_HEIGHT
					, width: DRAWING_AREA_WIDTH
				});

			$(document.body).append(drawingArea);

			paper = wwp.initializeDrawingArea(drawingArea[0]);
		});

		afterEach(function() {
			drawingArea.remove();
		});

		it('should have the same dimensions as its enclosing div', function() {
			expect(paper.height).to.equal(DRAWING_AREA_HEIGHT);
			expect(paper.width).to.equal(DRAWING_AREA_WIDTH);
		});

		it('should draw a line', function() {
			wwp.drawLine(20, 30, 30, 300);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			var element = elements[0];
			var path = pathFor(element);

			expect(path).to.equal("M20,30L30,300");
		});

		function getElementsOnDrawingArea(paper) {
			var elements = [];
			paper.forEach(function (element) {
				elements.push(element);
			});
			return elements;
		}

		function pathFor(element) {
			// Use 'Element.getBBox()' here instead of low-level DOM inspection?
			// (thanks to Vlad Gurdiga for the suggestion - http://www.letscodejavascript.com/v1/comments/tdjs49.html)

			if (Raphael.vml) {
				return vmlPathFor(element);
			} else if (Raphael.svg) {
				return svgPathFor(element);
			} else {
				throw new Error("Unknown Raphael type");
			}
		}

		function svgPathFor(element) {
			var path = element.node.attributes.d.value;
			if (path.indexOf(",") !== -1) {
				// We're in Firefox, Safari, Chrome, which uses format
				// M20,30L30,300
				return path;
			}
			else {
				// We're in IE9, which uses format
				// M 20 30 L 30 300
				var ie9PathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
				var ie9 = path.match(ie9PathRegex);

				return "M" + ie9[1] + "," + ie9[2] + "L" + ie9[3] + "," + ie9[4];
			}
			return path;
		}

		function vmlPathFor(element) {
			// We're in IE 8, which uses format
			// m432000,648000 l648000,67456800 e
			var VML_MAGIC_NUMBER = 21600;

			var path = element.node.path.value;

			var ie8PathRegex = /m(\d+),(\d+) l(\d+),(\d+) e/;
			var ie8 = path.match(ie8PathRegex);

			var startX = ie8[1] / VML_MAGIC_NUMBER;
			var startY = ie8[2] / VML_MAGIC_NUMBER;
			var endX = ie8[3] / VML_MAGIC_NUMBER;
			var endY = ie8[4] / VML_MAGIC_NUMBER;

			return "M" + startX + "," + startY + "L" + endX + "," + endY;
		}

	});
}());