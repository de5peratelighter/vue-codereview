<template>
    <span>
        <md-checkbox v-model="subscribed" @change="changeSubscription">Subscribe to notifications</md-checkbox>
    </span>
</template>

<script>
    import firebase from 'firebase'
    import { FBApp, messaging} from '@/data/firebase-config'
    import {mapActions, mapGetters } from 'vuex'
    export default {
        name: 'NotificationApp',
        data () {
            return {
                subscribed : false
            }
        },
        firebase : {},
        computed : {
            ...mapGetters(['activeUserGetter', 'firebasePathGetter'])
        },
        methods : {
            changeSubscription (el) {
                
                if (el) {
                    
                    messaging.requestPermission()
                    .then((result) =>  {
                          messaging.getToken().then((currentToken) => {
                            if (currentToken) {
                                FBApp.ref(this.firebasePathGetter.notifications +"/" + this.activeUserGetter.alias).set({
                                    token : currentToken, subscribed : this.$moment().format('DD-MM-YYYY, hh:mm')})
                                .then(() => {
                                    console.warn('Grats! Token is added to the DB, you will be receiving notifications upon various stuff')
                                })
                            } else {
                              console.warn('No Instance ID token available. Request permission to generate one.');
                            }
                          }).catch((err) => {
                            console.warn('An error occurred while retrieving token. ', err);
                          })    
                    }).catch((err) => {
                      console.warn(`Permission wasn't granted, please make sure you aren't in Incognito mode or with HTTP (feature works only for HTTPS pages).`, err);
                    })
                    
                } else {
                    FBApp.ref(this.firebasePathGetter.notifications +"/" + this.activeUserGetter.alias).set({}).then(()=> {
                        console.warn('Removing token for ', this.activeUserGetter.displayName)
                    })
                }
                
            }
        },
        created () {
            // check whether user is subscribed and update UI correspondingly
            this.$bindAsObject('tokenGetter', FBApp.ref(this.firebasePathGetter.notifications +"/" + this.activeUserGetter.alias), null, () => {
                this.subscribed = Boolean(this.tokenGetter.token)
            })
            
            // Callback fired if Instance ID token is updated.
            messaging.onTokenRefresh(() => {
                messaging.getToken().then(function(refreshedToken) {
                    console.warn(`Subscription Token has refreshed. Replacing it's latest instance in FB`);
                }).catch(function(err) {
                    console.warn('Unable to retrieve refreshed token ', err);
                });
            });
 
        }
        
    }
</script>
<style scoped>
    span {
        margin-left: 15px;
    }
</style>