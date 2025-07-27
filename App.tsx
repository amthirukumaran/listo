import { LogBox } from "react-native";
import { withStallion } from "react-native-stallion";
import { useLayoutEffect, useState } from "react";
import SplashScreen from "react-native-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

//Custom-Imports
import ListoContext from "./src/shared/listoContext";
import Rootstack from "./src/navigations/stacks/rootStack";
import googleSignInJSON from "../Listo/android/app/google-services.json";

LogBox.ignoreLogs(["This method is deprecated (as well as all React Native Firebase namespaced API) and will be removed in the next major release as part of move to match Firebase Web modular SDK API. Please see migration guide for more details: https://rnfirebase.io/migrating-to-v22. Method called was `toJSON`"])

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userDetails, setUserDetails] = useState();

  const [accountDetails, setAccountDetails] = useState([]);

  const [showGetStarted, setShowGetStarted] = useState<boolean>(false);

  useLayoutEffect(() => {
    GoogleSignin?.configure({ webClientId: googleSignInJSON?.client[0]?.oauth_client[1]?.client_id })
    getTourVisibility()
  }, [])

  const getTourVisibility = async () => {
    await AsyncStorage.getItem("showGetStarted").then((value) => {
      if (value === "false") {
        setShowGetStarted(false);
        setTimeout(async () => {
          await AsyncStorage?.getItem("isLogin").then(async (value) => {
            if (value === "true") {
              setIsLoggedIn(true)
              console.log("inside----")
              await AsyncStorage.getItem("accountDetails").then(res => {
                console.log("inside----", JSON.stringify(res, null, 4))
                setAccountDetails(JSON.parse(res as string))
              })
              await AsyncStorage.getItem("userDetails").then(res => {
                console.log("inside----", JSON.stringify(res, null, 4))
                setUserDetails(JSON.parse(res as string))
              })
            } else {
              setIsLoggedIn(false)
            }
          })
          SplashScreen?.hide()
        }, 400);
      } else {
        setShowGetStarted(true);
        setTimeout(async () => {
          await AsyncStorage?.getItem("isLogin").then(async (value) => {
            if (value === "true") {
              setIsLoggedIn(true)
              console.log("inside----")
              await AsyncStorage.getItem("accountDetails").then(res => {
                console.log("inside----", JSON.stringify(res, null, 4))
                setAccountDetails(JSON.parse(res as string))
              })
              await AsyncStorage.getItem("userDetails").then(res => {
                console.log("inside----", JSON.stringify(res, null, 4))
                setUserDetails(JSON.parse(res as string))
              })
            } else {
              setIsLoggedIn(false)
            }
          })
          SplashScreen?.hide()
        }, 400);
      }
    })
  }


  return (
    <ListoContext.Provider value={{ showGetStarted: showGetStarted, setShowGetStarted: setShowGetStarted, userDetails: userDetails, setUserDetails: setUserDetails, isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn, accountDetails: accountDetails, setAccountDetails: setAccountDetails }}>
      <NavigationContainer>
        <SafeAreaProvider >
          <Rootstack />
        </SafeAreaProvider>
      </NavigationContainer>
    </ListoContext.Provider>
  )
}
export default withStallion(App)