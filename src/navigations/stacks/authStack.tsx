import { createStackNavigator } from "@react-navigation/stack"

//Custom-Imports
import SignIn from "../screens/authScreens/signIn"
import SignUp from "../screens/authScreens/signUp"
import ForgotPassword from "../screens/authScreens/forgotPassword"

export default function Authstack() {

    const AuthStack = createStackNavigator()

    return (
        <AuthStack.Navigator initialRouteName="signIn" screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="signIn" component={SignIn} />
            <AuthStack.Screen name="signUp" component={SignUp} />
            <AuthStack.Screen name="forgotPassword" component={ForgotPassword} />
        </AuthStack.Navigator>
    )
}