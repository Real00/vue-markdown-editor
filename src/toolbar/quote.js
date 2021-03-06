import { quote } from '@/utils/constants/command';

export default {
  name: quote,
  icon: 'v-md-icon-quote',
  title: '插入引用（Ctrl+Q）',
  action(editor) {
    editor.execCommand(quote);
  },
};
