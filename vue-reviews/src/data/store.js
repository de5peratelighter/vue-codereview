import Vue from 'vue'

import Vuex from 'vuex'
Vue.use(Vuex)

import moment from 'moment-timezone'
moment.tz.guess()

import {GET_FBASE, LOGIN_ME, UPDATE_NUM, GET_REVIEWERS} from './mutation-types'

export default new Vuex.Store({
    state : {
        items : {
          "-KZvonwRi7MBVk7YEiCe" : {
            "comment" : "css fix",
            "content" : "https://dev.bazaarvoice.com/trac/bvc/changeset/1655761",
            "reviewer" : "Bohdan Kokotko",
            "status" : "Good",
            "submissiontime" : "12/06/2017, 16:27:22",
            "submitimage" : "https://lh5.googleusercontent.com/-3Hk73cIZ3no/AAAAAAAAAAI/AAAAAAAAADA/HEzBAYy-kC0/photo.jpg",
            "ticket" : "https://bits.bazaarvoice.com/jira/browse/SUP-21014",
          "username" : "Daryna Hunko"
          }, "-KZwWEmvglByJWO72guy" : {
            "comment" : "WOWO",
            "content" : "https://dev.bazaarvoice.com/trac/bvc/changeset?new=customers%2Fbranches%2Fuser%2Fobodrov-21038-myer%401656411&old=customers%2Fbranches%2Fuser%2Fobodrov-21038-myer%401656400",
            "reviewer" : "Bohdan Kokotko",
            "status" : "NotOK",
            "submissiontime" : "14/06/2017, 14:31:55",
            "submitimage" : "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
            "ticket" : "https://bits.bazaarvoice.com/jira/browse/SUP-21038",
            "username" : "Alexandr Bodrov"
          }, "-KZwWEmvglByJWO72guS" : {
            "comment" : "kk",
            "content" : "https://dev.bazaarvoice.com/trac/bvc/changeset/1656377",
            "reviewer" : "Igor Kokotko",
            "status" : "Looking",
            "submissiontime" : "15/06/2017, 12:39:11",
            "submitimage" : "https://lh3.googleusercontent.com/-HKWAKmqd3OQ/AAAAAAAAAAI/AAAAAAAAAGs/fIbbkaPOun0/photo.jpg",
            "ticket" : "https://bits.bazaarvoice.com/jira/browse/SUP-21035",
            "username" : "Станіслав Чепа"
          },
        },
        revs : "",
        activeUser : {
          displayName: 'Guest',
          photoURL : 'https://ssl.gstatic.com/images/icons/material/product/1x/avatar_circle_blue_120dp.png',
          isAnonymous : true,
          sessionLength: 0
        },
        displayNum : 5,
        searchTerm : 'SUP',
        firePath : {
          main : 'wow/nice',
          resources : 'wow/resources',
          reviewers : 'wow/resources/reviewers/all',
          schedule : 'wow/resources/schedule',
          holidays : 'wow/resources/holidays'
        },
        eventFormDate : moment(),
        currentYear : Number(moment().format('YYYY')),
        currentMonth : Number(moment().format('M')),
        eventFormActive : false,
        events : []
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
        firebasePathGetter : (state) => {
          return state.firePath
        },
        activeUserGetter : (state) => {
          return state.activeUser
        },
        displayNumGetter : (state) => {
          return state.displayNum
        },
        reviewersGetter : (state) => {
          return state.revs
        }
        
    },
    mutations : {
      [GET_FBASE] (state, payload) {
        console.log(payload)
        state.items = payload
      },
      [LOGIN_ME] (state, payload) {
        state.activeUser = payload
      },
      [UPDATE_NUM] (state, payload) {
        state.displayNum = Number(payload)
      },
      [GET_REVIEWERS] (state, payload) {
        state.revs = payload
      },
      // date
      setCurrentMonth(state,payload) {
            state.currentMonth = payload
        },
      setCurrentYear(state,payload) {
          state.currentYear = payload
      },
      eventFormActive(state, payload) {
          state.eventFormActive = payload
      },
      addEvent(state, payload) {
          // let obj = {  
          //     description : payload,
          //     date: state.eventFormDate
          // }
          state.events.push(payload)
          
      },
      eventFormUpdateDate(state, payload) {
          state.eventFormDate = payload
      },
    },
    actions : {
      [GET_FBASE] (store, payload) {
        store.commit(GET_FBASE, payload)
      },
      [GET_REVIEWERS] (store, payload) {
        store.commit(GET_REVIEWERS, payload)
      },
      [LOGIN_ME] (store, payload) {
        store.commit(LOGIN_ME, payload)
      },
      [UPDATE_NUM] (store, payload) {
        // check if number is positive
        if ((payload) > 0) store.commit(UPDATE_NUM, payload)
      },
      // date 
      addEvent(context, payload) {
            return new Promise((resolve, reject) => {
                let obj = {  
                    description : payload,
                    date: context.state.eventFormDate
                };
                // Axios.post('/add_event', obj).then(response => {
                //     if (response.status === 200) {
                //         context.commit('addEvent', obj);
                //         resolve('wow');
                //     } else {
                //         reject();
                //     }
                // })
            });
        }
    }
})