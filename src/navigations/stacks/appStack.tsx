import { createStackNavigator } from "@react-navigation/stack"

//Custom-Imports
import Dashboard from "../screens/appScreens/dashboard";
import SearchScreen from "../screens/appScreens/searchScreen";

export default function Appstack() {

    const AppStack = createStackNavigator();

    return (
        <AppStack.Navigator initialRouteName="dashboard" screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="dashboard" component={Dashboard} options={{ animation: "scale_from_center" }} />
            <AppStack.Screen name="SearchScreen" component={SearchScreen} options={{ animation: "fade" }} />
        </AppStack.Navigator>
    )

}