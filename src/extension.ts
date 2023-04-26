import * as vscode from 'vscode';
import { getConfig, getStatusBarColor } from './utils';
import { GithubUserProfile } from './interfaces/github.interface';
import { setAccessToken } from './commands/setAccessToken.cmd';
import { getGithubUserProfile, getGithubCurrentUserProfile } from './requests';
import { setUsername } from './commands/setUsername';
import { LogLevel, log } from './logger';
import ms from "ms"
import axios from 'axios';

export async function activate(context: vscode.ExtensionContext) {
	const statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem.text = "Loading...";
	statusBarItem.show();


	const config = getConfig()


	let setTokenCmd = vscode.commands.registerCommand('github-info.set-token', setAccessToken);
	let setUserNameCmd = vscode.commands.registerCommand('github-info.set-username', setUsername);

	context.subscriptions.push(setTokenCmd, setUserNameCmd);


	const token = config.token
	const username = config.username
	if (!token && !username) {
		vscode.window.showErrorMessage('[github_info] Please set your GitHub token or username');
		statusBarItem.text = "[github_info] error";
		statusBarItem.tooltip = "[github_info] Please set your GitHub token or username"
		return;
	}

	try {
		const user: GithubUserProfile = token ? await getGithubCurrentUserProfile(token) : await getGithubUserProfile(username)

		updateHandling(user, statusBarItem)
		setInterval(async () => {
			try {
				statusBarItem.text = "Updating.."
				statusBarItem.show()
				const user: GithubUserProfile = token ? await getGithubCurrentUserProfile(token) : await getGithubUserProfile(username)

				updateHandling(user, statusBarItem)
			} catch (error: any) {
				errorHandling(error, statusBarItem)
			}
		}, ms(config.intervalTime))
	} catch (error: any) {
		errorHandling(error, statusBarItem)
	}


	log(LogLevel.Info, 'Congratulations, your extension "github-info" is now active! ');
}

export function deactivate() { }


let previousFollowersCount: number = 0

function updateHandling(user: GithubUserProfile, statusBarItem: vscode.StatusBarItem): void {
	const currentFollowersCount = user.followers;
	let message = `$(mark-github)  Followers: ${currentFollowersCount} | Following: ${user.following}`;
	if (previousFollowersCount > 0) {
		const diff = currentFollowersCount - previousFollowersCount;
		if (diff > 0) {
			message += ` (${diff} new follower${diff > 1 ? 's' : ''})`;
		} else if (diff < 0) {
			message += ` (${Math.abs(diff)} unfollower${Math.abs(diff) > 1 ? 's' : ''})`;
		}
	}
	previousFollowersCount = currentFollowersCount;
	statusBarItem.text = message;
	statusBarItem.tooltip = `"${user.login}"'s GitHub Profile`
	statusBarItem.color = getStatusBarColor(currentFollowersCount);
}

function errorHandling(error: any, statusBarItem: vscode.StatusBarItem) {
	if (axios.isAxiosError(error)) {
		const { response } = error;
		if (response?.status === 403 && response?.headers["x-ratelimit-remaining"] === "0") {
			statusBarItem.text = "API LIMIT";
			statusBarItem.color = "yellow";
			statusBarItem.tooltip = "💡 You have reached the rate limit for the GitHub API. Please try again later or increase your rate limit by authenticating with a personal access token."
			statusBarItem.show()
		} else {
			statusBarItem.text = "[github-info] error";
			statusBarItem.tooltip = response?.status.toString() || "500"
		}
	} else {
		log(LogLevel.Error, error)
		statusBarItem.text = `Error`;
		statusBarItem.tooltip = `Error occurred: ${error.message}`
		statusBarItem.show()
	}
}




