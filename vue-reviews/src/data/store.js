import Vue from 'vue'

import Vuex from 'vuex'
Vue.use(Vuex)

import moment from 'moment-timezone'
moment.tz.guess()

import {GET_FBASE, LOGIN_ME, UPDATE_NUM, GET_REVIEWERS, GET_HOLIDAYS, GET_CAPACITY, SET_MONTH, SET_YEAR, GET_TODAYREVIEWERS, SET_FOCUSED_CELL} from './mutation-types'

export default new Vuex.Store({
    state : {
        capacity: [
          {
            '.key': 'Fake Blade',
            '.value': '4,4,4,4,4|0,1.5,3,2,0|1,2,1,1,0||NA||Fake Blade'
          },
          {
            '.key': 'Fake Batman',
            '.value': '4,4,4,4,4|0,1.5,3,2,0|1,2,1,1,0||NA||Fake Blade'
          },
          {
            '.key': 'Fake Gambit',
            '.value': '4,4,4,4,4|0,1.5,3,2,0|1,2,1,1,0||NA||Fake Gambit'
          },
          {
            '.key': 'Fake Wolverine',
            '.value': '4,4,4,4,4|0,1.5,3,2,0|1,2,1,1,0||NA||Fake Gambit'
          },
          {
            '.key': 'Fake Spiderman',
            '.value': '4,4,4,4,4|0,1.5,3,2,0|1,2,1,1,0||EMEA||Fake Spiderman'
          },
          {
            '.key': 'Fake Green Goblin',
            '.value': '4,4,4,4,4|0,1.5,3,2,0|1,2,1,1,0||EMEA||Fake Spiderman'
          },
          {
            '.key': 'Fake Tony Stark',
            '.value': '4,4,4,4,4|0,1.5,3,2,0|1,2,1,1,0||EMEA||Fake Tony Stark'
          },
          {
            '.key': 'Fake Tor',
            '.value': '4,4,4,4,4|0,1.5,3,2,0|1,2,1,1,0||EMEA||Fake Tony Stark'
          }
        ],
        focusedCell: {},
        items : {
          "-KZvonwRi7MBVk7YEiCe" : {
            "comment" : "css fix",
            "content" : "https://dev.bazaarvoice.com/trac/bvc/changeset/1655761",
            "reviewer" : "user2",
            "status" : "Good",
            "st" : "12/06/2017, 16:27:22",
            "ticket" : "https://bits.bazaarvoice.com/jira/browse/SUP-21014",
            "rc": "Ok this is good",
            "username" : "user1"
          }, "-KZwWEmvglByJWO72guy" : {
            "comment" : "WOWO",
            "content" : "https://dev.bazaarvoice.com/trac/bvc/changeset?new=customers%2Fbranches%2Fuser%2Fobodrov-21038-myer%401656411&old=customers%2Fbranches%2Fuser%2Fobodrov-21038-myer%401656400",
            "reviewer" : "user1",
            "status" : "NotOK",
            "st" : "14/06/2017, 14:31:55",
            "ticket" : "https://bits.bazaarvoice.com/jira/browse/SUP-21038",
            "rc": "You're playing with fire kid",
            "username" : "user2"
          }, "-KZwWEmvglByJWO72guS" : {
            "comment" : "kk",
            "content" : "https://dev.bazaarvoice.com/trac/bvc/changeset/1656377",
            "reviewer" : "user1",
            "status" : "Looking",
            "st" : "15/06/2017, 12:39:11",
            "ticket" : "https://bits.bazaarvoice.com/jira/browse/SUP-21035",
            "rc": "I'll take a look soon",
            "username" : "user1"
          },
        },
        revs : "", // List of reviewers, filled upon login
        holidays : "", // List of holidays, filled upon login
        reviewersPerDay : 3, // Number of reviewers per day
        reviewersScheduleAhead : 14, // Number of days to reschedule
        activeUser : {
          displayName: 'Guest',
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
          notifications : 'wow/notifications',
          guidelines: 'wow/guidelines',
          knowledgesharing: 'wow/knowledgesharing'
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
          let capacityLength = capacity.length;
          let teams = [];
          let team = '';
          for(let i = 0; i < capacityLength; i++) {
            team = capacity[i]['.value'].split('||')[1];
            if(teams.indexOf(team) === -1) {
              teams.push(team);
            }
          }
          teams.sort();
          return teams;
        },
        leadsByTeamGetter: (state) => (team) => {
          let capacity = state.capacity;
          let capacityLength = capacity.length;
          let leadsByTeam = [];
          let lead;
          let leadsTeam;
          let splitCapacity;
          for(let i = 0; i < capacityLength; i++) {
            splitCapacity = capacity[i]['.value'].split('||');
            lead = splitCapacity[2];
            leadsTeam = splitCapacity[1];
            if (leadsTeam !== team) {
              continue;
            }
            if(leadsByTeam.indexOf(lead) === -1) {
              leadsByTeam.push(lead);
            }
          }
          leadsByTeam.sort();
          return leadsByTeam;
        },
        usersByLeadGetter: (state) => (lead) => {
          let capacity = state.capacity;
          let capacityLength = capacity.length;
          let usersByLead = [];
          let user;
          let usersLead;
          let splitCapacity;
          for(let i = 0; i < capacityLength; i++) {
            splitCapacity = capacity[i]['.value'].split('||');
            usersLead = splitCapacity[2];
            user = capacity[i]['.key']
            if (usersLead !== lead || usersLead === user) {
              continue;
            }
            if(usersByLead.indexOf(user) === -1) {
              usersByLead.push(user);
            }
          }
          usersByLead.sort();
          usersByLead.push(lead);
          return usersByLead;
        },
        capacityByUserGetter: (state) => (user) => {
          let capacity = state.capacity;
          let capacityLength = capacity.length;
          let currentUser;
          for(let i = 0; i < capacityLength; i++) {
            currentUser = capacity[i]['.key']
            if(currentUser === user) {
              return capacity[i]['.value'];
            }
          }
        },
        usersByTeam: (state) => (team) => {
          // => TODO
/*           let capacity = state.capacity;
          let capacityLength = capacity.length;
          let splitCapacity;
          let currentUser;
          let index;
          for(let i = 0; i < capacityLength; i++) {
            currentUser = capacity[i]['.key']
            if(currentUser === user) {
              splitCapacity = capacity[i]['.value'].split('|');
              break;
            }
          }
          switch (type) {
            case 'requested':
              index = 0;
              break;
            case 'received':
              index = 1;
              break;
            case 'tickets':
              index = 2;
              break;
          }
          if (type !== undefined) {
            return splitCapacity[index].split(',');
          } else {
            return splitCapacity;
          } */

        },
        focusedUserGetter: (state) => {
          return state.focusedCell.user;
        },
        focusedDayGetter: (state) => {
          return state.focusedCell.day;
        }
    },
    mutations : {
      [GET_CAPACITY] (state, payload) {
        state.capacity = payload
      },
      [GET_CAPACITY] (state, payload) {
        state.capacity = payload
      },
      [GET_FBASE] (state, payload) {
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
      [SET_FOCUSED_CELL] (state, payload) {
        state.focusedCell = payload
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
      }
    },
    actions : {
      [SET_FOCUSED_CELL] (store, payload) {
        store.commit(SET_FOCUSED_CELL, payload)
      },
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
      }
    }
})
