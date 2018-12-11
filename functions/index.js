const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const express = require('express');
const cors = require('cors');
const webPush = require('web-push');
const _ = require('lodash');

const app = express();

// web push setting ...

// Constants just contains common messages so they're in one place
const constants = require('./constants');

//key from firebase messaging setting (web push certificate)
let VAPID = {
  "publicKey": "BAsuPEw0FQi_q640-9X9MXG8Q9exjoD2AilWBskvFTNYxbJxE8ZEHTPYg3lQWDkY0Ql0oKAFI2ULMGQp50gKaEM",
  "privateKey": "jDakwMuBE3kTtyOOl7M7XCe0aAhvzEmJieM-eKGajY4"
};
// let vapidKeys = {
//   publicKey: process.env.VAPID_PUBLIC_KEY,
//   privateKey: process.env.VAPID_PRIVATE_KEY
// };
let vapidKeys = {
  publicKey: VAPID.publicKey,
  privateKey: VAPID.privateKey
};
webPush.setGCMAPIKey('108442257140');


// Tell web push about our application server
webPush.setVapidDetails('mailto:phily@domain.com', vapidKeys.publicKey, vapidKeys.privateKey);




// Automatically allow cross-origin requests
app.use(cors({
  origin: true
}));

app.options('/api/*', cors())

//to deal with preflight request
// app.options("/api/*", function(req, res, next){
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, POST, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Accept,Authorization,Content-Length, X-Requested-With, Origin');
//   res.sendStatus(200);
// });

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "GET, POST PUT OPTIONS DELETE");


//   next();

// });


// build multiple CRUD interfaces:
app.get('/hello', (req, res) => {
  res.send(`Hello world`);
});
app.get('/api/hello', (req, res) => {
  res.send(`Hello api`);
});

app.post('/api/notification-setting', (req, res, next) => {


  let content = req.body;
  if (typeof content == "string") {
    content = JSON.parse(content);
  }

  console.log(content);
  let ref = "/minotification/" + content.messageSender + "/" + content.messageReceiver.uid + "/settings";
  return admin.database().ref(ref).set(content.settings).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    //return res.redirect(303, snapshot.ref.toString());
    res.json({
      "status": "200"
    });
    //return next(false);
  }).catch(error => {
    console.log(error);
    res.send(error)
  });


});

app.post('/api/notification-profile', (req, res, next) => {


  let content = req.body;
  if (typeof content == "string") {
    content = JSON.parse(content);
  }

  let ref = "/minotification/" + content.messageSender + "/" + content.messageReceiver.uid + "/profile";
  return admin.database().ref(ref).once("value").then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    //return res.redirect(303, snapshot.ref.toString());
    let snapJson = snapshot.val();
    if (!snapJson) {
      snapJson = {};
    }
    snapJson.settings = content.settings;
    snapJson.userInfo = content.messageReceiver;
    if (snapJson.subscriptions && content.subscription) {
      const contains = snapJson.subscriptions.some(elem => {
        return JSON.stringify(content.subscription) === JSON.stringify(elem);
      });
      if (!contains) {
        snapJson.subscriptions.push(content.subscription);
      }
    } else {
      snapJson.subscriptions = [content.subscription];
    }
    console.log(snapJson);
    return admin.database().ref(ref).set(snapJson).then((snapshot) => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      //return res.redirect(303, snapshot.ref.toString());
      res.json({
        "status": "200"
      });
      //return next(false);
    }).catch(error => {
      console.log(error);
      res.send(error)
    });

    res.json({
      "status": "200"
    });
    //return next(false);
  }).catch(error => {
    console.log(error);
    res.send(error)
  });


});
/**
 * get notification information to display in client
 */
app.get('/api/notification-profile/:senderId/:receiverId', (req, res) => {
  const senderId = req.params.senderId;
  const receiverId = req.params.receiverId;
  console.log(receiverId);

  let retJson = {
    "senderId": senderId,
    "receiverId": receiverId
  };
  let ref = admin.database().ref('/minotification');
  let subRef = ref.child(senderId + '/' + receiverId + "/profile");
  subRef.once("value").then(snap => {
    if (snap.val()) {
      retJson.settings = snap.val().settings;
    }
    res.json(retJson);
  }).catch(error => {
    res.json(retJson);
  });

});

/**
 * get available user list 
 */
app.get('/api/notification-userlist/:senderId', (req, res) => {
  const senderId = req.params.senderId;

  let retJson = {
    "senderId": senderId,
    "receiverList": []
  };
  let ref = admin.database().ref('/minotification');
  let subRef = ref.child(senderId);
  
  subRef.once("value").then(snap => {
    snap.forEach(function(childSnapshot) {
      let childKey = childSnapshot.key;
      let childData = childSnapshot.val();
      if (childData.profile.settings && childData.profile.settings.allowpush){
        let user = childData.profile.userInfo ; 
        user.subscriptions = childData.profile.subscriptions;
        retJson.receiverList.push(user);
      }

    });
    res.json(retJson);
  }).catch(error => {
    res.json(retJson);
  });

});

// //obsolete , use notification-profile instead
//   app.get('/api/notification-setting/:senderId/:receiverId', (req, res) => {
//       const senderId = req.params.senderId;
//       const receiverId = req.params.receiverId;
//       console.log(receiverId);

//       let retJson = {
//         "senderId":senderId,
//         "receiverId":receiverId      
//       };
//       let ref = admin.database().ref('/minotification');
//       let subRef = ref.child (senderId+'/'+receiverId+"/settings");
//       subRef.once("value").then( snap =>{
//         retJson.settings  = snap.val();
//         res.json(retJson);
//       }).catch(error =>{
//         res.json(retJson);
//       });





//   });
app.post('/api/userEndpoint', (req, res, next) => {

  return admin.database().ref('/messages').push(retuser).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    //return res.redirect(303, snapshot.ref.toString());
    res.send(JSON.stringify(retuser));
    return next(false);
  });
});

app.post('/api/push', (req, res, next) => {
  const pushSubscription = req.body.pushSubscription;
  const notificationMessage = req.body.notificationMessage;
  console.log(req.body);
  if (!pushSubscription) {
    res.status(400).send(constants.errors.ERROR_SUBSCRIPTION_REQUIRED);
    return next(false);
  }

  
  // let jsonSub = JSON.parse(pushSubscription);
  //set GCM sender ID
  // Use the web-push library to send the notification message to subscribers
  webPush
    .sendNotification(pushSubscription, notificationMessage)
    .then(success => handleSuccess(success))
    .catch(error => handleError(error));

  // if (subscriptions.length) {
  //   subscriptions.map((subscription, index) => {
  //     let jsonSub = JSON.parse(subscription);

  //     // Use the web-push library to send the notification message to subscribers
  //     webPush
  //       .sendNotification(jsonSub, notificationMessage)
  //       .then(success => handleSuccess(success, index))
  //       .catch(error => handleError(error, index));
  //   });
  // } else {
  //   res.send(constants.messages.NO_SUBSCRIBERS_MESSAGE);
  //   return next(false);
  // }
  function handleSuccess(success) {
    res.send(constants.messages.SINGLE_PUBLISH_SUCCESS_MESSAGE);
    return next(false);
  }

  function handleError(error) {
    console.log(error);
    res.status(500).send(constants.errors.ERROR_MULTIPLE_PUBLISH);
    return next(false);
  }

});



// Expose Express API as a single Cloud Function:
exports.app = functions.https.onRequest(app);


// [START addMessage]
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
// [START addMessageTrigger]
exports.addMessage = functions.https.onRequest((req, res) => {
  // [END addMessageTrigger]
  // Grab the text parameter.
  const original = req.query.text;
  // [START adminSdkPush]
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({
    original: original
  }).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
  // [END adminSdkPush]
});
// [END addMessage]

// [START makeUppercase]
// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();
    console.log('Uppercasing', context.params.pushId, original);
    const uppercase = original.toUpperCase();
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.parent.child('uppercase').set(uppercase);
  });
// [END makeUppercase]
// [END all]