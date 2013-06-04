(function() {
	/*global describe, it, expect, afterEach, beforeEach, wwp, $, Raphael, dump, console */
	"use strict";

	describe('wwp helper methods', function() {

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

		it('transforms coordinate array into SVG path string', function() {
			var coordinates = [100, 100, 120, 130];
			expect(wwp.coordinateArrayToPath(coordinates)).to.equal('M100,100L120,130');
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
					, border: "0px solid black" // IE8 complains when retrieving border-width if we don't set it first
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
			expect(pathFor(elements[0])).to.eql(wwp.coordinateArrayToPath([20, 30, 30, 300]));
		});

		it("draws line segment upon drag", function() {
			mouseDown($canvas, 20, 20);
			mouseMove($canvas, 30, 40);
			mouseUp($canvas, 30, 40);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql(wwp.coordinateArrayToPath([20, 20, 30, 40]));
		});

		it("does not draw line segment when mouse is not down", function() {
			mouseMove($canvas, 30, 40);
			mouseUp($canvas, 30, 40);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(0);
		});

		it("stops to draw line segment when mouse is up", function() {
			mouseDown($canvas, 20, 20);
			mouseMove($canvas, 30, 40);
			mouseUp($canvas, 30, 40);
			mouseMove($canvas, 35, 45);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql(wwp.coordinateArrayToPath([20, 20, 30, 40]));
		});

	});


	/**
	 * Utility functions
	 *
	 */

	function pathFor(element) {
		if (Raphael.vml) { return vmlPathFor(element); }
		else if (Raphael.svg) { return svgPathFor(element); }
		else { throw new Error("Unknown Raphael type"); }
	}

	function svgPathFor(element) {
		var path = element.node.attributes.d.value;
		if (path.indexOf(",") !== -1) {
			// We're in Firefox, Safari, Chrome, which uses format "M20,30L30,300"
			return path;
		}
		else {
			// We're in IE9, which uses format "M 20 30 L 30 300"
			var ie9PathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
			var ie9 = path.match(ie9PathRegex);

			return "M" + ie9[1] + "," + ie9[2] + "L" + ie9[3] + "," + ie9[4];
		}
		return path;
	}

	function vmlPathFor(element) {
		// We're in IE 8, which uses format "m432000,648000 l648000,67456800 e"
		var VML_MAGIC_NUMBER = 21600;

		var path = element.node.path.value;

		var ie8PathRegex = /m(\d+),(\d+) l(\d+),(\d+) e/;
		var ie8 = path.match(ie8PathRegex);

		var startX = ie8[1] / VML_MAGIC_NUMBER;
		var startY = ie8[2] / VML_MAGIC_NUMBER;
		var endX = ie8[3] / VML_MAGIC_NUMBER;
		var endY = ie8[4] / VML_MAGIC_NUMBER;

		return wwp.coordinateArrayToPath([startX, startY, endX, endY]);
	}

	function mouseDown($element, elementX, elementY) {
		mouseEvent('mousedown', $element, elementX, elementY);
	}

	function mouseUp($element, elementX, elementY) {
		mouseEvent('mouseup', $element, elementX, elementY);
	}

	function mouseMove($element, elementX, elementY) {
		mouseEvent('mousemove', $element, elementX, elementY);
	}

	function mouseEvent(type, $element, elementX, elementY) {
		var event = $.Event(type);
		var pagePosition = wwp.pagePositionFromElementPosition($element, elementX, elementY);
		event.pageX = pagePosition.x;
		event.pageY = pagePosition.y;
		$element.trigger(event);
	}

	function getElementsOnDrawingArea(paper) {
		var elements = [];
		paper.forEach(function (element) {
			elements.push(element);
		});
		return elements;
	}

}());