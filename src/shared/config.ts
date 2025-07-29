import { MMKV } from 'react-native-mmkv'

export const encryptedStorage = new MMKV({
    id: "1209",
    encryptionKey: "tashi-listo"
});

export const storage = new MMKV()

export const clientId = "950613133564-dldmuu111qfaltvbc8pcj0oa1156ms9a.apps.googleusercontent.com";