import * as vscode from 'vscode';
import { GithubUserProfile } from './interfaces/github.interface';
import { setAccessToken } from './commands/setAccessToken.cmd';
import { getGithubUserProfile, getGithubCurrentUserProfile } from './requests';
import { setUsername } from './commands/setUsername';
import { LogLevel, log } from './logger';
import ms from "ms"
import axios from 'axios';
import { getFormatFollowersCount } from './utils/getFormatFollowersCount.util';
import { getStatusBarColor } from './utils/getStatusBarColor.util';
import { getConfig } from './utils/config.util';
import { CONFIG_KEYS } from './constants/config-keys.constant';

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

		updateHandling(user, config.currentFollowers, statusBarItem)
		setInterval(async () => {
			try {
				statusBarItem.text = "Updating.."
				statusBarItem.show()
				const user: GithubUserProfile = token ? await getGithubCurrentUserProfile(token) : await getGithubUserProfile(username)

				updateHandling(user, config.currentFollowers, statusBarItem)
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



async function updateHandling(user: GithubUserProfile, previousFollowersCount: number, statusBarItem: vscode.StatusBarItem): Promise<void> {
	const config = getConfig()
	const currentFollowersCount = user.followers;
	let message =
		`$(mark-github)  Followers: ${getFormatFollowersCount(currentFollowersCount)} | Following: ${getFormatFollowersCount(user.following)}`;
	if (previousFollowersCount > 0) {
		const diff = currentFollowersCount - previousFollowersCount;
		if (diff > 0) {
			message += ` (${diff} new follower${diff > 1 ? 's' : ''})`;
		} else if (diff < 0) {
			message += ` (${Math.abs(diff)} unfollower${Math.abs(diff) > 1 ? 's' : ''})`;
		}
	}
	await config.update(CONFIG_KEYS.currentFollowers, currentFollowersCount, vscode.ConfigurationTarget.Global)
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




