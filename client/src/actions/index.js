import {
    LOGOUT,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
} from "./types";

import Auth from "../utils/auth";

export const loginSuccess = (user) => (dispatch) => {
    dispatch({
        type: LOGIN_SUCCESS,
        payload: { user },
    });
};

export const loginFailure = () => (dispatch) => {
    dispatch({
        type: LOGIN_FAIL,
    });
};

export const registerSuccess = (user) => (dispatch) => {
    dispatch({
        type: REGISTER_SUCCESS,
        payload: { user },
    });
};

export const registerFailure = () => (dispatch) => {
    dispatch({
        type: REGISTER_FAIL,
    });
};

export const register = (email, password) => (dispatch) => {
    Auth.register(email, password).then((data) => {
        if (data && data.user) {
            dispatch(registerSuccess(data.user));
        } else {
            dispatch(registerFailure());
        }
    });
};

export const login = (email, password) => (dispatch) => {
    Auth.login(email, password).then((data) => {
        if (data && data.user) {
            dispatch(loginSuccess(data.user));
        } else {
            dispatch(loginFailure());
        }
    });
};

export const logout = () => (dispatch) => {
    Auth.logout();

    dispatch({
        type: LOGOUT,
    });
};
