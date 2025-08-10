import axios from "axios";
import { baseUrl, encryptedStorage } from "./config";

const ListoAPI = axios.create({
    baseURL: baseUrl, // IMPORTANT: Replace with your actual backend API URL
    timeout: 10000, // Request timeout in milliseconds (e.g., 10 seconds)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Often useful for APIs
    },
});

ListoAPI?.interceptors?.request?.use((config) => {
    // You can add any request-specific logic here, such as adding authentication tokens
    // For example, if you have a token stored in MMKV:
    const token = encryptedStorage.getString('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // Handle request errors here
    return Promise.reject(error);
})

ListoAPI?.interceptors?.response?.use((response) => {
    // You can add any response-specific logic here
    return response;
}, (error) => {
    // Handle response errors here
    if (error.response) {
        switch (error.response.status) {
            case 401:
                // Unauthorized: Token might be expired or invalid.
                console.log('Authentication Required: Token invalid or expired. Attempting refresh or redirect to login...');
                // In a real app, you would:
                // 1. Try to refresh the token if a refresh token is available.
                // 2. If refresh fails or not applicable, navigate the user to the login screen.
                // Example (pseudo-code for navigation in React Native):
                // navigation.navigate('Login');
                break;
            case 403:
                // Forbidden: User does not have permission for this action.
                console.log('Permission Denied: User does not have access to this resource.');
                // You might show a specific error message to the user.
                break;
            case 404:
                // Not Found: The requested resource does not exist.
                console.log('Resource Not Found: The API endpoint or resource does not exist.');
                break;
            case 500:
                // Internal Server Error: Something went wrong on the server.
                console.log('Server Error: An internal server error occurred.');
                break;
            default:
                // Handle other HTTP status codes
                console.log(`Unhandled HTTP Error: ${error.response.status}`);
        }
    } else if (error.request) {
        // The request was made but no response was received
        console.error('Request error:', error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
    }
    return Promise.reject(error);
});

export default ListoAPI;