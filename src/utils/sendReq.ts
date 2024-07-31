import { API_BASE_URL } from '@/vars.ts';

export default async function sendReq(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data: object = {}) {
    const options: {
        method: string,
        headers: { [key: string]: string },
        body?: string,
        credentials: RequestCredentials
    } = {
        method,
        headers: {},
        credentials: 'include'
    };

    if (method !== 'GET' && Object.keys(data).length > 0) {
        options.body = JSON.stringify(data);
        options.headers['Content-Type'] = 'application/json';
    }

    let res;
    try {
        res = await fetch(url.startsWith('http') ? url : API_BASE_URL + url, options);
    } catch (e) {
        return {
            fetched: false,
            error: e
        };
    }

    const json = await res.json();

    return {
        fetched: true,
        ok: res.ok,
        status: res.status,
        data: json
    };
}

export async function sendFileReq(url: string, file: File) {
    const body = new FormData();
    body.append('file', file);

    let res;
    try {
        res = await fetch(url.startsWith('http') ? url : API_BASE_URL + url, {
            method: 'POST',
            body,
            credentials: 'include'
        });
    } catch (e) {
        return {
            fetched: false,
            error: e
        };
    }

    const json = await res.json();

    return {
        fetched: true,
        ok: res.ok,
        status: res.status,
        data: json
    };
}