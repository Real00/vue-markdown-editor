"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _xss = _interopRequireDefault(require("xss"));

var _svg = _interopRequireDefault(require("./svg"));

var _KaTex = _interopRequireDefault(require("./KaTex"));

var _common = require("./common");

var tagWhiteList = (0, _extends2.default)((0, _extends2.default)({
  tags: _common.tags
}, _KaTex.default), _svg.default);
Object.entries(tagWhiteList).forEach(function (_ref) {
  var tagName = _ref[0],
      attrWhiteList = _ref[1];
  _xss.default.whiteList[tagName] = attrWhiteList;
});
var options = {
  onIgnoreTagAttr: function onIgnoreTagAttr(tag, name, value) {
    if (_svg.default[tag] || _KaTex.default[tag] || _common.attrWhiteList.find(function (attr) {
      return attr === name;
    }) || _common.prefixAtteWhiteList.find(function (prefix) {
      return name.startsWith(prefix);
    })) {
      return name + "=\"" + _xss.default.escapeAttrValue(value) + "\"";
    }
  }
};

var _default = new _xss.default.FilterXSS(options);

exports.default = _default;