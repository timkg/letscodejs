window.wwp = window.wwp || {};

(function () {
	/**/
	"use strict";

	/**
	 * Wraps a DOM Element with utility methods
	 * @type {Function}
	 */
	var DomElement = wwp.DomElement = function (browserDomElement) {
		this.element = browserDomElement;
	};

	/**
	 * Attaches an event listener to the element which gets called with relative coordinates
	 * @param type
	 * @param callback
	 */
	DomElement.prototype.on = function(type, callback) {
		var self = this;
		this.element.on(type, function(event) {
			var relativeCoordinates = self.elementPositionFromPagePosition(event.pageX, event.pageY);
			callback(event, relativeCoordinates);
		});
	};

	/**
	 * Attaches an event listener to the element which gets called with relative coordinates
	 * @param type
	 * @param callback
	 */
	DomElement.prototype.onTouch = function(type, callback) {
		var self = this;
		this.element.on(type, function(event) {
			var relativeCoordinates = self.elementPositionFromPagePosition(
				event.originalEvent.touches[0].pageX
				, event.originalEvent.touches[0].pageY
			);
			callback(event, relativeCoordinates);
		});
	};

	/**
	 * Only attaches an event listener to the element when a single touch point exists
	 * @param type
	 * @param callback
	 */
	DomElement.prototype.onSingleTouch = function(type, callback) {
		var self = this;
		this.element.on(type, function(event) {
		if (event.originalEvent.touches.length !== 1) { return; }
			var relativeCoordinates = self.elementPositionFromPagePosition(
				event.originalEvent.touches[0].pageX
				, event.originalEvent.touches[0].pageY
			);
			callback(event, relativeCoordinates);
		});
	};

	/**
	 * Only attaches an event listener to the element when multiple touch points exist
	 * @param type
	 * @param callback
	 */
	DomElement.prototype.onMultiTouch = function(type, callback) {
		var self = this;
		this.element.on(type, function(event) {
		if (event.originalEvent.touches.length < 2) { return; }
			var relativeCoordinates = self.elementPositionFromPagePosition(
				event.originalEvent.touches[0].pageX
				, event.originalEvent.touches[0].pageY
			);
			callback(event, relativeCoordinates);
		});
	};

	/**
	 * Calculates relative coordinates on element from absolute coordinates on page
	 * @param pageX
	 * @param pageY
	 * @return {Object}
	 */
	DomElement.prototype.elementPositionFromPagePosition = function(pageX, pageY) {
		var relativeX, relativeY, contentOffset;
		contentOffset = this.contentOffset(this.element);

		relativeX = pageX - (this.element.offset().left + contentOffset.x);
		relativeY = pageY - (this.element.offset().top + contentOffset.y);
		return {x: relativeX, y: relativeY};
	};

	/**
	 * Calculates absolute page coordinates from relative coordinates
	 * @param elementX
	 * @param elementY
	 * @return {Object}
	 */
	DomElement.prototype.pagePositionFromElementPosition = function(elementX, elementY) {
		var pageX, pageY, contentOffset;
		contentOffset = this.contentOffset();

		pageX = elementX + (this.element.offset().left + contentOffset.x);
		pageY = elementY + (this.element.offset().top + contentOffset.y);
		return {x: pageX, y: pageY};
	};

	/**
	 * Calculates px between element topleft border edge and topleft content egde
	 * @return {Object}
	 */
	DomElement.prototype.contentOffset = function() {
		var borderLeftWidth, paddingLeft, borderTopWidth, paddingTop;

		borderLeftWidth = parseInt(this.element.css('border-left-width'), 10);
		paddingLeft = parseInt(this.element.css('padding-left'), 10);
		borderTopWidth = parseInt(this.element.css('border-top-width'), 10);
		paddingTop = parseInt(this.element.css('padding-top'), 10);

		return {x: borderLeftWidth + paddingLeft, y: borderTopWidth + paddingTop};
	};

	/**
	 * Calculates viewport coordinates from relative coordinates
	 * @param elementX
	 * @param elementY
	 * @return {Object}
	 */
	DomElement.prototype.viewportPositionFromElementPosition = function(elementX, elementY) {
		var viewportX, viewportY, contentOffset;
		contentOffset = this.contentOffset();

		viewportX = elementX + (this.element[0].getBoundingClientRect().left + contentOffset.x);
		viewportY = elementY + (this.element[0].getBoundingClientRect().top + contentOffset.y);
		return {x: viewportX, y: viewportY};
	};

}());