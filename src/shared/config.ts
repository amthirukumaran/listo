import { MMKV } from 'react-native-mmkv';

export const baseUrl = "https://listobackend-production.up.railway.app";

//using this to manage token,userDetails,accountDetails
export const encryptedStorage = new MMKV({
    id: "1209",
    encryptionKey: "tashi-listo"
});

//using this to manage isLoggedIn
export const storage = new MMKV()

export const clientId = "950613133564-dldmuu111qfaltvbc8pcj0oa1156ms9a.apps.googleusercontent.com";