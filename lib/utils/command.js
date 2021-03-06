"use strict";

exports.__esModule = true;
exports.default = registerCommand;
exports.commandWrapper = commandWrapper;

var _util = require("./util");

var defaultCommands = {};
(0, _util.importAll)(defaultCommands, require.context('@/command', false, /\.(js)$/));

function registerCommand(target, commandName, callback) {
  if (commandName) {
    if (!target[commandName]) {
      if (typeof callback === 'function') {
        target[commandName] = callback;
      } else {
        console.error("The command must be registered as a function: " + commandName);
      }
    } else {
      console.error("The command name is already in use: " + commandName);
    }
  } else {
    console.error('Command name is required');
  }
}

function commandWrapper(component) {
  component.commands = {};

  component.command = function (commandName, callback) {
    registerCommand(component.commands, commandName, callback);
  };

  Object.values(defaultCommands).forEach(function (module) {
    var name = module.name,
        callback = module.default;
    component.command(name, callback);
  });
}