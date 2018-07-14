import test from "ava";
import { JSDOM } from "jsdom";
import * as lib from "../src/completionist";
import * as helper from "./helpers/helper";
import mkmacro from "./helpers/mkmacro";

const jsdom = new JSDOM(``, {});
function el(): HTMLElement {
    return jsdom.window.document.createElement("div");
}

test("findNearest() finds first matching parent node starting from self", (t) => {
    const root = el();
    const a = el();
    const b1 = el();
    const b2 = el();
    const d = el();

    root.id = "root";
    a.classList.add("a", "foo");
    b1.classList.add("foo");
    b2.classList.add("foo");

    root.appendChild(a);
    a.appendChild(b1);
    a.appendChild(b2);
    b1.appendChild(d);

    let target = lib.findNearest(d, "#root");
    t.is(target, root, "Accepts CSS selector");

    target = lib.findNearest(d, ".foo");
    t.is(target, b1, "Finds nearest parent");

    target = lib.findNearest(a, ".a");
    t.is(target, a, "Matches self");
});

test("sortOrderComparator() returns 0 for els without sort-order", (t) => {
    const a = el();
    const b = el();

    t.is(0, lib.sortOrderComparator(a, b));
});

test("sortOrderComparator() returns 0 for els with same sort-order", (t) => {
    const a = el();
    a.setAttribute("data-sort-order", "1");
    const b = el();
    b.setAttribute("data-sort-order", "1");

    t.is(0, lib.sortOrderComparator(a, b));
});

test("sortOrderComparator() sorts missing sort-order before non-negative sort-order", (t) => {
    const a = el();
    const b = el();
    b.setAttribute("data-sort-order", "1");

    t.is(-1, lib.sortOrderComparator(a, b));
});

test("sortOrderComparator() sorts lower sort-order before higher sort-order", (t) => {
    const a = el();
    a.setAttribute("data-sort-order", "2");
    const b = el();
    b.setAttribute("data-sort-order", "1");

    t.is(1, lib.sortOrderComparator(a, b));
});

test("sortOrderComparator() uses human sorting", (t) => {
    const a = el();
    a.setAttribute("data-sort-order", "10");
    const b = el();
    b.setAttribute("data-sort-order", "2");

    t.is(1, lib.sortOrderComparator(a, b));
});

test("icon() returns Daily PvE icon for falsy icon property", (t) => {
    t.regex(lib.icon({}), /42684.png/);
    t.regex(lib.icon({ icon: "" }), /42684.png/);
});

test("icon() returns icon property value for truthy icon property", (t) => {
    t.regex(lib.icon({ icon: "foo" }), /foo/);
});

test("cleanUpDailyNames() returns empty list on empty list input", (t) => {
    const clean = lib.cleanUpDailyNames([], "en");
    t.deepEqual(clean, []);
});

test("cleanUpDailyNames() leaves names of regular achievements alone", (t) => {
    const someRegularDaily = helper.achievementWithName("42");
    t.is(someRegularDaily.name, "42", "Precondition");

    const clean = lib.cleanUpDailyNames([someRegularDaily], "en");

    t.is(clean[0].name, someRegularDaily.name, "Regular achievement should be unchanged");
});

test("cleanUpDailyNames() fixes Recommended Fractal names", (t) => {
    const someRegularDaily = helper.achievementWithName("27");
    const someRecommendedFractal = helper.someRecommendedFractal("27");
    t.notRegex(someRecommendedFractal.name, /Snowblind/, "Precondition");

    const clean = lib.cleanUpDailyNames([
        someRecommendedFractal,
        someRegularDaily,
    ], "en");

    t.regex(clean[0].name, /Snowblind/, "Recommended Fractal name should be cleaned up");
    t.not(clean[1].name, clean[0].name, "Regular achievement should be left alone");
});

test("cleanUpDailyNames() fixes Daily Activity names", (t) => {
    const activityPattern = /Keg|Crab|Sprint|Survival/;
    const someDailyActivity = helper.achievementWithId(1939);
    t.notRegex(someDailyActivity.name, activityPattern, "Precondition");

    const clean = lib.cleanUpDailyNames([someDailyActivity], "en");

    t.regex(clean[0].name, activityPattern, "Daily Activity name should be cleaned up");
});

test("fullyLevelled() returns true for max level 80", (t) => {
    const pos = {
        id: 47,
        level: {
            max: 80,
            min: 42,
        },
        required_access: [],
    };

    const res = lib.fullyLevelled(pos);
    t.true(res);
});

test("fullyLevelled() returns false for max level other than 80", (t) => {
    const neg = {
        id: 47,
        level: {
            max: 79,
            min: 80,
        },
        required_access: [],
    };

    const res = lib.fullyLevelled(neg);
    t.false(res);
});

test("Achievement 1939 is Daily Activity Participation", (t) => {
    t.true(lib.isDailyActivityParticipation(helper.achievementWithId(1939)));
});

test("Other achievements are not Daily Activity Participation", (t) => {
    t.false(lib.isDailyActivityParticipation(helper.achievementWithId(1938)));
    t.false(lib.isDailyActivityParticipation(helper.achievementWithId(1940)));
});

const dailyActivity = mkmacro((t, input: string, expected: RegExp) => {
    const dayOfWeek = new Date(input);

    const activity = lib.fixDailyActivityName(
        helper.achievementWithId(1939),
        dayOfWeek,
        "en");

    t.regex(activity.name, expected);
});

test("Daily Activity, Sunday, is Keg Brawl",            dailyActivity, "2018-01-07", /Keg/);
test("Daily Activity, Monday, is Crab Toss",            dailyActivity, "2018-01-08", /Crab/);
test("Daily Activity, Tuesday, is Sanctum Sprint",      dailyActivity, "2018-01-09", /Sanctum/);
test("Daily Activity, Tuesday, is not Keg Brawl", (t) => {
    const someTuesday = new Date("2018-01-09");

    const activity = lib.fixDailyActivityName(
        helper.achievementWithId(1939),
        someTuesday,
        "en");

    t.notRegex(activity.name, /Keg/);
});
