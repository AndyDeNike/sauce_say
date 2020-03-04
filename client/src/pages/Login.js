//rcf
import React, { useContext, useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

//functional component!
function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  //   const onChange = event => {
  //     setValues({ ...values, [event.target.name]: event.target.value });
  //   };

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: ""
  });

  //LOGIN_USER is the graphql query /
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    // userData is an alias for login
    update(_, { data: { login: userData } }) {
      console.log(userData);
      console.log("1");
      context.login(userData);
      console.log("4");
      console.log(context.user);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    //variables are necessary for mutations
    variables: values
  });

  function loginUserCallback() {
    loginUser();
  }

  //   const onSubmit = event => {
  //     event.preventDefault();
  //     loginUser();
  //   };

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>

      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul classname="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
