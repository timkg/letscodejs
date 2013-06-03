(function() {
	/*global describe, it, expect, afterEach, beforeEach, wwp, $, Raphael, dump, console */
	"use strict";

	describe('Drawing area', function() {

		var $canvas, paper;

		var DRAWING_AREA_HEIGHT = 300;
		var DRAWING_AREA_WIDTH = 600;

		beforeEach(function() {
			$canvas = $('<div></div>')
				.css({
					height: DRAWING_AREA_HEIGHT
					, width: DRAWING_AREA_WIDTH
				});

			$(document.body).append($canvas);

			paper = wwp.initializeDrawingArea($canvas[0]);
		});

		afterEach(function() {
			$canvas.remove();
		});

		it('should have the same dimensions as its enclosing div', function() {
			expect(paper.height).to.equal(DRAWING_AREA_HEIGHT);
			expect(paper.width).to.equal(DRAWING_AREA_WIDTH);
		});

		it('should draw a line', function() {
			wwp.drawLine(20, 30, 30, 300);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.equal("M20,30L30,300");
		});

		it("takes border of canvas into account", function() {
			$canvas.css({
				border:"10px solid black"
				, margin:"5px"
			});
			paper = wwp.initializeDrawingArea($canvas[0]); // re-init after border change

			var startX = 100;
			var startY = 100;
			var endX = 110;
			var endY = 120;
			clickMouse($canvas, startX, startY);
			clickMouse($canvas, endX, endY);

			var relativeStartPosition = relativeOffset($canvas, startX, startY);
			var relativeEndPosition = relativeOffset($canvas, endX, endY);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.equal('M' + relativeStartPosition.x + ',' + relativeStartPosition.y + 'L' + relativeEndPosition.x + ',' + relativeEndPosition.y);
		});

		it('responds to mouse events', function() {
			var startX = 100;
			var startY = 100;
			var endX = 110;
			var endY = 120;
			clickMouse($canvas, startX, startY);
			clickMouse($canvas, endX, endY);

			var relativeStartPosition = relativeOffset($canvas, startX, startY);
			var relativeEndPosition = relativeOffset($canvas, endX, endY);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.equal('M' + relativeStartPosition.x + ',' + relativeStartPosition.y + 'L' + relativeEndPosition.x + ',' + relativeEndPosition.y);
		});

		function relativeOffset($element, pageX, pageY) {
			var borderLeftWidth = parseInt($element.css('border-left-width'), 10);
			var marginLeft = parseInt($element.css('margin-left'), 10);
			var borderTopWidth = parseInt($element.css('border-top-width'), 10);
			var marginTop = parseInt($element.css('margin-top'), 10);

			var relativeX = pageX - ($element.offset().left + borderLeftWidth + marginLeft);
			var relativeY = pageY - ($element.offset().top + borderTopWidth + marginTop);
			return {x: relativeX, y: relativeY};
		}

		function clickMouse($element, pageX, pageY) {
			var clickEvent = $.Event('click');
			clickEvent.pageX = pageX;
			clickEvent.pageY = pageY;
			$element.trigger(clickEvent);
		}

		function getElementsOnDrawingArea(paper) {
			var elements = [];
			paper.forEach(function (element) {
				elements.push(element);
			});
			return elements;
		}

		function pathFor(element) {
			var box = element.getBBox();
			return "M" + box.x + "," + box.y + "L" + box.x2 + "," + box.y2;
		}

	});
}());