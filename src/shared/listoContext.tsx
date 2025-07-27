import { createContext, Dispatch, SetStateAction } from "react";

export interface listoContextType {
    showGetStarted: boolean,
    setShowGetStarted: Dispatch<SetStateAction<boolean>>,
    setUserDetails: Dispatch<SetStateAction<any>>
    userDetails?: any,
    isLoggedIn: boolean,
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>,
    accountDetails?: any
    setAccountDetails: Dispatch<SetStateAction<any>>
}

const defaultValues: listoContextType = {
    showGetStarted: true,
    setShowGetStarted: () => { },
    setUserDetails: () => { },
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    accountDetails: [],
    setAccountDetails: () => { }
}

const ListoContext = createContext(defaultValues);

export default ListoContext