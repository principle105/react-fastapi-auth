import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import NormalRoute from "./NormalRoute";

const ProtectedRoute = ({ component, path, exact, strict, redirects }) => {
    const { loggedIn, user, fetched } = useSelector((state) => state);

    return fetched ? (
        <NormalRoute
            component={
                // took so long :(
                !redirects.loggedIn || redirects.loggedIn[0] !== loggedIn ? (
                    !redirects.verified ||
                    (user === null && !redirects.loggedIn[0]) ||
                    redirects.verified[0] !==
                        (user !== null && user.verified) ? (
                        component
                    ) : (
                        <Redirect to={redirects.verified[1]} />
                    )
                ) : (
                    <Redirect to={redirects.loggedIn[1]} />
                )
            }
            exact={exact}
            strict={strict}
            path={path}
        />
    ) : (
        <div className="ui active inverted dimmer">
            <div className="ui text loader">Loading</div>
        </div>
    );
};

export default ProtectedRoute;
