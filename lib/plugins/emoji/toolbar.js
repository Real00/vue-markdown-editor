"use strict";

exports.__esModule = true;
exports.generatorMenuItems = generatorMenuItems;
exports.default = createToolbar;

function generatorMenuItems(emojiJson, commandName) {
  return Object.entries(emojiJson).map(function (_ref) {
    var emojiType = _ref[0],
        unicode = _ref[1];
    return {
      name: emojiType,
      text: unicode,
      action: function action(editor) {
        editor.execCommand(commandName, emojiType);
      }
    };
  });
}

function createToolbar(_ref2) {
  var commandName = _ref2.commandName,
      emojiJson = _ref2.emojiJson,
      text = _ref2.text,
      title = _ref2.title,
      icon = _ref2.icon;
  return {
    title: title,
    icon: icon,
    text: text,
    menus: {
      mode: 'panel',
      items: generatorMenuItems(emojiJson, commandName)
    }
  };
}