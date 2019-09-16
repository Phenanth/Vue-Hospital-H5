import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		// 开票数据数组
		orderData: [],
		companyName: ''
	},
	actions: {
		// 查询完成后在会话储存中储存一次查询的数据
		setOrderData ({ commit }, data) {
			return new Promise((resolve, reject) => {
				commit('SETORDERDATA', data.data)
				commit('SETCOMPANYNAME', data.name)
				resolve()
			})
		},
		// 移除本地会话储存，没有必要所以没用上
		removeOrderData ({ commit }) {
			return new Promise((resolve, reject) => {
				commit('REMOVEORDERDATA')
				resolve()
			})
		}
	},
	mutations: {
		// 查询完成后在会话储存中储存一次查询的数据
		SETORDERDATA (state, data) {
			state.orderData = data
			sessionStorage.setItem('taxOrderData', JSON.stringify(data))
		},
		SETCOMPANYNAME (state, name) {
			state.companyName = name
			sessionStorage.setItem('companyName', name)
		},
		// 移除本地会话储存，没有必要所以没用上
		REMOVEORDERDATA (state, data) {
			state.orderData = data
			sessionStorage.removeItem('taxOrderData')
		}
	},
	getters: {
		// 获取储存在会话存储中的开票数据
		getOrderData (state) {
			state.orderData = JSON.parse(sessionStorage.getItem('taxOrderData'))
			return state.orderData
		},
		getCompanyName (state) {
			state.companyName = sessionStorage.getItem('companyName')
			return state.companyName
		}
	}
})