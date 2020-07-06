var registerSuite = intern.getInterface('object').registerSuite;
var assert = intern.getPlugin('chai').assert;

define(['module', 'dojo/Deferred'], function (module, Deferred) {
  var src;

  registerSuite(module.id, {
    before: function () {
      var deferred = new Deferred();
      require(['app/src'], function (delayedSrc) {
        src = delayedSrc;
        deferred.resolve();
      });
      return deferred.promise;
    },

    tests: {
      'regular src 2': function () {
        assert.isTrue(src.trueToo());
      },
    },
  });
});
