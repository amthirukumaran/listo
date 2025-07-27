import RBSheet from "react-native-raw-bottom-sheet";
import { useStallionUpdate, restart } from "react-native-stallion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Keyboard, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View, Modal, useWindowDimensions, ActivityIndicator } from "react-native";

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

export default function Dashboard() {

    //@ts-ignore
    const refRBSheet = useRef<RBSheet>(null)

    const { width } = useWindowDimensions()

    const [isOpen, setIsOpen] = useState(false);

    const [isLoad, setIsLoad] = useState(false);

    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)

    const { setIsLogin, userDetails, accountDetails, setAccountDetails } = useContext(ListoContext);

    const { isRestartRequired } = useStallionUpdate()

    useLayoutEffect(() => {
        console.log("accountDetails", JSON.stringify(accountDetails, null, 4))
        setIsLoad(true)
        getFoucs()
    }, [])

    const getFoucs = () => {
        setTimeout(() => {
            setIsLoad(false)
            checkForUpdates()
        }, 1000);
    }

    const checkForUpdates = () => {
        if (isRestartRequired) {
            setTimeout(() => {
                setIsUpdateAvailable(true);
            }, 400);
        }
    }


    // console.log("isRestartRequires---", isRestartRequired)

    const handleClose = () => {
        refRBSheet?.current?.close();
        setTimeout(() => {
            clickToSignOut(true)
        }, 400);
    }

    const handleAddAccount = () => {
        refRBSheet?.current?.close();
        setTimeout(() => {
            clickToSignOut(false)
        }, 400);
    }

    const clickToSignOut = (signOut: boolean) => {
        GoogleSignin?.signOut().then((res: any) => {
            let dataLength: number;
            setTimeout(async () => {
                setAccountDetails((prev: any) => {
                    let data = prev?.filter((item: any) => item?.activeLogin == false)
                    dataLength = data?.length;
                    return data
                })
                if (dataLength) {
                    setIsOpen(true)
                } else {
                    setIsLogin(false);
                    await AsyncStorage?.removeItem("isLogin")
                }
            }, 400);
            console.log("signOut---->", JSON.stringify(res, null, 4))
        }).catch((e: any) => {
            console.log("logOutError--->", JSON.stringify(e, null, 4))
        })
    }

    const handleUpdateApp = () => {
        setIsUpdateAvailable(false);
        setTimeout(() => {
            restart()
        }, 400);
    }

    return (
        <KeyboardAvoidingView onStartShouldSetResponder={() => { Keyboard.dismiss(); return false }} style={{ flex: 1, backgroundColor: appColors?.light }}>
            <View style={{ paddingHorizontal: 20, paddingVertical: 20, flexDirection: "row", justifyContent: "space-between", gap: 20, backgroundColor: "" }}>
                <View style={{ flex: 0.75, flexDirection: "row", gap: 13, alignItems: "center", backgroundColor: "" }}>
                    <View style={{ backgroundColor: appColors?.secondary, borderRadius: 4 }}>
                        <Text style={{ fontFamily: appFonts?.bold, padding: 15, paddingVertical: 8, fontSize: 16, color: appColors?.lightDark }}>{userDetails?.additionalUserInfo?.profile?.name[0]?.toUpperCase() ?? userDetails?.user?.email[0]?.toUpperCase()}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={2} style={{ fontFamily: appFonts?.bold, fontSize: 16, color: appColors?.dark }}>{userDetails?.additionalUserInfo?.profile?.given_name?.toLowerCase() ?? userDetails?.user?.email?.split("@")[0]?.toLowerCase()}</Text>
                    </View>
                </View>
                <View style={{ flex: 0.25, flexDirection: "row", gap: 23, alignItems: "center", backgroundColor: "", justifyContent: "flex-end" }}>
                    <View>
                        <TouchableOpacity>
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
                <View style={{ flex: 1, backgroundColor: "red" }}>
                </View>
            }
            <RBSheet ref={refRBSheet} draggable={true} closeOnPressMask={true} height={accountDetails?.length > 1 ? 300 : 235} customStyles={{ container: { borderTopEndRadius: 20, borderTopStartRadius: 20 } }}>
                <View style={{ paddingVertical: 10, paddingTop: 5 }}>
                    <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark, fontSize: 16, textAlign: "center" }}>Accounts</Text>
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: appColors?.light, paddingHorizontal: 20, justifyContent: "center" }} showsVerticalScrollIndicator={false}>
                    {accountDetails?.map((item: any, index: number) => (
                        <TouchableOpacity key={index} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: appColors?.lightBackground, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6, marginBottom: accountDetails?.length - 1 == index ? 15 : 10 }}>
                            <View style={{ flex: 0.8, flexDirection: "row", gap: 10, alignItems: "center" }}>
                                <View style={{ backgroundColor: appColors?.secondary, borderRadius: 4 }}>
                                    <Text style={{ fontFamily: appFonts?.bold, padding: 10, paddingVertical: 5, fontSize: 16, color: appColors?.lightDark }}>{item?.additionalUserInfo?.profile?.name[0]?.toUpperCase() ?? item?.user?.email[0]?.toUpperCase()}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={2} style={{ fontFamily: appFonts?.bold, fontSize: 13, color: appColors?.dark }}>{item?.user?.email}</Text>
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
                    <TouchableOpacity onPress={() => handleAddAccount()} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingTop: 12, paddingHorizontal: 15 }}>
                        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                            <FontAwesome name="plus-square-o" size={23} color={appColors?.lightDark} />
                            <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark, fontSize: 14 }}>Add an account</Text>
                        </View>
                        <Entypo name="chevron-right" color={appColors?.lightDark} size={23} />
                    </TouchableOpacity>
                    <View style={{ borderWidth: 0.2, borderColor: appColors?.borderColor, marginVertical: 2 }} />
                    <TouchableOpacity onPress={() => handleClose()} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingBottom: 12, paddingHorizontal: 15 }}>
                        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                            <Feather name="share" size={23} color={appColors?.red} style={{ transform: [{ rotate: "90deg" }] }} />
                            <Text style={{ fontFamily: appFonts?.bold, color: appColors?.red, fontSize: 14 }}>Log Out</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </RBSheet>
            <Modal visible={isOpen} transparent>
                <View style={{ flex: 1, backgroundColor: appColors?.transparentBackground, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: width > 900 ? 600 : width > 600 ? 500 : 300, borderRadius: 10, paddingBottom: 35, backgroundColor: appColors?.light }}>
                        <View style={{ alignItems: "center", paddingVertical: 20 }}>
                            <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark, fontSize: 14 }}>SWITCH ACCOUNTS</Text>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal visible={isUpdateAvailable} transparent>
                <RestartApp onClick={() => handleUpdateApp()} />
            </Modal>
        </KeyboardAvoidingView>
    )
}