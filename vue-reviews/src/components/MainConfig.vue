<template>
    <div>
        <div class="c-main-section">
            <h4 v-if="activeUserGetter.isAnonymous">This sections is for logged users</h4>
            <h4 v-else-if="!levelDEVORPM(activeUserGetter.role)">You don't have permission to alter config, if you need one - request from PM/DEVs</h4>
            <md-button v-else id="configButton" @click="goGetUsers" class="md-accent md-raised">
                Update users 
                <md-tooltip md-direction="right">Will display global users setup(you can update most of the data/roles/teams on user basis)</md-tooltip>
            </md-button>
        </div>
        
        <ul v-if="levelDEVORPM(activeUserGetter.role) && isPM" class="c-main-section">
            
            <span class="md-display-3" v-if="!activeUserGetter.isAnonymous">{{ initialMessage }}</span>

            <li v-for="(item, key) in users" :key="key">
              
                <md-card>
                    <md-layout md-align="center" md-vertical-align="center" md-gutter md-row>
                      
                        <md-layout md-flex="20">
                            <md-card-content>{{ item['.key'] }}</md-card-content>
                        </md-layout>
                      
                        <md-layout>
                            <md-card-content>{{ item.alias }}</md-card-content>
                        </md-layout>
                      
                        <md-layout>
                            <md-input-container class="width80">
                            <label for="role" style="color:inherit">Role</label>
                              <md-select name="role" v-model="item.role">
                                <md-option v-for="option in roleOptions" :key="option.id" :value="option.name" @selected="onSelectChange(item, 'role')">{{option.name}}</md-option>
                              </md-select>
                            </md-input-container>
                        </md-layout>
                      
                        <md-layout>
                            <md-input-container class="width80">
                            <label for="team" style="color:inherit">Support Team</label>
                              <md-select name="team" v-model="item.team">
                                <md-option v-for="option in teamOptions" :key="option.id" :value="option.name" @selected="onSelectChange(item, 'team')">{{option.name}}</md-option>
                              </md-select>
                            </md-input-container>
                        </md-layout>
                        
                        <md-layout>
                            <md-input-container class="width80">
                            <label for="tester" style="color:inherit">TSE testing</label>
                              <md-select name="tester" v-model="item.tester">
                                <md-option v-for="option in tsetestingOptions" :key="option.id" :value="option.name" @selected="onSelectChange(item, 'tester')">{{option.name}}</md-option>
                              </md-select>
                            </md-input-container>
                        </md-layout>
                        
                        <md-layout>
                            <md-input-container class="width80">
                                <label :for="`reviewers__list__addnew${key}`">Special Notes</label>
                                <md-input :id="`reviewers__list__addnew${key}`" v-model="item.notes"></md-input>
                                <md-button @click="onSelectChange(item, 'notes')" class="md-icon-button"> 
                                   GO
                                </md-button>
                            </md-input-container>
                        </md-layout>
                      
                    </md-layout>
                </md-card>
              
            </li>
        </ul>
        <div v-if="levelDEVORPM(activeUserGetter.role)">
            <new-instance :inputs="mainConfigInputs" :requiredword="newInstanceRequiredWord" :path="firebasePathGetter.users" relcomponent="mainconfig"></new-instance>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import {mapActions, mapGetters} from 'vuex'
    import { FBApp } from '@/data/firebase-config'
    import { levelMixin } from '@/mixins/restrictions'
    import { newInstanceMixin } from '@/mixins/inputs'
    const NewInstance = () => import('@/components/NewInstance.vue')
    
    export default {
        name: 'MainConfig',
        data () {
            return {
                initialMessage : 'Users setup',
                role : 'Role',
                newInstanceRequiredWord: '',
                isPM : false
            }
        },
        firebase : {},
        mixins: [levelMixin, newInstanceMixin],
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
        },
        components : {
            NewInstance
        }
    }
</script>
<style scoped>
    
    .width80 {
        max-width: 80%;
    }
    
</style>