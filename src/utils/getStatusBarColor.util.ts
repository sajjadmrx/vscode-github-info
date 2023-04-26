export function getStatusBarColor(followersCount: number): string {
    if (followersCount < 50) {
        return "#f44336"; //red
    } else if (followersCount < 200) {
        return "#ffc107"; //yellow
    } else {
        return "#4caf50"; //green
    }
}

