<template>
    <div>
        <div class="c-main-section">
          <template v-if="levelDEVORPM(activeUserGetter.role)">
            <md-layout md-gutter md-align="center">
              <md-button class="md-raised md-primary" @click="getFullData">Calculate codereview statistics</md-button>
              <md-button class="md-raised md-primary" disabled>Calculate capacity statistics</md-button>
            </md-layout>
            <md-layout v-if="isNotEmpty(users)" md-gutter md-align="center">
                <md-table>
                  <md-table-header>
                    <md-table-row>
                      <md-table-head>User</md-table-head>
                      <md-table-head md-numeric md-tooltip="The total amount of food energy and the given serving size">Changesets</md-table-head>
                      <md-table-head md-numeric>NotOKs</md-table-head>
                      <md-table-head md-numeric>Reviews</md-table-head>
                      <md-table-head md-numeric>NotOKs by reviewer</md-table-head>
                    </md-table-row>
                  </md-table-header>
                
                  <md-table-body>
                    <md-table-row v-for="(row, ind, key) in users" :key="key">
                      <md-table-cell> <template v-if="row.username">{{row.username}}</template> <template v-else>{{noUserMessage}}</template> </md-table-cell>
                      <md-table-cell>{{row.changesNum}}</md-table-cell>
                      <md-table-cell>{{row.notoks}} {{ findPercentage(row.changesNum,row.notoks) }}</md-table-cell>
                      <md-table-cell>{{row.reviews}}</md-table-cell>
                      <md-table-cell>{{row.rnotoks}} {{ findPercentage(row.reviews,row.rnotoks) }}</md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table> 
                
            </md-layout>
          </template>
          <h4 v-else>{{notTeamLeadMessage}}</h4>
        </div>
    </div>
</template>

<script>
  import firebase from 'firebase'
  import { levelMixin } from '@/mixins/restrictions'
  import { FBApp } from '@/data/firebase-config'
  import {mapActions, mapGetters } from 'vuex'
    export default {
        name: 'StatsTable',
        data () {
          return {
            notTeamLeadMessage : 'This data is accessible only for teamlead and PMs',
            noUserMessage: 'Not reviewed yet',
            users : {}
          }
        },
        computed : {
          ...mapGetters(['activeUserGetter', 'firebasePathGetter'])
        },
        mixins: [levelMixin],
        firebase : {},
        methods : {
          isNotEmpty(users) {
            return Object.keys(users).length > 0
          },
          findPercentage (num,notoks) {
            return notoks ? " (" + this._.parseInt(notoks * 100 / num) + "%)" : ""
          },
          getFullData () {
              this.$bindAsArray('itemsArray', FBApp.ref(this.firebasePathGetter.main), null, () => {
                let users = {}
                let reviewers = {}
                for (let value of this.itemsArray) {
                  let user = value.username ;
                  // checking if user is already in the statistics
                  if (!users[user]) 
                    {let inst = users[user] = {}; inst.username = user; inst.changesNum = 1; inst.notoks = 0;
                    if (value.status == "NotOK") ++inst.notoks;}
                  else {let inst = users[user]; 
                    inst.changesNum++;  
                    if (value.status == "NotOK") ++inst.notoks;}
                  // checking if reviewer is already in the statistics
                  if (!users[value.reviewer]) 
                    {let inst = users[value.reviewer] = {}; inst.username=value.reviewer; inst.reviews = 1;
                    inst.changesNum=0; inst.notoks = 0;
                    if (value.status == "NotOK") (++inst.rnotoks)||(inst.rnotoks = 1);
                    } 
                  else {
                    let inst = users[value.reviewer]; 
                    (++inst.reviews)||(inst.reviews = 1);
                    if (value.status == "NotOK") (++inst.rnotoks)||(inst.rnotoks = 1);
                  }
                }
                this.users = this._.orderBy(users, 'username')
            })
          }
        },
        watch: {
          activeUserGetter (newCount, oldCount) {
            if (!newCount.isAnonymous) {
              this.users = {}
            }
          }
        }
    }
</script>
<style scoped>
  .md-table-cell-container {
    text-align: center;
  }
</style>