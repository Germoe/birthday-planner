// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab users
    const userids = (await admin.firestore().collection('users').get()).docs.map((doc) => doc.id);

    async function grabBirthdays(uid) {
        const birthdays = await admin.firestore().collection('users').doc(uid).collection('birthdays').get().then((querySnapshot) => {
            return querySnapshot.docs.map((doc) => {
                const birthday = doc.data()
                return {
                    ...birthday,
                    bid: doc.id,
                    birthdate: birthday['birthdate'].toDate()
                }
            })
        }).catch((err) => console.log(err))
        return birthdays
    };

    async function grabNotification(uid) {
        const emailRef = await admin.firestore().collection('users').doc(uid).collection('notifications').doc('email').get().then((doc) => {
            return {
                ...doc.data(),
                nid: doc.id
            };
        }).catch((err) => console.log(err))

        return emailRef
    }

    function DatetoString(dt) {
        var mm = dt.getMonth() + 1; // getMonth() is zero-based
        var dd = dt.getDate();
    
        return [dt.getFullYear(),
                (mm>9 ? '' : '0') + mm,
                (dd>9 ? '' : '0') + dd
            ].join('-');
    };

    function getDaysUntil(date) {
        const today = new Date()
        return Math.ceil((date - today)/ (1000 * 60 * 60 * 24))
    }

    async function prepareBirthdayMessage(uid, emailNotification, birthdays) {
        const today = new Date()
        const nid = emailNotification['nid']
        const email = emailNotification['email']

        // Create ref to new birthday
        const messageRef = admin.firestore().collection('mail').doc(`${uid}-${nid}-${DatetoString(today)}`);

        // Create Default Data
        const data = {
            to: email,
            message: {
              subject: 'Hello from Firebase!',
              html: 'This is an <code>HTML</code> email body.',
            },
          };
        
        // Commit data to firestore
        await messageRef.set(data);
    }

    function selectNotifications(emailNotification, birthday) {
        const daysUntil = getDaysUntil(birthday['birthdate'])
        const daysBefore = emailNotification['daysBefore']

        if (daysUntil == daysBefore) {
            return true
        } 
    }

    async function sendUserNotifications(uid) {
        // Check if User wants to receive notifications
        const emailNotification = await grabNotification(uid)

        if (emailNotification && emailNotification['notify']) {
            // If user has setup notifications grab Birthdays to calculate countdowns
            const birthdays = (await grabBirthdays(uid)).filter((birthday) => selectNotifications(emailNotification, birthday))
            if (birthdays.length > 0) {
                await prepareBirthdayMessage(uid, emailNotification, birthdays)
            }

            return {
                uid,
                daysBefore: emailNotification['daysBefore'],
                birthdays
            }
        } else {
            return {uid}
        }
    }

    const notificationPromises = userids.map((uid) => sendUserNotifications(uid))
    const notifications = await Promise.all(notificationPromises)
    // Send back a message that we've successfully written the message
    return res.json({result: notifications});
  });
