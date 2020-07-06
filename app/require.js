// Copyright Koninklijke Philips N.V. 2018
//
// All rights are reserved. Reproduction or transmission in whole or in part, in
// any form or by any means, electronic, mechanical or otherwise, is prohibited
// without the prior written consent of the copyright owner.
//

// The dojo AMD loader has an optional first 'config' parameter. This is used
// most often in unittest code to magically map moduleIds to a stub implementation.
// Unfortunately, this has a persistent side effect on the loader's internal
// administration. This version of 'require' provides a way to undo that.
//
// Usage:
//   define([ ..., 'interntests/require'], function( ..., require) {
//     var requireContext;
//     before: function() {
//       requireContext = require(
//         { map: { '*': { ... } } },    // <--- this is where the magic happens
//         [ ... ],
//         function( ... ) { ... }
//       );
//     },
//     after: function() {
//       requireContext.restore();
//     }
//   });
//
// Note:
//   the map should override on '*' level, so it gets correctly replaced while undoing.
//
// Mapping data-dojo-types
// -----------------------
// In cases where the stubbed modules are declared as a data-dojo-type in a template,
// the _WidgetsInTemplateMixin needs to be aware of the mapping when it instantiates
// the module instances. This is done by passing the 'require' function while instantiating
// the widget, like this:
//
//    var instance = new MyWidget({ contextRequire: require });
//
// _WidgetsInTemplateMixin will look for such a contextRequire and use it if available.
// This ensures the map is applied at this point.
//
// Note:
//   Unfortunately, when it creates the widgets in the template, it does not pass the
//   contextRequire to their constructor. This means that mappings will not be applied to
//   nested widgets, which may be unexpected and unintended.
//   To fix this we would have to change the dojo parser.
//

define(['require', 'dojo/_base/lang'], function (require, lang) {
  function isString(object) {
    return {}.toString.call(object) === '[object String]';
  }

  function testRequire(
    config,
    deps,
    callback,
    referenceModule,
    contextRequire
  ) {
    if (Array.isArray(config) || isString(config)) {
      // require is called without a config object, just forward to actual require
      return require(config, deps, callback, referenceModule, contextRequire);
    }
    var globalRequireMap = lang.mixin({ '*': {} }, require.map);
    var mergedMap = lang.mixin({}, globalRequireMap, config.map);
    var mergedConfig = lang.mixin({}, config, { map: mergedMap });
    // Clear the dependencies from the cache so they will get reloaded/redefined with the mapped configuration.
    deps.forEach(require.undef);
    // Call the actual require -- this will persistently update the global map internally
    require(mergedConfig, deps, callback, referenceModule, contextRequire);
    return {
      restore: function restore() {
        // Clear the loaded dependencies from the cache to avoid them being used with the mapped configuration.
        deps.forEach(require.undef);
        // Clear the constructor cache built-up by the dojo parser
        delete testRequire._dojoParserCtorMap;
        // Restore the updated global map to its original value
        require({ map: globalRequireMap });
      },
    };
  }

  testRequire.undef = require.undef;

  return testRequire;
});
