import Vue from 'vue'

import Vuex from 'vuex'
Vue.use(Vuex)

import {GET_FBASE, LOGIN_ME} from './mutation-types'

export default new Vuex.Store({
    state : {
        items : {
          "-KZvonwRi7MBVk7YEiCe" : {
          "content" : "changeset here",
          "comment" : "test data",
          "reviewer" : "Igor Kokotko",
          "status" : "Good",
          "submissiontime" : "2016-12-26",
          "submitimage" : "https://lh3.googleusercontent.com/-qNASrFkBl8c/AAAAAAAAAAI/AAAAAAAAAhQ/Uclpx3WRLyw/photo.jpg",
          "ticket" : "ticket here",
          "username" : "Bohdan Kokotko"
          }, "-KZwWEmvglByJWO72guy" : {
            "content" : "haha",
            "comment" : "NICE",
            "reviewer" : "Igor Kokotko",
            "status" : "Looking",
            "submissiontime" : "2016-12-26",
            "submitimage" : "https://lh6.googleusercontent.com/-TmXo5J9edvo/AAAAAAAAAAI/AAAAAAAAACQ/vLRY3Mwe9zg/photo.jpg",
            "ticket" : "https://bits.bazaarvoice.com/jira/browse/SUP-19499",
            "username" : "Igor Kokotko"
          }, "-KZwWEmvglByJWO72guS" : {
            "content" : "ololo",
            "comment" : "this is test data",
            "reviewer" : "Igor Kokotko",
            "status" : "New",
            "submissiontime" : "2016-12-29",
            "submitimage" : "https://lh6.googleusercontent.com/-TmXo5J9edvo/AAAAAAAAAAI/AAAAAAAAACQ/vLRY3Mwe9zg/photo.jpg",
            "ticket" : "https://bits.bazaarvoice.com/jira/browse/SUP-19494",
            "username" : "Igor Kokotko"
          },
        },
        activeUser : {
          displayName: 'Guest',
          photoURL : 'https://ssl.gstatic.com/images/icons/material/product/1x/avatar_circle_blue_120dp.png',
          isAnonymous : true
        },
        nums : 1,
        firePath : {
            refs : {
                items : 'wow/nice'
            }
        }
    },
    getters : {
        // cartTotal : (state) => {
        //     let total = 0
        //     state.cart.items.forEach((item) => {
        //         total += item.product.price * item.quantity
        //     })
        //     return total
        // },
        // taxAmount : (state, getters) => {
        //     return (percentage) => {
        //         return ((getters.cartTotal * percentage) / 100)
        //     }
        // },
        firebaseMainPathGetter : (state) => {
          return state.firePath.refs.items
        },
        activeUserGetter : (state) => {
          return state.activeUser
        }
    },
    mutations : {
      [GET_FBASE] (state, payload) {
        state.items = payload
      },
      [LOGIN_ME] (state, payload) {
        state.activeUser = payload
      }
    },
    actions : {
      [GET_FBASE] (store, payload) {
        store.commit(GET_FBASE, payload)
      },
      [LOGIN_ME] (store, payload) {
        store.commit(LOGIN_ME, payload)
      }
    }
})