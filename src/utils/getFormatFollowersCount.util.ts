export function getFormatFollowersCount(count: number): string {
    if (count < 1000) {
        return count.toLocaleString();
    } else if (count >= 1000 && count <= 999999) {
        return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else if (count >= 1000000 && count <= 999999999) {
        return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else {
        return (count / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
}
