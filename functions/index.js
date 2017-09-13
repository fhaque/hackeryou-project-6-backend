const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
//database for flakeys
const dbFlakeysRef = admin.database().ref('/flakeys');



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});




exports.cronHandle = functions.https.onRequest((req, res) => {
    if (req.query.key === "badMamboJumbo") {
        console.log("Cron Signal Logged.");
        dbFlakeysRef.once('value').then(snapshot => {
            const updates = {};
            snapshot.forEach(function(flakey) {
                const key = flakey.key;
                updates[key + '/expired'] = ( flakey.child('dateExpires').val() <= Date.now() );
                // entries.push( flakey.child('dateExpires').val() <= Date.now() );
                
            });
            return dbFlakeysRef.update(updates);
        })
        .then( () => res.sendStatus(200) );
        // res.sendStatus(200);
    } else { //unauthorized access
        console.log('Cron Signal Unauthorized.');
        res.sendStatus(401);
    }
});


// exports.cronHandle = functions.https.onRequest((req, res) => {
//     if (req.query.key === "badMamboJumbo") {
//         console.log("Cron Signal Logged.");
//         res.sendStatus(200);
//     } else { //unauthorized access
//         console.log('Cron Signal Unauthorized.');
//         res.sendStatus(401);
//     }
// });
