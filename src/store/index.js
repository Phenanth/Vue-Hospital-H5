import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		orderData: []
	},
	actions: {
		setOrderData ({ commit }, data) {
			return new Promise((resolve, reject) => {
				commit('SETORDERDATA', data)
				resolve()
			})
		}
	},
	mutations: {
		SETORDERDATA (state, data) {
			state.orderData = data
			sessionStorage.setItem('taxOrderData', JSON.stringify(data))
		}
	},
	getters: {
		getOrderData (state) {
			state.orderData = JSON.parse(sessionStorage.getItem('taxOrderData'))
			return state.orderData
		}
	}
})