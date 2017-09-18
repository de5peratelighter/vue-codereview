<template>
    <div>
        <div>
            <h4 v-if="activeUserGetter.isAnonymous">This sections is for logged users</h4>
            <h4 v-else-if="!levelDEVORPM(activeUserGetter.role)">You don't have permission to alter config, if you need one - request from PM/DEVs</h4>
            <div v-else>

                <md-tabs md-fixed md-centered>
                    
                   <md-tab id="Users" md-label="Users">
                        <users-config></users-config>
                    </md-tab>
                    
                    <md-tab id="Guidelines" md-label="Guidelines">
                       <guidelines-config></guidelines-config>
                    </md-tab>
                    
                    <md-tab id="Prefixes" md-label="Prefixes">
                        <prefixes-config></prefixes-config>
                    </md-tab>
            
                </md-tabs>
                
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import { levelMixin } from '@/mixins/restrictions'
    const UsersConfig = () => import('@/components/configure/UsersConfig.vue')
    const GuidelinesConfig = () => import('@/components/configure/GuidelinesConfig.vue')
    const PrefixesConfig = () => import('@/components/configure/PrefixesConfig.vue')
    
    export default {
        name: 'MainConfig',
        mixins: [levelMixin],
        computed : {
            ...mapGetters(['activeUserGetter'])
        },
        components : {
            UsersConfig,
            GuidelinesConfig,
            PrefixesConfig
        }
    }
</script>