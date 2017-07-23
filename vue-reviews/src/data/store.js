import Vue from 'vue'

import Vuex from 'vuex'
Vue.use(Vuex)

import moment from 'moment-timezone'
moment.tz.guess()

import {GET_FBASE, LOGIN_ME, UPDATE_NUM, GET_REVIEWERS, GET_HOLIDAYS} from './mutation-types'

export default new Vuex.Store({
    state : {
        items : {
          "-KZvonwRi7MBVk7YEiCe" : {
            "comment" : "css fix",
            "content" : "https://dev.bazaarvoice.com/trac/bvc/changeset/1655761",
            "reviewer" : "user2",
            "status" : "Good",
            "st" : "12/06/2017, 16:27:22",
            "si" : "https://lh5.googleusercontent.com/-3Hk73cIZ3no/AAAAAAAAAAI/AAAAAAAAADA/HEzBAYy-kC0/photo.jpg",
            "ticket" : "https://bits.bazaarvoice.com/jira/browse/SUP-21014",
          "username" : "user1"
          }, "-KZwWEmvglByJWO72guy" : {
            "comment" : "WOWO",
            "content" : "https://dev.bazaarvoice.com/trac/bvc/changeset?new=customers%2Fbranches%2Fuser%2Fobodrov-21038-myer%401656411&old=customers%2Fbranches%2Fuser%2Fobodrov-21038-myer%401656400",
            "reviewer" : "user1",
            "status" : "NotOK",
            "st" : "14/06/2017, 14:31:55",
            "si" : "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
            "ticket" : "https://bits.bazaarvoice.com/jira/browse/SUP-21038",
            "username" : "user2"
          }, "-KZwWEmvglByJWO72guS" : {
            "comment" : "kk",
            "content" : "https://dev.bazaarvoice.com/trac/bvc/changeset/1656377",
            "reviewer" : "user1",
            "status" : "Looking",
            "st" : "15/06/2017, 12:39:11",
            "si" : "https://lh3.googleusercontent.com/-HKWAKmqd3OQ/AAAAAAAAAAI/AAAAAAAAAGs/fIbbkaPOun0/photo.jpg",
            "ticket" : "https://bits.bazaarvoice.com/jira/browse/SUP-21035",
            "username" : "user1"
          },
        },
        revs : "", // List of reviewers, filled upon login
        holidays : "", // List of holidays, filled upon login
        reviewersPerDay : 3, // Number of reviewers per day
        reviewersScheduleAhead : 14, // Number of days to reschedule
        activeUser : {
          displayName: 'Guest',
          photoURL : 'https://ssl.gstatic.com/images/icons/material/product/1x/avatar_circle_blue_120dp.png',
          isAnonymous : true,
          role: undefined, // not best practice but very convenient, won't require additional if-elses on user-login
          alias: undefined, // if user isn't in read-only firebase boject "users" - login response always returns 'undefined'
          team: undefined,
          token: 1111111
        },
        displayNum : 5,
        searchTerm : 'SUP',
        firePath : {
          main : 'wow/nice',
          resources : 'wow/resources',
          reviewers : 'wow/resources/reviewers',
          // holidays : 'wow/resources/holidays/all',
          schedule : 'wow/resources/schedule',
          users : 'wow/users'
        },
        eventAppDate : moment(),
        eventFormDate : moment(),
        currentYear : Number(moment().format('YYYY')),
        currentMonth : Number(moment().format('M')),
        eventFormActive : false
    },
    getters : {
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
        },
        holidaysGetter : (state) => {
          return state.holidays
        },
        revPerDayGetter : (state) => {
          return state.reviewersPerDay
        },
        revScheduleDaysGetter : (state) => {
          return state.reviewersScheduleAhead
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
      [GET_HOLIDAYS] (state, payload) {
        state.holidays = payload
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
      [GET_HOLIDAYS] (store,payload) {
        store.commit(GET_HOLIDAYS, payload)
      }
    }
})