const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const moment = require('moment');

exports.reviewersSchedule = functions.https.onRequest((request, response) => {

  admin.database().ref('/wow/resources/reviewers').once('value').then(snapshot => {

        let revPerDayGetter = 3
        let daysToSchedule = 21
        let reviewers = snapshot.val().all
        let holidays = snapshot.val().holidays

        let revs = {}
        reviewers.split(',').forEach((el, i)=> { revs[i] = el})
        let resultData = {}

    if (reviewers.length) {
        admin.database().ref('/wow/resources/schedule').once('value').then(snap => {

            
            let firstWeekDay = snap.val()[moment().format('YYYY-MM-DD')]

            if (firstWeekDay) {
                let reviewerIndex = Number(firstWeekDay.split(',').pop())
                for (let i=1;i<=daysToSchedule;i++) {
                    
                    let nextDay = moment().add(i,'days')
                    let holiday = holidays.split(',').find(el => moment(el, 'MMMM D').isSame(nextDay, 'day'))
                    if (nextDay.day() > 0 && nextDay.day()<6 && !holiday) {
                    
                        var nextDayF = nextDay.format('YYYY-MM-DD')
                        
                        let newStr = ""
                        for (let j=1; j<=revPerDayGetter;j++) {
                            reviewerIndex = reviewerIndex >= Object.keys(revs).length-1 ? 0 : reviewerIndex+1
                            newStr += revs[reviewerIndex]+','
                            if (j===revPerDayGetter) newStr += String(reviewerIndex)
                        }
                        if (!snap.val()[nextDay.format('YYYY-MM-DD')]) {
                            resultData[nextDayF] = newStr
                        }
                    
                    }
                    
                }
            } else {
                response.send("Wrong data. Nothing to update.");
            }

            if ( Object.keys(resultData).length ) {
                console.log(resultData)
                admin.database().ref('/wow/resources/schedule').update(resultData)
                response.send("Schedule successfully updated!");
            } else {
                console.warn('Nothing to update, maybe incoming data isnt proper')
                response.send("Nothing to update");
            }
            
        })

    }
    
  });

});
