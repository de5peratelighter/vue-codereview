import Vue from 'vue'

import Vuex from 'vuex'
Vue.use(Vuex)

import moment from 'moment-timezone'
moment.tz.guess()

import {GET_FBASE, LOGIN_ME, UPDATE_NUM, GET_REVIEWERS, GET_HOLIDAYS, GET_CAPACITY, SET_MONTH, SET_YEAR, GET_TODAYREVIEWERS} from './mutation-types'

export default new Vuex.Store({
    state : {
        capacity: {
          "Fake Blade": "4,4,4,4,4|0,1.5,3,2,0|1,2,1,1,0||NA||Fake Blade",
          "Fake Batman": "1,1,1,1,1|0,1.5,3,2,0|1,2,1,1,0||NA||Fake Blade",
        },
        items : {
          "-KZvonwRi7MBVk7YEiCe" : {
            "comment" : "css fix",
            "content" : "https://dev.bazaarvoice.com/trac/bvc/changeset/1655761",
            "reviewer" : "user2",
            "status" : "Good",
            "st" : "12/06/2017, 16:27:22",
            "si" : "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
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
            "si" : "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
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
          schedule : 'wow/resources/schedule',
          users : 'wow/users',
          capacity: 'wow/resources/capacityByWeek',
          notifications : 'wow/notifications'
        },
        eventAppDate : moment(),
        currentYear : Number(moment().format('YYYY')),
        currentMonth : Number(moment().format('M')),
        currentWeek : Number(moment().week()),
        eventFormActive : false,
        activeReviewers : []
    },
    getters : {
        firebasePathGetter : (state) => {
          return state.firePath
        },
        activeUserGetter : (state) => {
          return state.activeUser
        },
        displayNumGetter : (state) => {
          return state.displayNum
        },
        revsGetter : (state) => {
          let obj = {}
          state.revs ? state.revs.split(',').forEach((el, i)=> { obj[i] = el}) : obj = state.revs
          return obj
        },
        holidaysGetter : (state) => {
          let obj = {} // an object, if data is received from Firebase - restructure it into object (kept in Firebase as a single String)
          state.holidays ? state.holidays.split(',').forEach((el, i)=> { obj[i] = el}) : obj = state.holidays
          return obj
        },
        revPerDayGetter : (state) => {
          return state.reviewersPerDay
        },
        revScheduleDaysGetter : (state) => {
          return state.reviewersScheduleAhead
        },
        teamsGetter: (state) => {
          let capacity = state.capacity;
          let teams = [];
          let team = '';
          let user;
          for (user in capacity) {
            team = capacity[user].split('||')[1];
            if(teams.indexOf(team) === -1) {
              teams.push(team);
            }
          }
          return (teams);
        },
        leadsGetter: (state) => {
          let capacity = state.capacity;
          let leads = [];
          let lead = '';
          let user;
          for (user in capacity) {
            lead = capacity[user].split('||')[2];
            if(leads.indexOf(lead) === -1) {
              leads.push(lead);
            }
          }
          return (leads);
        }
    },
    mutations : {
      [GET_CAPACITY] (state, payload) {
        state.capacity = payload
      },
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
      [SET_MONTH] (state, payload) {
        state.currentMonth = payload
      },
      [SET_YEAR] (state, payload) {
        state.currentYear = payload
      },
      eventFormActive(state, payload) {
        state.eventFormActive = payload
      },
      [GET_TODAYREVIEWERS] (state,payload) {
        state.activeReviewers = payload
      }
    },
    actions : {
      [GET_CAPACITY] (store, payload) {
        store.commit(GET_CAPACITY, payload)
      },
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
      },
      [SET_MONTH] (store,payload) {
        store.commit(SET_MONTH, payload)
      },
      [SET_YEAR] (store,payload) {
        store.commit(SET_YEAR, payload)
      },
      [GET_TODAYREVIEWERS] (store,payload) {
        if (payload) {
          console.log(payload)
          store.commit(GET_TODAYREVIEWERS, payload.split(',').slice(0,-1))
        }
      }
    }
})