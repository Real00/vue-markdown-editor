"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _highlight = _interopRequireDefault(require("highlight.js/lib/highlight.js"));

var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));

var _xml = _interopRequireDefault(require("highlight.js/lib/languages/xml"));

var _css = _interopRequireDefault(require("highlight.js/lib/languages/css"));

// language js
_highlight.default.registerLanguage('js', _javascript.default);

_highlight.default.registerLanguage('javascript', _javascript.default); // language xml, html


_highlight.default.registerLanguage('html', _xml.default);

_highlight.default.registerLanguage('xml', _xml.default); // language css


_highlight.default.registerLanguage('css', _css.default);

var _default = _highlight.default;
exports.default = _default;