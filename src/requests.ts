import axios from 'axios';
import { GithubRepository, GithubUserProfile } from './interfaces/github.interface';

const BASE_URL = "https://api.github.com";



export async function getGithubUserProfile(username: string): Promise<GithubUserProfile> {
    const response = await axios.get(`${BASE_URL}/users/${username}`);
    return response.data
}

export async function getUserRepositories(username: string): Promise<GithubRepository[]> {
    const response = await axios.get(`${BASE_URL}/users/${username}/repos`);
    return response.data.map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url
    }));
}
