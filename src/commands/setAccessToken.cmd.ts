import * as vscode from 'vscode';
import { getConfig } from '../utils';


export async function setAccessToken() {
    try {
        const input = await vscode.window.showInputBox({
            prompt: 'GitHub Personal Access Token',
            value: ''
        });

        if (!input) {
            return;
        }

        await getConfig().update('token', input, vscode.ConfigurationTarget.Global);
        await vscode.window.showInformationMessage(`✅ saved successfully!`);
    } catch (err) {
        console.error(err);
        vscode.window.showErrorMessage('An error occurred while saving the token.');
    }
}
