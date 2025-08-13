import { useContext } from "react";
import Snackbar from "react-native-snackbar";
import { signInWithCustomToken } from "@react-native-firebase/auth";

//custom-Imports
import ListoAPI from "./interceptor";
import { appFonts } from "./appFonts";
import ListoContext from "./listoContext";
import { auth, encryptedStorage } from "./config";


export const sessionHandler = () => {

    const { setUserDetails, setAccountDetails } = useContext(ListoContext)

    //handles the user already logged in with this email
    const checkIfLoggedIn = (uid: string, noSnackbar?: boolean) => {
        const getAllToken = encryptedStorage?.getString("token");
        const tokens = getAllToken ? JSON.parse(getAllToken) : [];
        if (tokens.includes(uid)) {
            console.log("User already logged in with this email");
            if (!noSnackbar) {
                Snackbar.show({
                    text: "You're already using this account. Log in with a different one.",
                    duration: Snackbar?.LENGTH_LONG,
                    fontFamily: appFonts?.medium
                });
            }
            return true
        } else {
            return false
        }
    }

    const storeCurrentUserDetails = (response: any) => {

        // console.log("storeCurrentUserDetails-----", JSON.stringify(response, null, 4))

        return new Promise((resolve) => {

            const { user } = response
            const { multiFactor, metadata, ...rest } = user.toJSON();

            //holds the current user details
            setUserDetails(rest)
            encryptedStorage.set("userDetails", JSON.stringify(rest))
            //holds details of user accounts
            setAccountDetails((prev: any) => {
                const updatedRes = { ...rest, activeLogin: true }
                if (prev?.length) {
                    const prevRes = prev?.map((item: any) => ({ ...item, activeLogin: false }))
                    encryptedStorage.set("accountDetails", JSON.stringify([...prevRes, updatedRes]))
                    return [...prevRes, updatedRes]
                } else {
                    encryptedStorage.set("accountDetails", JSON.stringify([updatedRes]))
                    return [updatedRes]
                }
            })
            setTimeout(() => {
                resolve({ success: true })
            });
        })

    }

    const handleAccountSwitchFailure = () => {

        return new Promise((resolve, reject) => {
            const userDetails = JSON.parse(encryptedStorage.getString("userDetails") as string)
            const accountDetails = JSON.parse(encryptedStorage.getString("accountDetails") as string)

            if (accountDetails?.filter((item: any) => item?.uid === userDetails?.uid)?.length) {
                resolve({ success: true, userDetails, accountDetails })
            } else {
                const uid = accountDetails[0]?.uid
                ListoAPI?.get(`/custom-token?uid=${uid}`).then((listoResponse: any) => {
                    signInWithCustomToken(auth, listoResponse?.data?.token).then(() => {
                        let currentUser = accountDetails?.find((item: any) => item?.uid === uid)
                        encryptedStorage?.delete("userDetails")
                        resolve({ success: true, userDetails: currentUser, accountDetails })
                    }).catch((e: any) => {
                        console.log("signInWithCustomToken error: ", JSON.stringify(e, null, 4))
                        reject({ success: false, error: e })
                    })
                }).catch((e: any) => {
                    reject({ success: false, error: e })
                })

            }
        })
    }

    return {
        checkIfLoggedIn,
        storeCurrentUserDetails,
        handleAccountSwitchFailure
    }
}