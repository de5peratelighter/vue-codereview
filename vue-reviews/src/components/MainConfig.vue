<template>
    <div>
        <div class="c-main-section">
            <span v-if="activeUserGetter.isAnonymous" class="md-display-3">This sections is for logged users</span>
            <md-button v-else id="configButton" @click="goGetUsers" class="md-accent">
              Get users
            </md-button>
        </div>
        
        <ul v-if="isPM && !activeUserGetter.isAnonymous" class="c-main-section">
        <span class="md-display-3" v-if="!activeUserGetter.isAnonymous">{{ initialMessage }}</span>
        
        <li  v-for="(item, key) in users" :key="key">
          
          <md-card>
            <md-layout md-align="center" md-vertical-align="center" md-gutter md-row>
              
                <md-layout>
                    <md-card-content>{{ item['.key'] }}</md-card-content>
                </md-layout>
              
                <md-layout>
                    <md-card-content>{{ item.alias }}</md-card-content>
                </md-layout>
              
              <!--<md-layout>-->
              <!--  <md-button :href="item.ticket" target="_blank">-->
              <!--    {{ truncContent(item.ticket, 'ticket') }}-->
              <!--  </md-button>-->
              <!--</md-layout>-->
              
                <md-layout>
                    <md-input-container class="width60">
                    <label for="role" style="color:inherit">Role</label>
                      <md-select name="role" v-model="item.role">
                        <md-option v-for="option in roleOptions" :key="option.id" :value="option.name" @selected="onSelectChange(item, 'role')">{{option.name}}</md-option>
                      </md-select>
                    </md-input-container>
                </md-layout>
              
                <md-layout>
                    <md-input-container class="width60">
                    <label for="team" style="color:inherit">Team</label>
                      <md-select name="team" v-model="item.team">
                        <md-option v-for="option in teamOptions" :key="option.id" :value="option.name" @selected="onSelectChange(item, 'team')">{{option.name}}</md-option>
                      </md-select>
                    </md-input-container>
                </md-layout>
              
            </md-layout>
          </md-card>
          
        </li>
      </ul>
        
    </div>
</template>

<script>
    import firebase from 'firebase'
    import {mapActions, mapGetters} from 'vuex'
    import FBApp from '@/data/firebase-config'
    
    export default {
        name: 'MainConfig',
        data () {
            return {
                initialMessage : 'Users setup',
                role : 'Role',
                isPM : false,
                roleOptions : [
                    { id: 1, name: 'Guest'},
                    { id: 2, name: 'Engineer'},
                    { id: 3, name: 'Reviewer'},
                    { id: 4, name: 'TeamLead'},
                    { id: 5, name: 'PM_DEV'},
                ],
                teamOptions : [
                    { id: 1, name: 'NA1'},
                    { id: 2, name: 'NA2'},
                    { id: 3, name: 'EMEA'},
                    { id: 4, name: 'Managers'},
                    { id: 5, name: 'Guest'}
                ]
            }
        },
        firebase : {},
        computed : {
            ...mapGetters(['activeUserGetter','firebasePathGetter'])
        },
        methods : {
            goGetUsers () {
                this.$bindAsArray('users', FBApp.ref(this.firebasePathGetter.users),null, () => {
                    this.isPM = true
                })
            },
            onSelectChange (el, action) {
                if (action) {
                    FBApp.ref(this.firebasePathGetter.users +"/" + el['.key']).update({[action] : el[action]})
                }
            }
        }
    }
</script>
<style scoped>
    
    .width60 {
        max-width: 60%;
    }
    
</style>