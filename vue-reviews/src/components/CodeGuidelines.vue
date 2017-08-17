<template>
    <div>
        <md-tabs md-fixed md-centered>
           <md-tab v-for="(element,key,index) in guides" :id="key" :md-label="key" :key="index">
    
                <template v-if="levelDEVORPM(activeUserGetter.role)">
                    <md-input-container v-for="(el,keynext) in element" :key="keynext" :added="showAddedDate(keynext)">
                        <md-input v-model="el.val"></md-input>
                        <md-button class="md-icon-button md-raised md-dense" v-clipboard:copy="el.val">
                          <md-icon>content_copy</md-icon>
                        </md-button>
                        <md-button class="md-icon-button md-raised md-dense" @click="updateGuideline(key, keynext, el.val)">
                          <md-icon>done</md-icon>
                        </md-button>
                    </md-input-container>
                    <md-layout>
                        <md-input-container>
                            <label>Add new rule</label>
                            <md-textarea maxlength="270" class="md-fab md-mini md-clean" v-model="index" ></md-textarea>
                            <md-button class="md-raised md-primary" @click="pushNewGuideline(key, index)">Add</md-button>
                        </md-input-container>
                    </md-layout>
                </template>
                
                <template v-else>
                    <p v-for="(el,keynext) in element" :key="keynext" :added="showAddedDate(keynext)"> {{el.val}}</p>
                </template>
                
            </md-tab>
        </md-tabs>

        
    </div>
</template>

<script>
    import firebase from 'firebase'
    import { levelMixin } from '@/mixins/restrictions'
    import { FBApp } from '@/data/firebase-config'
    import {mapActions, mapGetters } from 'vuex'
    export default {
        name: 'CodeGuidelines',
        data () {
          return {
              guides : {}
          }
        },
        computed : {
            ...mapGetters(['activeUserGetter', 'firebasePathGetter'])
        },
        firebase: {},
        mixins: [levelMixin],
        methods : {
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
        },
        created () {
            this.$bindAsObject('guidelines', FBApp.ref(this.firebasePathGetter.guidelines), null, () => {
                this.guides = this.guidelines
                
                FBApp.ref(this.firebasePathGetter.guidelines).on('value', (el) => {
                    this.guides = el.val()
                })
                
            })
        }
    }
</script>
<style scoped>
    p { margin: 3px 0}
</style>