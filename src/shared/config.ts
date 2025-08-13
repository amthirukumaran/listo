import { MMKV } from 'react-native-mmkv';
import { PermissionsAndroid } from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';


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