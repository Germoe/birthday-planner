// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.region('europe-west1').pubsub.schedule('0 7 * * *').timeZone('Europe/Berlin').onRun(async (context) => {
    await scheduleMessages()
    return null;
});

exports.addMessageHttp = functions.region('europe-west1').https.onRequest(async (req, res) => {
    const notifications = await scheduleMessages()
    res.json({result: notifications});
});

async function scheduleMessages() {
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

    function getCountDown(date) {
        const today = new Date();
        let next_date = new Date(`${today.getFullYear()}-${getMonth(date)}-${getDate(date)}`);
        if (today > next_date) {
            next_date = new Date(`${today.getFullYear() + 1}-${getMonth(date)}-${getDate(date)}`);
        }
        const timeinmilisec = next_date.getTime() - today.getTime();
        return Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));
    }

    async function prepareBirthdayMessage(uid, emailNotification, birthdays) {
        const today = DatetoString(new Date())
        const nid = emailNotification['nid']
        const email = emailNotification['email']

        // Create ref to new birthday
        const messageRef = admin.firestore().collection('mail').doc(`${uid}-${nid}-${today}`);

        const birthdaysOutput = birthdays.map((birthday) => {
            const daysUntil = getCountDown(birthday['birthdate'])
            const birthdate = DatetoString(birthday['birthdate'])
            return {
                ...birthday,
                birthdate,
                daysUntil
            }
        })
        // Create Default Data
        const data = {
            to: email,
            template: {
              name: 'birthdays',
              data: {
                  birthdays: birthdaysOutput
              },
            },
          };
        
        // Commit data to firestore
        await messageRef.set(data);
    }

    function selectNotifications(emailNotification, birthday) {
        const daysUntil = getCountDown(birthday['birthdate'])
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

    return notifications
}