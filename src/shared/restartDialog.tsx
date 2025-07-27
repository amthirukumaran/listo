import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//Custom-Imports
import { appFonts } from "./appFonts";
import { appColors } from "./appColors";

const RestartApp = ({ onClick }: { onClick: () => void }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: appColors?.transparentBackground, justifyContent: "center", alignItems: "center" }}>
            <View style={{ backgroundColor: appColors?.light, borderRadius: 13, width: 320, paddingHorizontal: 20, paddingVertical: 15 }}>
                <View style={{ alignSelf: "center" }}>
                    <View style={{ alignSelf: "center" }}>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark, fontSize: 16 }}>REMINDER</Text>
                        </View>
                    </View>
                    <View style={{ paddingVertical: 10, paddingBottom: 20 }}>
                        <Text style={{ textAlign: "center", fontFamily: appFonts?.medium, color: appColors?.lightGrey, lineHeight: 20 }}>A new update was downloaded</Text>
                        <Text style={{ textAlign: "center", fontFamily: appFonts?.medium, color: appColors?.lightGrey, lineHeight: 20 }}>Click to Restart.</Text>
                    </View>
                    <Pressable onPress={onClick} style={{ alignSelf: "center", backgroundColor: appColors?.dark, borderRadius: 12, paddingVertical: 10 }}>
                        <Text style={{ paddingHorizontal: 15, color: appColors?.light, fontFamily: appFonts?.bold }}>Restart App</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView >
    )
}

export default RestartApp