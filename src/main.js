import Vue from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { sync } from 'vuex-router-sync';
import './styles/app.scss';
import '@/plugins/vuetify-overrides';
// import { loadConfigs, getEnvs } from "@/configs";
// import "@/utils/logging";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);

Vue.config.productionTip = false;

Vue.filter('currency', function (value, symbol, precision = 0) {
  return `${symbol}${value.toFixed(precision)}`;
});

Vue.filter('date', function (v, format) {
  return dayjs(v).format(format);
});

Vue.filter('capitalize', (v) => {
  if (v.length === 0) {
    return v;
  }

  const [firstLetter] = v;
  const rest = v.substring(1);

  return `${firstLetter.toUpperCase()}${rest}`;
});

Vue.filter('phone', function (v) {
  const cleaned = ('' + v).replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? '+1 ' : '';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return v;
});

const eventBus = new Vue();

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: () => {
      return eventBus;
    },
  },
});

async function f() {
  const { default: store } = await import('@/store');
  const { default: router } = await import('@/router');

  sync(store, router);

  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
}

f();

// loadConfigs()
//   .then(async () => {
//     // Only load these modules after configs values have been loaded
//     // Since these modules use configs values
//   })
//   .catch((e) => {
//     console.error("Fail to read configs.json", e);
//   });
