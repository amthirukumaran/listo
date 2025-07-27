import { createStackNavigator } from "@react-navigation/stack"

//Custom-Imports
import Dashboard from "../screens/appScreens/dashboard";

export default function Appstack() {

    const AppStack = createStackNavigator();

    return (
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="dashboard" component={Dashboard} />
        </AppStack.Navigator>
    )

}