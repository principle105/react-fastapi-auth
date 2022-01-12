import React, { useState } from "react";
import { toast } from "react-toastify";
import Auth from "../utils/auth";

import { Button, Input } from "semantic-ui-react";

const Verify = () => {
    const [token, setToken] = useState("");

    const handleTokenChange = (newValue) => {
        // Checking change is valid for code
        if (
            !newValue ||
            (parseInt(newValue) === Number(newValue) &&
                newValue.length <= 8 &&
                !/\s/.test(newValue))
        ) {
            setToken(newValue);
        }
    };

    const tryEmailVerify = () => {
        Auth.verifyEmail(token).then((res) => {
            if (!res || !res.data.verified) {
                toast.error("Invalid code", {
                    customId: "invalid-code",
                });
            } else {
                window.location.reload(false);
            }
        });

        setToken("");
    };

    return (
        <div>
            <h1>Enter your verification code</h1>
            <Input
                placeholder="Verification Token"
                value={token}
                onChange={(e) => handleTokenChange(e.target.value)}
            />
            <Button primary onClick={tryEmailVerify}>
                Verify
            </Button>
        </div>
    );
};

export default Verify;
