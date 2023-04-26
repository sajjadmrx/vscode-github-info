import { getStatusBarColor } from "../getStatusBarColor.util"

describe('getStatusBarColor', () => {
    it('returns red for followersCount < 50', () => {
        expect(getStatusBarColor(49)).toBe('#f44336');
        expect(getStatusBarColor(0)).toBe('#f44336');
        expect(getStatusBarColor(-1)).toBe('#f44336');
    });

    it('returns yellow for 50 <= followersCount < 200', () => {
        expect(getStatusBarColor(50)).toBe('#ffc107');
        expect(getStatusBarColor(100)).toBe('#ffc107');
        expect(getStatusBarColor(199)).toBe('#ffc107');
    });

    it('returns green for followersCount >= 200', () => {
        expect(getStatusBarColor(200)).toBe('#4caf50');
        expect(getStatusBarColor(500)).toBe('#4caf50');
        expect(getStatusBarColor(999999999)).toBe('#4caf50');
    });
});
