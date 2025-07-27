import { useNavigation } from "@react-navigation/native";
import { Keyboard, KeyboardAvoidingView, Text, TouchableOpacity, View } from "react-native";

//Icon-Imports
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Custom-Imports
import { appFonts } from "../../../shared/appFonts";
import { appColors } from "../../../shared/appColors";

export default function ForgotPassword() {

    const navigation: any = useNavigation();

    return (
        <KeyboardAvoidingView onStartShouldSetResponder={() => { Keyboard?.dismiss(); return false }} style={{ flex: 1, backgroundColor: appColors?.light }}>
            <View style={{ alignSelf: "flex-end", paddingHorizontal: 20, paddingVertical: 20 }}>
                <TouchableOpacity onPress={() => navigation?.goBack()}>
                    <MaterialCommunityIcons name='close' size={26} color={appColors?.dark} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, backgroundColor: appColors?.light, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontFamily: appFonts?.bold, fontSize: 16, color: appColors?.lightDark, paddingHorizontal: 20, textAlign: "center", lineHeight: 20 }}>Forgot Password Page still in Developing Stage, Sorry For the Inconvenience</Text>
            </View>
        </KeyboardAvoidingView>
    )
}