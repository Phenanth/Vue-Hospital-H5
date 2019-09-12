import axios from 'axios';

let orderProxy = '/tax/api';
let headers = { 'content-type': 'application/json' };

export const fetchOrder = (params) => {
  return axios.post(`${orderProxy}/order/`, params, {headers: headers}).then((res) => res);
}

// URL后方要加`/`，之前因为没加不停404报错
export const fetchOrderIssue = (params) => {
  return axios.post(`${orderProxy}/order/issue/`, params, {headers: headers}).then((res) => res);
}