import { createContext, Dispatch, SetStateAction } from "react";

export interface listoContextType {
    showGetStarted: boolean,
    setShowGetStarted: Dispatch<SetStateAction<boolean>>,
    setUserDetails: Dispatch<SetStateAction<any>>
    userDetails?: any,
    islogin: boolean,
    setIsLogin: Dispatch<SetStateAction<boolean>>,
    accountDetails?: any
    setAccountDetails: Dispatch<SetStateAction<any>>
}

const defaultValues: listoContextType = {
    showGetStarted: true,
    setShowGetStarted: () => { },
    setUserDetails: () => { },
    islogin: false,
    setIsLogin: () => { },
    accountDetails: [],
    setAccountDetails: () => { }
}

const ListoContext = createContext(defaultValues);

export default ListoContext