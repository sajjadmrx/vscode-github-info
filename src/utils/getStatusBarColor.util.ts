import { getConfig } from "./config.util";

export function getStatusBarColor(followersCount: number): string {
    const colors = getConfig().colors

    let color = colors.low;

    if (followersCount >= 100 && followersCount < 500) {
        color = colors.medium;
    } else if (followersCount >= 500) {
        color = colors.high;
    }

    return color;
}

