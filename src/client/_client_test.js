(function() {
	/*global describe, it, expect, afterEach, beforeEach, wwp, $, Raphael, dump, console */
	"use strict";

	var DRAWING_AREA_HEIGHT, DRAWING_AREA_WIDTH;
	DRAWING_AREA_HEIGHT = 300;
	DRAWING_AREA_WIDTH = 600;

	describe('wwp helper methods', function() {

		var WWPElm;

		beforeEach(function() {
			var $elm = $('<div></div>')
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

			WWPElm = new wwp.DomElement($elm);
		});

		afterEach(function() {
			WWPElm.element.remove();
			WWPElm = null;
		});

		it('calculates distance between topleft border edge and topleft content edge', function() {
			var distance = WWPElm.contentOffset();
			// border: '20px solid black' + padding: '15px'
			expect(distance).to.eql({x: 35, y: 35});
		});

		it('calculates coordinates on DOM element from global page position', function() {
			var pos = WWPElm.elementPositionFromPagePosition(100, 100);
			// border: '20px solid black' + padding: '15px' + margin: '20px'
			expect(pos).to.eql({x: 45, y: 45});
		});

		it('calculates page coordinates from coordinates on DOM element', function() {
			var pos = WWPElm.pagePositionFromElementPosition(100, 100);
			// border: '20px solid black' + padding: '15px' + margin: '20px'
			expect(pos).to.eql({x: 155, y: 155});
		});

		it('transforms coordinate array into SVG path string', function() {
			var coordinates = [100, 100, 120, 130];
			expect(coordinateArrayToPath(coordinates)).to.equal('M100,100L120,130');
		});

	});

	describe('Drawing area', function() {

		var $canvas, paper, WWPCanvas;

		beforeEach(function() {
			$canvas = $('<div></div>')
				.css({
					height: DRAWING_AREA_HEIGHT
					, width: DRAWING_AREA_WIDTH
					, border: "0px solid black" // IE8 complains when retrieving border-width if we don't set it first
				});

			$(document.body).append($canvas);
			paper = wwp.initializeDrawingArea($canvas[0]);
			WWPCanvas = new wwp.DomElement($canvas);
		});

		afterEach(function() {
			$canvas.remove();
			WWPCanvas = null;
		});

		it('should have the same dimensions as its enclosing div', function() {
			expect(paper.height).to.equal(DRAWING_AREA_HEIGHT);
			expect(paper.width).to.equal(DRAWING_AREA_WIDTH);
		});

		it('should expose a method to programmatically draw a line', function() {
			wwp.drawLine(20, 30, 30, 300);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([20, 30, 30, 300]);
		});

	});

	describe('Mouse events', function() {

		var $canvas, paper, WWPCanvas;

		beforeEach(function() {
			$canvas = $('<div></div>')
				.css({
					height: DRAWING_AREA_HEIGHT
					, width: DRAWING_AREA_WIDTH
					, border: "0px solid black" // IE8 complains when retrieving border-width if we don't set it first
				});

			$(document.body).append($canvas);
			paper = wwp.initializeDrawingArea($canvas[0]);
			WWPCanvas = new wwp.DomElement($canvas);
		});

		afterEach(function() {
			$canvas.remove();
			WWPCanvas = null;
		});

		it("draws line segment upon drag", function() {
			WWPCanvas.triggerMouse('down', 20, 20);
			WWPCanvas.triggerMouse('move', 30, 40);
			WWPCanvas.triggerMouse('up', 30, 40);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([20, 20, 30, 40]);
		});

		it("does not draw line segment when mouse is not down", function() {
			WWPCanvas.triggerMouse('move', 30, 40);
			WWPCanvas.triggerMouse('up', 30, 40);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(0);
		});

		it("stops to draw line segment when mouse is up", function() {
			WWPCanvas.triggerMouse('down',20, 20);
			WWPCanvas.triggerMouse('move', 30, 40);
			WWPCanvas.triggerMouse('up', 30, 40);
			WWPCanvas.triggerMouse('move', 35, 45);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([20, 20, 30, 40]);
		});

		it("does not draw line segment when mouse leaves drawing area", function() {
			WWPCanvas.triggerMouse('down',20, 20);
			WWPCanvas.triggerMouse('leave', 1000, 40);
			WWPCanvas.triggerMouse('move', 35, 45);
			WWPCanvas.triggerMouse('move', 10, 100);
			WWPCanvas.triggerMouse('up', 35, 45);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(0);
		});

		it("stops to draw more line segments when mouse leaves drawing area", function() {
			WWPCanvas.triggerMouse('down',20, 20);
			WWPCanvas.triggerMouse('move', 35, 45);
			WWPCanvas.triggerMouse('leave', 1000, 40);
			WWPCanvas.triggerMouse('move', 10, 100);
			WWPCanvas.triggerMouse('up', 35, 45);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([20, 20, 35, 45]);
		});

		it("draws multiple segments", function() {
			WWPCanvas.triggerMouse('down',20, 20);
			WWPCanvas.triggerMouse('move', 30, 40);
			WWPCanvas.triggerMouse('move', 40, 10);
			WWPCanvas.triggerMouse('move', 45, 100);
			WWPCanvas.triggerMouse('up', 45, 100);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(3);
			expect(pathFor(elements[0])).to.eql([20, 20, 30, 40]);
			expect(pathFor(elements[1])).to.eql([30, 40, 40, 10]);
			expect(pathFor(elements[2])).to.eql([40, 10, 45, 100]);
		});

		it("does not allow text to be selected outside drawing area when drag leaves area", function() {
			WWPCanvas.element.on('down', function(event) {
				expect(event.isDefaultPrevented()).to.be(true);
			});
			WWPCanvas.triggerMouse('down',20, 20);
			WWPCanvas.triggerMouse('move', 30, 40);
			WWPCanvas.triggerMouse('up', 30, 40);
		});

	});

	describe('Touch events', function() {

		if (!supportsTouch()) { return; }

		var $canvas, paper, WWPCanvas;

		beforeEach(function() {
			$canvas = $('<div></div>')
				.css({
					height: DRAWING_AREA_HEIGHT
					, width: DRAWING_AREA_WIDTH
					, border: "0px solid black" // IE8 complains when retrieving border-width if we don't set it first
				});

			$(document.body).append($canvas);

			WWPCanvas = new wwp.DomElement($canvas);

			paper = wwp.initializeDrawingArea($canvas[0]);
		});

		afterEach(function() {
			$canvas.remove();
			WWPCanvas = null;
		});

		it("draws line segment in response to touch events", function() {
			WWPCanvas.triggerTouch('start', 20, 20);
			WWPCanvas.triggerTouch('move', 30, 40);
			WWPCanvas.triggerTouch('end', 30, 40);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([20, 20, 30, 40]);
		});

		it("does not scroll or zoom when user is drawing", function() {
			WWPCanvas.element.on('touchstart', function(event) {
				expect(event.isDefaultPrevented()).to.be(true);
			});
			WWPCanvas.triggerTouch('start', 20, 20);
			WWPCanvas.triggerTouch('move', 30, 40);
			WWPCanvas.triggerTouch('end', 30, 40);
		});

		it("stops drawing when multiple touches occur", function() {
			WWPCanvas.triggerTouch('start', 20, 20);
			WWPCanvas.triggerTouch('move', 30, 40);
			WWPCanvas.triggerMultiTouch('start', 20, 20, 30, 30);
			WWPCanvas.triggerMultiTouch('move', 30, 30, 40, 40);
			WWPCanvas.triggerTouch('move', 40, 50);
			WWPCanvas.triggerTouch('end', 40, 50);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([20, 20, 30, 40]);
		});
	});


	/**
	 * Test helper functions
	 *
	 */

	function supportsTouch() {
		return (typeof Touch === 'object');
	}

	function getElementsOnDrawingArea(paper) {
		var elements = [];
		paper.forEach(function (element) {
			elements.push(element);
		});
		return elements;
	}

	function pathFor(element) {
		if (Raphael.vml) {
			return vmlPathFor(element);
		}
		else if (Raphael.svg) {
			return svgPathFor(element);
		}
		else { throw new Error("Unknown Raphael type"); }
	}

	function svgPathFor(element) {
		var path = element.node.attributes.d.value;
		if (path.indexOf(",") !== -1) {
			// We're in Firefox, Safari, Chrome, which uses format "M20,30L30,300"
			return svgPathToCoordinateArray(path);
		}
		else {
			// We're in IE9, which uses format "M 20 30 L 30 300"
			var ie9PathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
			var ie9 = path.match(ie9PathRegex);

			return [ie9[1], ie9[2], ie9[3], ie9[4]];
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

		return [startX, startY, endX, endY];
	}

	/**
	 * given an array with 4 coordinates, returns SVG path string (MX,YLX,Y)
	 * @param coordinates
	 * @return {String}
	 */
	function coordinateArrayToPath (coordinates) {
		return 'M' + coordinates[0] + ',' + coordinates[1] + 'L' + coordinates[2] + ',' + coordinates[3];
	}

	/**
	 * given an SVG path string (MX,YLX,Y), returns array with 4 coordinates
	 * @param svgPath
	 * @return {Array}
	 */
	function svgPathToCoordinateArray(svgPath) {
		svgPath = svgPath.substr(1); // get rid of 'M'
		var parts = svgPath.split('L'), coordinates = {};
		coordinates.start = parts[0];
		coordinates.end = parts[1];

		coordinates.start = coordinates.start.split(',');
		coordinates.end = coordinates.end.split(',');

		return [coordinates.start[0], coordinates.start[1], coordinates.end[0], coordinates.end[1]];
	}

}());