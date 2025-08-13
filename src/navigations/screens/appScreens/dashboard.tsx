import { Divider, Image } from "@rneui/base";
import Snackbar from "react-native-snackbar";
import RBSheet from "react-native-raw-bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContext, useEffect, useRef, useState } from "react";
import { useStallionUpdate, restart } from "react-native-stallion";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { signInWithCustomToken, signOut } from "@react-native-firebase/auth";
import { Keyboard, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View, Modal, ActivityIndicator, StatusBar, Pressable } from "react-native";

//Icon-Imports
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

//Custom-Imports
import { appFonts } from "../../../shared/appFonts";
import { appColors } from "../../../shared/appColors";
import RestartApp from "../../../shared/restartDialog";
import ListoContext from "../../../shared/listoContext";
import { auth, encryptedStorage, storage } from "../../../shared/config";

//Service-Imports
import ListoAPI from "../../../shared/interceptor";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import { initPushNotifications } from "../../../shared/pushNotification";


export default function Dashboard() {

    //handles the safeArea
    const { bottom, right, top } = useSafeAreaInsets()
    //@ts-ignore
    const refRBSheet = useRef<RBSheet>(null)
    //Variable used to navigate btwn screens
    const navigation = useNavigation<any>();
    //Variable used to handle after screen focused
    const isFocused = useIsFocused();
    //Variable used to show modal for switch Accounts
    const [switchAccounts, setSwitchAccounts] = useState(false);
    //Variable used to control the main Screen Loader
    const [isLoad, setIsLoad] = useState(true);
    //Variable used to control the transparentLoader
    const [transparentLoader, setTransparentLoader] = useState(false)
    //Variable used to control the restart dialogProps
    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
    //Variables used to control the listo
    const { setIsLoggedIn, userDetails, accountDetails, setAccountDetails, setUserDetails } = useContext(ListoContext);
    //Variable used to handle the OTA release
    const { isRestartRequired } = useStallionUpdate()

    useEffect(() => {
        if (isFocused) {
            getFoucs();
            // (async () => {
            //     console.log("inside async function-----")
            //     await requestNotificationPermission()
            //     
            //     // getInAppMessaging().setMessagesDisplaySuppressed(false);
            // })()
            console.log("token-----", JSON.parse(encryptedStorage.getString("token") as string))
            console.log("accountDetails: ", JSON.stringify(accountDetails, null, 4))
            console.log("userDetails: ", JSON.stringify(userDetails, null, 4))
            console.log("auth----", auth)
        }
        return () => setIsLoad(true)
    }, [isFocused])

    useEffect(() => {
        checkForUpdates()
    }, [isRestartRequired])


    const getFoucs = () => {
        setTimeout(() => {
            (async () => {
                await initPushNotifications()
                await logEvent(getAnalytics(), 'dashboard')
            })()
            setIsLoad(false)
        }, 1000);
    }

    const checkForUpdates = () => {
        if (isRestartRequired) {
            setTimeout(() => {
                setIsUpdateAvailable(true);
            }, 2000);
        }
    }

    const handleLogout = (currentUid: string) => {
        if (accountDetails?.length >= 2) {
            signOut(auth).then(() => {
                if (userDetails?.uid === currentUid && userDetails?.providerData[0]?.providerId === "google.com") {
                    GoogleSignin.signOut()
                }
                encryptedStorage?.delete("accountDetails")
                encryptedStorage.set("accountDetails", JSON.stringify(accountDetails?.filter((item: any) => item?.uid != currentUid)))
                setAccountDetails((prev: any) => prev?.filter((item: any) => item?.uid != currentUid))
                const token = JSON.parse(encryptedStorage.getString("token") as string)
                encryptedStorage.set("token", JSON.stringify(token?.filter((item: any) => item != currentUid)))
                setSwitchAccounts(true)
            }).catch(e => {
                Snackbar.show({
                    text: "Something went wrong. please try again later",
                    duration: Snackbar.LENGTH_LONG,
                    textColor: appColors.light,
                });
            })
        } else {
            signOut(auth).then(() => {
                if (userDetails?.uid === currentUid && userDetails?.providerData[0]?.providerId === "google.com") {
                    GoogleSignin.signOut()
                }
                setAccountDetails(null);
                encryptedStorage?.delete("accountDetails")
                setUserDetails(null);
                encryptedStorage?.delete("userDetails")
                encryptedStorage?.delete("token")
                storage.delete("isLoggedIn")
                setIsLoggedIn(false);
            }).catch(e => {
                Snackbar.show({
                    text: "Something went wrong. please try again later",
                    duration: Snackbar.LENGTH_LONG,
                    textColor: appColors.light,
                });
            })
        }
    }

    const handleAddAccount = () => {
        setIsLoad(true)
        if (accountDetails?.filter((item: any) => item?.providerData[0]?.providerId === "google.com")?.length) {
            GoogleSignin.signOut().catch(e => {
                console.log("An error occurred. Please try again.")
                Snackbar.show({
                    text: "Something went wrong. please try again later",
                    duration: Snackbar.LENGTH_LONG,
                    textColor: appColors.light,
                });
                return
            })
        }

        signOut(auth).then(() => {
            setTimeout(() => {
                setIsLoggedIn(false)
            }, 400);
        }).catch((e) => {
            console.log("An error occurred. Please try again.")
            Snackbar.show({
                text: "Something went wrong. please try again later",
                duration: Snackbar.LENGTH_LONG,
                textColor: appColors.light,
            });
        })

    }

    const handleLoginthisAccount = async (currentUid: string) => {

        if (userDetails?.uid === currentUid) {
            console.log("You are already logged in with this account");
            setTimeout(() => {
                Snackbar.show({
                    text: "You are already logged in with this account",
                    duration: Snackbar?.LENGTH_LONG,
                    fontFamily: appFonts?.medium
                });
            }, 400);
            return
        }

        if (userDetails?.uid === currentUid && userDetails?.providerData[0]?.providerId === "google.com") {
            GoogleSignin.signOut()
        }

        setTransparentLoader(true)

        ListoAPI?.get(`/custom-token?uid=${currentUid}`).then((listoResponse: any) => {
            console.log(JSON.stringify(listoResponse, null, 4));
            signInWithCustomToken(auth, listoResponse?.data?.token).then(customTokenResponse => {
                let currentUser: any;
                accountDetails?.forEach((item: any) => item?.uid === currentUid ? currentUser = item : null)
                setAccountDetails((prev: any) => {
                    let data = prev?.map((item: any) => item?.uid === currentUid ? { ...item, activeLogin: true } : { ...item, activeLogin: false })
                    encryptedStorage?.delete("accountDetails")
                    encryptedStorage.set("accountDetails", JSON.stringify(data))
                    return data
                })
                setUserDetails(currentUser)
                encryptedStorage?.delete("userDetails")
                encryptedStorage.set("userDetails", JSON.stringify(currentUser))
                setTransparentLoader(false)
                console.log("signInWithCustomToken res: ", JSON.stringify(customTokenResponse, null, 4))
            }).catch((e: any) => {
                console.log("signInWithCustomToken error: ", JSON.stringify(e, null, 4))
            })

        }).catch(e => {
            console.log("ERROR FROM CUSTOMTOKEN CREATION", e)
        })

    }

    const handleUpdateApp = () => {
        setIsUpdateAvailable(false);
        setTimeout(() => {
            restart()
        }, 400);
    }

    return (
        <KeyboardAvoidingView onStartShouldSetResponder={() => { Keyboard.dismiss(); return false }} style={{ flex: 1, backgroundColor: appColors?.light, paddingTop: top }}>
            <StatusBar barStyle={"dark-content"} />
            <View style={{ paddingHorizontal: 15, paddingVertical: 15, flexDirection: "row", justifyContent: "space-between", gap: 20, backgroundColor: "" }}>
                <View style={{ flex: 0.75, flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: "" }}>
                    {userDetails?.photoURL ?
                        <Image
                            source={{ uri: userDetails?.photoURL }}
                            style={{ height: 32, aspectRatio: 1, borderRadius: 99 }}
                            resizeMode="cover"
                            PlaceholderContent={
                                <View style={{ backgroundColor: appColors?.secondary, borderRadius: 4 }}>
                                    <Text style={{ fontFamily: appFonts?.bold, padding: 15, paddingVertical: 8, fontSize: 16, color: appColors?.lightDark }}>{(userDetails?.displayName && userDetails?.displayName[0]?.toUpperCase()) ?? userDetails?.email[0]?.toUpperCase()}</Text>
                                </View>
                            }
                        />
                        :
                        <View style={{ backgroundColor: appColors?.secondary, borderRadius: 4 }}>
                            <Text style={{ fontFamily: appFonts?.bold, padding: 15, paddingVertical: 8, fontSize: 16, color: appColors?.lightDark }}>{((userDetails?.displayName && userDetails?.displayName[0]?.toUpperCase()) ?? userDetails?.email[0]?.toUpperCase()) || "N/A"}</Text>
                        </View>
                    }
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={2} style={{ fontFamily: appFonts?.bold, fontSize: 16, color: appColors?.dark }}>{(userDetails?.displayName || userDetails?.email?.split("@")[0]?.toLowerCase()) || "N/A"}</Text>
                    </View>
                </View>
                <View style={{ flex: 0.25, flexDirection: "row", gap: 23, alignItems: "center", backgroundColor: "", justifyContent: "flex-end" }}>
                    <View>
                        <TouchableOpacity onPress={() => { navigation.navigate("searchScreen") }}>
                            <Octicons name="search" size={22} color={appColors?.lightDark} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => { refRBSheet?.current?.open() }}>
                            <Ionicons name="settings-sharp" size={23} color={appColors?.lightDark} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {isLoad ?
                <View style={{ flex: 1, marginTop: -100, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size={30} color={appColors?.lightDark} />
                </View>
                :
                <View style={{ flex: 1 }}>
                    <View style={{ position: "absolute", bottom: bottom + 50, right: right + 35 }}>
                        <Pressable onPress={() => { navigation?.navigate("addTask") }} style={{ paddingVertical: 12, paddingHorizontal: 18, borderRadius: 99, backgroundColor: appColors?.lightDark, justifyContent: "center", alignItems: "center" }} >
                            <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                <FontAwesome name="pencil-square-o" size={22} color={appColors?.dark} />
                                <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark }}>Add</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            }
            <RBSheet customModalProps={{ statusBarTranslucent: true, navigationBarTranslucent: true }} ref={refRBSheet} draggable={true} closeOnPressMask={true} height={accountDetails?.length > 1 ? 320 : 260} customStyles={{ container: { borderTopEndRadius: 20, borderTopStartRadius: 20 } }}>
                <View style={{ flex: 1, backgroundColor: appColors?.light, paddingBottom: bottom }} >
                    <View style={{ paddingVertical: 10, paddingTop: 5 }}>
                        <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark, fontSize: 16, textAlign: "center" }}>Accounts</Text>
                    </View>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, justifyContent: "center" }} showsVerticalScrollIndicator={false}>
                        {accountDetails?.map((item: any, index: number) => (
                            <TouchableOpacity onPress={() => { refRBSheet?.current?.close(); setTimeout(() => handleLoginthisAccount(item?.uid)) }} key={index} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: appColors?.lightBackground, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6, marginBottom: accountDetails?.length - 1 == index ? 15 : 10 }}>
                                <View style={{ flex: 0.8, flexDirection: "row", gap: 10, alignItems: "center" }}>
                                    <View style={{ backgroundColor: appColors?.secondary, borderRadius: 4 }}>
                                        <Text style={{ fontFamily: appFonts?.bold, padding: 10, paddingVertical: 5, fontSize: 16, color: appColors?.lightDark }}>{((item?.displayName && item?.displayName[0]?.toUpperCase()) ?? item?.email[0]?.toUpperCase()) || "N/A"}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text numberOfLines={2} style={{ fontFamily: appFonts?.bold, fontSize: 13, color: appColors?.dark }}>{item?.email ?? "N/A"}</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 0.2, backgroundColor: "", alignItems: "flex-end" }}>
                                    {item?.activeLogin &&
                                        <FontAwesome6 name="user-check" size={20} color={appColors?.lightDark} />
                                    }
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={{ marginHorizontal: 20, marginBottom: 15, borderRadius: 6, backgroundColor: appColors?.lightBackground, }}>
                        <TouchableOpacity onPress={() => { refRBSheet?.current?.close(); setTimeout(() => handleAddAccount()) }} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingTop: 12, paddingHorizontal: 15 }}>
                            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                <FontAwesome name="plus-square-o" size={23} color={appColors?.lightDark} />
                                <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark, fontSize: 14 }}>Add an account</Text>
                            </View>
                            <Entypo name="chevron-right" color={appColors?.lightDark} size={23} />
                        </TouchableOpacity>
                        <View style={{ borderWidth: 0.2, borderColor: appColors?.borderColor, marginVertical: 2 }} />
                        <TouchableOpacity onPress={() => { refRBSheet?.current?.close(); setTimeout(() => handleLogout(userDetails?.uid)) }} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingBottom: 12, paddingHorizontal: 15 }}>
                            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                <Feather name="share" size={23} color={appColors?.red} style={{ transform: [{ rotate: "90deg" }] }} />
                                <Text style={{ fontFamily: appFonts?.bold, color: appColors?.red, fontSize: 14 }}>Log Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>
            <Modal visible={switchAccounts} statusBarTranslucent navigationBarTranslucent transparent >
                <View style={{ flex: 1, backgroundColor: appColors?.transparentBackground, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: 340, maxHeight: 220, borderRadius: 13, backgroundColor: appColors?.light, paddingHorizontal: 15, paddingBottom: 13 }}>
                        <View style={{ alignItems: "center", paddingTop: 20 }}>
                            <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark, fontSize: 14 }}>SWITCH ACCOUNTS</Text>
                        </View>
                        <Divider style={{ marginVertical: 10, marginBottom: 7 }} />
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10 }}>
                            {accountDetails?.map((item: any, index: number) => (
                                <TouchableOpacity onPress={() => { setSwitchAccounts(false); handleLoginthisAccount(item?.uid) }} key={index} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, backgroundColor: "" }}>
                                    {item?.photoURL ?
                                        <Image
                                            source={{ uri: item?.photoURL }}
                                            style={{ height: 32, aspectRatio: 1, borderRadius: 99 }}
                                            resizeMode="cover"
                                            PlaceholderContent={
                                                <View style={{ backgroundColor: appColors?.secondary, borderRadius: 4 }}>
                                                    <Text style={{ fontFamily: appFonts?.bold, padding: 15, paddingVertical: 8, fontSize: 16, color: appColors?.lightDark }}>{(item?.displayName && item?.displayName[0]?.toUpperCase()) ?? item?.email[0]?.toUpperCase()}</Text>
                                                </View>
                                            }
                                        />
                                        :
                                        <View style={{ backgroundColor: appColors?.secondary, borderRadius: 4 }}>
                                            <Text style={{ fontFamily: appFonts?.bold, padding: 10, paddingVertical: 5, fontSize: 16, color: appColors?.lightDark }}>{((item?.displayName && item?.displayName[0]?.toUpperCase()) ?? item?.email[0]?.toUpperCase()) || "N/A"}</Text>
                                        </View>
                                    }
                                    <View style={{ flex: 1 }}>
                                        <Text numberOfLines={1} style={{ fontFamily: appFonts?.bold, fontSize: 14, color: appColors?.dark }}>{item?.email ?? "N/A"}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <Modal visible={transparentLoader} animationType="fade" transparent statusBarTranslucent navigationBarTranslucent>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: appColors?.transparentBackground }}>
                    <ActivityIndicator size={30} color={appColors?.light} />
                </View>
            </Modal>
            <Modal navigationBarTranslucent={true} statusBarTranslucent={true} visible={isUpdateAvailable} transparent>
                <RestartApp onClick={() => handleUpdateApp()} />
            </Modal>
        </KeyboardAvoidingView>
    )
}