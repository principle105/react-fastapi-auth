import React, { lazy } from "react";
import { Switch } from "react-router-dom";
import { NormalRoute, ProtectedRoute } from "./utils/routes";

// Importing components
import NavBar from "./components/NavBar";

// Importing Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Verify = lazy(() => import("./pages/Verify"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

const App = () => {
    return (
        <div
            id="pseudoBody"
            style={{
                marginRight: "2rem",
                marginLeft: "2rem",
            }}
        >
            <NavBar />
            <Switch>
                <ProtectedRoute
                    component={<Home />}
                    exact
                    path="/"
                    redirects={{
                        verified: [false, "/verify"],
                        loggedIn: [false, "/login"],
                    }}
                />
                <ProtectedRoute
                    component={<Login />}
                    exact
                    path="/login"
                    redirects={{
                        loggedIn: [true, "/"],
                    }}
                />
                <ProtectedRoute
                    component={<Register />}
                    exact
                    path="/register"
                    redirects={{
                        loggedIn: [true, "/"],
                    }}
                />
                <ProtectedRoute
                    component={<Verify />}
                    exact
                    path="/verify"
                    redirects={{
                        verified: [true, "/"],
                        loggedIn: [false, "/"],
                    }}
                />
                <NormalRoute component={<PageNotFound />} path="*" />
            </Switch>
        </div>
    );
};

export default App;
