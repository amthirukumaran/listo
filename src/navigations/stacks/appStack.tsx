import { createStackNavigator } from "@react-navigation/stack"

//Custom-Imports
import AddTask from '../screens/appScreens/addTask';
import Dashboard from "../screens/appScreens/dashboard";
import SearchScreen from "../screens/appScreens/searchScreen";

export default function Appstack() {

    const AppStack = createStackNavigator();

    return (
        <AppStack.Navigator initialRouteName="dashboard" screenOptions={{ headerShown: false, cardOverlayEnabled: false }}>
            <AppStack.Screen name="dashboard" component={Dashboard} options={{ animation: "scale_from_center" }} />
            <AppStack.Screen name="searchScreen" component={SearchScreen} options={{ animation: "fade" }} />
            <AppStack.Screen name="addTask" component={AddTask} options={{ animation: "slide_from_right" }} />
        </AppStack.Navigator>
    )

}