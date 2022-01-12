import axios from "axios";
import { toast } from "react-toastify";

const register = (email, password) => {
    return doActivity(email, password, "register");
};

const login = (email, password) => {
    return doActivity(email, password, "token");
};

const doActivity = (email, password, addOn) => {
    const formData = new FormData();
    // Using username field because fastapi default is username instead of email
    formData.append("username", email);
    formData.append("password", password);

    return axios
        .post(`/api/auth/${addOn}`, formData)
        .then((res) => {
            if (res.data.access_token) {
                localStorage.setItem("token", res.data.access_token);
            }
            return res.data;
        })
        .catch((e) => {
            const status = e.response.status;

            const error = e.response.data.detail;

            if (status === 422 || status === 400) {
                toast.error(error || "Invalid data", {
                    toastId: "auth-error1",
                });
            } else if (status === 401) {
                toast.error(error || "You are unauthorized", {
                    toastId: "auth-error2",
                });
            } else {
                toast.error("Something went wrong", {
                    toastId: "auth-error3",
                });
            }
            return;
        });
};

const logout = () => {
    localStorage.removeItem("token");
};

const verifyEmail = (code) => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    return axios
        .get(`/api/auth/verify?code=${code}`, {
            headers,
        })
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return;
        });
};

const exportedObject = {
    register,
    login,
    logout,
    verifyEmail,
};

export default exportedObject;
