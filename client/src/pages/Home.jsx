import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
    const { user } = useSelector((state) => state);

    return (
        <div>
            <h1>Signed in as {user.email}</h1>
        </div>
    );
};

export default Home;
