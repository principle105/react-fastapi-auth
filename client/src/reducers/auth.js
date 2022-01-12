import {
    LOGOUT,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
} from "../actions/types";

const auth = (
    state = { loggedIn: false, user: null, fetched: false },
    action
) => {
    const { type, payload } = action;

    switch (type) {
        case LOGOUT:
            return {
                ...state,
                loggedIn: false,
                user: null,
                fetched: true,
            };

        case REGISTER_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                user: payload.user,
                fetched: true,
            };
        case REGISTER_FAIL:
            return {
                ...state,
                loggedIn: false,
                fetched: true,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                loggedIn: false,
                user: null,
                fetched: true,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                user: payload.user,
                fetched: true,
            };
        default:
            return state;
    }
};

export default auth;
