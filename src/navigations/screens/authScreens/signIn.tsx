import * as Yup from 'yup';
import { useFormik } from "formik";
import { Input } from '@rneui/base';
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential, getAuth, signInWithEmailAndPassword, } from "@react-native-firebase/auth";
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

//Custom-Imports
import { appFonts } from "../../../shared/appFonts";
import { appColors } from "../../../shared/appColors";
import ListoContext from '../../../shared/listoContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {

    const navigation: any = useNavigation();

    const [isLoad, setIsLoad] = useState(true)

    const [transparentLoader, setTransparentLoader] = useState(false);

    const [isError, setIsError] = useState(false);

    const [buttonLoader, setButtonLoader] = useState(false);

    const { setIsLoggedIn, setUserDetails, setAccountDetails } = useContext(ListoContext);

    useLayoutEffect(() => {
        setIsLoad(true)
        getFocused();
    }, [])


    const getFocused = () => {
        setTimeout(() => {
            setIsLoad(false)
        }, 1000);
    }


    const validationSchema = Yup.object().shape({
        email: Yup.string().required(""),
        password: Yup.string().required(""),
    })

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            setButtonLoader(true);
            setTimeout(() => {
                loginWithEmailAndPassword(formik?.values?.email, formik?.values?.password)
            }, 400);
        }
    })

    const continueWithGoogle = async () => {

        setTransparentLoader(true)
        await GoogleSignin.signIn().then(async (res) => {
            // console.log("google-----------", JSON.stringify(res, null, 4))
            if (res?.type === "success") {
                const credential = await GoogleAuthProvider.credential(res?.data?.idToken);
                // console.log("credentialss----", JSON.stringify(credential, null, 4))
                const auth = getAuth()
                // console.log("inside------")
                signInWithCredential(auth, credential).then((res: any) => {
                    // console.log("res----", JSON.stringify(res, null, 4))
                    setTimeout(async () => {
                        setUserDetails(res)
                        setAccountDetails(prev => {
                            const updatedRes = { ...res, activeLogin: true }
                            if (prev?.length) {
                                const prevRes = prev?.map((item: any) => ({ ...item, activeLogin: false }));
                                (async () => {
                                    await AsyncStorage.setItem("accountDetails", JSON.stringify([...prevRes, updatedRes]))
                                    await AsyncStorage.setItem("userDetails", JSON.stringify(res))
                                })()
                                return [...prevRes, updatedRes]
                            } else {
                                (async () => {
                                    await AsyncStorage.setItem("accountDetails", JSON.stringify([updatedRes]))
                                    await AsyncStorage.setItem("userDetails", JSON.stringify(res))
                                })()
                                return [updatedRes]
                            }
                        })
                        await AsyncStorage.setItem("isLogin", JSON?.stringify(true));
                        setTransparentLoader(false)
                        setIsLoggedIn(true)
                    }, 1000);
                }).catch((e: any) => {
                    setTransparentLoader(false)
                })
            } else {
                setTransparentLoader(false)
                console.log("outside if----")
            }
        }).catch(() => {
            setTransparentLoader(false);
        })
    }

    const loginWithEmailAndPassword = (email: string, password: string) => {


        signInWithEmailAndPassword(getAuth(), email, password).then((res: any) => {
            setTimeout(async () => {
                setUserDetails(res)
                setAccountDetails(prev => {
                    const updatedRes = { ...res, activeLogin: true }
                    if (prev?.length) {
                        const prevRes = prev?.map((item: any) => ({ ...item, activeLogin: false }))
                        return [...prevRes, updatedRes]
                    } else {
                        return [updatedRes]
                    }
                })
                setIsLoggedIn(true)
                setButtonLoader(false);
                await AsyncStorage.setItem("isLogin", JSON?.stringify(true));
            }, 2000);
            console.log("res---", JSON.stringify(res, null, 4))
        }).catch((e) => {
            setIsError(true)
            setButtonLoader(false);
            console.log("E.code--->", e.code)
            console.log("E.msg--->", e.message)
            console.log("E.name--->", e.name)
            // console.log("e---->", JSON.stringify(e, null, 4))
        })
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: appColors?.light }} >
            <StatusBar backgroundColor={appColors?.light} barStyle={"dark-content"} />
            <KeyboardAvoidingView onStartShouldSetResponder={() => { Keyboard?.dismiss(); return false; }} style={{ flex: 1, backgroundColor: appColors?.light }}>
                {isLoad ?
                    <View style={{ flex: 1, backgroundColor: appColors?.light, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={30} color={appColors?.lightDark} />
                    </View>
                    :
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: "" }}>
                        <View style={{ flex: 1, paddingTop: 70 }}>
                            <View style={{ alignItems: "center" }}>
                                <Image
                                    style={{ height: 80, width: 80, alignSelf: "center" }}
                                    source={require("../../../assets/splash.jpg")}
                                />
                                <Text style={{ fontFamily: appFonts?.bold, fontSize: 20, textAlign: "left", color: appColors?.dark, paddingVertical: 10 }}>Where thoughts become tasks</Text>
                                <Text style={{ fontFamily: appFonts?.bold, fontSize: 16, color: appColors?.lightDark }}>Log in to your Listo account</Text>
                            </View>
                            <View style={{ paddingHorizontal: 20, paddingVertical: 30 }}>
                                <Input
                                    label={"Email"}
                                    value={formik?.values?.email}
                                    onChangeText={(text) => formik?.setFieldValue("email", text)}
                                    disabled={buttonLoader}
                                    containerStyle={{ backgroundColor: "" }}
                                    errorStyle={{ backgroundColor: "", margin: 0 }}
                                    inputStyle={{ paddingHorizontal: 10, paddingStart: 15, color: appColors?.lightGrey, fontFamily: appFonts?.medium, fontSize: 14 }}
                                    labelStyle={{ fontFamily: appFonts?.medium, paddingBottom: 7, paddingLeft: 5, fontWeight: undefined, color: appColors?.lightDark, fontSize: 14 }}
                                    inputContainerStyle={{ backgroundColor: "", borderWidth: 1, borderRadius: 8, borderColor: appColors?.borderColor }}
                                />
                                <Input
                                    label={"Password"}
                                    value={formik?.values?.password}
                                    onChangeText={(text) => formik?.setFieldValue("password", text)}
                                    disabled={buttonLoader}
                                    textContentType="password"
                                    containerStyle={{ backgroundColor: "", }}
                                    errorStyle={{ backgroundColor: "", margin: 0, height: 0 }}
                                    inputStyle={{ paddingHorizontal: 10, paddingStart: 15, color: appColors?.lightGrey, fontFamily: appFonts?.medium, fontSize: 14 }}
                                    labelStyle={{ fontFamily: appFonts?.medium, paddingBottom: 7, paddingLeft: 5, fontWeight: undefined, color: appColors?.lightDark, fontSize: 14 }}
                                    inputContainerStyle={{ backgroundColor: "", borderWidth: 1, borderRadius: 8, borderColor: appColors?.borderColor }}
                                />
                                {isError &&
                                    <View style={{ paddingHorizontal: 10, alignSelf: "flex-end", paddingTop: 8, paddingBottom: 5 }}>
                                        <TouchableOpacity disabled={buttonLoader} onPress={() => { formik?.resetForm(); setIsError(false); navigation?.navigate("forgotPassword") }}>
                                            <Text style={{ fontFamily: appFonts?.medium, fontSize: 14, color: appColors?.red }}>Forgot Password?</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                <View style={{ paddingHorizontal: 10, paddingVertical: 15, paddingTop: !isError ? 32 : undefined }}>
                                    <TouchableOpacity disabled={buttonLoader && !formik?.isValid} onPress={() => { formik?.handleSubmit() }} activeOpacity={0.7} style={{ alignItems: "center", backgroundColor: appColors?.lightGrey, borderRadius: 8 }}>
                                        {buttonLoader ?
                                            <ActivityIndicator style={{ paddingVertical: 13 }} size={"small"} color={appColors?.light} />
                                            :
                                            <Text style={{ color: appColors?.light, fontFamily: appFonts?.bold, paddingVertical: 13 }}>LOGIN</Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: "row", gap: 10, paddingVertical: 15, paddingHorizontal: 20, alignItems: "center" }}>
                                    <View style={{ borderBottomWidth: 0.5, flex: 1, borderColor: appColors?.borderColor }} />
                                    <Text style={{ color: appColors?.lightDark, fontFamily: appFonts?.medium, fontSize: 14 }}>OR</Text>
                                    <View style={{ borderBottomWidth: 0.5, flex: 1, borderColor: appColors?.borderColor }} />
                                </View>
                                <View style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
                                    <TouchableOpacity disabled={buttonLoader} onPress={() => { continueWithGoogle() }} activeOpacity={0.7} style={{ alignItems: "center", backgroundColor: appColors?.lightBackground, borderRadius: 8, paddingHorizontal: 15 }}>
                                        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                            <Image
                                                source={require("../../../assets/google.png")}
                                                style={{ height: 22, width: 22, backgroundColor: appColors?.lightBackground, overlayColor: appColors?.lightBackground }}
                                            />
                                            <Text style={{ color: appColors?.dark, fontFamily: appFonts?.medium, paddingVertical: 14 }}>Continue With Google</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{ height: 70, justifyContent: "center", alignItems: "center", backgroundColor: "", paddingHorizontal: 20 }}>
                            <View style={{ flexDirection: "row", gap: 5 }}>
                                <Text style={{ fontFamily: appFonts?.medium, color: appColors?.lightDark, fontSize: 14 }}>{`Don't have an account?`}</Text>
                                <TouchableOpacity disabled={buttonLoader} onPress={() => { formik?.resetForm(); setIsError(false); navigation?.navigate("signUp") }}>
                                    <Text style={{ color: appColors?.dark, fontFamily: appFonts?.bold, textDecorationLine: "underline", fontSize: 14 }}>Sign up</Text>
                                </TouchableOpacity>
                            </View>
                            {/* <Text style={{ color: appColors?.lightDark, fontFamily: appFonts?.medium, fontSize: 13, paddingTop: 7 }}>© 2025 Listo, Inc.</Text> */}
                        </View>
                    </ScrollView>
                }
                <Modal navigationBarTranslucent={true} statusBarTranslucent={true} transparent visible={transparentLoader}>
                    <StatusBar barStyle={"light-content"} backgroundColor={appColors?.transparentBackground} />
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: appColors?.transparentBackground }}>
                        < ActivityIndicator size={25} color={appColors?.light} />
                    </View>
                </Modal>
            </KeyboardAvoidingView >
        </SafeAreaView>
    )
}