// notifications.ts
import notifee, { AndroidImportance } from '@notifee/react-native';
import { getMessaging, requestPermission, getToken, onMessage, setBackgroundMessageHandler, getInitialNotification, AuthorizationStatus } from '@react-native-firebase/messaging';

//Custom-Imports
import { requestNotificationPermission, storage } from './config';

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
