import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../actions";

import { Button, Input } from "semantic-ui-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(login(email, password));
    };

    return (
        <div>
            <h1>Login</h1>
            <Input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button primary onClick={handleLogin}>
                Login
            </Button>
            <p style={{ marginTop: "0.6rem" }}>
                Don't already have an account?{" "}
                <NavLink to="/register" exact>
                    Register
                </NavLink>
            </p>
        </div>
    );
};

export default Login;
