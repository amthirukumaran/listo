import { Icon } from '@rneui/base';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';

import { appColors } from "./appColors";
import { appFonts } from './appFonts';


export type DialogType = {
    dialogProps?: {
        content: string,
        button: { id: number, label: string, color: string, backgroundColor: string }[],
        image: { iconName: string, color: string, iconType?: string, size?: number | null }
    },
    confirmation: (label: string) => void,
    isPopover?: boolean
}

//functional component to render confirmation dialog
const Dialog = ({ dialogProps, confirmation }: DialogType) => {

    const { width } = useWindowDimensions()

    //Variable which is used for manage app font size
    const smallerFontSize = width > 900 ? 18 : width > 600 ? 16 : 14;
    //Variable used to maintain leave page dialog box props for update/add modifier modal
    const leaveDialogProps = {
        content: "You have unsaved changes. Are you sure you want to leave this page?",
        button: [
            { id: 2, label: "No", color: appColors?.secondary, backgroundColor: appColors.light },
            { id: 1, label: "Yes", color: appColors.light, backgroundColor: appColors.secondary }
        ],
        image: { iconName: 'run', color: appColors.secondary }
    }
    //Variable which is used to store dialog value
    const dialog: DialogType['dialogProps'] = dialogProps ?? leaveDialogProps

    return (
        <View style={{ flex: 1, backgroundColor: appColors?.light }}>
            {/* render content and icon */}
            <View style={{ alignItems: 'center', justifyContent: 'space-between', flex: 1, marginBottom: 10 }}>
                <Icon type={dialog?.image?.iconType ?? 'material-community'} name={dialog?.image?.iconName} size={dialog?.image?.size ?? 40} color={dialog?.image?.color} style={{ paddingTop: 25, paddingBottom: 15 }} />
                <Text style={{ fontSize: smallerFontSize, fontFamily: appFonts?.medium, marginHorizontal: 20, color: appColors.lightDark, flexWrap: 'wrap', lineHeight: 25, textAlign: 'center' }}>{dialog?.content}</Text>
            </View>
            {/* render button */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                {dialog?.button.map((item) => {
                    return (
                        <Pressable key={item?.id}
                            style={({ pressed }) => [
                                { opacity: pressed ? 0.7 : 1 }
                            ]}
                            onPress={() => confirmation(item.label)}>
                            <View style={{
                                alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, flexDirection: 'column', padding: 9, borderRadius: 50, shadowColor: "0000", shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { height: 2, width: 2 }, elevation: 5,
                                backgroundColor: item?.backgroundColor, width: dialog?.button?.length == 1 ? 200 : 100
                            }}>
                                <Text style={{ textAlign: 'center', alignSelf: 'center', textTransform: 'capitalize', lineHeight: 20, color: item?.color, fontSize: smallerFontSize, fontFamily: appFonts.bold }}>{item?.label}</Text>
                            </View>
                        </Pressable>
                    )
                })
                }
            </View>
        </View >
    )

}
export default Dialog;