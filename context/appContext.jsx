import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
const AppContext = createContext();
export const MyAppContext = ({ children }) => {
  const [login, setLogin] = useState(true);
  const [modelOpen, setModelOpen] = useState(false);
   const [activeForm, setActiveForm] = useState("login");
   const [userDetails, setUserDetails] = useState(null);
   useEffect(() => {
     const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserDetails(JSON.parse(storedUser));
      }
    }, []); 
// console.log(userDetails)
  return (
    <AppContext.Provider
      value={{
        login,
        setLogin,
        modelOpen,
        setModelOpen,
        activeForm,
        setActiveForm,
        userDetails,
        setUserDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useMyContext = () => useContext(AppContext);
