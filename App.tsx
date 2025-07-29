import { LogBox } from "react-native";
import { useLayoutEffect, useState } from "react";
import { withStallion } from "react-native-stallion";
import SplashScreen from "react-native-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

//Custom-Imports
import ListoContext from "./src/shared/listoContext";
import Rootstack from "./src/navigations/stacks/rootStack";
import { clientId, encryptedStorage, storage } from "./src/shared/config";

LogBox.ignoreLogs(["This method is deprecated (as well as all React Native Firebase namespaced API) and will be removed in the next major release as part of move to match Firebase Web modular SDK API. Please see migration guide for more details: https://rnfirebase.io/migrating-to-v22. Method called was `toJSON`"])

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userDetails, setUserDetails] = useState();

  const [accountDetails, setAccountDetails] = useState([]);

  const [showGetStarted, setShowGetStarted] = useState<boolean>(false);

  useLayoutEffect(() => {
    checkUserAuthentication()
  }, [])

  const checkUserAuthentication = () => {

    GoogleSignin?.configure({ webClientId: clientId })

    const statusOfTour = storage.getBoolean("showGetStarted");
    setShowGetStarted(statusOfTour ?? true)
    if (statusOfTour) {
      setIsLoggedIn(false)
    } else {
      const statusOfLogin = storage.getBoolean("isLoggedIn")
      setIsLoggedIn(statusOfLogin ?? false)
      if (statusOfLogin) {
        const detailsOfLoggedUser = encryptedStorage.getString("userDetails")
        setUserDetails(detailsOfLoggedUser ? JSON.parse(detailsOfLoggedUser) : null)
        const detailsOfAccount = encryptedStorage.getString("accountDetails")
        setAccountDetails(detailsOfAccount ? JSON.parse(detailsOfAccount) : [])
      }
    }

    setTimeout(() => {
      SplashScreen.hide()
    }, 400);
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