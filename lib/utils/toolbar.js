"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = registerToolbar;
exports.toolbarWrapper = toolbarWrapper;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _util = require("./util");

var defaultToolbars = {};
(0, _util.importAll)(defaultToolbars, require.context('@/toolbar', false, /\.(js)$/));

function registerToolbar(target, name, config) {
  if (name) {
    if (!target[name]) {
      target[name] = (0, _extends2.default)({}, config);
    } else {
      console.error("The toolbar name is already in use: " + name);
    }
  } else {
    console.error('Toolbar name is required');
  }
}

function toolbarWrapper(component) {
  component.toolbars = {};

  component.toolbar = function (name, config) {
    registerToolbar(component.toolbars, name, config);
  };

  Object.values(defaultToolbars).forEach(function (module) {
    var config = module.default;
    component.toolbar(config.name, config);
  });
}