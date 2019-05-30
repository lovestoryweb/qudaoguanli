import Vue from 'vue';
import Locales from './locale';
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';
import thTLocale from 'iview/src/locale/lang/th-TH';

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang.toLowerCase() === 'zh-cn' || navLang.toLowerCase() === 'en-us' || navLang.toLowerCase() === 'th-th') ? (navLang.substr(0,navLang.indexOf('-')).toLowerCase()+'-'+navLang.substr(navLang.indexOf('-')+1,navLang.length).toUpperCase()) : false;
const lang = window.localStorage.lang || localLang || 'th-TH';

Vue.config.lang = lang;

// 多语言配置
const locales = Locales;
const mergeZH = Object.assign(zhLocale, locales['zh-CN']);
const mergeEN = Object.assign(enLocale, locales['en-US']);
const mergeTH = Object.assign(thTLocale, locales['th-TH']);
Vue.locale('zh-CN', mergeZH);
Vue.locale('en-US', mergeEN);
Vue.locale('th-TH', mergeTH);