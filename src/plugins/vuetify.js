import Vue from 'vue';
import Vuetify, { VRow, VCol } from 'vuetify/lib';
import '@/assets/css/universal-icon-set.css';
import ClockIcon from '@/components/icons/ClockIcon';
import FileIcon from '@/components/icons/FileIcon';
import ProgressQuarter from '@/components/icons/ProgressQuarter';
import ProgressCompleted from '@/components/icons/ProgressCompleted';
import PlusIcon from '@/components/icons/PlusIcon';

Vue.use(Vuetify, {
  // Have to register these components globally
  // https://vuetifyjs.com/en/features/treeshaking/#functional-components
  components: {
    VRow,
    VCol,
  },
});

export default new Vuetify({
  breakpoint: {
    thresholds: {
      xs: 960,
    },
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        'primary': '#1601C3',
        'secondary': '#4DABF2',
        'tertiary': '#212529',
        'accent': '#b8d638',
        'error': '#FB6A7A',
        'info': '#5A7788',
        'success': '#5A7788',
        'warning': '#BF2600',
        'gratify-blue': '#1601C3',
        'blue-75': '#5040D2',
        'blue-50': '#8A80E1',
        'blue-25': '#C4BFF0',
        'blue-10': '#E8E6F9',
        'ultra-red': '#FB6A7A',
        'ultra-red-75': '#FC8F9B',
        'ultra-red-50': '#FDB4BC',
        'ultra-red-25': '#FEDADE',
        'violet': '#FF82A9',
        'sky': '#23C9FF',
        'ice': '#F7F7FA',
        'slate': '#3C4257',
        'slate-75': '#6D7181',
        'slate-50': '#9DA0AB',
        'slate-25': '#CED0D5',
        'slate-10': '#ECECEE',
        'payment-form-bg': '#F5F6F7',
      },
    },
  },
  icons: {
    // uis missing some mdi's icon that Julia hasn't changed yet
    iconfont: 'mdi',
    values: {
      'next': 'uis-chevron-right-cr-fr-line',
      'prev': 'uis-chevron-left-cr-fr-line',
      'check': 'uis-check-cr-fr-solid',
      'warning': 'uis-warning-solid',
      'clock': {
        component: ClockIcon,
      },
      'file': {
        component: FileIcon,
      },
      'progress-25': {
        component: ProgressQuarter,
      },
      'progress-50': 'uis-emoji-happy-circle-18',
      'progress-75': 'uis-emoji-happy-circle-2',
      'progress-100': {
        component: ProgressCompleted,
      },
      'plus': {
        component: PlusIcon,
      },
    },
  },
});
