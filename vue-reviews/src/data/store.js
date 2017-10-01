import Vue from 'vue'

import Vuex from 'vuex'
Vue.use(Vuex)

import moment from 'moment-timezone'
moment.tz.guess()

import lodash from 'lodash'
import VueLodash from 'vue-lodash/dist/vue-lodash.min'
Vue.use(VueLodash, lodash)


import {GET_FBASE, LOGIN_ME, UPDATE_NUM, GET_REVIEWERS, GET_HOLIDAYS, GET_CAPACITY, SET_MONTH, SET_YEAR, SET_FOCUSED_CELL, SET_IS_EDITING, SET_COPY_CACHE, SET_CURRENT_WEEK, GET_USERS, SET_PREFIXES} from './mutation-types'

export default new Vuex.Store({
    state : {
        capacity: [],
        focusedCell: {},
        items : {
          "0" : {
            ".key" : "1503202651791",
            "comment" : "css fix",
            "content" : "/1655761",
            "reviewer" : "user2",
            "status" : "Good",
            "ticket" : "/SUP-21014",
            "rc": "Ok this is good",
            "username" : "user1"
          }, "1" : {
            ".key" : "1504503651791",
            "comment" : "WOWO",
            "content" : "/1656321",
            "reviewer" : "user1",
            "status" : "NotOK",
            "ticket" : "/SUP-21038",
            "rc": "You're playing with fire kid",
            "username" : "user2"
          }, "2" : {
            ".key" : "1505006651791",
            "comment" : "interesting case!",
            "content" : "/1656377",
            "reviewer" : "user1",
            "status" : "Looking",
            "ticket" : "/SUP-21035",
            "rc": "I'll take a look soon",
            "username" : "user1"
          }, "3" : {
            ".key" : "1505006651712",
            "comment" : "if your changeset is 'urgent' just use this word in any form",
            "content" : "/1656376",
            "reviewer" : "user1",
            "status" : "New",
            "ticket" : "/SUP-21039",
            "rc": "wow!",
            "username" : "user1"
          },
        },
        editableItemClass: 'capacity-editable',
        isEditing: false,
        copyCache: {
          el: null,
          data: ''
        },
        revs : "", // List of reviewers, filled upon login
        holidays : "", // List of holidays, filled upon login
        reviewersPerDay : 3, // Number of reviewers per day
        reviewersScheduleAhead : 21, // Number of days to reschedule
        activeUser : {
          displayName: 'Guest',
          isAnonymous : true,
          role: "", // not best practice but very convenient, won't require additional if-elses on user-login
          alias: "", // if user isn't in read-only firebase boject "users" - login response always returns 'undefined'
          team: "",
          token: 1111111,
          notes: ""
        },
        displayNum : 5,
        searchTerm : 'SUP',
        users: [],
        firePath : {
          main : 'wow/nice',
          resources : 'wow/resources',
          reviewers : 'wow/resources/reviewers',
          schedule : 'wow/resources/schedule',
          users : 'wow/users',
          capacity: 'wow/resources/capacityByWeek',
          notifications : 'wow/notifications',
          guidelines: 'wow/guidelines',
          knowledgesharing: 'wow/knowledgesharing',
          prefixes: 'wow/resources/prefixes'
        },
        globalPrefixes : {
          tickets : {label : '', val : 'https://bits.bazaarvoice.com/jira/browse'},
          changes : {label : '', val : 'https://dev.bazaarvoice.com/trac/bvc/changeset'}
        },
        eventAppDate : moment(),
        currentYear : Number(moment().format('YYYY')),
        currentMonth : Number(moment().format('M')),
        currentWeek : Number(moment().isoWeek()),
        eventFormActive : false,
        activeReviewers : [],
        workingHours : ['10,11,12' , '13,14,15' , '16,17']
    },
    getters : {
        firebasePathGetter : (state) => {
          return state.firePath
        },
        globalPrefixesGetter : (state) => {
          return state.globalPrefixes
        },
        workingHoursGetter : (state) => {
          return state.workingHours
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
          const usersArr = state.users;
          const teams = [];
          const teamRegExp = /([a-z]|[A-Z])*/gi;
          usersArr.forEach((userItem, index) => {
            const userTeam = userItem['team'].match(teamRegExp)[0];
            if(teams.indexOf(userTeam) === -1 && userTeam !== 'Newcomer') {
              teams.push(userTeam);
            }
          });
          teams.sort();
          return teams;
        },
        subTeamsByTeamGetter: (state) => (team) => {
          const usersArr = state.users;
          const subTeams = [];
          const subTeamRegExp = new RegExp('^' + team, 'i');
          usersArr.forEach((userItem, index) => {
            const userSubTeam = userItem['team'];
            const isSubTeaminTeam = subTeamRegExp.test(userSubTeam);
            if(isSubTeaminTeam && subTeams.indexOf(userSubTeam) === -1 && userSubTeam !== 'Newcomer') {
              subTeams.push(userSubTeam);
            }
          });
          subTeams.sort();
          return subTeams;
        },
        usersBySubTeamGetter: (state) => (subTeam) => {
          const usersArr = state.users;
          const usersBySubTeam = [];
          let subTeamLead;
          usersArr.forEach((userItem, index) => {
            const userSubTeam = userItem['team'];
            if(userItem['team'] === subTeam && ['Engineer', 'TeamLead', 'Reviewer'].indexOf(userItem['role']) !== -1) {
              if(userItem['role'] === 'TeamLead') {
                subTeamLead = userItem['alias'];
              } else {
                usersBySubTeam.push(userItem['alias']);
              }
            }
          });
          usersBySubTeam.sort();
          if(subTeamLead) {
            usersBySubTeam.unshift(subTeamLead);
          }
          return usersBySubTeam;
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
        capacityByTeamGetter: (state) => (team) => {
          const usersArr = state.users;
          const users = [];
          const subTeamRegExp = new RegExp('^' + team, 'i');
          usersArr.forEach((userItem) => {
            const userSubTeam = userItem['team'];
            if(subTeamRegExp.test(userSubTeam)) {
              users.push(userItem['alias']);
            }
          });
          const capacity = state.capacity;
          const teamCapacity = [];
          capacity.forEach((val, index) => {
            const currentUser = capacity[index]['.key'];
            if(users.indexOf(currentUser) !== -1) {
              const splitCapacity = capacity[index]['.value'].split('||');
              teamCapacity.push(splitCapacity[0]);
            }
          })
          return teamCapacity;
        },
        userInfoGetter: (state) => (alias, info) => {
          const usersArr = state.users;
          let i = 0;
          while(1) {
            if(usersArr[i]['alias'] === alias) {
              if(info) {
                return usersArr[i][info];
              } else {
                return usersArr[i];
              }
            }
            i++;
          }
        },
        focusedUserGetter: (state) => {
          return state.focusedCell.user;
        },
        focusedCellGetter: (state) => {
          return state.focusedCell.cell
        },
        editableItemClassGetter: (state) => {
          return state.editableItemClass;
        },
        isEditingGetter: (state) => {
          return state.isEditing;
        },
        copyCacheGetter: (state) => {
          return state.copyCache;
        },
        currentWeekGetter: (state) => {
          return state.currentWeek;
        },
    },
    mutations : {
      [SET_PREFIXES] (state, payload) {
        state.globalPrefixes = payload
      },
      [GET_CAPACITY] (state, payload) {
        state.capacity = payload
      },
      [GET_USERS] (state, payload) {
        state.users = payload
      },
      [SET_IS_EDITING] (state, payload) {
        state.isEditing = payload;
      },
      [SET_COPY_CACHE] (state, payload) {
        state.copyCache.data = payload.data;
        state.copyCache.el = payload.el;
      },
      [SET_CURRENT_WEEK] (state, payload) {
        state.currentWeek = payload;
      },
      [GET_FBASE] (state, payload) {
        state.items = payload
      },
      [LOGIN_ME] (state, payload) {
        state.activeUser = payload
      },
      [UPDATE_NUM] (state, payload) {
        state.displayNum = payload
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
      [GET_USERS] (store, payload) {
        store.commit(GET_USERS, payload)
      },
      [SET_IS_EDITING] (store, payload) {
        store.commit(SET_IS_EDITING, payload)
      },
      [SET_COPY_CACHE] (store, payload) {
        store.commit(SET_COPY_CACHE, payload)
      },
      [SET_CURRENT_WEEK] (store, payload) {
        store.commit(SET_CURRENT_WEEK, payload)
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
        payload = Number(payload)
        if (payload > 0 && payload < 200 ) {
          store.commit(UPDATE_NUM, payload)
        } else {
          console.assert(false,'Your number is less than 0 or bigger than 200.')
        }
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
      [SET_PREFIXES] (store,payload) {
        store.commit(SET_PREFIXES, payload)
      }
    }
})
