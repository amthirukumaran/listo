import { MMKV } from 'react-native-mmkv';
import { PermissionsAndroid } from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { getMessaging, requestPermission, getToken, onMessage, setBackgroundMessageHandler, getInitialNotification, AuthorizationStatus } from '@react-native-firebase/messaging';


export const baseUrl = "https://listobackend-production.up.railway.app";

//using this to manage token,userDetails,accountDetails
export const encryptedStorage = new MMKV({
    id: "1209",
    encryptionKey: "tashi-listo"
});

//using this to manage isLoggedIn
export const storage = new MMKV();

export const clientId = "950613133564-dldmuu111qfaltvbc8pcj0oa1156ms9a.apps.googleusercontent.com";

export const auth = getAuth();

export const listoDB = getFirestore();

export const requestNotificationPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted === PermissionsAndroid?.RESULTS?.GRANTED) {
        console.log("Permission granted", granted)
        return true
    } else {
        console.log("Permission denied", granted)
        return false
    }
}

// Ask for notification permission (Android 13+ and iOS)
async function requestUserPermission() {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);

    if (authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL) {
        console.log('Notification permission granted.');
        return true;
    }

    console.log('Notification permission denied.');
    return false;
}

// Display a notification using Notifee
async function displayNotification(title: string, body: string) {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: "default"
    });

    await notifee.displayNotification({
        title,
        body,
        android: {
            channelId,
            pressAction: { id: 'default' },
            sound: "default"
            // smallIcon: "logo"
        },
    });
}

// Initialize push notifications
export async function initPushNotifications() {

    let hasPermission = storage.getBoolean('NotificationPermission') ?? false;

    if (!hasPermission) {
        hasPermission = await requestNotificationPermission()
        storage.set('NotificationPermission', hasPermission);
    }

    if (!hasPermission) {
        console.log('Push notifications disabled by user.');
        return;
    }

    const messaging = getMessaging();

    // Get FCM token
    // const fcmToken = await getToken(messaging);
    // console.log('FCM Token:', fcmToken);

    // Foreground messages
    onMessage(messaging, async (remoteMessage) => {
        console.log('Foreground message:', remoteMessage);
        if (remoteMessage.notification) {
            await displayNotification(
                remoteMessage.notification.title || 'New Message',
                remoteMessage.notification.body || ''
            );
        }
    });

    // Background messages
    setBackgroundMessageHandler(messaging, async (remoteMessage) => {
        console.log('Background message:', remoteMessage);
    });

    // Quit-state messages
    const initialNotification = await getInitialNotification(messaging);
    if (initialNotification) {
        console.log('Opened app from quit state via notification:', initialNotification);
    }
}