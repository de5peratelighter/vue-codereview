<template>
    <div class="c-main-section">
            
        <div>
            <h4 v-if="activeUserGetter.isAnonymous">This sections is for logged users</h4>
            <h4 v-else-if="!levelDEVORPM(activeUserGetter.role)">You don't have permission to alter config, if you need one - request from PM/DEVs</h4>
            <div v-else>
                <md-button @click="showElement('usersTicker')" class="md-raised">
                    <md-icon v-if="!tickers.usersTicker">add</md-icon>
                    <md-icon v-else>remove</md-icon>
                    Users
                </md-button>
                <md-button @click="showElement('guidelinesTicker')" class="md-raised">
                    <md-icon v-if="!tickers.guidelinesTicker">add</md-icon>
                    <md-icon v-else>remove</md-icon>
                    Guidelines
                </md-button>
            </div>
        </div>
            
        <div>
            
            <div :class="{ hidden: !tickers.usersTicker }">
               
                <users-config></users-config>
                
            </div>
            
            <div :class="{ hidden: !tickers.guidelinesTicker }">
                
                <guidelines-config></guidelines-config>
                
            </div>
         </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import { levelMixin } from '@/mixins/restrictions'
    const UsersConfig = () => import('@/components/configure/UsersConfig.vue')
    const GuidelinesConfig = () => import('@/components/configure/GuidelinesConfig.vue')
    
    export default {
        name: 'MainConfig',
        data () {
            return {
                role : 'Role',
                
                tickers : {
                    usersTicker : false,
                    guidelinesTicker : false
                }
            }
        },
        mixins: [levelMixin],
        computed : {
            ...mapGetters(['activeUserGetter'])
        },
        methods : {
            showElement (el) {
              this.tickers[el] = !this.tickers[el]
            },
        },
        components : {
            UsersConfig,
            GuidelinesConfig
        }
    }
</script>