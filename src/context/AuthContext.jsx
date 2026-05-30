import {

  createContext,

  useContext,

  useState,

} from "react";

/* =========================
   CREATE CONTEXT
========================= */

const AuthContext =
  createContext();

/* =========================
   PROVIDER
========================= */

export function AuthProvider({

  children,

}) {

  const [user,
    setUser] =
    useState(

      JSON.parse(

        localStorage.getItem(
          "user"
        )
      )
    );

  /* =========================
     LOGIN
  ========================= */

  function login(
    userData,
    token
  ) {

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(

      "user",

      JSON.stringify(
        userData
      )
    );

    setUser(userData);
  }

  /* =========================
     LOGOUT
  ========================= */

  function logout() {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);
  }

  return (

    <AuthContext.Provider

      value={{

        user,

        login,

        logout,

      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

/* =========================
   CUSTOM HOOK
========================= */

export function useAuth() {

  return useContext(
    AuthContext
  );
}