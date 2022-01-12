import React, { Suspense } from "react";
import { Route } from "react-router-dom";

const NormalRoute = ({ component, path, exact, strict }) => {
    return (
        <Route
            component={() => (
                <Suspense fallback={<div></div>}>{component}</Suspense>
            )}
            exact={exact}
            strict={strict}
            path={path}
        />
    );
};

export default NormalRoute;
