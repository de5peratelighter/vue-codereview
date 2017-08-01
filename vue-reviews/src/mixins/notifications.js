export const notificationMixin = {
    data () {
        return {
            authorizationKey : 'AAAAa_TnElc:APA91bHPwaZvdrnnFm5eG3-lcgSpJ1pWMGOBs940x4Wp63ZNA__tfSesEHul8gw4UWzISSsjfEiFJQsTN3Zp5ebYRl1hEew9_vKnf2pUuGNsoFq9uZf5t9JjlG-siyX9CAZKrXgyojNE'
        }
    },
    methods: {
        submitNotification(owner, requester, type, status) {
      
            let notification = {
              'title': 'Hello ' + owner['.key'],
              'body': '',
              'icon' : requester.photoURL,
              'click_action' : window ? window.location.href : ''
            };
          
            if (type==='informOwner') {
                notification.body = requester.alias + ' updated status of your changeset to ' + status
            } else if (type==='informReviewer') {
                notification.body = requester.alias + ' added new changest, please review at your earliest convenience!'
            }
            
            if (notification.body) {
                this.triggerNotificationSend(notification, owner.token)
            }
        },
        triggerNotificationSend(notification, token) {
            
            fetch('https://fcm.googleapis.com/fcm/send', {
              'method': 'POST',
              'headers': {'Authorization': 'key=' + this.authorizationKey, 'Content-Type': 'application/json'},
              'body': JSON.stringify({'notification': notification, 'to': token})
            }).then(()=>{console.debug("Bob: Notification sent to the reviewer.");
            }).catch((error)=>{console.warn("Bob: Notification wasn't sent:( Oopps.", error) });
            
        }
    }
};