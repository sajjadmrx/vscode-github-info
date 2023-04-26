jest.mock('../config.util', () => ({
    getConfig: jest.fn()
}));

import { getConfig } from "../config.util";
import { getStatusBarColor } from "../getStatusBarColor.util";

describe("getStatusBarColor", () => {
    beforeEach(() => {
        // @ts-ignore
        getConfig.mockReturnValue({
            colors: {
                low: "#f44336",
                medium: "#ffc107",
                high: "#4caf50"
            }
        });
    })
    it("returns the correct color for less than 100 followers", () => {
        const color = getStatusBarColor(50);
        expect(color).toBe("#f44336");
    });

    it("returns the correct color for between 100 and 500 followers", () => {
        const color = getStatusBarColor(200);
        expect(color).toBe("#ffc107");
    });

    it("returns the correct color for more than 500 followers", () => {
        const color = getStatusBarColor(1000);
        expect(color).toBe("#4caf50");
    });
});
