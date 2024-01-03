import jwt_decode from "jwt-decode";

export const getDecodedAccessToken = () => {
    const storedData = localStorage.getItem('accessToken');
    if (storedData) {
        const { accessToken } = JSON.parse(storedData);
        if (accessToken) {
            return jwt_decode(accessToken);
        }
    }
    return null;
};
