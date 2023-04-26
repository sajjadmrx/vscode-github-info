import * as vscode from 'vscode';
import { getConfig } from '../utils/config.util';


export async function setUsername() {
    try {
        const input = await vscode.window.showInputBox({
            prompt: 'Enter your GitHub username',
            value: ''
        });

        if (!input) {
            return;
        }

        await getConfig().update('username', input, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`✅ Username ${input} saved successfully!`);
    } catch (err) {
        console.error(err);
        vscode.window.showErrorMessage('An error occurred while saving the token.');
    }
}
