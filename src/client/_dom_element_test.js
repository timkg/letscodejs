(function () {
	/*global beforeEach, describe, it, expect, $, wwp*/
	"use strict";

	describe('DOM Element', function() {

		var domElement;

		beforeEach(function() {
			domElement = new wwp.DomElement($('<div></div>'));
		});

		it('handles mouse events', function() {
			['down', 'move', 'up', 'enter', 'leave', 'over'].map(function(type) {
				testMouseEvent(type);
			});
		});

		it('handles touch events', function() {
			if (!supportsTouch()) { return; }
			['start', 'move', 'end', 'cancel'].map(function(type) {
				testTouchEvent(type);
			});
		});

		function testMouseEvent(type) {
			domElement.on('mouse'+type, function(event, offset) {
				expect(offset.x).to.equal(10);
				expect(offset.y).to.equal(15);
			});
			domElement.triggerMouse(type, 10, 15);
		}

		function testTouchEvent(type) {
			domElement.onSingleTouch(type, function(event, offset) {
				expect(offset.x).to.equal(10);
				expect(offset.y).to.equal(15);
			});
			domElement.triggerTouch(type, 10, 15);
		}

		function supportsTouch() {
			return (typeof Touch === 'object');
		}

	});

}());