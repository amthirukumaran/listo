import { Divider, SearchBar } from '@rneui/base';
import RBSheet from "react-native-raw-bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';

import { appFonts } from "../../../shared/appFonts";
import { appColors } from "../../../shared/appColors";

const SearchScreen = () => {

    //@ts-ignore
    const refRBSheet = useRef<RBSheet>(null)
    //Variable used to hold the searchText
    const [searchText, setSearchText] = useState("");

    const sortby = ["Best Matches", "Last edited: Newest First", "Last edited: Oldest First", "Created: Newest First", "Created: Oldest First"]

    useEffect(() => {
        if (searchText) {

        } else {

        }
    }, [searchText])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: appColors?.light }}>
            <StatusBar barStyle={"dark-content"} />
            <View style={{ paddingHorizontal: 15, marginTop: 20, flexDirection: "row", gap: 10, alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                    <SearchBar
                        value={searchText}
                        placeholder="Search.."
                        searchIcon={{ size: 25, color: appColors?.lightDark, style: { padding: 0, marginLeft: 5 } }}
                        allowFontScaling
                        autoFocus={true}
                        inputMode="search"
                        placeholderTextColor={appColors?.lightDark}
                        verticalAlign="middle"
                        textAlignVertical="center"
                        onChangeText={(text) => setSearchText(text)}
                        clearIcon={searchText?.length ? true : false}
                        inputStyle={{ fontSize: 15, fontFamily: appFonts?.medium, color: appColors?.dark }}
                        inputContainerStyle={{ backgroundColor: appColors?.secondary, borderRadius: 13, height: 48, paddingHorizontal: 0, paddingVertical: 0 }}
                        containerStyle={{ backgroundColor: appColors?.light, borderTopColor: appColors?.light, borderBottomColor: appColors?.light, paddingHorizontal: 0, paddingVertical: 0, }}
                    />
                </View>
                <TouchableOpacity onPress={() => { Keyboard.dismiss(); setTimeout(() => { refRBSheet?.current?.open() }, 200); }} style={{ aspectRatio: 1, backgroundColor: appColors?.dark, padding: 8, borderRadius: 99 }}>
                    <Ionicons name="filter" size={22} color={appColors?.secondary} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>

            </View>
            <RBSheet ref={refRBSheet} draggable customModalProps={{ statusBarTranslucent: true }} height={295} customStyles={{ container: { borderTopEndRadius: 20, borderTopStartRadius: 20 } }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: appColors?.light }}>
                    <View style={{ alignSelf: "center", marginTop: 5, marginBottom: 10 }}>
                        <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark, fontSize: 14 }}>Sort by</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: appColors?.light, paddingHorizontal: 20, justifyContent: "center", overflow: "hidden" }}>
                        <View style={{ backgroundColor: appColors?.secondary, borderRadius: 10, overflow: "hidden" }}>
                            {sortby?.map((itm, ind) =>
                                <TouchableOpacity key={ind}>
                                    <View style={{ paddingVertical: 12, paddingHorizontal: 15 }}>
                                        <Text style={{ fontFamily: appFonts?.medium, color: appColors?.dark }}>{itm}</Text>
                                    </View>
                                    <Divider />
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </RBSheet>
        </SafeAreaView>
    )
}

export default SearchScreen