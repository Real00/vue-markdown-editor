import { link } from '@/utils/constants/command';

export default {
  name: link,
  icon: 'v-md-icon-link',
  title: '插入链接（Ctrl+L）',
  action(editor) {
    editor.execCommand(link);
  },
};
