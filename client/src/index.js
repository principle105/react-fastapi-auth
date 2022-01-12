import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import reducers from "./reducers";
import { loginSuccess, loginFailure } from "./actions";

import App from "./App.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "semantic-ui-css/semantic.min.css";

console.log = console.warn = console.error = () => {};

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancer(applyMiddleware(thunk)));
window.mainStore = store;

fetch("/api/auth/data", {
    headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
})
    .then((r) => r.json())
    .then((res) => {
        if (res.email) {
            store.dispatch(loginSuccess(res));
        } else {
            store.dispatch(loginFailure(res));
        }
    })
    .catch((e) => {
        store.dispatch(loginFailure(e));
    });

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ToastContainer limit={3} />
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);
