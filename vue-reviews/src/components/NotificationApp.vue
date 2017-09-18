<template>
    <span>
        <md-checkbox v-model="subscribed" @change="changeSubscription">Subscribe to notifications</md-checkbox>
        <md-snackbar md-position="bottom center" ref="popUpNotification" md-duration="5000">
            <strong>{{popUpNotificationBody}}</strong>
            <md-button class="md-accent" @click="$refs.popUpNotification.close()">Close</md-button>
        </md-snackbar>
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
                subscribed : false,
                popUpNotificationBody : ''
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
                        this.subscribed = false;
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
            
            // check whether user is subscribed and update UI correspondingly (also checks whether current token is same as in DB on component creation
            // token can be accessed before requestPermission() call 
            this.$bindAsObject('tokenGetter', FBApp.ref(this.firebasePathGetter.notifications +"/" + this.activeUserGetter.alias), null, () => {
                messaging.getToken().then((currentToken) => {
                    if (this.tokenGetter && currentToken) {
                        if (this.tokenGetter.token != currentToken) {
                            FBApp.ref(this.firebasePathGetter.notifications +"/" + this.activeUserGetter.alias).set({
                                token : currentToken, subscribed : this.$moment().format('DD-MM-YYYY, hh:mm')
                            })
                        }
                        return currentToken
                    }
                }).then((currentToken) => { 
                    if (currentToken) {this.subscribed = this.tokenGetter.token === currentToken}
                })
                
            })
            
            // if app is an active TAB - display notificaiton as a snackbar
            messaging.onMessage((payload) => {
                if (payload.notification) {
                      this.popUpNotificationBody = payload.notification.body;
                      this.$refs.popUpNotification.open();
                }
            });
 
        }
        
    }
</script>
<style scoped>
    span {
        margin-left: 15px;
    }
</style>