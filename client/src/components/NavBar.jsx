import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../actions";

import { Button, Menu } from "semantic-ui-react";

const NavBar = () => {
    const { loggedIn } = useSelector((state) => state);

    const dispatch = useDispatch();

    const handleLogOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    const NavItem = (props) => {
        return (
            <NavLink to={props.to} exact>
                {props.name}
            </NavLink>
        );
    };

    return (
        <div style={{ paddingTop: "1rem" }}>
            <Menu secondary>
                <Menu.Item style={{ fontSize: 22 }}>
                    <NavItem to="/" name="Authentication" />
                </Menu.Item>
                {loggedIn ? (
                    <Menu.Item position="right" style={{ fontSize: 15 }}>
                        <Button color="red" onClick={handleLogOut}>
                            Logout
                        </Button>
                    </Menu.Item>
                ) : null}
            </Menu>
            <div className="ui hidden divider"></div>
        </div>
    );
};

export default NavBar;
