import MarkdownIt from 'markdown-it';
import { escapeHtml } from 'markdown-it/lib/common/utils';

export function createHighlightRender({
  hasLang = () => true,
  highlight = (str) => str,
  codeBlockClass,
}) {
  const getCodeBlockClass = (lang) => (codeBlockClass ? codeBlockClass(lang) : `language-${lang}`);

  return function (str, lang) {
    let res = escapeHtml(str);

    if (lang) {
      if (hasLang(lang)) {
        res = highlight(str, lang);
      } else {
        console.error(`markdown highlight code: missing the language pack：${lang}`);
      }
    }

    return `<pre class="${getCodeBlockClass(lang)}"><code>${res}</code></pre>`;
  };
}

export default function () {
  const markdownItInstance = new MarkdownIt();

  markdownItInstance.set({
    html: true,
    breaks: true,
    linkify: false,
    typographer: true,
  });

  return markdownItInstance;
}
