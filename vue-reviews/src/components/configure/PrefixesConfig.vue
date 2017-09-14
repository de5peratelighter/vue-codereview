<template>
    <div>
        <md-layout md-flex-offset="5"> 
            <md-button  @click="goGetPrefixes" class="md-warn md-raised">
                Update prefixes 
                <md-tooltip md-direction="right">Will globally update the prefixes for various items</md-tooltip>
            </md-button>
        </md-layout>
        
        <md-layout v-if="isPM" md-flex-offset="5" md-flex="95">
            <md-layout>
                <md-input-container v-for="(el,key,i) in prefixes" :key="i">
                    <label :for="`prefixes__list__item${key}`">{{el.label}}</label>
                    <md-input :id="`prefixes__list__item${key}`" v-model="el.val"></md-input>
                    <md-button @click="goUpdatePrefix(key,el.val)" class="md-list-action md-accent md-raised">
                       UPDATE
                    </md-button>
                    <md-tooltip md-delay="400" md-direction="bottom">Please exclude the last slash '/' from the global prefix value.</md-tooltip>
                </md-input-container>
            </md-layout>
            
        </md-layout>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import {mapGetters} from 'vuex'
    import { FBApp } from '@/data/firebase-config'
    export default {
        name: 'PrefixesConfig',
        data () {
            return {
                isPM : false,
                prefixes : {}
            }
        },
        computed : {
            ...mapGetters(['firebasePathGetter'])
        },
        firebase : {},
        methods : {
            goGetPrefixes () {
                this.$bindAsObject('prefs', FBApp.ref(this.firebasePathGetter.prefixes), null, () => {
                    this.prefixes = this.prefs
                    this.isPM = true
                    FBApp.ref(this.firebasePathGetter.prefixes).on('value', (el) => {
                        this.prefixes = el.val()
                    })
                })
            },
            goUpdatePrefix (key, val) {
                FBApp.ref(this.firebasePathGetter.prefixes + '/' + key + '/val').set(val)
            }
        }
    }
</script>
