var registerSuite = intern.getInterface('object').registerSuite;
var assert = intern.getPlugin('chai').assert;

define(['module', 'app/src'], function (module, src) {
  registerSuite(module.id, {
    tests: {
      'regular src': function () {
        assert.isTrue(src.true());
      },
    },
  });
});
