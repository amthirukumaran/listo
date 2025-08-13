import { Divider, SearchBar } from '@rneui/base';
import RBSheet from "react-native-raw-bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

//Icon-Imports
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//Custom-Imports
import { appFonts } from "../../../shared/appFonts";
import { appColors } from "../../../shared/appColors";

const SearchScreen = () => {

    //handles the safeArea
    const { top, bottom } = useSafeAreaInsets();
    //@ts-ignore
    const refRBSheet = useRef<RBSheet>(null)
    //Variable used to control the loading state
    const [isload, setIsload] = useState<boolean>(false);
    //Variable used to hold the searchText
    const [searchText, setSearchText] = useState<string | undefined>("");
    //Variable used to store the selected sort option
    const [selectedSort, setSelectedSort] = useState<{ id: number | null }>({ id: null })

    const sortby = [
        { id: 1, value: "Best Matches" },
        { id: 2, value: "Recently Created first" },
        { id: 3, value: "Recently Created last" },
        { id: 4, value: "Recently updated first" },
        { id: 5, value: "Recently updated Last" }
    ]

    useEffect(() => {
        if (searchText) {

        } else {

        }
    }, [searchText])

    const handleSortOption = (id: number | null) => {
        setIsload(true);
        setSelectedSort({ id: id })
        setTimeout(() => {
            setIsload(false)
        }, 1000);
    }

    return (
        <KeyboardAvoidingView onStartShouldSetResponder={() => { Keyboard.dismiss(); return false }} style={{ flex: 1, backgroundColor: appColors?.light, paddingTop: top, paddingBottom: bottom }}>
            <StatusBar barStyle={"dark-content"} />
            <View style={{ paddingHorizontal: 15, marginTop: 15, flexDirection: "row", gap: 10, alignItems: "center" }}>
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
                    <Ionicons name="filter" size={23} color={appColors?.secondary} />
                </TouchableOpacity>
            </View>
            {isload ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: -100 }}>
                    <ActivityIndicator size={30} color={appColors?.lightDark} />
                </View>
                :
                <View style={{ flex: 1 }}>

                </View>
            }
            <RBSheet ref={refRBSheet} draggable customModalProps={{ statusBarTranslucent: true }} height={295} customStyles={{ container: { borderTopEndRadius: 20, borderTopStartRadius: 20 } }}>
                <View style={{ flex: 1, backgroundColor: appColors?.light, paddingHorizontal: 20, paddingBottom: bottom }}>
                    <View style={{ alignSelf: "center", marginTop: 5, marginBottom: 12 }}>
                        <Text style={{ fontFamily: appFonts?.bold, color: appColors?.dark, fontSize: 14 }}>Sort by</Text>
                    </View>
                    <Divider style={{ marginTop: 1, marginBottom: 8 }} />
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: appColors?.light, justifyContent: "center", overflow: "hidden" }}>
                        {sortby?.map((itm, ind) =>
                            <TouchableOpacity key={ind} onPress={() => { refRBSheet?.current?.close(); setTimeout(() => handleSortOption(itm?.id)); }} >
                                <View style={{ paddingVertical: 10, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <Text style={{ fontFamily: appFonts?.medium, color: appColors?.lightGrey }}>{itm?.value}</Text>
                                    <MaterialIcons name='check' color={(selectedSort?.id === itm?.id) ? appColors?.lightGrey : appColors?.light} size={22} />
                                </View>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>
            </RBSheet >
        </KeyboardAvoidingView >
    )
}

export default SearchScreen