import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth";

//change component to alias Component and ...rest takes in the rest the props
function AuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      //Component is either Login or Register depending 
      render={props => (user ? <Redirect to="/" /> : <Component {...props} />)}
    />
  );
}

export default AuthRoute;
