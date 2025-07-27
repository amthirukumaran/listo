import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Text, TouchableOpacity, View } from "react-native";

//Icon-Imports
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Custom-Imports
import { appFonts } from "../../../shared/appFonts";
import { appColors } from "../../../shared/appColors";

export default function SignUp() {

    const navigation: any = useNavigation();

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: appColors?.light }}>
            <View style={{ alignSelf: "flex-end", paddingHorizontal: 20, paddingVertical: 20 }}>
                <TouchableOpacity onPress={() => navigation?.goBack()}>
                    <MaterialCommunityIcons name='close' size={26} color={appColors?.dark} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontFamily: appFonts?.bold, color: appColors?.lightDark }}>Signup Page isn't Build yet!</Text>
            </View>
        </KeyboardAvoidingView>
    )
}