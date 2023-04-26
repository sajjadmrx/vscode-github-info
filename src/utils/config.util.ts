import * as vscode from 'vscode';


export type WorkspaceExtensionConfiguration = vscode.WorkspaceConfiguration & {
    token: string,
    username: string,
    intervalTime: string
}

export function getConfig() {
    return vscode.workspace.getConfiguration('github_info') as WorkspaceExtensionConfiguration;
}

