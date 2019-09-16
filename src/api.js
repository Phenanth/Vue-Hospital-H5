import axios from 'axios';

let orderProxy = '/api';
let headers = { 'content-type': 'application/json' };

export const fetchOrder = (params) => {
  return axios.post(`${orderProxy}/cancer-invoice/order/`, params, {headers: headers}).then((res) => res);
}

// URL后方要加`/`，之前因为没加不停404报错
export const fetchOrderIssue = (params) => {
  return axios.post(`${orderProxy}/cancer-invoice/order/issue/`, params, {headers: headers}).then((res) => res);
}

// 根据税号获取公司信息
export const fetchCompanyInfo = (params) => {
	return axios.get(`${orderProxy}/cancer-invoice/tax/${params.taxCode}`, {headers: headers}).then((res) => res);
}
