import { getFormatFollowersCount } from "../getFormatFollowersCount.util"
describe('getFormatFollowersCount', () => {
    it('formats count less than 1000', () => {
        expect(getFormatFollowersCount(999)).toBe('999');
    });

    it('formats count between 1000 and 999999', () => {
        expect(getFormatFollowersCount(1500)).toBe('1.5K');
    });

    it('formats count between 1000000 and 999999999', () => {
        expect(getFormatFollowersCount(5000000)).toBe('5M');
    });

    it('formats count greater than or equal to 1000000000', () => {
        expect(getFormatFollowersCount(1500000000)).toBe('1.5B');
    });
});
