import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null
};

//jwtToken is set in AuthProvider context functions
if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

  //
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    initialState.user = decodedToken;
  }
}

//thats what we use from components to access context
//context can be used or redux
const AuthContext = createContext({
  user: null,
  login: userData => {},
  logout: () => {}
});

//recieves action with type and payload and determines what to do
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      console.log("3");
      return {
        ...state,
        //set the user to this data
        user: action.payload
      };
    case "LOGOUT":
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

//we use to wrap all of app to have access to provider to functions from context
function AuthProvider(props) {
  //useReducer takes state and dispatch
  // in this case state is the user object and dispatch is authReducer
  const [state, dispatch] = useReducer(authReducer, initialState);

  //takes in context functions with userData param (provided by graphql query)
  function login(userData) {
    console.log("2");
    localStorage.setItem("jwtToken", userData.token);
    //we dispatch our action to authReducer
    dispatch({
      type: "LOGIN",
      payload: userData
    });
  }

  function logout() {
    localStorage.removeItem("jwtToken");
    dispatch({
      type: "LOGOUT"
    });
  }

  //the AuthContext.Provider
  return (
    <AuthContext.Provider
      //value is what we pass to components under this context provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
