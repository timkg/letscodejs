(function() {
	/*global describe, it, expect, afterEach, beforeEach, wwp, $, Raphael, dump, console */
	"use strict";

	describe('wwp DOM helper methods', function() {

		var $elm;

		beforeEach(function() {
			$elm = $('<div></div>')
				.css({
					height: '200px'
					, width: '200px'
					, margin: '20px'
					, border: '20px solid black'
					, padding: '15px'
				});

			$(document.body)
				.css({
					margin: 0
					, padding: 0
					, border: 0
				})
				.append($elm);
		});

		afterEach(function() {
			$elm.remove();
		});

		it('calculates distance between topleft border edge and topleft content edge', function() {
			var distance = wwp.contentOffset($elm);
			// border: '20px solid black' + padding: '15px'
			expect(distance).to.eql({x: 35, y: 35});
		});

		it('calculates coordinates on DOM element from global page position', function() {
			var pos = wwp.elementPositionFromPagePosition($elm, 100, 100);
			// border: '20px solid black' + padding: '15px' + margin: '20px'
			expect(pos).to.eql({x: 45, y: 45});
		});

		it('calculates page coordinates from coordinates on DOM element', function() {
			var pos = wwp.pagePositionFromElementPosition($elm, 100, 100);
			// border: '20px solid black' + padding: '15px' + margin: '20px'
			expect(pos).to.eql({x: 155, y: 155});
		});

	});

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

			clickMouse($canvas, 100, 100);
			clickMouse($canvas, 110, 120);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([100, 100, 110, 120]);
		});

		it('responds to mouse events', function() {
			clickMouse($canvas, 100, 100);
			clickMouse($canvas, 110, 120);
			clickMouse($canvas, 140, 150);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(2);
			expect(pathFor(elements[0])).to.eql([100, 100, 110, 120]);
			expect(pathFor(elements[1])).to.eql([110, 120, 140, 150]);
		});

		function pathFor(element) {
			var box = element.getBBox();
			return [box.x, box.y, box.x2, box.y2];
		}

		function clickMouse($element, elementX, elementY) {
			var clickEvent = $.Event('click');
			var pagePosition = wwp.pagePositionFromElementPosition($element, elementX, elementY);
			clickEvent.pageX = pagePosition.x;
			clickEvent.pageY = pagePosition.y;
			$element.trigger(clickEvent);
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