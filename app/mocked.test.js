var registerSuite = intern.getInterface('object').registerSuite;
var assert = intern.getPlugin('chai').assert;

define(['./require', 'module', 'dojo/Deferred'], function (
  require,
  module,
  Deferred
) {
  var src;
  var requireContext;

  registerSuite(module.id, {
    before: function () {
      var deferred = new Deferred();
      requireContext = require({
        map: { '*': { 'app/src': 'app/mocked' } },
      }, ['app/src'], function (mockedSrc) {
        src = mockedSrc;
        deferred.resolve();
      });
      return deferred.promise;
    },

    after: function () {
      requireContext.restore();
    },

    tests: {
      'mocked src': function () {
        assert.isFalse(src.true());
      },
    },
  });
});
