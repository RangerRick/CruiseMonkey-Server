/**
 * @constructor
 */
function Swiper() {
'use strict';

	var self = this,
		hasTouch = 'ontouchstart' in window,
		resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
		startEvent = hasTouch ? 'touchstart' : 'mousedown',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove',
		endEvent = hasTouch ? 'touchend' : 'mouseup',
		cancelEvent = hasTouch ? 'touchcancel' : 'mouseup',
		container = $('#container'),
		w = $(window),

	eventHandler = function(e) {
		'use strict';
		// console.log('e = ' + e.type);
		switch (e.type) {
			case startEvent:
				self.__start(e);
				break;
			case moveEvent:
				self.__move(e);
				break;
			case cancelEvent:
			case endEvent:
				self.__end(e);
				break;
			case resizeEvent:
				self.__resize(e);
				break;
		}
	};

	self.__start = function(e) {
		'use strict';
		console.log('__start: ' + e);
		//e.preventDefault();

		if (self.initiated) return;

		var point = hasTouch ? e.touches[0] : e;

		self.initiated = true;
		self.moved = false;
		self.thresholdExceeded = false;
		self.startX = point.pageX;
		self.startY = point.pageY;
		self.pointX = point.pageX;
		self.pointY = point.pageY;
		self.stepsX = 0;
		self.stepsY = 0;
		self.directionX = 0;
		self.directionLocked = false;

		this.__event('touchstart');
	};
	self.__move = function(e) {
		'use strict';
		if (!self.initiated) return;

		var point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - self.pointX,
			deltaY = point.pageY - self.pointY,
			newX = this.x + deltaX,
			dist = Math.abs(point.pageX - self.startX);

		self.moved = true;
		self.pointX = point.pageX;
		self.pointY = point.pageY;
		self.directionX = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
		self.stepsX += Math.abs(deltaX);
		self.stepsY += Math.abs(deltaY);

		// We take a 10px buffer to figure out the direction of the swipe
		if (self.stepsX < 10 && self.stepsY < 10) {
			return;
		}

		// We are scrolling vertically, so skip SwipeView and give the control back to the browser
		if (!self.directionLocked && self.stepsY > self.stepsX) {
			self.initiated = false;
			return;
		}

		e.preventDefault();

		self.directionLocked = true;

		if (newX > 0 || newX < self.maxX) {
			newX = self.x + (deltaX / 2);
		}

		if (!self.thresholdExceeded && dist >= self.snapThreshold) {
			self.thresholdExceeded = true;
			console.log('__move: thresholdExceeded!  dist = ' + dist + ', threshold = ' + self.snapThreshold);
			self.__event('moveout');
		} else if (self.thresholdExceeded && dist < self.snapThreshold) {
			console.log('__move: thresholdExceeded!  dist = ' + dist + ', threshold = ' + self.snapThreshold);
			self.thresholdExceeded = false;
			self.__event('movein');
		} else {
			console.log('__move: threshold not exceeded.  dist = ' + dist + ', threshold = ' + self.snapThreshold);
		}

		// self.__pos(newX);
	};
	self.__end = function(e) {
		'use strict';
		console.log('__end: ' + e);

		if (!self.initiated) return;

		var point = hasTouch ? e.changedTouches[0] : e,
			dist = Math.abs(point.pageX - self.startX);

		self.initiated = false;

		if (!self.moved) return;

		if (self.x > 0 || self.x < self.maxX) {
			dist = 0;
			console.log('__end: distance (' + self.x + ') was less than max (' + self.maxX + ')');
			self.__event('movein');
		}

		// Check if we exceeded the snap threshold
		if (dist < self.snapThreshold) {
			console.log('__end: distance (' + dist + ') was less than the snap threshold (' + self.snapThreshold + ')');
			self.slider.style[transitionDuration] = Math.floor(300 * dist / self.snapThreshold) + 'ms';
			// self.__pos(-self.page * self.pageWidth);
			return;
		}

		// self.__checkPosition();
	};
	self.__resize = function(e) {
		'use strict';
		console.log('__resize: ' + e);

		self.snapThreshold = Math.round($(window).width() * 0.15);
	};

	self.__event = function(type) {
		'use strict';
		console.log('event fired: ' + type);

		var ev = document.createEvent('Event');
		ev.initEvent('swiper-' + type, true, true);
		w.trigger(ev);
	};

	if (hasTouch) {
		self.__resize();
		w.on(startEvent, eventHandler);
		w.on(moveEvent, eventHandler);
		w.on(endEvent, eventHandler);
		w.on(cancelEvent, eventHandler);
	}
}

var swiper = new Swiper();
(function() {
	'use strict';
	var pageOrder = ['official-events', 'my-events', 'amenities', 'decks'];

	var w = $(window);
	w.on('swiper-moveout', function() {
		'use strict';
		var direction = swiper.directionX,
			currentPage = pageNavigator.getCurrentPage(),
			newPage,
			pageIndex,
			newPageIndex;

		console.log('triggering page change, direction = ' + direction);
		pageIndex = $.inArray(currentPage, pageOrder);
		if (pageIndex != -1) {
			newPageIndex = pageIndex + -swiper.directionX;
			if (newPageIndex < 0 || newPageIndex >= pageOrder.length) {
				console.log('current page ' + currentPage + ' is the first or last page to display!');
			} else {
				console.log('transition from current page: ' + currentPage + ' (' + pageIndex + ') to new page: ' + pageOrder[newPageIndex] + ' (' + newPageIndex + ')');
				navigateTo(pageOrder[newPageIndex]);
			}
		} else {
			console.log('unhandled page: ' + currentPage);
		}
	});
})();
