(function() {
	/*global describe, it, expect, afterEach, beforeEach, wwp, $, Raphael */
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
				border: "10px solid black"
				, margin: "5px"
			});
			paper = wwp.initializeDrawingArea($canvas[0]); // re-init after border change
			var clickEvent = $.Event('click');
			clickEvent.pageX = $canvas.offset().left + 30;
			clickEvent.pageY = $canvas.offset().top + 30;

			$canvas.trigger(clickEvent);

			var elements = getElementsOnDrawingArea(paper);

			expect(pathFor(elements[0])).to.equal('M0,0L30,30');
		});

		it('responds to mouse events', function() {
			var clickEvent = $.Event('click');
			clickEvent.pageX = $canvas.offset().left + 30;
			clickEvent.pageY = $canvas.offset().top + 30;

			$canvas.trigger(clickEvent);

			var elements = getElementsOnDrawingArea(paper);

			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.equal('M0,0L30,30');
		});

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