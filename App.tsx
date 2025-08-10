import { LogBox } from "react-native";
import { useLayoutEffect, useState } from "react";
import { withStallion } from "react-native-stallion";
import SplashScreen from "react-native-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";

//Custom-Imports
import ListoContext from "./src/shared/listoContext";
import Rootstack from "./src/navigations/stacks/rootStack";
import { sessionHandler } from "./src/shared/sessionHandler";
import { clientId, encryptedStorage, storage } from "./src/shared/config";

LogBox.ignoreLogs(["This method is deprecated (as well as all React Native Firebase namespaced API) and will be removed in the next major release as part of move to match Firebase Web modular SDK API. Please see migration guide for more details: https://rnfirebase.io/migrating-to-v22. Method called was `toJSON`"])

function App() {

  //variable used to handle state of login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //Variable used to store the currentUser Details
  const [userDetails, setUserDetails] = useState();
  //Variable used to store account details 
  const [accountDetails, setAccountDetails] = useState([]);
  //Variable used to handle tour
  const [showGetStarted, setShowGetStarted] = useState<boolean>(false);
  //helping function
  const { handleAccountSwitchFailure } = sessionHandler();

  useLayoutEffect(() => {
    checkUserAuthentication()
  }, [])

  const checkUserAuthentication = () => {

    GoogleSignin?.configure({ webClientId: clientId })

    const statusOfTour = storage.getBoolean("showGetStarted");
    setShowGetStarted(statusOfTour ?? true)
    if (statusOfTour) {
      setIsLoggedIn(false)
      setTimeout(() => {
        SplashScreen.hide()
      }, 400);
    } else {
      const statusOfLogin = storage.getBoolean("isLoggedIn")
      if (statusOfLogin) {
        handleAccountSwitchFailure().then((res: any) => {
          if (res?.success) {
            setUserDetails(res?.userDetails)
            encryptedStorage.set("userDetails", JSON.stringify(res?.userDetails))
            setAccountDetails(res?.accountDetails)
            encryptedStorage.set("accountDetails", JSON.stringify(res?.accountDetails))
            setIsLoggedIn(true)
            storage.set("isLoggedIn", true)
            setTimeout(() => {
              SplashScreen.hide()
            }, 400);
          }
        }).catch((e: any) => {
          encryptedStorage.delete("userDetails")
          encryptedStorage.delete("accountDetails")
          encryptedStorage.delete("token")
          storage.delete("isLoggedIn")
          setIsLoggedIn(false)
          storage.set("isLoggedIn", false)
          setTimeout(() => {
            SplashScreen.hide()
          }, 400);
        })
      } else {
        setIsLoggedIn(false)
        storage.set("isLoggedIn", false)
        setTimeout(() => {
          SplashScreen.hide()
        }, 400);
      }
    }

  }

  return (
    <ListoContext.Provider value={{ showGetStarted: showGetStarted, setShowGetStarted: setShowGetStarted, userDetails: userDetails, setUserDetails: setUserDetails, isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn, accountDetails: accountDetails, setAccountDetails: setAccountDetails }}>
      <NavigationContainer>
        <SafeAreaProvider initialMetrics={initialWindowMetrics} >
          <Rootstack />
        </SafeAreaProvider>
      </NavigationContainer>
    </ListoContext.Provider>
  )
}
export default withStallion(App)