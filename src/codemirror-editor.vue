<template>
  <v-md-container
    :left-toolbar="leftToolbar"
    :right-toolbar="rightToolbar"
    :toolbars="toolbars"
    :disabled-menus="disabledMenus"
    :height="height"
    :fullscreen="fullscreen"
    :left-area-visible="tocVisible"
    left-area-title="目录导航"
    :mode="mode"
    @toolbar-item-click="handleToolbarItemClick"
    @toolbar-menu-click="handleToolbarMenuClick"
    @resize="handleContainerResize"
    ref="contaner"
  >
    <scrollbar slot="left-area">
      <toc-nav
        :titles="titles"
        @nav-click="handleNavClick"
      />
    </scrollbar>
    <div
      class="codemirror-wrapper"
      slot="editor"
      ref="codemirrorEditor"
    />
    <scrollbar
      slot="preview"
      :disabled="mode === 'preview'"
      ref="previewScroller"
    >
      <v-md-preview
        :text="text"
        :theme="theme"
        :scroll-container="getPreviewScrollContainer"
        @change="handleChange"
        ref="preview"
      />
    </scrollbar>
    <v-md-upload-img
      v-if="hasUploadImage"
      :upload-image-config="$attrs['upload-image-config'] || $attrs.uploadImageConfig"
      ref="uploadImage"
    />
  </v-md-container>
</template>

<script>
import createEditor from './create-editor';
import { smooth } from '@/utils/smooth-scroll';
import HotKeys from '@/utils/hotkeys';

import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';

const component = {
  props: {
    codemirrorConfig: Object,
  },
  watch: {
    value() {
      if (this.value !== this.text) {
        this.text = this.value;
        this.codemirrorInstance.setValue(this.text);
      }
    },
  },
  created () {
    this.hotkeysManager = new HotKeys();
  },
  mounted() {
    this.codemirrorInstance = new Codemirror(this.$refs.codemirrorEditor, {
      tabSize: 2,
      lineNumbers: true,
      styleActiveLine: true,
      ...this.codemirrorConfig,
      value: this.text,
      mode: 'markdown',
      lineWrapping: 'wrap',
      scrollbarStyle: 'overlay',
      dragDrop: false,
    });

    this.codemirrorInstance.on('change', () => {
      const newValue = this.getValue();

      this.handleInput(newValue);
    });

    this.codemirrorInstance.on('scroll', () => {
      this.handleEditorScroll();
    });

    this.codemirrorInstance.on('keydown', (_, e) => {
      this.hotkeysManager.dispatch(e);
    });
  },
  methods: {
    handleContainerResize() {
      // 容器大小变化的时候刷新 codemirror 解决滚动条的显示问题
      this.codemirrorInstance.refresh();
    },
    getValue() {
      return this.codemirrorInstance.getValue();
    },
    getIndexInInterval(number, start, end) {
      if (start <= number && number <= end) {
        return number - start;
      }
    },
    // Must implement
    delLineLeft () {
      this.codemirrorInstance.execCommand('delLineLeft');
    },
    // Must implement
    getCursorLineLeftText () {
      const { codemirrorInstance } = this;
      const { line: startLine, ch: startCh } = codemirrorInstance.getCursor('from');
      const { line: endLine, ch: endCh } = codemirrorInstance.getCursor('to');

      if (startLine !== endLine || startCh !== endCh) return;

      return codemirrorInstance.getLine(startLine).slice(0, startCh);
    },
    // Must implement
    editorRegisterHotkeys (...arg) {
      this.hotkeysManager.registerHotkeys(...arg);
    },
    // Must implement
    editorScrollToTop (scrollTop) {
      const currentScrollTop = this.getScrollInfo().top;

      smooth({
        currentScrollTop,
        scrollToTop: scrollTop,
        scrollFn: scrollTop => this.codemirrorInstance.scrollTo(0, scrollTop),
      });
    },
    // Must implement
    getScrollInfo () {
      return this.codemirrorInstance.getScrollInfo();
    },
    // Must implement
    heightAtLine (...arg) {
      return this.codemirrorInstance.heightAtLine(...arg);
    },
    // Must implement
    focus() {
      this.codemirrorInstance.focus();
    },
    // Must implement
    undo() {
      this.codemirrorInstance.undo();
    },
    // Must implement
    redo() {
      this.codemirrorInstance.redo();
    },
    // Must implement
    clear() {
      this.codemirrorInstance.setValue('');
    },
    // Must implement
    replaceSelectionText(text, type = 'around') {
      this.codemirrorInstance.replaceSelection(text, type);
    },
    // Must implement
    changeSelctionTo(insertText, selectedText) {
      const curStartLine = this.codemirrorInstance.getCursor('from');
      const curEndLine = this.codemirrorInstance.getCursor('to');

      if (!selectedText) {
        this.codemirrorInstance.setSelection(curEndLine);
        return;
      }

      const lines = this.text.split('\n').slice(curStartLine.line, curEndLine.line + 1);
      const startIndex = lines.join('\n').indexOf(selectedText, curStartLine.ch);
      const endIndex = startIndex + selectedText.length;

      const start = {
        line: 0,
        ch: null,
        indexOfSelected: startIndex,
      };
      const end = {
        line: 0,
        ch: null,
        indexOfSelected: endIndex,
      };

      let strLen = 0;
      lines.find((rowText, lineIndex) => {
        const rowLength = rowText.length;

        [start, end].forEach((position) => {
          const newCursor = this.getIndexInInterval(
            position.indexOfSelected,
            strLen,
            strLen + rowLength
          );

          if (typeof newCursor !== 'undefined') {
            position.ch = newCursor;
            position.line = curStartLine.line + lineIndex;
          }
        });

        // + 1 是算上换行符占的长度
        strLen += rowLength + 1;

        return start.ch !== null && end.ch !== null;
      });


      this.codemirrorInstance.setSelection(end, start);
    },
    // Must implement
    getCurrentSelectedStr () {
      return this.codemirrorInstance.getSelection();
    },
  },
};

createEditor(component);

export default component;
</script>

<style lang="scss">
@import '@/styles/var';

.v-md-editor {
  .codemirror-wrapper {
    height: 100%;

    .CodeMirror {
      height: 100%;
      color: $text-color;
      font-size: $editor-font-size;
      font-family: $editor-font-family;
      line-height: $editor-line-height;

      &:hover {
        .CodeMirror-overlayscroll-vertical,
        .CodeMirror-overlayscroll-horizontal {
          & > div {
            opacity: 1;
          }
        }
      }

      pre {
        padding: 0 12px;
        word-break: break-all;
      }
    }

    .cm-header,
    .cm-url,
    .cm-link {
      color: #1890ff;
    }

    .cm-link {
      text-decoration: none;
    }

    .cm-url {
      text-decoration: underline;
    }

    .cm-quote,
    .cm-comment,
    .cm-variable-2:not(.cm-url),
    .cm-link {
      color: $text-color;
    }

    // 选中代码的高亮背景色
    .CodeMirror-selected {
      background: mix(#e8f2ff, #000, 90%);
    }

    .CodeMirror-linenumbers {
      padding: 0 5px;
    }

    // 滚动条样式
    .CodeMirror-overlayscroll-vertical,
    .CodeMirror-overlayscroll-horizontal {
      & > div {
        background-color: $scrollbar-background-color;
        border-radius: $scrollbar-border-radius;
        cursor: pointer;
        opacity: 0;
        transition: opacity $scrollbar-opacity-transition,
          background-color $scrollbar-background-transition;

        &:hover {
          background-color: $scrollbar-active-background-color;
        }
      }
    }

    .CodeMirror-overlayscroll-vertical {
      right: 2px;
    }
  }
}
</style>
