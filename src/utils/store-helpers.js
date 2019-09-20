// Helpers for vuex (inspired by https://github.com/davestewart/vuex-pathify)

import {isBoundsFilterActive} from './bounds';

/**
 * @typedef {Object} Options
 * @property {String|Array} rootModuleProp  The name of the component property containing the path to the root module to
 *                                          use; this root path will be prefixed to the provided path
 */

/**
 * Getter for a computed property allowing to easily retrieve the value of a store property
 * This function must be called from a Vue.js component
 * @example
 * computed: {
 *   myProp: get('myModule/myProp')
 * }
 *
 * @example
 * computed: {
 *   myProp: sync('myProp', {rootModuleProp: 'modulePath'}),
 *   modulePath() {
 *     return 'myModule';
 *   }
 * }
 *
 * @param {String|Array<String>} path Store path to the property
 * @param {Options} [options] Options refining the way to get the property
 * @returns A computed getter for the targetted property
 */
export function get(path, options={}) {
  path = arrayPath(path);
  return {
    get() {
      return getValue(this.$store, fullPath(path, this, options));
    },
  };
}

/**
 * Provides getter and setter for a computed property that should be synchronized with a store property
 * This function must be called from a Vue.js component
 * @example
 * computed: {
 *   myProp: sync('myModule/myProp')
 * }
 *
 * @param {String|Array<String>} path Store path to the property
 * @param {Options} [options] Options refining the way to sync the property
 * @returns Computed getter and setter for the targetted property
 */
export function sync(path, options={}) {
  path = arrayPath(path);
  return {
    ...get(path, options),
    set(value) {
      this.$store.commit(getMutationName(fullPath(path, this, options)), value);
    }
  };
}

/**
 * Provides getter and setter for a computed property that should be synchronized with a simple filter
 * stored in Vuex
 * This function must be called from a Vue.js component and the targetted module should be constructed as shown
 * in the example
 * @example
 * // Vue.js component
 * computed: {
 *   myFilter: sync('myModule', 'myFilter'),
 * }
 * // myModule structure
 * namespaced: true,
 * state: {
 *   filters: {
 *     myFilter: null // null value for inactive filter
 *   }
 * },
 * mutations: {
 *   setFilter(state, {filterName, propValue}) {
 *     state.filters[filterName] = propValue;
 *   },
 * }
 *
 *
 * @param {String|Array<String>} modulePath Path to the store module containing the filters
 * @param {String} filterName The name of the filter property
 * @param {Options} [options] Options refining the way to sync the filter
 * @returns Computed getter and setter for the targetted filter
 */
export function syncFilter(modulePath, filterName, options={}) {
  modulePath = arrayPath(modulePath);

  return {
    get() {
      return getValue(this.$store, fullPath(modulePath, this, options)).filters[filterName];
    },
    set(propValue) {
      let path = fullPath(modulePath, this, options);
      this.$store.commit(path.join('/') + '/setFilter', {filterName, propValue});
    }
  };
}

/**
 * Provides getter and setter for a computed property that should be synchronized with a bounds filter (min, max bounds)
 * stored in Vuex
 * This function must be called from a Vue.js component, that also defines a property giving the max upper bound, and the
 * targetted module should be constructed as shown in the example
 * @example
 * // Vue.js component
 * computed: {
 *   myFilter: sync('myModule', 'myFilter', 'maxValue'),
 *   maxValue() {return 15;}
 * }
 * // myModule structure
 * namespaced: true,
 * state: {
 *   filters: {
 *     myFilter: null // null value for inactive filter (computed property will be equal to [0, maxValue])
 *   }
 * },
 * mutations: {
 *   setFilter(state, {filterName, propValue}) {
 *     state.filters[filterName] = propValue;
 *   },
 * }
 *
 *
 * @param {String|Array<String>} modulePath Path to the store module containing the filters
 * @param {String} filterName The name of the filter property
 * @param {String} maxProp The name of the component property containing the max allowed value
 * @param {Options} [options] Options refining the way to sync the filter
 * @returns Computed getter and setter for the targetted filter
 */
export function syncBoundsFilter(modulePath, filterName, maxProp, options={}) {
  modulePath = arrayPath(modulePath);

  return {
    get() {
      let value = getValue(this.$store, fullPath(modulePath, this, options)).filters[filterName];
      return value ? value : [0, this[maxProp]];
    },
    set(bounds) {
      let path = fullPath(modulePath, this, options);
      let propValue = isBoundsFilterActive(bounds, this[maxProp]) ? bounds : null;
      this.$store.commit(path.join('/') + '/setFilter', {filterName, propValue});
    }
  };
}

/**
 * Provides getter and setter for a computed property that should be synchronized with a multiselect filter stored in Vuex
 * This function must be called from a Vue.js component, that also defines a property giving the available options, and the
 * targetted module should be constructed as shown in the example
 * @example
 * // Vue.js component
 * computed: {
 *   myFilter: sync('myModule', 'myFilter', 'availableOptions'),
 *   availableOptions() {return [1, 2, 3];}
 * }
 * // myModule structure
 * namespaced: true,
 * state: {
 *   filters: {
 *     myFilter: null // null value for inactive filter (computed property will be equal to copy of available options)
 *   }
 * },
 * mutations: {
 *   setFilter(state, {filterName, propValue}) {
 *     state.filters[filterName] = propValue;
 *   },
 * }
 *
 *
 * @param {String|Array<String>} path Path to the store module containing the filters
 * @param {String} filterName The name of the filter property
 * @param {String} optionsProp The name of the component property containing the available options
 * @param {Options} [options] Options refining the way to sync the filter
 * @returns Computed getter and setter for the targetted filter
 */
export function syncMultiselectFilter(modulePath, filterName, optionsProp, options={}) {
  modulePath = arrayPath(modulePath);

  return {
    get() {
      let value = getValue(this.$store, fullPath(modulePath, this, options)).filters[filterName];
      return value ? value : this[optionsProp].slice();
    },
    set(selectedOptions) {
      let path = fullPath(modulePath, this, options);
      let propValue = (selectedOptions.length === this[optionsProp].length) ? null : selectedOptions;
      this.$store.commit(path.join('/') + '/setFilter', {filterName, propValue});
    }
  };
}

function arrayPath(path) {
  if(!path) {
    return [];
  }
  if(Array.isArray(path)) {
    return path;
  }
  if(typeof path === 'string') {
    return path.split('/');
  }
  throw new Error('Path must be a string or an array');
}

function fullPath(path, component, options) {
  if(options.rootModuleProp) {
    path = arrayPath(component[options.rootModuleProp]).concat(path);
  }
  return path;
}

function getValue(store, path) {
  let obj = store.state;
  for(let i = 0; i < path.length; i++) {
    obj = obj[path[i]];
  }
  return obj;
}

function getMutationName(path) {
  let variableName = path[path.length - 1];
  let modulePath = path.slice(0, path.length -1);
  return modulePath.join('/') + '/set' + variableName.charAt(0).toUpperCase() + variableName.slice(1);
}
