import * as vscode from 'vscode';
import { setUsername } from './commands/addUser.cmd';
import { getConfig } from './utils';
import { getGithubUserProfile } from './requests';
import { GithubUserProfile } from './interfaces/github.interface';

export async function activate(context: vscode.ExtensionContext) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem.text = "Loading...";
	statusBarItem.show();
	const config = getConfig()


	let disposable = vscode.commands.registerCommand('github-info.saveUsername', setUsername);

	context.subscriptions.push(disposable);
	const username = await config.get('username') as string;
	if (!username) {
		vscode.window.showErrorMessage('Please enter your GitHub username first!');
		return;
	}
	try {
		// const user: GithubUserProfile = await getGithubUserProfile(username)
		statusBarItem.text = `Github Followers: ${75}`
		statusBarItem.color = 'white';
		statusBarItem.backgroundColor = '#6f42c1';
	} catch { }
	console.log('Congratulations, your extension "github-info" is now active!');
}

export function deactivate() { }



