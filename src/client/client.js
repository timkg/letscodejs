/*global $, wp:true*/

wwp = {};

(function() {
	"use strict";

	wwp.initializeDrawingArea = function() {
		var div = document.createElement('div');
		div.setAttribute('id', 'wwp-drawingArea');
		div.setAttribute('foo', 'bar');
		document.body.appendChild(div);
	};

}());