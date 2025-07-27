import { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack"
import GetStartedScreen from "../screens/getStartedScreen/getStartedScreen"

//Custom-Imports
import Appstack from "./appStack";
import Authstack from "./authStack";
import ListoContext from "../../shared/listoContext";



export default function Rootstack() {

    const RootStack = createStackNavigator();

    const { showGetStarted, isLoggedIn } = useContext(ListoContext)


    if (showGetStarted) {
        return (
            <GetStartedScreen />
        )
    }

    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ?
                <RootStack.Screen name="appStack" component={Appstack} />
                :
                <RootStack.Screen name="authStack" component={Authstack} />
            }
        </RootStack.Navigator>
    )
}