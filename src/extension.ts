import * as vscode from 'vscode';
import { getConfig, getStatusBarColor } from './utils';
import { GithubUserProfile } from './interfaces/github.interface';
import { setAccessToken } from './commands/setAccessToken.cmd';
import { getGithubUserProfile, getGithubCurrentUserProfile } from './requests';
import { setUsername } from './commands/setUsername';
import { LogLevel, log } from './logger';
import ms from "ms"

export async function activate(context: vscode.ExtensionContext) {
	const statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem.text = "Loading...";
	statusBarItem.show();


	const config = getConfig()


	let setTokenCmd = vscode.commands.registerCommand('github-info.auth', setAccessToken);
	let setUserNameCmd = vscode.commands.registerCommand('github-info.set-username', setUsername);

	context.subscriptions.push(setTokenCmd, setUserNameCmd);


	const token = await config.get('token') as string;
	const username = await config.get('username') as string;
	if (!token && !username) {
		vscode.window.showErrorMessage('[github_info] Please set your GitHub token or username');
		statusBarItem.hide()
		return;
	}

	try {
		const user: GithubUserProfile = token ? await getGithubCurrentUserProfile(token) : await getGithubUserProfile(username)
		updateFollowersBar(user, statusBarItem)
		setInterval(async () => {
			try {
				statusBarItem.text = "Updating.."
				statusBarItem.show()
				const user: GithubUserProfile = token ? await getGithubCurrentUserProfile(token) : await getGithubUserProfile(username)
				updateFollowersBar(user, statusBarItem)
			} catch (er) {

			}
		}, ms("1h"))
	} catch (er: any) {
		log(LogLevel.Error, er)
		statusBarItem.hide()
	}


	log(LogLevel.Info, 'Congratulations, your extension "github-info" is now active! ');
}

export function deactivate() { }

function updateFollowersBar(user: GithubUserProfile, statusBarItem: vscode.StatusBarItem): void {
	statusBarItem.text = `\$(mark-github)  Followers: ${user.followers} | Following: ${user.following}`
	statusBarItem.color = getStatusBarColor(user.followers)
}






