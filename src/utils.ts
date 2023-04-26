import * as vscode from 'vscode';


export type WorkspaceExtensionConfiguration = vscode.WorkspaceConfiguration & {
    token: string,
    username: string,
    intervalTime: string
}

export function getConfig() {
    return vscode.workspace.getConfiguration('github_info') as WorkspaceExtensionConfiguration;
}

export function getStatusBarColor(followersCount: number): string {
    if (followersCount < 50) {
        return "#f44336"; //red
    } else if (followersCount < 200) {
        return "#ffc107"; //yellow
    } else {
        return "#4caf50"; //green
    }
}