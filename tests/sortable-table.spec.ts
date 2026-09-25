import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("interactions");
});

test.describe("Sorting filters", () => {
    test("Default table is sorted by text ascending", async ({ page }) => {
        const textFilter = page.locator(
            "xpath=//button[@data-testid='interactions-sort-name']/ancestor::th",
        );
        const nameCells = page.locator(
            "xpath=//table[@data-testid='interactions-table']//tbody/tr/td[2]",
        );
        await expect.poll(() => nameCells.count()).toBeGreaterThan(0);
        const names = await nameCells.allTextContents();

        await expect(textFilter).toHaveAttribute("aria-sort", "ascending");
        expect(names).toEqual(names.toSorted());
    });

    test("Sort table by text ascending", async ({ page }) => {
        const textSortingBT = page.locator(
            "xpath=//button[@data-testid='interactions-sort-name']",
        );
        const textFilter = textSortingBT.locator(`xpath=/ancestor::th`);
        const nameCells = page.locator(
            "xpath=//table[@data-testid='interactions-table']//tbody/tr/td[2]",
        );

        await expect.poll(() => nameCells.count()).toBeGreaterThan(0);
        await textSortingBT.dblclick();
        const names = await nameCells.allTextContents();

        await expect(textFilter).toHaveAttribute("aria-sort", "ascending");
        expect(names).toEqual(names.toSorted());
    });

    test("Sort table by text descending", async ({ page }) => {
        const textSortingBT = page.locator(
            "xpath=//button[@data-testid='interactions-sort-name']",
        );
        const textFilter = textSortingBT.locator(`xpath=/ancestor::th`);
        const nameCells = page.locator(
            "xpath=//table[@data-testid='interactions-table']//tbody/tr/td[2]",
        );

        await expect.poll(() => nameCells.count()).toBeGreaterThan(0);
        await textSortingBT.click();
        const names = await nameCells.allTextContents();

        await expect(textFilter).toHaveAttribute("aria-sort", "descending");
        expect(names).toEqual(names.toSorted().toReversed());
    });

    test("Sort table by status ascending", async ({ page }) => {
        const statusSortingBT = page.locator(
            "xpath=//button[@data-testid='interactions-sort-status']",
        );
        const statusFilter = statusSortingBT.locator(`xpath=/ancestor::th`);
        const statusCells = page.locator(
            "xpath=//table[@data-testid='interactions-table']//tbody/tr/td[3]/span",
        );

        await expect.poll(() => statusCells.count()).toBeGreaterThan(0);
        await statusSortingBT.click();
        const statuses = await statusCells.allTextContents();

        await expect(statusFilter).toHaveAttribute("aria-sort", "ascending");
        expect(statuses).toEqual(statuses.toSorted());
    });

    test("Sort table by status descending", async ({ page }) => {
        const statusSortingBT = page.locator(
            "xpath=//button[@data-testid='interactions-sort-status']",
        );
        const statusFilter = statusSortingBT.locator(`xpath=/ancestor::th`);
        const statusCells = page.locator(
            "xpath=//table[@data-testid='interactions-table']//tbody/tr/td[3]/span",
        );

        await expect.poll(() => statusCells.count()).toBeGreaterThan(0);
        await statusSortingBT.dblclick();
        const statuses = await statusCells.allTextContents();

        await expect(statusFilter).toHaveAttribute("aria-sort", "descending");
        expect(statuses).toEqual(statuses.toSorted().toReversed());
    });

    test("Sort table by duration ascending", async ({ page }) => {
        const durationSortingBT = page.locator(
            "xpath=//button[@data-testid='interactions-sort-duration']",
        );
        const durationFilter = durationSortingBT.locator(`xpath=/ancestor::th`);
        const durationCells = page.locator(
            "xpath=//table[@data-testid='interactions-table']//tbody/tr/td[4]",
        );

        await expect.poll(() => durationCells.count()).toBeGreaterThan(0);
        await durationSortingBT.click();
        const durations = await durationCells.allTextContents();
        const pureDurations = durations.map((duration) =>
            Number(duration.split(" ")[0]),
        );

        await expect(durationFilter).toHaveAttribute("aria-sort", "ascending");
        expect(pureDurations).toEqual(pureDurations.toSorted((a, b) => a - b));
    });

    test("Sort table by duration descending", async ({ page }) => {
        const durationSortingBT = page.locator(
            "xpath=//button[@data-testid='interactions-sort-duration']",
        );
        const durationFilter = durationSortingBT.locator(`xpath=/ancestor::th`);
        const durationCells = page.locator(
            "xpath=//table[@data-testid='interactions-table']//tbody/tr/td[4]",
        );

        await expect.poll(() => durationCells.count()).toBeGreaterThan(0);
        await durationSortingBT.dblclick();
        const durations = await durationCells.allTextContents();
        const pureDurations = durations.map((duration) =>
            Number(duration.split(" ")[0]),
        );

        await expect(durationFilter).toHaveAttribute("aria-sort", "descending");
        expect(pureDurations).toEqual(pureDurations.toSorted((a, b) => b - a));
    });
});

test.describe("Rows selecting", () => {
    test("No rows are selected by default", async ({ page }) => {
        const checkbox = page.locator(
            "xpath=//input[contains(@data-testid,'interactions-row-select-')]",
        );
        const selectedCount = page.locator(
            "xpath=//span[@data-testid='interactions-selected-count']",
        );

        await expect.poll(() => checkbox.count()).toBeGreaterThan(0);
        const checkboxes = await checkbox.all();
        for (const checkbox of checkboxes) {
            await expect(checkbox).not.toBeChecked();
        }
        await expect(selectedCount).toHaveText("Вибрано: 0");
    });

    test("Select all rows", async ({ page }) => {
        const checkbox = page.locator(
            "xpath=//input[contains(@data-testid,'interactions-row-select-')]",
        );
        const selectedCount = page.locator(
            "xpath=//span[@data-testid='interactions-selected-count']",
        );

        await expect.poll(() => checkbox.count()).toBeGreaterThan(0);
        const checkboxes = await checkbox.all();
        for (const checkbox of checkboxes) {
            await checkbox.check();
            await expect(checkbox).toBeChecked();
        }
        await expect(selectedCount).toHaveText(`Вибрано: ${checkboxes.length}`);
    });

    test("Deselect all rows", async ({ page }) => {
        const checkbox = page.locator(
            "xpath=//input[contains(@data-testid,'interactions-row-select-')]",
        );
        const selectedCount = page.locator(
            "xpath=//span[@data-testid='interactions-selected-count']",
        );

        await expect.poll(() => checkbox.count()).toBeGreaterThan(0);
        const checkboxes = await checkbox.all();
        for (const checkbox of checkboxes) {
            await checkbox.check();
            await checkbox.uncheck();
            await expect(checkbox).not.toBeChecked();
        }
        await expect(selectedCount).toHaveText("Вибрано: 0");
    });
});
