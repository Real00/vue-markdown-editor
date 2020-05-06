"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = createTodoListPlugin;

var _toolbar = _interopRequireDefault(require("./toolbar"));

var _command = _interopRequireDefault(require("./command"));

var _markdownItTodoList = _interopRequireDefault(require("../../utils/markdown-it-todo-list"));

require("./todo-list.css");

function createTodoListPlugin(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? 'todo-list' : _ref$name,
      _ref$icon = _ref.icon,
      icon = _ref$icon === void 0 ? 'v-md-icon-checkbox' : _ref$icon,
      text = _ref.text,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? '任务列表（Ctrl+Shift+U）' : _ref$title,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? '#3eaf7c' : _ref$color;

  var toolbar = (0, _toolbar.default)({
    commandName: name,
    title: title,
    text: text,
    icon: icon
  });
  var defaultBorderColor = '#d9d9d9';

  var border = function border(type) {
    return "border-color: " + (type === 'todo' ? defaultBorderColor : color);
  };

  var background = "background-color: " + color;

  var extendMarkdown = function extendMarkdown(mdParser) {
    if (mdParser) {
      // extend markdown-it
      mdParser.use(_markdownItTodoList.default, {
        renderCheckbox: function renderCheckbox(type) {
          var checkboxClass = 'v-md-editor__todo-list-checkbox';
          var style = type === 'todo' ? "" + border(type) : border(type) + ";" + background;
          return "<span class=\"" + checkboxClass + (type === 'todo' ? '' : " " + checkboxClass + "--checked") + "\" style=\"" + style + "\"></span>";
        }
      });
    }
  };

  return {
    extendMarkdown: extendMarkdown,
    install: function install(VMdEditor) {
      if (VMdEditor.command) VMdEditor.command(name, _command.default);
      if (VMdEditor.toolbar) VMdEditor.toolbar(name, toolbar);

      if (VMdEditor.hotkey) {
        VMdEditor.hotkey({
          modifier: 'ctrlShift',
          key: 'u',
          action: function action(editor) {
            editor.execCommand(name);
          }
        });
      }

      VMdEditor.extendMarkdown(extendMarkdown);
    }
  };
}