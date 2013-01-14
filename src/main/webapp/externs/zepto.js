/*
 * Copyright 2011 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Externs for Zepto 1.8.2
 *
 * Note that some functions use different return types depending on the number
 * of parameters passed in. In these cases, you may need to annotate the type
 * of the result in your code, so the JSCompiler understands which type you're
 * expecting. For example:
 *    <code>var elt = /** @type {Element} * / (foo.get(0));</code>
 *
 * @see http://api.jquery.com/
 * @externs
 */

/**
 * @typedef {(Window|Document|Element|Array.<Element>|string|Zepto|
 *     NodeList)}
 */
var ZeptoSelector;

/** @typedef {function(...)|Array.<function(...)>} */
var ZeptoCallback;

/**
 * @constructor
 * @param {(ZeptoSelector|Element|Object|Array.<Element>|Zepto|string|
 *     function())=} arg1
 * @param {(Element|Zepto|Document|
 *     Object.<string, (string|function(!Zepto.event=))>)=} arg2
 * @return {!Zepto}
 */
function Zepto(arg1, arg2) {}

/**
 * @constructor
 * @extends {Zepto}
 * @param {(ZeptoSelector|Element|Object|Array.<Element>|Zepto|string|
 *     function())=} arg1
 * @param {(Element|Zepto|Document|
 *     Object.<string, (string|function(!Zepto.event=))>)=} arg2
 * @return {!Zepto}
 */
function $(arg1, arg2) {}

/**
 * @param {(ZeptoSelector|Array.<Element>|string|Zepto)} arg1
 * @param {Element=} context
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.add = function(arg1, context) {};

/**
 * @param {(string|function(number,String))} arg1
 * @return {!Zepto}
 */
Zepto.prototype.addClass = function(arg1) {};

/**
 * @param {(string|Element|Zepto|function(number))} arg1
 * @param {(string|Element|Array.<Element>|Zepto)=} content
 * @return {!Zepto}
 */
Zepto.prototype.after = function(arg1, content) {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {Object.<string,*>=} settings
 * @return {Zepto.jqXHR}
 */
Zepto.ajax = function(arg1, settings) {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {Object.<string,*>=} settings
 * @return {Zepto.jqXHR}
 */
$.ajax = function(arg1, settings) {};

/**
 * @param {function(!Zepto.event,XMLHttpRequest,Object.<string, *>)} handler
 * @return {!Zepto}
 */
Zepto.prototype.ajaxComplete = function(handler) {};

/**
 * @param {function(!Zepto.event,Zepto.jqXHR,Object.<string, *>,*)} handler
 * @return {!Zepto}
 */
Zepto.prototype.ajaxError = function(handler) {};

/**
 * @param {(string|
 *     function(Object.<string,*>,Object.<string, *>,Zepto.jqXHR))} dataTypes
 * @param {function(Object.<string,*>,Object.<string, *>,Zepto.jqXHR)=} handler
 */
Zepto.ajaxPrefilter = function(dataTypes, handler) {};

/**
 * @param {(string|
 *     function(Object.<string,*>,Object.<string, *>,Zepto.jqXHR))} dataTypes
 * @param {function(Object.<string,*>,Object.<string, *>,Zepto.jqXHR)=} handler
 */
$.ajaxPrefilter = function(dataTypes, handler) {};

/**
 * @param {function(!Zepto.event,Zepto.jqXHR,Object.<string, *>)} handler
 * @return {!Zepto}
 */
Zepto.prototype.ajaxSend = function(handler) {};

/** @const */
Zepto.ajaxSettings = {};

/** @const */
$.ajaxSettings = {};

/** @type {Object.<string, string>} */
Zepto.ajaxSettings.accepts = {};

/** @type {Object.<string, string>} */
$.ajaxSettings.accepts = {};

/** @type {boolean} */
Zepto.ajaxSettings.async;

/** @type {boolean} */
$.ajaxSettings.async;

/** @type {Object.<string, RegExp>} */
Zepto.ajaxSettings.contents = {};

/** @type {Object.<string, RegExp>} */
$.ajaxSettings.contents = {};

/** @type {string} */
Zepto.ajaxSettings.contentType;

/** @type {string} */
$.ajaxSettings.contentType;

/** @type {Object.<string, *>} */
Zepto.ajaxSettings.converters = {};

/** @type {Object.<string, *>} */
$.ajaxSettings.converters = {};

/** @type {Object.<string, boolean>} */
Zepto.ajaxSettings.flatOptions = {};

/** @type {Object.<string, boolean>} */
$.ajaxSettings.flatOptions = {};

/** @type {boolean} */
Zepto.ajaxSettings.global;

/** @type {boolean} */
$.ajaxSettings.global;

/** @type {boolean} */
Zepto.ajaxSettings.isLocal;

/** @type {boolean} */
$.ajaxSettings.isLocal;

/** @type {boolean} */
Zepto.ajaxSettings.processData;

/** @type {boolean} */
$.ajaxSettings.processData;

/** @type {Object.<string, string>} */
Zepto.ajaxSettings.responseFields = {};

/** @type {Object.<string, string>} */
$.ajaxSettings.responseFields = {};

/** @type {boolean} */
Zepto.ajaxSettings.traditional;

/** @type {boolean} */
$.ajaxSettings.traditional;

/** @type {string} */
Zepto.ajaxSettings.type;

/** @type {string} */
$.ajaxSettings.type;

/** @type {string} */
Zepto.ajaxSettings.url;

/** @type {string} */
$.ajaxSettings.url;

/** @return {XMLHttpRequest|ActiveXObject} */
Zepto.ajaxSettings.xhr = function() {};

/** @return {XMLHttpRequest|ActiveXObject} */
$.ajaxSettings.xhr = function() {};

/** @param {Object.<string,*>} options */
Zepto.ajaxSetup = function(options) {};

/** @param {Object.<string,*>} options */
$.ajaxSetup = function(options) {};

/**
 * @param {function()} handler
 * @return {!Zepto}
 */
Zepto.prototype.ajaxStart = function(handler) {};

/**
 * @param {function()} handler
 * @return {!Zepto}
 */
Zepto.prototype.ajaxStop = function(handler) {};

/**
 * @param {function(!Zepto.event,XMLHttpRequest,Object.<string, *>)} handler
 * @return {!Zepto}
 */
Zepto.prototype.ajaxSuccess = function(handler) {};

/**
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.andSelf = function() {};

/**
 * @param {Object.<string,*>} properties
 * @param {(string|number|function()|Object.<string,*>)=} arg2
 * @param {(string|function())=} easing
 * @param {function()=} complete
 * @return {!Zepto}
 */
Zepto.prototype.animate = function(properties, arg2, easing, complete) {};

/**
 * @param {(string|Element|Zepto|function(number,string))} arg1
 * @param {(string|Element|Array.<Element>|Zepto)=} content
 * @return {!Zepto}
 */
Zepto.prototype.append = function(arg1, content) {};

/**
 * @param {(ZeptoSelector|Element|Zepto)} target
 * @return {!Zepto}
 */
Zepto.prototype.appendTo = function(target) {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {(string|number|function(number,string))=} arg2
 * @return {(string|!Zepto)}
 */
Zepto.prototype.attr = function(arg1, arg2) {};

/**
 * @param {(string|Element|Zepto|function())} arg1
 * @param {(string|Element|Array.<Element>|Zepto)=} content
 * @return {!Zepto}
 */
Zepto.prototype.before = function(arg1, content) {};

/**
 * @param {(string|Object.<string, function(!Zepto.event=)>)} arg1
 * @param {(Object.<string, *>|function(!Zepto.event=)|boolean)=} eventData
 * @param {(function(!Zepto.event=)|boolean)=} arg3
 * @return {!Zepto}
 */
Zepto.prototype.bind = function(arg1, eventData, arg3) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.blur = function(arg1, handler) {};

/** @type {boolean} */
Zepto.boxModel;

/** @type {boolean} */
$.boxModel;

/** @type {Object.<string,*>} */
Zepto.browser;

/** @type {Object.<string,*>} */
$.browser;

/**
 * @type {boolean}
 * @const
 */
Zepto.browser.mozilla;

/**
 * @type {boolean}
 * @const
 */
$.browser.mozilla;

/**
 * @type {boolean}
 * @const
 */
Zepto.browser.msie;

/**
 * @type {boolean}
 * @const
 */
$.browser.msie;

/**
 * @type {boolean}
 * @const
 */
Zepto.browser.opera;

/**
 * @type {boolean}
 * @const
 */
$.browser.opera;

/**
 * @deprecated
 * @type {boolean}
 * @const
 */
Zepto.browser.safari;

/**
 * @deprecated
 * @type {boolean}
 * @const
 */
$.browser.safari;

/** @type {string} */
Zepto.browser.version;

/** @type {string} */
$.browser.version;

/**
 * @type {boolean}
 * @const
 */
Zepto.browser.webkit;

/**
 * @type {boolean}
 * @const
 */
$.browser.webkit;

/**
 * @constructor
 * @private
 */
Zepto.callbacks = function () {};

/**
 * @param {string=} flags
 * @return {Zepto.callbacks}
 */
Zepto.Callbacks = function (flags) {};

/** @param {function()} callbacks */
Zepto.callbacks.prototype.add = function(callbacks) {};

/** @return {undefined} */
Zepto.callbacks.prototype.disable = function() {};

/** @return {undefined} */
Zepto.callbacks.prototype.empty = function() {};

/** @param {...*} var_args */
Zepto.callbacks.prototype.fire = function(var_args) {};

/** @return {boolean} */
Zepto.callbacks.prototype.fired = function() {};

/** @param {...*} var_args */
Zepto.callbacks.prototype.fireWith = function(var_args) {};

/**
 * @param {function()} callback
 * @return {boolean}
 * @nosideeffects
 */
Zepto.callbacks.prototype.has = function(callback) {};

/** @return {undefined} */
Zepto.callbacks.prototype.lock = function() {};

/** @return {boolean} */
Zepto.callbacks.prototype.locked = function() {};

/** @param {function()} callbacks */
Zepto.callbacks.prototype.remove = function(callbacks) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.change = function(arg1, handler) {};

/**
 * @param {ZeptoSelector=} selector
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.children = function(selector) {};

/**
 * @param {string=} queueName
 * @return {!Zepto}
 */
Zepto.prototype.clearQueue = function(queueName) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.click = function(arg1, handler) {};

/**
 * @param {boolean=} withDataAndEvents
 * @param {boolean=} deepWithDataAndEvents
 * @return {!Zepto}
 * @suppress {checkTypes} see issue 583
 */
Zepto.prototype.clone = function(withDataAndEvents, deepWithDataAndEvents) {};

/**
 * @param {(ZeptoSelector|Zepto|Element|string|Array.<string>)} arg1
 * @param {Element=} context
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.closest = function(arg1, context) {};

/**
 * @param {Element} container
 * @param {Element} contained
 * @return {boolean}
 */
Zepto.contains = function(container, contained) {};

/**
 * @param {Element} container
 * @param {Element} contained
 * @return {boolean}
 */
$.contains = function(container, contained) {};

/**
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.contents = function() {};

/** @type {Element} */
Zepto.prototype.context;

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {(string|number|function(number,*))=} arg2
 * @return {(string|!Zepto)}
 */
Zepto.prototype.css = function(arg1, arg2) {};

/** @type {Object.<string, *>} */
Zepto.cssHooks;

/** @type {Object.<string, *>} */
$.cssHooks;

/**
 * @param {Element} elem
 * @param {string=} key
 * @param {*=} value
 * @return {*}
 */
Zepto.data = function(elem, key, value) {};

/**
 * @param {(string|Object.<string, *>)=} arg1
 * @param {*=} value
 * @return {*}
 */
Zepto.prototype.data = function(arg1, value) {};

/**
 * @param {Element} elem
 * @param {string=} key
 * @param {*=} value
 * @return {*}
 */
$.data = function(elem, key, value) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.dblclick = function(arg1, handler) {};

/**
 * @constructor
 * @implements {Zepto.Promise}
 * @param {function()=} opt_fn
 * @see http://api.jquery.com/category/deferred-object/
 */
Zepto.deferred = function(opt_fn) {};

/**
 * @constructor
 * @extends {Zepto.deferred}
 * @param {function()=} opt_fn
 * @return {Zepto.Deferred}
 */
Zepto.Deferred = function(opt_fn) {};

/**
 * @constructor
 * @extends {Zepto.deferred}
 * @param {function()=} opt_fn
 * @see http://api.jquery.com/category/deferred-object/
 */
$.deferred = function(opt_fn) {};

/**
 * @constructor
 * @extends {Zepto.deferred}
 * @param {function()=} opt_fn
 * @return {Zepto.deferred}
 */
$.Deferred = function(opt_fn) {};

/**
 * @override
 * @param {ZeptoCallback} alwaysCallbacks
 * @param {ZeptoCallback=} alwaysCallbacks2
 * @return {Zepto.deferred}
 */
Zepto.deferred.prototype.always
    = function(alwaysCallbacks, alwaysCallbacks2) {};

/**
 * @override
 * @param {ZeptoCallback} doneCallbacks
 * @param {ZeptoCallback=} doneCallbacks2
 * @return {Zepto.deferred}
 */
Zepto.deferred.prototype.done = function(doneCallbacks, doneCallbacks2) {};

/**
 * @override
 * @param {ZeptoCallback} failCallbacks
 * @param {ZeptoCallback=} failCallbacks2
 * @return {Zepto.deferred}
 */
Zepto.deferred.prototype.fail = function(failCallbacks, failCallbacks2) {};

/**
 * @param {...*} var_args
 * @return {Zepto.deferred}
 */
Zepto.deferred.prototype.notify = function(var_args) {};

/**
 * @param {Object} context
 * @param {...*} var_args
 * @return {Zepto.deferred}
 */
Zepto.deferred.prototype.notifyWith = function(context, var_args) {};

/**
 * @override
 * @param {function()=} doneFilter
 * @param {function()=} failFilter
 * @param {function()=} progressFilter
 * @return {Zepto.Promise}
 */
Zepto.deferred.prototype.pipe
    = function(doneFilter, failFilter, progressFilter) {};

/**
 * @param {function()} progressCallbacks
 * @return {Zepto.deferred}
 */
Zepto.deferred.prototype.progress = function(progressCallbacks) {};

/**
 * @param {Object=} target
 * @return {Zepto.Promise}
 */
Zepto.deferred.prototype.promise = function(target) {};

/**
 * @param {...*} var_args
 * @return {Zepto.deferred}
 */
Zepto.deferred.prototype.reject = function(var_args) {};

/**
 * @param {Object} context
 * @param {Array.<*>=} args
 * @return {Zepto.deferred}
 */
Zepto.deferred.prototype.rejectWith = function(context, args) {};

/**
 * @param {...*} var_args
 * @return {Zepto.deferred}
 */
Zepto.deferred.prototype.resolve = function(var_args) {};

/**
 * @param {Object} context
 * @param {Array.<*>=} args
 * @return {Zepto.deferred}
 */
Zepto.deferred.prototype.resolveWith = function(context, args) {};

/** @return {string} */
Zepto.deferred.prototype.state = function() {};

/**
 * @override
 * @param {ZeptoCallback} doneCallbacks
 * @param {ZeptoCallback=} failCallbacks
 * @param {ZeptoCallback=} progressCallbacks
 * @return {Zepto.deferred}
 */
Zepto.deferred.prototype.then
    = function(doneCallbacks, failCallbacks, progressCallbacks) {};

/**
 * @param {number} duration
 * @param {string=} queueName
 * @return {!Zepto}
 */
Zepto.prototype.delay = function(duration, queueName) {};

/**
 * @param {string} selector
 * @param {(string|Object.<string,*>)} arg2
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg3
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.delegate = function(selector, arg2, arg3, handler) {};

/**
 * @param {Element} elem
 * @param {string=} queueName
 */
Zepto.dequeue = function(elem, queueName) {};

/**
 * @param {string=} queueName
 * @return {!Zepto}
 */
Zepto.prototype.dequeue = function(queueName) {};

/**
 * @param {Element} elem
 * @param {string=} queueName
 */
$.dequeue = function(elem, queueName) {};

/**
 * @param {ZeptoSelector=} selector
 * @return {!Zepto}
 */
Zepto.prototype.detach = function(selector) {};

/**
 * @deprecated
 * @param {(string|Object.<string,*>)=} arg1
 * @param {string=} handler
 * @return {!Zepto}
 */
Zepto.prototype.die = function(arg1, handler) {};

/**
 * @param {Object} collection
 * @param {function(number,?)} callback
 * @return {Object}
 */
Zepto.each = function(collection, callback) {};

/**
 * @param {function(number,Element)} fnc
 * @return {!Zepto}
 */
Zepto.prototype.each = function(fnc) {};

/**
 * @param {Object} collection
 * @param {function(number,?)} callback
 * @return {Object}
 */
$.each = function(collection, callback) {};

/** @return {!Zepto} */
Zepto.prototype.empty = function() {};

/**
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.end = function() {};

/**
 * @param {number} arg1
 * @return {!Zepto}
 */
Zepto.prototype.eq = function(arg1) {};

/** @param {string} message */
Zepto.error = function(message) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.error = function(arg1, handler) {};

/** @param {string} message */
$.error = function(message) {};

/**
 * @constructor
 * @param {string} eventType
 */
Zepto.event = function(eventType) {};

/**
 * @constructor
 * @extends {Zepto.event}
 * @param {string} eventType
 * @param {Object=} properties
 * @return {Zepto.Event}
 */
Zepto.Event = function(eventType, properties) {};

/**
 * @constructor
 * @extends {Zepto.event}
 * @param {string} eventType
 */
$.event = function(eventType) {};

/**
 * @constructor
 * @extends {Zepto.event}
 * @param {string} eventType
 * @param {Object=} properties
 * @return {$.Event}
 */
$.Event = function(eventType, properties) {};

/** @type {Element} */
Zepto.event.prototype.currentTarget;

/** @type {Object.<string, *>} */
Zepto.event.prototype.data;

/** @type {Element} */
Zepto.event.prototype.delegateTarget;

/**
 * @return {boolean}
 * @nosideeffects
 */
Zepto.event.prototype.isDefaultPrevented = function() {};

/**
 * @return {boolean}
 * @nosideeffects
 */
Zepto.event.prototype.isImmediatePropagationStopped = function() {};

/**
 * @return {boolean}
 * @nosideeffects
 */
Zepto.event.prototype.isPropagationStopped = function() {};

/** @type {string} */
Zepto.event.prototype.namespace;

/** @type {Event} */
Zepto.event.prototype.originalEvent;

/** @type {number} */
Zepto.event.prototype.pageX;

/** @type {number} */
Zepto.event.prototype.pageY;

/** @return {undefined} */
Zepto.event.prototype.preventDefault = function() {};

/** @type {Object.<string, *>} */
Zepto.event.prototype.props;

/** @type {Element} */
Zepto.event.prototype.relatedTarget;

/** @type {*} */
Zepto.event.prototype.result;

/** @return {undefined} */
Zepto.event.prototype.stopImmediatePropagation = function() {};

/** @return {undefined} */
Zepto.event.prototype.stopPropagation = function() {};

/** @type {Element} */
Zepto.event.prototype.target;

/** @type {number} */
Zepto.event.prototype.timeStamp;

/** @type {string} */
Zepto.event.prototype.type;

/** @type {number} */
Zepto.event.prototype.which;

/**
 * @param {(Object|boolean)} arg1
 * @param {...*} var_args
 * @return {Object}
 */
Zepto.extend = function(arg1, var_args) {};

/**
 * @param {(Object|boolean)} arg1
 * @param {...*} var_args
 * @return {Object}
 */
Zepto.prototype.extend = function(arg1, var_args) {};

/**
 * @param {(Object|boolean)} arg1
 * @param {...*} var_args
 * @return {Object}
 */
$.extend = function(arg1, var_args) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!Zepto}
 */
Zepto.prototype.fadeIn = function(duration, arg2, callback) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!Zepto}
 */
Zepto.prototype.fadeOut = function(duration, arg2, callback) {};

/**
 * @param {(string|number)} duration
 * @param {number} opacity
 * @param {(function()|string)=} arg3
 * @param {function()=} callback
 * @return {!Zepto}
 */
Zepto.prototype.fadeTo = function(duration, opacity, arg3, callback) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(string|function())=} easing
 * @param {function()=} callback
 * @return {!Zepto}
 */
Zepto.prototype.fadeToggle = function(duration, easing, callback) {};

/**
 * @param {(ZeptoSelector|function(number)|Element|Zepto)} arg1
 * @return {!Zepto}
 */
Zepto.prototype.filter = function(arg1) {};

/**
 * @param {(ZeptoSelector|Zepto|Element)} arg1
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.find = function(arg1) {};

/** @return {!Zepto} */
Zepto.prototype.first = function() {};

/** @see http://docs.jquery.com/Plugins/Authoring */
Zepto.fn;

/** @see http://docs.jquery.com/Plugins/Authoring */
$.fn;

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.focus = function(arg1, handler) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.focusin = function(arg1, handler) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.focusout = function(arg1, handler) {};

/** @const */
Zepto.fx = {};

/** @const */
$.fx = {};

/** @type {number} */
Zepto.fx.interval;

/** @type {number} */
$.fx.interval;

/** @type {boolean} */
Zepto.fx.off;

/** @type {boolean} */
$.fx.off;

/**
 * @param {string} url
 * @param {(Object.<string,*>|string|
 *     function(string,string,Zepto.jqXHR))=} data
 * @param {(function(string,string,Zepto.jqXHR)|string)=} success
 * @param {string=} dataType
 * @return {Zepto.jqXHR}
 */
Zepto.get = function(url, data, success, dataType) {};

/**
 * @param {number=} index
 * @return {(Element|Array.<Element>)}
 * @nosideeffects
 */
Zepto.prototype.get = function(index) {};

/**
 * @param {string} url
 * @param {(Object.<string,*>|string|
 *     function(string,string,Zepto.jqXHR))=} data
 * @param {(function(string,string,Zepto.jqXHR)|string)=} success
 * @param {string=} dataType
 * @return {Zepto.jqXHR}
 */
$.get = function(url, data, success, dataType) {};

/**
 * @param {string} url
 * @param {(Object.<string,*>|function(string,string,Zepto.jqXHR))=} data
 * @param {function(string,string,Zepto.jqXHR)=} success
 * @return {Zepto.jqXHR}
 */
Zepto.getJSON = function(url, data, success) {};

/**
 * @param {string} url
 * @param {(Object.<string,*>|function(string,string,Zepto.jqXHR))=} data
 * @param {function(string,string,Zepto.jqXHR)=} success
 * @return {Zepto.jqXHR}
 */
$.getJSON = function(url, data, success) {};

/**
 * @param {string} url
 * @param {function(Node,string,Zepto.jqXHR)=} success
 * @return {Zepto.jqXHR}
 */
Zepto.getScript = function(url, success) {};

/**
 * @param {string} url
 * @param {function(Node,string,Zepto.jqXHR)=} success
 * @return {Zepto.jqXHR}
 */
$.getScript = function(url, success) {};

/** @param {string} code */
Zepto.globalEval = function(code) {};

/** @param {string} code */
$.globalEval = function(code) {};

/**
 * @param {Array.<*>} arr
 * @param {function(*,number)} fnc
 * @param {boolean=} invert
 * @return {Array.<*>}
 */
Zepto.grep = function(arr, fnc, invert) {};

/**
 * @param {Array.<*>} arr
 * @param {function(*,number)} fnc
 * @param {boolean=} invert
 * @return {Array.<*>}
 */
$.grep = function(arr, fnc, invert) {};

/**
 * @param {(string|Element)} arg1
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.has = function(arg1) {};

/**
 * @param {string} className
 * @return {boolean}
 * @nosideeffects
 */
Zepto.prototype.hasClass = function(className) {};

/**
 * @param {Element} elem
 * @return {boolean}
 * @nosideeffects
 */
Zepto.hasData = function(elem) {};

/**
 * @param {Element} elem
 * @return {boolean}
 * @nosideeffects
 */
$.hasData = function(elem) {};

/**
 * @param {(string|number|function(number,number))=} arg1
 * @return {(number|!Zepto)}
 */
Zepto.prototype.height = function(arg1) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!Zepto}
 */
Zepto.prototype.hide = function(duration, arg2, callback) {};

/** @param {boolean} hold */
Zepto.holdReady = function(hold) {};

/** @param {boolean} hold */
$.holdReady = function(hold) {};

/**
 * @param {function(!Zepto.event=)} arg1
 * @param {function(!Zepto.event=)=} handlerOut
 * @return {!Zepto}
 */
Zepto.prototype.hover = function(arg1, handlerOut) {};

/**
 * @param {(string|function(number,string))=} arg1
 * @return {(string|!Zepto)}
 */
Zepto.prototype.html = function(arg1) {};

/**
 * @param {*} value
 * @param {Array.<*>} arr
 * @param {number=} fromIndex
 * @return {number}
 * @nosideeffects
 */
Zepto.inArray = function(value, arr, fromIndex) {};

/**
 * @param {*} value
 * @param {Array.<*>} arr
 * @param {number=} fromIndex
 * @return {number}
 * @nosideeffects
 */
$.inArray = function(value, arr, fromIndex) {};

/**
 * @param {(ZeptoSelector|Element|Zepto)=} arg1
 * @return {number}
 */
Zepto.prototype.index = function(arg1) {};

/**
 * @return {number}
 * @nosideeffects
 */
Zepto.prototype.innerHeight = function() {};

/**
 * @return {number}
 * @nosideeffects
 */
Zepto.prototype.innerWidth = function() {};

/**
 * @param {(ZeptoSelector|Element|Zepto)} target
 * @return {!Zepto}
 */
Zepto.prototype.insertAfter = function(target) {};

/**
 * @param {(ZeptoSelector|Element|Zepto)} target
 * @return {!Zepto}
 */
Zepto.prototype.insertBefore = function(target) {};

/**
 * @param {(ZeptoSelector|function(number)|Zepto|Element)} arg1
 * @return {boolean}
 */
Zepto.prototype.is = function(arg1) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
Zepto.isArray = function(obj) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
$.isArray = function(obj) {};

/**
 * @param {Object} obj
 * @return {boolean}
 * @nosideeffects
 */
Zepto.isEmptyObject = function(obj) {};

/**
 * @param {Object} obj
 * @return {boolean}
 * @nosideeffects
 */
$.isEmptyObject = function(obj) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
Zepto.isFunction = function(obj) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
$.isFunction = function(obj) {};

/**
 * @param {*} value
 * @return {boolean}
 * @nosideeffects
 */
Zepto.isNumeric = function(value) {};

/**
 * @param {*} value
 * @return {boolean}
 * @nosideeffects
 */
$.isNumeric = function(value) {};

/**
 * @param {Object} obj
 * @return {boolean}
 * @nosideeffects
 */
Zepto.isPlainObject = function(obj) {};

/**
 * @param {Object} obj
 * @return {boolean}
 * @nosideeffects
 */
$.isPlainObject = function(obj) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
Zepto.isWindow = function(obj) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
$.isWindow = function(obj) {};

/**
 * @param {Element} node
 * @return {boolean}
 * @nosideeffects
 */
Zepto.isXMLDoc = function(node) {};

/**
 * @param {Element} node
 * @return {boolean}
 * @nosideeffects
 */
$.isXMLDoc = function(node) {};

/** @type {string} */
Zepto.prototype.jquery;

/**
 * @constructor
 * @extends {XMLHttpRequest}
 * @implements {Zepto.Promise}
 * @private
 * @see http://api.jquery.com/Zepto.ajax/#jqXHR
 */
Zepto.jqXHR = function () {};

/**
 * @override
 * @param {ZeptoCallback} alwaysCallbacks
 * @param {ZeptoCallback=} alwaysCallbacks2
 * @return {Zepto.jqXHR}
 */
Zepto.jqXHR.prototype.always =
    function(alwaysCallbacks, alwaysCallbacks2) {};

/**
 * @deprecated
 * @param {function()} callback
 * @return {Zepto.jqXHR}
*/
Zepto.jqXHR.prototype.complete = function (callback) {};

/**
 * @override
 * @param {ZeptoCallback} doneCallbacks
 * @return {Zepto.jqXHR}
 */
Zepto.jqXHR.prototype.done = function(doneCallbacks) {};

/**
 * @param {function()} callback
 * @return {Zepto.jqXHR}
*/
Zepto.jqXHR.prototype.error = function (callback) {};

/**
 * @override
 * @param {ZeptoCallback} failCallbacks
 * @return {Zepto.jqXHR}
 */
Zepto.jqXHR.prototype.fail = function(failCallbacks) {};

/**
 * @deprecated
 * @override
 */
Zepto.jqXHR.prototype.onreadystatechange = function (callback) {};

/**
 * @param {function()=} doneFilter
 * @param {function()=} failFilter
 * @param {function()=} progressFilter
 * @return {Zepto.jqXHR}
 */
Zepto.jqXHR.prototype.pipe =
    function(doneFilter, failFilter, progressFilter) {};

/**
 * @deprecated
 * @param {function()} callback
 * @return {Zepto.jqXHR}
*/
Zepto.jqXHR.prototype.success = function (callback) {};

/**
 * @override
 * @param {ZeptoCallback} doneCallbacks
 * @param {ZeptoCallback=} failCallbacks
 * @param {ZeptoCallback=} progressCallbacks
 * @return {Zepto.jqXHR}
 */
Zepto.jqXHR.prototype.then =
    function(doneCallbacks, failCallbacks, progressCallbacks) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.keydown = function(arg1, handler) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.keypress = function(arg1, handler) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.keyup = function(arg1, handler) {};

/** @return {!Zepto} */
Zepto.prototype.last = function() {};

/** @type {number} */
Zepto.prototype.length;

/**
 * @deprecated
 * @param {(string|Object)} arg1
 * @param {(function(!Zepto.event=)|Object)=} arg2
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.live = function(arg1, arg2, handler) {};

/**
 * @deprecated
 * @param {(function(!Zepto.event=)|Object.<string, *>|string)} arg1
 * @param {(function(!Zepto.event=)|Object.<string,*>|string)=} arg2
 * @param {function(string,string,XMLHttpRequest)=} complete
 * @return {!Zepto}
 */
Zepto.prototype.load = function(arg1, arg2, complete) {};

/**
 * @param {*} obj
 * @return {Array.<*>}
 */
Zepto.makeArray = function(obj) {};

/**
 * @param {*} obj
 * @return {Array.<*>}
 */
$.makeArray = function(obj) {};

/**
 * @param {(Array.<*>|Object.<string, *>)} arg1
 * @param {(function(*,number)|function(*,(string|number)))} callback
 * @return {Array.<*>}
 */
Zepto.map = function(arg1, callback) {};

/**
 * @param {function(number,Element)} callback
 * @return {!Zepto}
 */
Zepto.prototype.map = function(callback) {};

/**
 * @param {(Array.<*>|Object.<string, *>)} arg1
 * @param {(function(*,number)|function(*,(string|number)))} callback
 * @return {Array.<*>}
 */
$.map = function(arg1, callback) {};

/**
 * @param {Array.<*>} first
 * @param {Array.<*>} second
 * @return {Array.<*>}
 */
Zepto.merge = function(first, second) {};

/**
 * @param {Array.<*>} first
 * @param {Array.<*>} second
 * @return {Array.<*>}
 */
$.merge = function(first, second) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.mousedown = function(arg1, handler) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.mouseenter = function(arg1, handler) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.mouseleave = function(arg1, handler) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.mousemove = function(arg1, handler) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.mouseout = function(arg1, handler) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.mouseover = function(arg1, handler) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.mouseup = function(arg1, handler) {};

/**
 * @param {ZeptoSelector=} selector
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.next = function(selector) {};

/**
 * @param {string=} selector
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.nextAll = function(selector) {};

/**
 * @param {(ZeptoSelector|Element)=} arg1
 * @param {ZeptoSelector=} filter
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.nextUntil = function(arg1, filter) {};

/**
 * @param {boolean=} removeAll
 * @return {Object}
 */
Zepto.noConflict = function(removeAll) {};

/**
 * @param {boolean=} removeAll
 * @return {Object}
 */
$.noConflict = function(removeAll) {};

/**
 * @return {function()}
 * @nosideeffects
 */
Zepto.noop = function() {};

/**
 * @return {function()}
 * @nosideeffects
 */
$.noop = function() {};

/**
 * @param {(ZeptoSelector|Array.<Element>|function(number)|Zepto)} arg1
 * @return {!Zepto}
 */
Zepto.prototype.not = function(arg1) {};

/**
 * @return {number}
 * @nosideeffects
 */
Zepto.now = function() {};

/**
 * @return {number}
 * @nosideeffects
 */
$.now = function() {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {(string|function(!Zepto.event=))=} selector
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.off = function(arg1, selector, handler) {};

/**
 * @param {({left:number,top:number}|
 *     function(number,{top:number,left:number}))=} arg1
 * @return {({left:number,top:number}|!Zepto)}
 */
Zepto.prototype.offset = function(arg1) {};

/**
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.offsetParent = function() {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {*=} selector
 * @param {*=} data
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.on = function(arg1, selector, data, handler) {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {*=} arg2
 * @param {*=} arg3
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.one = function(arg1, arg2, arg3, handler) {};

/**
 * @param {boolean=} includeMargin
 * @return {number}
 * @nosideeffects
 */
Zepto.prototype.outerHeight = function(includeMargin) {};

/**
 * @param {boolean=} includeMargin
 * @return {number}
 * @nosideeffects
 */
Zepto.prototype.outerWidth = function(includeMargin) {};

/**
 * @param {(Object.<string, *>|Array.<Object.<string, *>>)} obj
 * @param {boolean=} traditional
 * @return {string}
 */
Zepto.param = function(obj, traditional) {};

/**
 * @param {(Object.<string, *>|Array.<Object.<string, *>>)} obj
 * @param {boolean=} traditional
 * @return {string}
 */
$.param = function(obj, traditional) {};

/**
 * @param {ZeptoSelector=} selector
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.parent = function(selector) {};

/**
 * @param {ZeptoSelector=} selector
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.parents = function(selector) {};

/**
 * @param {(ZeptoSelector|Element)=} arg1
 * @param {ZeptoSelector=} filter
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.parentsUntil = function(arg1, filter) {};

/**
 * @param {string} json
 * @return {Object.<string, *>}
 */
Zepto.parseJSON = function(json) {};

/**
 * @param {string} json
 * @return {Object.<string, *>}
 */
$.parseJSON = function(json) {};

/**
 * @param {string} data
 * @return {Document}
 */
Zepto.parseXML = function(data) {};

/**
 * @param {string} data
 * @return {Document}
 */
$.parseXML = function(data) {};

/**
 * @return {{left:number,top:number}}
 * @nosideeffects
 */
Zepto.prototype.position = function() {};

/**
 * @param {string} url
 * @param {(Object.<string,*>|string|
 *     function(string,string,Zepto.jqXHR))=} data
 * @param {(function(string,string,Zepto.jqXHR)|string)=} success
 * @param {string=} dataType
 * @return {Zepto.jqXHR}
 */
Zepto.post = function(url, data, success, dataType) {};

/**
 * @param {string} url
 * @param {(Object.<string,*>|string|
 *     function(string,string,Zepto.jqXHR))=} data
 * @param {(function(string,string,Zepto.jqXHR)|string)=} success
 * @param {string=} dataType
 * @return {Zepto.jqXHR}
 */
$.post = function(url, data, success, dataType) {};

/**
 * @param {(string|Element|Zepto|function(number,string))} arg1
 * @param {(string|Element|Zepto)=} content
 * @return {!Zepto}
 */
Zepto.prototype.prepend = function(arg1, content) {};

/**
 * @param {(ZeptoSelector|Element|Zepto)} target
 * @return {!Zepto}
 */
Zepto.prototype.prependTo = function(target) {};

/**
 * @param {ZeptoSelector=} selector
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.prev = function(selector) {};

/**
 * @param {ZeptoSelector=} selector
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.prevAll = function(selector) {};

/**
 * @param {(ZeptoSelector|Element)=} arg1
 * @param {ZeptoSelector=} filter
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.prevUntil = function(arg1, filter) {};

/**
 * @param {(string|Object)=} type
 * @param {Object=} target
 * @return {Zepto.Promise}
 */
Zepto.prototype.promise = function(type, target) {};

/**
 * @interface
 * @private
 * @see http://api.jquery.com/Types/#Promise
 */
Zepto.Promise = function () {};

/**
 * @param {ZeptoCallback} alwaysCallbacks
 * @param {ZeptoCallback=} alwaysCallbacks2
 * @return {Zepto.Promise}
 */
Zepto.Promise.prototype.always =
    function(alwaysCallbacks, alwaysCallbacks2) {};

/**
 * @param {ZeptoCallback} doneCallbacks
 * @return {Zepto.Promise}
 */
Zepto.Promise.prototype.done = function(doneCallbacks) {};

/**
 * @param {ZeptoCallback} failCallbacks
 * @return {Zepto.Promise}
 */
Zepto.Promise.prototype.fail = function(failCallbacks) {};

/**
 * @param {function()=} doneFilter
 * @param {function()=} failFilter
 * @param {function()=} progressFilter
 * @return {Zepto.Promise}
 */
Zepto.Promise.prototype.pipe =
    function(doneFilter, failFilter, progressFilter) {};

/**
 * @param {ZeptoCallback} doneCallbacks
 * @param {ZeptoCallback=} failCallbacks
 * @param {ZeptoCallback=} progressCallbacks
 * @return {Zepto.Promise}
 */
Zepto.Promise.prototype.then =
    function(doneCallbacks, failCallbacks, progressCallbacks) {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {(string|number|boolean|function(number,String))=} arg2
 * @return {(string|!Zepto)}
 */
Zepto.prototype.prop = function(arg1, arg2) {};

/**
 * @param {...*} var_args
 * @return {function()}
 */
Zepto.proxy = function(var_args) {};

/**
 * @param {...*} var_args
 * @return {function()}
 */
$.proxy = function(var_args) {};

/**
 * @param {Array.<Element>} elements
 * @param {string=} name
 * @param {Array.<*>=} args
 * @return {!Zepto}
 */
Zepto.prototype.pushStack = function(elements, name, args) {};

/**
 * @param {(string|Array.<function()>|function(function()))=} queueName
 * @param {(Array.<function()>|function(function()))=} arg2
 * @return {(Array.<Element>|!Zepto)}
 */
Zepto.prototype.queue = function(queueName, arg2) {};

/**
 * @param {Element} elem
 * @param {string=} queueName
 * @param {(Array.<function()>|function())=} arg3
 * @return {(Array.<Element>|!Zepto)}
 */
Zepto.queue = function(elem, queueName, arg3) {};

/**
 * @param {Element} elem
 * @param {string=} queueName
 * @param {(Array.<function()>|function())=} arg3
 * @return {(Array.<Element>|!Zepto)}
 */
$.queue = function(elem, queueName, arg3) {};

/**
 * @param {function()} handler
 * @return {!Zepto}
 */
Zepto.prototype.ready = function(handler) {};

/**
 * @param {string=} selector
 * @return {!Zepto}
 */
Zepto.prototype.remove = function(selector) {};

/**
 * @param {string} attributeName
 * @return {!Zepto}
 */
Zepto.prototype.removeAttr = function(attributeName) {};

/**
 * @param {(string|function(number,string))=} arg1
 * @return {!Zepto}
 */
Zepto.prototype.removeClass = function(arg1) {};

/**
 * @param {(string|Array.<string>)=} arg1
 * @return {!Zepto}
 */
Zepto.prototype.removeData = function(arg1) {};

/**
 * @param {Element} elem
 * @param {string=} name
 * @return {!Zepto}
 */
Zepto.removeData = function(elem, name) {};

/**
 * @param {Element} elem
 * @param {string=} name
 * @return {!Zepto}
 */
$.removeData = function(elem, name) {};

/**
 * @param {string} propertyName
 * @return {!Zepto}
 */
Zepto.prototype.removeProp = function(propertyName) {};

/**
 * @param {ZeptoSelector} target
 * @return {!Zepto}
 */
Zepto.prototype.replaceAll = function(target) {};

/**
 * @param {(string|Element|Zepto|function())} arg1
 * @return {!Zepto}
 */
Zepto.prototype.replaceWith = function(arg1) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.resize = function(arg1, handler) {};

/**
 * @return {string}
 * @nosideeffects
 */
Zepto.prototype.reveal = function() {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.scroll = function(arg1, handler) {};

/**
 * @param {number=} value
 * @return {(number|!Zepto)}
 */
Zepto.prototype.scrollLeft = function(value) {};

/**
 * @param {number=} value
 * @return {(number|!Zepto)}
 */
Zepto.prototype.scrollTop = function(value) {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.select = function(arg1, handler) {};

/**
 * @return {string}
 * @nosideeffects
 */
Zepto.prototype.serialize = function() {};

/**
 * @return {Array.<Object.<string, *>>}
 * @nosideeffects
 */
Zepto.prototype.serializeArray = function() {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!Zepto}
 */
Zepto.prototype.show = function(duration, arg2, callback) {};

/**
 * @param {ZeptoSelector=} selector
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.prototype.siblings = function(selector) {};

/**
 * @deprecated
 * @return {number}
 * @nosideeffects
 */
Zepto.prototype.size = function() {};

/**
 * @param {number} start
 * @param {number=} end
 * @return {!Zepto}
 */
Zepto.prototype.slice = function(start, end) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!Zepto}
 */
Zepto.prototype.slideDown = function(duration, arg2, callback) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!Zepto}
 */
Zepto.prototype.slideToggle = function(duration, arg2, callback) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!Zepto}
 */
Zepto.prototype.slideUp = function(duration, arg2, callback) {};

/**
 * @param {(boolean|string)=} arg1
 * @param {boolean=} arg2
 * @param {boolean=} jumpToEnd
 * @return {!Zepto}
 */
Zepto.prototype.stop = function(arg1, arg2, jumpToEnd) {};

/**
 * @deprecated
 * @return {!Zepto}
 * @nosideeffects
 */
Zepto.sub = function() {};

/**
 * @deprecated
 * @return {!Zepto}
 * @nosideeffects
 */
$.sub = function() {};

/**
 * @param {(function(!Zepto.event=)|Object.<string, *>)=} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.submit = function(arg1, handler) {};

/** @type {Object.<string, *>} */
Zepto.support;

/** @type {Object.<string, *>} */
$.support;

/** @type {boolean} */
Zepto.support.boxModel;

/** @type {boolean} */
$.support.boxModel;

/** @type {boolean} */
Zepto.support.changeBubbles;

/** @type {boolean} */
$.support.changeBubbles;

/** @type {boolean} */
Zepto.support.cssFloat;

/** @type {boolean} */
$.support.cssFloat;

/** @type {boolean} */
Zepto.support.fixedPosition;

/** @type {boolean} */
$.support.fixedPosition;

/** @type {boolean} */
Zepto.support.hrefNormalized;

/** @type {boolean} */
$.support.hrefNormalized;

/** @type {boolean} */
Zepto.support.htmlSerialize;

/** @type {boolean} */
$.support.htmlSerialize;

/** @type {boolean} */
Zepto.support.leadingWhitespace;

/** @type {boolean} */
$.support.leadingWhitespace;

/** @type {boolean} */
Zepto.support.noCloneEvent;

/** @type {boolean} */
$.support.noCloneEvent;

/** @type {boolean} */
Zepto.support.opacity;

/** @type {boolean} */
$.support.opacity;

/** @type {boolean} */
Zepto.support.scriptEval;

/** @type {boolean} */
$.support.scriptEval;

/** @type {boolean} */
Zepto.support.style;

/** @type {boolean} */
$.support.style;

/** @type {boolean} */
Zepto.support.submitBubbles;

/** @type {boolean} */
$.support.submitBubbles;

/** @type {boolean} */
Zepto.support.tbody;

/** @type {boolean} */
$.support.tbody;

/**
 * @param {(string|function(number,string))=} arg1
 * @return {(string|!Zepto)}
 */
Zepto.prototype.text = function(arg1) {};

/**
 * @return {Array.<Element>}
 * @nosideeffects
 */
Zepto.prototype.toArray = function() {};

/**
 * @deprecated
 * @param {(function(!Zepto.event=)|string|number|function()|boolean)=} arg1
 * @param {(function(!Zepto.event=)|function()|string)=} arg2
 * @param {(function(!Zepto.event=)|function())=} arg3
 * @return {!Zepto}
 */
Zepto.prototype.toggle = function(arg1, arg2, arg3) {};

/**
 * @param {(string|boolean|function(number,string,boolean))=} arg1
 * @param {boolean=} flag
 * @return {!Zepto}
 */
Zepto.prototype.toggleClass = function(arg1, flag) {};

/**
 * @param {(string|Zepto.event)} arg1
 * @param {...*} var_args
 * @return {!Zepto}
 */
Zepto.prototype.trigger = function(arg1, var_args) {};

/**
 * @param {string} eventType
 * @param {Array.<*>=} extraParameters
 * @return {*}
 */
Zepto.prototype.triggerHandler = function(eventType, extraParameters) {};

/**
 * @param {string} str
 * @return {string}
 * @nosideeffects
 */
Zepto.trim = function(str) {};

/**
 * @param {string} str
 * @return {string}
 * @nosideeffects
 */
$.trim = function(str) {};

/**
 * @param {*} obj
 * @return {string}
 * @nosideeffects
 */
Zepto.type = function(obj) {};

/**
 * @param {*} obj
 * @return {string}
 * @nosideeffects
 */
$.type = function(obj) {};

/**
 * @param {(string|function(!Zepto.event=)|Zepto.event)=} arg1
 * @param {(function(!Zepto.event=)|boolean)=} arg2
 * @return {!Zepto}
 */
Zepto.prototype.unbind = function(arg1, arg2) {};

/**
 * @param {string=} arg1
 * @param {(string|Object.<string,*>)=} arg2
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.undelegate = function(arg1, arg2, handler) {};

/**
 * @param {Array.<Element>} arr
 * @return {Array.<Element>}
 */
Zepto.unique = function(arr) {};

/**
 * @param {Array.<Element>} arr
 * @return {Array.<Element>}
 */
$.unique = function(arr) {};

/**
 * @deprecated
 * @param {(function(!Zepto.event=)|Object.<string, *>)} arg1
 * @param {function(!Zepto.event=)=} handler
 * @return {!Zepto}
 */
Zepto.prototype.unload = function(arg1, handler) {};

/** @return {!Zepto} */
Zepto.prototype.unwrap = function() {};

/**
 * @param {(string|Array.<string>|function(number,*))=} arg1
 * @return {(string|number|Array.<string>|!Zepto)}
 */
Zepto.prototype.val = function(arg1) {};

/**
 * @param {Zepto.deferred} deferred
 * @param {...Zepto.deferred} deferreds
 * @return {Zepto.Promise}
 */
Zepto.when = function(deferred, deferreds) {};

/**
 * @param {Zepto.deferred} deferred
 * @param {...Zepto.deferred} deferreds
 * @return {Zepto.Promise}
 */
$.when = function(deferred, deferreds) {};

/**
 * @param {(string|number|function(number,number))=} arg1
 * @return {(number|!Zepto)}
 */
Zepto.prototype.width = function(arg1) {};

/**
 * @param {(string|ZeptoSelector|Element|Zepto|function(number))} arg1
 * @return {!Zepto}
 */
Zepto.prototype.wrap = function(arg1) {};

/**
 * @param {(string|ZeptoSelector|Element|Zepto)} wrappingElement
 * @return {!Zepto}
 */
Zepto.prototype.wrapAll = function(wrappingElement) {};

/**
 * @param {(string|function(number))} arg1
 * @return {!Zepto}
 */
Zepto.prototype.wrapInner = function(arg1) {};
