import { useContext, useState } from "react";
import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

//Custom-Imports
import { storage } from "../../../shared/config";
import { appFonts } from "../../../shared/appFonts";
import { appColors } from "../../../shared/appColors";
import ListoContext from "../../../shared/listoContext";

export default function GetStartedScreen() {

    const { setShowGetStarted } = useContext(ListoContext);

    //Variable stores the tour data
    const tourData = [
        {
            id: 1,
            image: require("../../../assets/frame1.png"),
            title: "Capture Your Thoughts",
            description: "Write down anything. Remember everything.",
            showSkip: true,
            action: "Next"
        },
        {
            id: 2,
            image: require("../../../assets/frame2.png"),
            title: "Turn Notes into Action",
            description: "Add checklists and to-dos to keep your day on track. Stay productive and focused.",
            showSkip: true,
            action: "Next"
        },
        {
            id: 3,
            image: require("../../../assets/frame3.png"),
            title: "Build Your Own Workflow",
            description: "Mix notes, tasks, lists, and more-- just like building blocks. Customize it your way.",
            showSkip: false,
            action: "Continue"
        },
    ];

    //Variable holds the index
    const [index, setIndex] = useState(0);
    //variable holds the currentIndex
    const currentData = tourData[index]

    const handleIndex = () => {
        if (index < tourData.length - 1) {
            setIndex(prev => prev + 1);
        } else {
            getStartedClose()
        }
    }

    const getStartedClose = async () => {
        storage.set("showGetStarted", false)
        setShowGetStarted(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "whitesmoke" }}>
            <View style={{ paddingHorizontal: 20, height: 100, justifyContent: "center" }}>
                {currentData?.showSkip &&
                    <TouchableOpacity onPress={() => { getStartedClose() }} style={{ borderRadius: 15, backgroundColor: appColors?.lightGrey, alignSelf: "flex-end" }}>
                        <Text style={{ paddingVertical: 6.5, paddingHorizontal: 18, color: appColors?.light, fontFamily: appFonts?.bold, fontWeight: undefined }}>SKIP</Text>
                    </TouchableOpacity>
                }
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
                <View style={{ marginTop: -100 }}>
                    <Image
                        source={currentData?.image}
                        fadeDuration={200}
                        loadingIndicatorSource={currentData?.image}
                    />
                </View>
                <Text style={{ color: appColors?.dark, fontFamily: appFonts?.bold, fontSize: 18 }}>{currentData?.title}</Text>
                <View style={{ marginTop: 5 }}>
                    <Text style={{ textAlign: "center", fontSize: 16, color: appColors?.lightDark, fontFamily: appFonts?.medium }}>{currentData?.description}</Text>
                </View>
            </View>
            <View style={{ height: 100, paddingHorizontal: 20, justifyContent: "center" }}>
                <TouchableOpacity onPress={() => handleIndex()} activeOpacity={0.5} style={{ backgroundColor: "black", borderRadius: 8, alignItems: "center" }}>
                    <Text style={{ color: appColors?.light, fontFamily: appFonts?.bold, paddingVertical: 15, fontSize: 16 }}>{currentData?.action}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}