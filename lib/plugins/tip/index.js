"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = createTipPlugin;

var _markdownItContainer = _interopRequireDefault(require("../../utils/markdown-it-container"));

function createTipPlugin(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? 'tip' : _ref$name,
      _ref$icon = _ref.icon,
      icon = _ref$icon === void 0 ? 'v-md-icon-tip' : _ref$icon,
      text = _ref.text,
      _ref$placeholder = _ref.placeholder,
      placeholder = _ref$placeholder === void 0 ? '在此输入内容' : _ref$placeholder,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? '插入提示' : _ref$title;

  var commandHandler = function commandHandler(editor, type) {
    if (type === void 0) {
      type = 'tip';
    }

    editor.insert(function (selected) {
      var prefix = ':::';
      var suffix = ':::';
      var content = selected || placeholder;
      return {
        text: prefix + " " + type + "\n  " + content + "\n" + suffix,
        selected: content
      };
    });
  };

  var toolbar = {
    title: title,
    icon: icon,
    text: text,
    menus: [{
      name: 'tip',
      text: '提示',
      action: function action(editor) {
        editor.execCommand(name);
      }
    }, {
      name: 'warning',
      text: '注意',
      action: function action(editor) {
        editor.execCommand(name, 'warning');
      }
    }, {
      name: 'danger',
      text: '警告',
      action: function action(editor) {
        editor.execCommand(name, 'danger');
      }
    }]
  };

  var extendMarkdown = function extendMarkdown(mdParser) {
    var blockClass = 'v-md-plugin-tip';

    if (mdParser) {
      // extend markdown-it
      (0, _markdownItContainer.default)(mdParser, {
        type: 'tip',
        defaultTitle: '提示',
        blockClass: blockClass
      });
      (0, _markdownItContainer.default)(mdParser, {
        type: 'warning',
        defaultTitle: '注意',
        blockClass: blockClass
      });
      (0, _markdownItContainer.default)(mdParser, {
        type: 'danger',
        defaultTitle: '警告',
        blockClass: blockClass
      });
    }
  };

  return {
    extendMarkdown: extendMarkdown,
    install: function install(VMdEditor) {
      if (VMdEditor.command) VMdEditor.command(name, commandHandler);
      if (VMdEditor.toolbar) VMdEditor.toolbar(name, toolbar);
      VMdEditor.extendMarkdown(extendMarkdown);
    }
  };
}