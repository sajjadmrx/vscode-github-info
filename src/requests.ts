import axios from 'axios';
import { GithubUserProfile } from './interfaces/github.interface';

const BASE_URL = "https://api.github.com";



export async function getGithubCurrentUserProfile(token: string): Promise<GithubUserProfile> {
    const response = await axios.get(`${BASE_URL}/user`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export async function getGithubUserProfile(username: string): Promise<GithubUserProfile> {
    const response = await axios.get(`${BASE_URL}/users/${username}`);
    return response.data;
}