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
			expect(pathFor(elements[0])).to.eql([20, 30, 30, 300]);
		});

		it("takes border of canvas into account", function() {
			$canvas.css({
				border: "10px solid black"
				, margin: "5px"
			});
			paper = wwp.initializeDrawingArea($canvas[0]); // re-init after border change

			var relativeStartPosition = clickMouse($canvas, 100, 100);
			var relativeEndPosition = clickMouse($canvas, 110, 120);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([relativeStartPosition.x, relativeStartPosition.y, relativeEndPosition.x, relativeEndPosition.y]);
		});

		it('responds to mouse events', function() {
			var relativeStartPosition = clickMouse($canvas, 100, 100);
			var relativeCenterPosition = clickMouse($canvas, 110, 120);
			var relativeEndPosition = clickMouse($canvas, 140, 150);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(2);
			expect(pathFor(elements[0])).to.eql([relativeStartPosition.x, relativeStartPosition.y, relativeCenterPosition.x, relativeCenterPosition.y]);
			expect(pathFor(elements[1])).to.eql([relativeCenterPosition.x, relativeCenterPosition.y, relativeEndPosition.x, relativeEndPosition.y]);
		});

		function pathFor(element) {
			var box = element.getBBox();
			return [box.x, box.y, box.x2, box.y2];
		}

		function clickMouse($element, pageX, pageY) {
			var clickEvent = $.Event('click');
			clickEvent.pageX = pageX;
			clickEvent.pageY = pageY;
			$element.trigger(clickEvent);
			return wwp.relativeOffset($element, pageX, pageY);
		}

		function getElementsOnDrawingArea(paper) {
			var elements = [];
			paper.forEach(function (element) {
				elements.push(element);
			});
			return elements;
		}

	});
}());