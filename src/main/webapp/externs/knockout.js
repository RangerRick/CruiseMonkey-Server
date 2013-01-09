/**
 * @externs
 */

var ko = {};

ko.observable = function(initialValue) {};
/**
 * @param {Object} evaluatorFunctionOrOptions
 * @param {Object=} evaluatorFunctionTarget
 * @param {Object=} options
 */
ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {};
ko.computed = ko.dependentObservable;

/**
  * @param {Array=} initialValues
  */
ko.observableArray = function (initialValues) {};
ko.contextFor = function(obj) { this.$data = {}; };
ko.bindingHandlers = {};

/**
 * @param {Object} viewModel
 * @param {Element=} rootNode
 */
ko.applyBindings = function (viewModel, rootNode) {};


ko.toJS = function(rootObject) {};

/**
 * @param {Object} rootObject
 * @param {function(Object,Object)|null=} replacer
 * @param {number=} space
 */
ko.toJSON = function(rootObject, replacer, space) {};

ko.utils = {};
ko.utils.unwrapObservable = function(value) {};
/**
 * @param {Array} array
 * @param {function(Object)} callback
 */
ko.utils.arrayFilter = function(array, callback) {}
/**
 * @param {Array} array
 * @param {function(Object)} callback
 */
ko.utils.arrayFirst = function(array, callback) {}
