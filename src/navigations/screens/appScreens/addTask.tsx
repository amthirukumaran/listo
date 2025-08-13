import { Divider, Icon, Image, Input } from "@rneui/base";
import RBSheet from "react-native-raw-bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { launchImageLibrary } from 'react-native-image-picker';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

//Icon-Imports
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

//custom-Imports
import { appFonts } from "../../../shared/appFonts";
import { appColors } from '../../../shared/appColors';

const AddTask = () => {

    //handles the safeArea
    const { top, bottom } = useSafeAreaInsets();
    //@ts-ignore
    const refRBSheet = useRef<RBSheet>(null)
    //Variable used to navigate btwn screens
    const navigation = useNavigation<any>();
    //Variable used to control the loader
    const [isLoad, setIsLoad] = useState(true);
    //Variable to control Modal and its content
    const [isOpen, setIsOpen] = useState(false)
    //Variable used to hold emoji
    const [emoji, setEmoji] = useState<RegExpMatchArray | string>("")

    const [coverImage, setCoverImage] = useState<any>();

    const [width, setWidth] = useState(0)

    const bottomData = [
        [
            { iconType: "MaterialIcons", iconName: "star-border", title: "Add to Favourites", size: 23, color: appColors?.dark, methodName: "favourites" },
            { iconType: "MaterialIcons", iconName: "delete-outline", title: "Delete", size: 23, color: appColors?.red, methodName: "delete" }
        ],
        [
            { iconType: "Feather", iconName: "smile", title: (emoji?.length ? "Edit Icon" : "Add Icon"), size: 23, color: appColors?.dark, methodName: "addIcon" },
            { iconType: "FontAwesome", iconName: "image", title: coverImage ? "Edit Cover" : "Add Cover", size: 23, color: appColors?.dark, methodName: "addCover" },
            ...(coverImage ? [{ iconType: "MaterialIcons", iconName: "delete-outline", title: "Delete Cover", size: 23, color: appColors?.red, methodName: "deleteCover" }] : [])
        ],
        // [
        //     { iconType: "MaterialIcons", iconName: "notifications-on", title: "Push Notification", size: 23, color: appColors?.dark }
        // ]
    ].filter(Boolean)


    useEffect(() => {
        setTimeout(() => {
            setIsLoad(false);
        }, 2000);
    }, [])


    const handleRBSheet = (props: string) => {
        switch (props) {
            case "addIcon": {
                setIsOpen(true);
                break;
            }
            case "addCover": {
                launchImageLibrary({ mediaType: "photo", quality: 1, selectionLimit: 1 }).then((res) => {
                    if (res?.assets?.length) {
                        setCoverImage(res?.assets[0]?.uri)
                    }
                    console.log("res----", JSON.stringify(res, null, 4))
                }).catch((e) => {
                    console.log("e---", JSON.stringify(e, null, 4))
                })
                break;
            }
            case "deleteCover": {
                setCoverImage(null)
            }
        }
    }

    const handleEmoji = (text: string) => {
        const emojiRegex = /\p{Extended_Pictographic}/u;
        const match = text.match(emojiRegex);
        setEmoji(match ? match[0] : "")
    }


    return (
        <KeyboardAvoidingView onStartShouldSetResponder={() => { Keyboard.dismiss(); return false }} style={{ flex: 1, backgroundColor: appColors?.light, paddingTop: top }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15, paddingVertical: 15 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Feather name="arrow-left" size={23} color={appColors?.dark} />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark, fontSize: 16 }}>Add Tasks</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => { refRBSheet?.current?.open() }}>
                    <Ionicons name="settings-sharp" size={23} color={appColors?.lightDark} />
                </TouchableOpacity>
            </View>
            {isLoad ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: -100 }}>
                    <ActivityIndicator size={30} color={appColors?.lightDark} />
                </View>
                :
                <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: appColors?.light }}>
                    {coverImage ?
                        <Image
                            source={{ uri: coverImage }}
                            style={{ height: 180, width: "100%" }}
                        />
                        : null}
                    <View style={{ paddingHorizontal: 15 }}>
                        {emoji?.length && !coverImage ?
                            <View>
                                <Text style={{ fontSize: 35 }}>{emoji}</Text>
                            </View>
                            : null
                        }
                        <Text style={{ fontFamily: appFonts?.bold, fontSize: 18, color: appColors?.lightDark }}>Task Title</Text>
                    </View>
                </ScrollView>
            }
            <Modal visible={isOpen} onRequestClose={() => { setIsOpen(false) }} transparent statusBarTranslucent navigationBarTranslucent animationType="fade">
                <View onStartShouldSetResponder={() => { Keyboard?.dismiss(); return false }} style={{ flex: 1, backgroundColor: appColors?.transparentBackground, justifyContent: "center" }}>
                    <View style={{ marginHorizontal: 50, paddingVertical: 20, backgroundColor: appColors?.light, borderRadius: 9 }}>
                        <View style={{ backgroundColor: "" }}>
                            <Text style={{ fontFamily: appFonts?.bold, textAlign: "center" }}>Add Icon</Text>
                        </View>
                        <View style={{ marginTop: 15, flexGrow: 1, flexShrink: 1 }}>
                            <Input
                                value={emoji as string}
                                maxLength={2}
                                cursorColor={appColors?.lightDark}
                                placeholderTextColor={appColors?.lightDark}
                                onChangeText={(text) => handleEmoji(text)}
                                inputMode="text"
                                inputStyle={{ textAlignVertical: "center", fontFamily: appFonts?.medium, fontSize: 16, paddingStart: (width / 2) - 10 }}
                                containerStyle={{ paddingHorizontal: 20 }}
                                errorStyle={{ height: 0, margin: 0 }}
                                onLayout={(event) => setWidth(event?.nativeEvent?.layout?.width)}
                                inputContainerStyle={{ borderWidth: 1, borderRadius: 9, borderColor: appColors?.secondary }}
                            />
                        </View>
                        <View style={{ paddingHorizontal: 22, paddingVertical: 10, backgroundColor: "", marginTop: 10 }}>
                            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                                <TouchableOpacity style={{ backgroundColor: appColors?.light, borderWidth: 1, borderRadius: 8, borderColor: appColors?.borderColor, width: 110, paddingVertical: 8, alignItems: "center" }} onPress={() => setIsOpen(false)}>
                                    <Text style={{ fontFamily: appFonts?.medium, fontSize: 14, color: appColors?.dark }}>cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={!Boolean(emoji?.length)} onPress={() => { if (emoji?.length) setIsOpen(false) }} style={{ backgroundColor: appColors?.secondary, borderWidth: 1, borderRadius: 8, borderColor: appColors?.lightBackground, width: 110, paddingVertical: 8, alignItems: "center" }}>
                                    <Text style={{ fontFamily: appFonts?.medium, fontSize: 14, color: appColors?.dark }}>save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <RBSheet ref={refRBSheet} customModalProps={{ statusBarTranslucent: true, navigationBarTranslucent: true }} draggable closeOnPressMask height={310} customStyles={{ container: { borderTopEndRadius: 20, borderTopStartRadius: 20 } }}>
                <View style={{ flex: 1, backgroundColor: appColors?.light, paddingHorizontal: 20, paddingBottom: bottom }}>
                    <View style={{ alignSelf: "center", marginTop: 5, marginBottom: 12 }}>
                        <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark, fontSize: 14 }}>Action</Text>
                    </View>
                    <Divider style={{ marginTop: 1, marginBottom: 8 }} />
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: appColors?.light, overflow: "hidden" }}>
                        <View style={{ marginTop: 10, overflow: "hidden" }}>
                            {bottomData?.map((data: any, index: number) =>
                                <View key={index} style={{ overflow: "hidden", marginTop: index === 1 ? 15 : undefined, backgroundColor: appColors?.lightBackground, borderRadius: 8 }}>
                                    {data?.map((item: any, index: number) =>
                                        <View key={index}>
                                            <TouchableOpacity onPress={() => { refRBSheet?.current?.close(); setTimeout(() => handleRBSheet(item?.methodName), 400) }} style={{ paddingVertical: 10, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 10 }}>
                                                {item?.iconType == "Feather" ?
                                                    <Feather name={item?.iconName} size={item?.size} color={item?.color} />
                                                    :
                                                    <Icon type={item?.iconType} name={item?.iconName} size={item?.size} color={item?.color} />
                                                }
                                                <Text style={{ fontFamily: appFonts?.medium, fontSize: 14, color: appColors?.dark }}>{item?.title}</Text>
                                            </TouchableOpacity>
                                            {(data.length - 1 != index) &&
                                                <Divider style={{ marginTop: 1 }} />
                                            }
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </RBSheet>
        </KeyboardAvoidingView>
    )
}

export default AddTask