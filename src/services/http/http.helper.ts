import axios from 'axios';

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function transformKeys(value: unknown, transform: (key: string) => string): any {
    if (Array.isArray(value)) {
        return value.map((item) => transformKeys(item, transform));
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, val]) => [transform(key), transformKeys(val, transform)])
        );
    }

    return value;
}

export function keysToSnakeCase<T = any>(value: unknown): T {
    return transformKeys(value, (key: string) => key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`));
}

export function keysToCamelCase<T = any>(value: unknown): T {
    return transformKeys(value, (key: string) => key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase()));
}

export const http = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_API_URL}/api/app`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use((config) => {
    if (config.data) {
        config.data = keysToSnakeCase(config.data);
    }
    if (config.params) {
        config.params = keysToSnakeCase(config.params);
    }
    return config;
});

http.interceptors.response.use(
    (response) => {
        response.data = keysToCamelCase(response.data);
        return response;
    },
    (error) => {
        if (error.response) {
            error.response.data = keysToCamelCase(error.response.data);
        }
        return Promise.reject(error);
    }
);


