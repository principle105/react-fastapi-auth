import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../actions";

import { Button, Input } from "semantic-ui-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(register(email, password));
    };

    return (
        <div>
            <h1>Register</h1>
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
                Register
            </Button>
            <p style={{ marginTop: "0.6rem" }}>
                Already have an account?{" "}
                <NavLink to="/login" exact>
                    Login
                </NavLink>
            </p>
        </div>
    );
};

export default Login;
