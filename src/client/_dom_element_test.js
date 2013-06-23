(function () {
	/*global beforeEach, describe, it, expect, $, wwp*/
	"use strict";

	describe('DOM Element', function() {

		var domElement;

		beforeEach(function() {
			domElement = new wwp.DomElement($('<div></div>'));
		});

		it('handles mouse events', function() {
			domElement.on('mousemove', function(event, offset) {
				console.log(offset);
				expect(offset.x).to.equal(10);
				expect(offset.y).to.equal(15);
			});
			domElement.triggerMouse('move', 10, 15);
		});


	});

}());