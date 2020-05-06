"use strict";

exports.__esModule = true;
exports.default = _default;

// Modified from https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/markdown/lib/link.js
function _default(md, _ref) {
  var externalAttrs = _ref.externalAttrs,
      openLinkIcon = _ref.openLinkIcon,
      openLinkIconClass = _ref.openLinkIconClass;
  var hasOpenExternalLink = false;

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    var token = tokens[idx];
    var hrefIndex = token.attrIndex('href');

    if (hrefIndex >= 0) {
      var link = token.attrs[hrefIndex];
      var href = link[1];
      var isExternal = /^https?:/.test(href);

      if (isExternal) {
        Object.entries(externalAttrs).forEach(function (_ref2) {
          var key = _ref2[0],
              val = _ref2[1];
          token.attrSet(key, val);
        });

        if (/_blank/i.test(externalAttrs.target)) {
          hasOpenExternalLink = true;
        }
      }
    }

    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_close = function (tokens, idx, options, env, self) {
    if (hasOpenExternalLink) {
      hasOpenExternalLink = false;

      if (openLinkIcon && openLinkIconClass) {
        return "<i class=\"" + openLinkIconClass + "\"></i>" + self.renderToken(tokens, idx, options);
      }
    }

    return self.renderToken(tokens, idx, options);
  };
}