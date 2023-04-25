import * as vscode from 'vscode';
import { getConfig } from '../utils';


export async function setUsername() {
    try {
        const input = await vscode.window.showInputBox({
            prompt: 'Enter your GitHub username',
            value: await getConfig().get('github.username') || ''
        });

        if (!input) {
            return;
        }

        await getConfig().update('username', input, vscode.ConfigurationTarget.Global);

        await vscode.window.showInformationMessage(`Username ${input} saved successfully!`);
    } catch (err) {
        console.error(err);
        vscode.window.showErrorMessage('An error occurred while saving the username.');
    }
}
