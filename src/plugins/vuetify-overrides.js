import Vue from 'vue';
import { VTextField } from 'vuetify/lib';
import Logo from '@/components/common/Logo';

Vue.component('GpTextField', {
  extends: VTextField,
  props: {
    outlined: {
      type: Boolean,
      default: true,
    },
    dense: {
      type: Boolean,
      default: true,
    },
  },
});

Vue.component('Logo', Logo);
