'use strict'

import axios from 'axios';
import Vue from 'vue';
import util from './util';
import {Message} from 'iview';
import locale from '../locale/locale';
import {router} from '../router/index';
import Cookies from 'js-cookie';

//拦截器
axios.interceptors.request.use(config => {
  	// loading
	return config
}, error => {
	return Promise.reject(error)
})

axios.interceptors.response.use(response => {
	return response
}, error => {
	return Promise.resolve(error.response)
})

function checkStatus (response) {
	// loading
  	// 如果http状态码正常，则直接返回数据
  	if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    	return response.data
    	// 如果不需要除了data之外的数据，可以直接 return response.data
  	}
  	var networkAnomalyMsg = locale[localStorage.lang || Vue.config.lang || util.languageTwo].networkAnomalyMsg;
  	// 异常状态下，把错误信息返回去
  	return {
	    status: -404,
	    msg: networkAnomalyMsg
  	}
}

function checkCode (res) {
	// 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  	if (res.status === -404) {
    	Message.error(res.msg);
  	}else if(res.resultCode == '999998'){
  		Cookies.remove('user');
  		router.push({
            name: 'login'
        });
  	}else if(res.resultCode == "-1"){
  		var sysExceptionMsg = locale[localStorage.lang || Vue.config.lang || util.languageTwo].sysException;
  		Message.error(sysExceptionMsg);
  	}
  	// if (res.data && (!res.data.success)) {
   //  	alert(res.data.error_msg)
  	// }
  	return res
}

/**
 * 获取语言标识请求头
 * @return {[type]} [description]
 */
function getLanguageHeader(){
	var sysLanguage = localStorage.lang || Vue.config.lang || util.languageTwo;
	var language = sysLanguage.replace('-','_');
	if(language == util.languageOne || language == util.languageTwo){
		return language;
	}
	return util.languageOne;
}

export default {
	post (url, data) {
    	return axios({
		  	method: 'post',
		  	url,
		  	data: JSON.stringify(data),
		  	timeout: 10000,
		  	headers: {
		    	'X-Language-Id': getLanguageHeader(),
		    	'Content-Type': 'application/json; charset=UTF-8'
		  	}
	    }).then(
	    	(response) => {
	        	return checkStatus(response)
	      	}
	    ).then(
	    	(res) => {
	        	return checkCode(res)
	      	}
	    )
  	},
	get (url, params) {
	    return axios({
	    	method: 'get',
	    	url,
	    	params, // get 请求时带的参数
	    	timeout: 10000,
	    	headers: {
	    		'X-Language-Id': getLanguageHeader()
	    	}
	    }).then(
	    	(response) => {
	    		return checkStatus(response)
	    	}
	    ).then(
	    	(res) => {
	    		return checkCode(res)
	    	}
	    )
	}
}
