/*global describe, it, expect, wwp */

(function() {
	"use strict";

	describe('Drawing area', function() {

		it('should be initialized in a specific div', function() {
			wwp.initializeDrawingArea();

			var div = document.getElementById('wwp-drawingArea');
			expect(div.getAttribute('foo')).to.equal('bar');	
			
		});

	});
}());