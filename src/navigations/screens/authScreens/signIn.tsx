import * as Yup from 'yup';
import { useFormik } from "formik";
import { Input } from '@rneui/base';
import Snackbar from 'react-native-snackbar';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useLayoutEffect, useState } from 'react';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential, getAuth, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

//Custom-Imports
import { appFonts } from "../../../shared/appFonts";
import { appColors } from "../../../shared/appColors";
import ListoContext from '../../../shared/listoContext';
import { sessionHandler } from '../../../shared/sessionHandler';
import { encryptedStorage, storage } from '../../../shared/config';

export default function SignIn() {

    //Variable used to handle the navigation
    const navigation: any = useNavigation();
    //Variable used to handle the mainScreen loader
    const [isLoad, setIsLoad] = useState(true);
    //Variable used to handle the transparentLoader
    const [transparentLoader, setTransparentLoader] = useState(false);
    //Variable used to show forgot password
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    //Variable used to disable ui thread while api call
    const [buttonLoader, setButtonLoader] = useState(false);
    //Variable used to control the stack
    const { setIsLoggedIn } = useContext(ListoContext);
    //helping functions
    const { checkIfLoggedIn, storeCurrentUserDetails } = sessionHandler();

    useLayoutEffect(() => {
        getFocused();
        console.log("SignIn screen loaded-------------");
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
            if (res?.type === "success") {
                const credential = await GoogleAuthProvider.credential(res?.data?.idToken);
                const auth = getAuth()
                signInWithCredential(auth, credential).then((response: any) => {

                    if (checkIfLoggedIn(response?.user?.uid, true)) {
                        GoogleSignin.signOut()
                        console.log("User already logged in with this email");
                        setTransparentLoader(false)
                        setTimeout(() => {
                            Snackbar.show({
                                text: "You're already using this account. Log in with a different one.",
                                duration: Snackbar?.LENGTH_LONG,
                                fontFamily: appFonts?.medium
                            });
                        }, 400);
                        return;
                    }

                    storeCurrentUserDetails(response).then((userResponse: any) => {
                        if (userResponse?.success) {
                            //handles the token of the user
                            const token = encryptedStorage.getString("token")
                            if (token?.length) {
                                const parsedToken = JSON.parse(token);
                                if (!parsedToken?.includes(response?.user?.uid)) {
                                    encryptedStorage.set("token", JSON.stringify([...parsedToken, response?.user?.uid]))
                                }
                            } else {
                                encryptedStorage.set("token", JSON.stringify([response?.user?.uid]))
                            }
                            setIsLoggedIn(true)
                            setTransparentLoader(false)
                            storage.set("isLoggedIn", true)
                        } else {
                            Snackbar.show({
                                text: "Something went wrong. please try again later",
                                duration: Snackbar.LENGTH_LONG,
                                textColor: appColors.light,
                            });
                        }
                    })

                }).catch((e: any) => {
                    setTransparentLoader(false)
                })
            } else {
                setTransparentLoader(false)
                setTimeout(() => {
                    Snackbar.show({
                        text: "Something went wrong. Please try again later.",
                        duration: Snackbar.LENGTH_LONG,
                        fontFamily: appFonts?.medium
                    })
                }, 400);
            }
        }).catch(() => {
            setTransparentLoader(false)
            setTimeout(() => {
                Snackbar.show({
                    text: "Something went wrong. Please try again later.",
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: appFonts?.medium
                })
            }, 400);
        })
    }

    // Function to handle login with email and password
    const loginWithEmailAndPassword = (email: string, password: string) => {

        signInWithEmailAndPassword(getAuth(), email, password).then((response: any) => {

            if (checkIfLoggedIn(response?.user?.uid)) {
                console.log("User already logged in with this email");
                return;
            }

            storeCurrentUserDetails(response).then((userResponse: any) => {
                if (userResponse?.success) {
                    //handles the token of the user
                    const token = encryptedStorage.getString("token")
                    if (token?.length) {
                        const parsedToken = JSON.parse(token);
                        encryptedStorage.set("token", JSON.stringify([...parsedToken, response?.user?.uid]))
                    } else {
                        encryptedStorage.set("token", JSON.stringify([response?.user?.uid]))
                    }
                    //handles the login status of the user
                    setIsLoggedIn(true)
                    storage.set("isLoggedIn", true)
                } else {
                    Snackbar.show({
                        text: "Something went wrong. please try again later",
                        duration: Snackbar.LENGTH_LONG,
                        textColor: appColors.light,
                    });
                }
            })

        }).catch((e) => {
            console.log("E.code--->", e.code)
            if (e?.code === "auth/wrong-password") {
                setIncorrectPassword(true)
                Snackbar.show({
                    text: "Incorrect password. Please try again.",
                    duration: Snackbar?.LENGTH_LONG,
                    fontFamily: appFonts?.medium
                })
            } else if (e?.code === "auth/user-not-found") {
                Snackbar.show({
                    text: `We couldn’t find a user with this email.`,
                    duration: Snackbar?.LENGTH_LONG,
                    fontFamily: appFonts?.medium
                })
            } else if (e?.code === "auth/invalid-email") {
                Snackbar.show({
                    text: "Email is invalid. Please enter a valid email address.",
                    duration: Snackbar?.LENGTH_LONG,
                    fontFamily: appFonts?.medium
                })
            } else if (e?.code === "auth/too-many-requests") {
                Snackbar.show({
                    text: "Too many requests. Please try again later.",
                    duration: Snackbar?.LENGTH_LONG,
                    fontFamily: appFonts?.medium
                })
            } else {
                Snackbar.show({
                    text: "An error occurred. Please try again.",
                    duration: Snackbar?.LENGTH_LONG,
                    fontFamily: appFonts?.medium
                })
            }
        }).finally(() => {
            setButtonLoader(false)
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: appColors?.light }} edges={["top"]} >
            <StatusBar backgroundColor={appColors?.light} barStyle={"dark-content"} />
            <KeyboardAvoidingView onStartShouldSetResponder={() => { Keyboard?.dismiss(); return false; }} style={{ flex: 1, backgroundColor: appColors?.light }}>
                {isLoad ?
                    <View style={{ flex: 1, backgroundColor: appColors?.light, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={30} color={appColors?.lightDark} />
                    </View>
                    :
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
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
                                {incorrectPassword &&
                                    <View style={{ paddingHorizontal: 10, alignSelf: "flex-end", paddingTop: 8, paddingBottom: 5 }}>
                                        <TouchableOpacity disabled={buttonLoader} onPress={() => { formik?.resetForm(); setIncorrectPassword(false); navigation?.navigate("forgotPassword") }}>
                                            <Text style={{ fontFamily: appFonts?.medium, fontSize: 14, color: appColors?.red }}>Forgot Password?</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                <View style={{ paddingHorizontal: 10, paddingVertical: 15, paddingTop: !incorrectPassword ? 32 : undefined }}>
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
                                <TouchableOpacity disabled={buttonLoader} onPress={() => { formik?.resetForm(); setIncorrectPassword(false); navigation?.navigate("signUp") }}>
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