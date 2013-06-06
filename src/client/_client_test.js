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
			expect(wwp.coordinateArrayToPath(coordinates)).to.equal('M100,100L120,130');
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
			mouseDown(WWPCanvas, 20, 20);
			mouseMove(WWPCanvas, 30, 40);
			mouseUp(WWPCanvas, 30, 40);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([20, 20, 30, 40]);
		});

		it("does not draw line segment when mouse is not down", function() {
			mouseMove(WWPCanvas, 30, 40);
			mouseUp(WWPCanvas, 30, 40);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(0);
		});

		it("stops to draw line segment when mouse is up", function() {
			mouseDown(WWPCanvas, 20, 20);
			mouseMove(WWPCanvas, 30, 40);
			mouseUp(WWPCanvas, 30, 40);
			mouseMove(WWPCanvas, 35, 45);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([20, 20, 30, 40]);
		});

		it("does not draw line segment when mouse leaves drawing area", function() {
			mouseDown(WWPCanvas, 20, 20);
			mouseLeave(WWPCanvas, 1000, 40);
			mouseMove(WWPCanvas, 35, 45);
			mouseMove(WWPCanvas, 10, 100);
			mouseUp(WWPCanvas, 35, 45);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(0);
		});

		it("stops to draw more line segments when mouse leaves drawing area", function() {
			mouseDown(WWPCanvas, 20, 20);
			mouseMove(WWPCanvas, 35, 45);
			mouseLeave(WWPCanvas, 1000, 40);
			mouseMove(WWPCanvas, 10, 100);
			mouseUp(WWPCanvas, 35, 45);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([20, 20, 35, 45]);
		});

		it("draws multiple segments", function() {
			mouseDown(WWPCanvas, 20, 20);
			mouseMove(WWPCanvas, 30, 40);
			mouseMove(WWPCanvas, 40, 10);
			mouseMove(WWPCanvas, 45, 100);
			mouseUp(WWPCanvas, 45, 100);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(3);
			expect(pathFor(elements[0])).to.eql([20, 20, 30, 40]);
			expect(pathFor(elements[1])).to.eql([30, 40, 40, 10]);
			expect(pathFor(elements[2])).to.eql([40, 10, 45, 100]);
		});

		it("does not allow text to be selected outside drawing area when drag leaves area", function() {
			WWPCanvas.element.on('mousedown', function(event) {
				expect(event.isDefaultPrevented()).to.be(true);
			});
			mouseDown(WWPCanvas, 20, 20);
			mouseMove(WWPCanvas, 30, 40);
			mouseUp(WWPCanvas, 30, 40);
		});

//		it("allows text to be selected when dragging outside the drawing area", function() {
//			var $body = $(document.body);
//			$body.on('mousedown', function(event) {
//				expect(event.isDefaultPrevented()).to.be(false);
//			});
//			mouseDown($body, 20, 20);
//			mouseMove($body, 30, 40);
//			mouseUp($body, 30, 40);
//		});
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
			touchStart(WWPCanvas, 20, 20);
			touchMove(WWPCanvas, 30, 40);
			touchEnd(WWPCanvas, 30, 40);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([20, 20, 30, 40]);
		});

		it("does not scroll or zoom when user is drawing", function() {
			WWPCanvas.element.on('touchstart', function(event) {
				expect(event.isDefaultPrevented()).to.be(true);
			});
			touchStart(WWPCanvas, 20, 20);
			touchMove(WWPCanvas, 30, 40);
			touchEnd(WWPCanvas, 30, 40);
		});

//		it("allows scroll or zoom when user is touching outside drawing area", function() {
//			var $body = $(document.body);
//			$body.on('touchstart', function(event) {
//				expect(event.isDefaultPrevented()).to.be(false);
//				$body.off('touchstart');
//			});
//			touchStart($body, 20, 20);
//			touchMove($body, 30, 40);
//			touchEnd($body, 30, 40);
//		});

		it("stops drawing when multiple touches occur", function() {
			touchStart(WWPCanvas, 20, 20);
			touchMove(WWPCanvas, 30, 40);
			createMultiTouchEvent('touchstart', WWPCanvas, 20, 20, 30, 30);
			createMultiTouchEvent('touchmove', WWPCanvas, 30, 30, 40, 40);
			touchMove(WWPCanvas, 40, 50);
			touchEnd(WWPCanvas, 40, 50);

			var elements = getElementsOnDrawingArea(paper);
			expect(elements.length).to.equal(1);
			expect(pathFor(elements[0])).to.eql([20, 20, 30, 40]);
		});
	});


	/**
	 * Utility functions
	 *
	 */

	// Note: a multi-touch action still triggers a single TouchEvent. Its TouchList is composed of multiple Touches.
	// TouchEvent: a single- or multi-touch Event.
	// Touch: a point of contact between a finger and the screen
	// TouchList: a list of Touches that take part in a TouchEvent

	function touchStart(WWPElm, elementX, elementY) {
		createSingleTouchEvent('touchstart', WWPElm, elementX, elementY);
	}

	function touchMove(WWPElm, elementX, elementY) {
		createSingleTouchEvent('touchmove', WWPElm, elementX, elementY);
	}

	function touchEnd(WWPElm, elementX, elementY) {
		createSingleTouchEvent('touchend', WWPElm, elementX, elementY);
	}

	function touchCancel(WWPElm, elementX, elementY) {
		createSingleTouchEvent('touchcancel', WWPElm, elementX, elementY);
	}

	/**
	 * Fires a TouchEvent with a TouchList composed of a single Touch
	 * @param type
	 * @param $element
	 * @param elementX
	 * @param elementY
	 */
	function createSingleTouchEvent(type, WWPElm, elementX, elementY) {
		var touchPoint = createTouchPoint(WWPElm, elementX, elementY);
		var touchEvent = createNativeTouchEvent(type, new TouchList(touchPoint));
		dispatchTouchEvent(WWPElm, touchEvent);
	}

	/**
	 * Fires a TouchEvent with a TouchList composed of two Touches
	 * @param type
	 * @param $element
	 * @param elementX1
	 * @param elementY1
	 * @param elementX2
	 * @param elementY2
	 */
	function createMultiTouchEvent(type, WWPElm, elementX1, elementY1, elementX2, elementY2) {
		var touchPoint1 = createTouchPoint(WWPElm, elementX1, elementY1);
		var touchPoint2 = createTouchPoint(WWPElm, elementX2, elementY2);
		var touchEvent = createNativeTouchEvent(type , new TouchList(touchPoint1, touchPoint2));
		dispatchTouchEvent(WWPElm, touchEvent);
	}

	/**
	 * Creates a TouchEvent object
	 * The target element is determined at dispatch
	 * @param type
	 * @param touchList
	 * @return {Event}
	 */
	function createNativeTouchEvent(type, touchList) {
		var nativeTouchEvent = document.createEvent('TouchEvent');
		nativeTouchEvent.initTouchEvent(
			type
			, true // canBubble
			, true // cancelable
			, window
			, null
			, 0, 0 // screenX/Y
			, 0, 0 // pageX/Y
			, false, false, false, false // meta keys  - shift, alt, etc
			, touchList
			, touchList
			, touchList
		);

		return nativeTouchEvent;
	}

	/**
	 * Wraps a native touch event in a jQuery event object and triggers it on the target element
	 * @param $element
	 * @param touchEvent
	 */
	function dispatchTouchEvent(WWPElm, touchEvent) {
		var jqueryEvent = new $.Event();
		jqueryEvent.type = touchEvent.type;
		jqueryEvent.originalEvent = touchEvent;
		WWPElm.element.trigger(jqueryEvent);
	}

	/**
	 * Creates a new Touch on a given element
	 * https://developer.mozilla.org/en-US/docs/Web/API/Touch
	 * @param $element
	 * @param elementX
	 * @param elementY
	 * @return {Touch}
	 */
	function createTouchPoint(WWPElm, elementX, elementY) {
		var pagePosition = WWPElm.pagePositionFromElementPosition(elementX, elementY);

		return new Touch(
			undefined
			, WWPElm.element[0]
			, 0
			, pagePosition.x
			, pagePosition.y
			, 0, 0 // clientX/Y
		);
	}

	/**
	 * Returns a boolean indicating if touch events are supported
	 * http://modernizr.github.io/Modernizr/touch.html
	 * @return {Boolean}
	 */
	function supportsTouch() {
		return (typeof Touch === 'object');
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
			return wwp.svgPathToCoordinateArray(path);
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


	function mouseDown(WWPElement, elementX, elementY) {
		mouseEvent('mousedown', WWPElement, elementX, elementY);
	}

	function mouseUp(WWPElement, elementX, elementY) {
		mouseEvent('mouseup', WWPElement, elementX, elementY);
	}

	function mouseMove(WWPElement, elementX, elementY) {
		mouseEvent('mousemove', WWPElement, elementX, elementY);
	}

	function mouseLeave(WWPElement, elementX, elementY) {
		mouseEvent('mouseleave', WWPElement, elementX, elementY);
	}

	function mouseEvent(type, WWPElm, elementX, elementY) {
		var event = $.Event(type);
		var pagePosition = WWPElm.pagePositionFromElementPosition(elementX, elementY);
		event.pageX = pagePosition.x;
		event.pageY = pagePosition.y;
		WWPElm.element.trigger(event);
	}

	function getElementsOnDrawingArea(paper) {
		var elements = [];
		paper.forEach(function (element) {
			elements.push(element);
		});
		return elements;
	}

}());