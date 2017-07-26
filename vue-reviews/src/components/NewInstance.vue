<template>
    <md-layout class="c-main-section">
        <md-layout v-for="(item, index) in inputs" :key="index">
            <md-input-container>
                <label :for="item.id">{{item.label}}</label>
                <md-input :id="item.id" v-model="item.val" :required="item.required" :maxlength="item.maxLength"></md-input>
            </md-input-container>
        </md-layout>
        <md-layout md-flex="15">
            <md-button class="md-raised md-accent" :disabled="disableSubmit" @click="submitData(activeUserGetter, $event)">Submit</md-button>
            <md-button class="md-raised" @click="clearData">Clear</md-button>
        </md-layout>
    </md-layout>
</template>

<script>
    import firebase from 'firebase'
    import { FBApp } from './../data/firebase-config'
    var provider = new firebase.auth.GoogleAuthProvider();
    import { levelMixin } from '@/mixins/restrictions'
    import {mapActions, mapGetters } from 'vuex'
    export default {
        mixins: [levelMixin],
        props : ['inputs','requiredword', 'path', 'relcomponent'],
        data () {
            return {
                inputsInvalid : true
            }
        },
        computed : {
            ...mapGetters(['activeUserGetter']),
            disableSubmit () {
                return this.inputsInvalid
            }
        },
        watch: {
            inputs : {
                handler(after, before) {
                    let stater = after.every((el) => (el.required && !el.val.includes(this.requiredword)) ? false : true)
                    this.inputsInvalid = stater ? false : true
                },
                deep: true
            }
          },
        methods : {
            submitData (user, el) {
                if (this.inputsInvalid) {
                    el.target.setAttribute('disabled', this.inputsInvalid)
                    
                } else if (!user.isAnonymous && this.levelDEVORPM(user.role) && this.path) {
                    
                    // relcomponent indicates the component that is relevant for our concrete newInstance component
                    if (this.relcomponent === 'codereview') {
                        
                        let newData = {
                            username: user.alias,
                            si:  user.photoURL,
                            content: this.inputs[0].val,
                            ticket: this.inputs[1].val,
                            status: 'New',
                            reviewer: '',
                            st : this.$moment().format('DD-MM-YYYY, hh:mm:ss')
                        } 
                        if (this.inputs[2].val) { newData.comment = this.inputs[2].val }
                        FBApp.ref(this.path).push(newData)
                        
                    } else if (this.relcomponent === 'mainconfig' && this.defaultRoleOption && this.defaultTeamOption) {
                        
                        let token = this.inputs[0].val ? this.inputs[0].val : 'WrongToken'
                        let alias = this.inputs[1].val ? this.inputs[1].val : 'WrongAlias'
                        FBApp.ref(this.path +"/" + token).set({alias: alias, role : this.defaultRoleOption, team : this.defaultTeamOption})
                        
                    }
                    
                }
                
                this.clearData()
            },
            clearData (el) {
                this.inputs.map(el=> el.val = "")
            }
        }
        
    }
</script>
