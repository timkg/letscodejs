window.wwp = window.wwp || {};

(function () {
	/*global $*/
	"use strict";

	/**
	 * Wraps a DOM Element with utility methods
	 * @type {Function}
	 */
	var DomElement = wwp.DomElement = function (browserDomElement) {
		this.element = browserDomElement;
	};

	/**
	 * ---------------------------------------
	 * EVENT TRIGGERING / FIRING / DISPATCHING
	 * ---------------------------------------
	 */

	/**
	 * Triggers a MouseEvent on the element
	 *   Usage: WWPElm.triggerMouse('move', 30, 30)
	 *     -> triggers a mousemove event on the element, at relative coordinates 30,30
	 * @param type
	 * @param event
	 */
	DomElement.prototype.triggerMouse = function(type, elementX, elementY) {
		var event = $.Event('mouse'+type);
		var pagePosition = this.pagePositionFromElementPosition(elementX, elementY);
		event.pageX = pagePosition.x;
		event.pageY = pagePosition.y;
		this.element.trigger(event);
	};

	/**
	 * Triggers a TouchEvent on the element, with a single Touch (point of contact)
	 *   Usage: WWPElm.triggerTouch('start', 30, 30)
	 *     -> triggers a touchstart event on the element, at relative coordinates 30,30
	 * @param type
	 * @param elementX
	 * @param elementY
	 */
	DomElement.prototype.triggerTouch = function(type, elementX, elementY) {
		var touchPoint = this.createTouchPoint(elementX, elementY);
		var touchEvent = createTouchEventObject('touch'+type , new TouchList(touchPoint));
		dispatchTouchEvent(this, touchEvent);
	};

	/**
	 * Triggers a TouchEvent on the element, with two Touches (points of contact)
	 *   Usage: WWPElm.triggerTouch('start', 30, 30, 35, 35)
	 *     -> triggers a touchstart event on the element
	 * @param type
	 * @param elementX1
	 * @param elementY1
	 * @param elementX2
	 * @param elementY2
	 */
	DomElement.prototype.triggerMultiTouch = function(type, elementX1, elementY1, elementX2, elementY2) {
		var touchPoint1 = this.createTouchPoint(elementX1, elementY1);
		var touchPoint2 = this.createTouchPoint(elementX2, elementY2);
		var touchEvent = createTouchEventObject('touch'+type , new TouchList(touchPoint1, touchPoint2));
		dispatchTouchEvent(this, touchEvent);
	};

	/**
	 * Creates a Touch object (point of contact) on the element
	 * @param elementX
	 * @param elementY
	 * @return {Touch}
	 */
	DomElement.prototype.createTouchPoint = function(elementX, elementY) {
		var pagePosition = this.pagePositionFromElementPosition(elementX, elementY);

		return new Touch(
			undefined
			, this.element
			, 0
			, pagePosition.x
			, pagePosition.y
			, 0, 0 // clientX/Y
		);
	};

	/**
	 * Creates a native TouchEvent object
	 * @param type
	 * @param touchList
	 * @return {Event}
	 */
	function createTouchEventObject(type, touchList) {
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
	 * Wraps a native TouchEvent in a jQuery event object and triggers it on the target wwp.DomElement
	 * @param $element
	 * @param touchEvent
	 */
	function dispatchTouchEvent(wwpelm, touchEvent) {
		var jqueryEvent = new $.Event();
		jqueryEvent.type = touchEvent.type;
		jqueryEvent.originalEvent = touchEvent;
		wwpelm.element.trigger(jqueryEvent);
	}

	/**
	 * --------------------------
	 * EVENT LISTENERS / HANDLERS
	 * --------------------------
	 */

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

}());