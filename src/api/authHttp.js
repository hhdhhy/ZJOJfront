import http from "./http"

const login = (username, password) => {
    const path="/auth/login/"
    return http.post(path, {
        username,
        password
    });
};

const register = (username, password) => {
    const path="/auth/register/"
    return http.post(path, {
        username,
        password
    });
};

export default {
    login,
    register
}