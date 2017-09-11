<template>
    <div>
        <md-layout md-flex-offset="5"> 
            <md-button id="configButton" @click="goGetGuidelines" class="md-accent md-raised">
                Update guidelines 
                <md-tooltip md-direction="right">Will display code review guidelines</md-tooltip>
            </md-button>
        </md-layout>
        
        <md-layout md-flex-offset="5" md-flex="95">
                <md-tabs md-fixed md-centered>
                    <md-tab v-for="(topic,label,index) in guides" :id="label" :md-label="label" :key="index">
                        <template>
                            <md-input-container v-for="(el,keynext) in topic" :key="keynext" :added="showAddedDate(keynext)" class="zero__space">
                                <md-textarea v-model="el.val"></md-textarea>
                                <md-button class="md-icon-button md-raised md-dense" v-clipboard:copy="el.val">
                                  <md-icon>content_copy</md-icon>
                                  <md-tooltip md-direction="bottom">Same as Ctrl+C for this rule</md-tooltip>
                                </md-button>
                                <md-button class="md-icon-button md-raised md-dense" @click="updateGuideline(label, keynext, el.val)">
                                  <md-icon>done</md-icon>
                                  <md-tooltip md-direction="bottom">Click to update the rule</md-tooltip>
                                </md-button>
                            </md-input-container>
                            <md-layout>
                                <md-input-container>
                                    <label>Add new rule</label>
                                    <md-textarea maxlength="270" class="md-fab md-mini md-clean" v-model="index" ></md-textarea>
                                    <md-button class="md-raised md-primary" @click="pushNewGuideline(label, index)">Add</md-button>
                                </md-input-container>
                            </md-layout>
                        </template>
                        
                    </md-tab>
                </md-tabs>
        </md-layout>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import {mapGetters} from 'vuex'
    import { FBApp } from '@/data/firebase-config'
    import { optionsMixin } from '@/mixins/restrictions'
    import { newInstanceMixin } from '@/mixins/inputs'
    export default {
        name: 'GuidelinesConfig',
        data () {
            return {
                guides : {}
            }
        },
        mixins: [optionsMixin, newInstanceMixin],
        computed : {
            ...mapGetters(['firebasePathGetter', 'activeUserGetter'])
        },
        firebase : {},
        methods : {
            goGetGuidelines () {
                this.$bindAsObject('guidelines', FBApp.ref(this.firebasePathGetter.guidelines), null, () => {
                    this.guides = this.guidelines
                    FBApp.ref(this.firebasePathGetter.guidelines).on('value', (el) => {
                        this.guides = el.val()
                    })
                })
            },
            pushNewGuideline (el, val) {
                FBApp.ref(this.firebasePathGetter.guidelines + '/' + el + '/' + this.$moment().valueOf()).set({
                    val : val, modifiedby : this.activeUserGetter.alias
                })
            },
            showAddedDate (el) {
                return this.$moment(Number(el)).format("DD-MMM-YY")
            },
            updateGuideline (parentKey, childKey, val) {
                let result = val ?  {val : val, modifiedby : this.activeUserGetter.alias} : {}
                FBApp.ref(this.firebasePathGetter.guidelines + '/' + parentKey + '/' + childKey).set(result)
            }
        }
    }
</script>

<style scoped>
    
    .width80 {
        max-width: 80%;
    }
    ul {
        width: 100%;
    }
    
</style>