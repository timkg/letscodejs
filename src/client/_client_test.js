/*global describe, it, expect, wwp */

(function() {
	"use strict";

	describe('Drawing area', function() {

		it('should be initialized in a specific div', function() {
			var drawingAreaId = 'wwp-drawingArea';
			var div = document.createElement('div');
			div.setAttribute('id', drawingAreaId);
			document.body.appendChild(div);

			wwp.initializeDrawingArea(drawingAreaId);

			var tagName = $(div).children()[0].tagName.toLowerCase();

			expect(tagName).to.be.ok('drawing area container has child elements to hold svg drawings');
			
			if( tagName === 'svg' ) {

			}
			
			
		});

	});
}());