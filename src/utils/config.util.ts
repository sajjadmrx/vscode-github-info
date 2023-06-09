import * as vscode from 'vscode';

export type Config = {
    token: string,
    username: string,
    intervalTime: string,
    currentFollowers: number,
    colors: {
        low: string,
        medium: string,
        high: string
    }
}
export type WorkspaceExtensionConfiguration = vscode.WorkspaceConfiguration & Config

export function getConfig() {
    return vscode.workspace.getConfiguration('github_info') as WorkspaceExtensionConfiguration;
}

