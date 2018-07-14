import test from "ava";
import * as fractal from "../src/fractal";
import * as gw2 from "../src/gw2";
import * as helper from "./helpers/helper";

test("Achievement with reward Fractal Master's Chest is T4", (t) => {
    t.true(fractal.isT4(helper.achievementWithRewards(
        helper.rewardId(helper.ItemId.FractalMasterChest))));
});

test("Achievement with reward Fractal Expert's Chest is not T4", (t) => {
    t.false(fractal.isT4(helper.achievementWithRewards(
        helper.rewardId(helper.ItemId.FractalExpertChest))));
});

test("Achievement with rewards Fractal Master's Chest and others is not T4", (t) => {
    t.false(fractal.isT4(helper.achievementWithRewards(
        helper.rewardId(helper.ItemId.FractalMasterChest),
        helper.rewardId(helper.ItemId.FractalExpertChest))));
});

test("Achievement with no rewards is not T4", (t) => {
    t.false(fractal.isT4(helper.achievementWithRewards()));
});

test("Achievement with reward Fractal Initiate's Research Chest is Recommended", (t) => {
    t.true(fractal.isRecommended(helper.achievementWithRewards(
        helper.rewardId(helper.ItemId.FractalInitiateResearchChest))));
});

test("Achievement with reward Fractal Adept's Research Chest is Recommended", (t) => {
    t.true(fractal.isRecommended(helper.achievementWithRewards(
        helper.rewardId(helper.ItemId.FractalAdeptResearchChest))));
});

test("Achievement with reward Fractal Expert's Research Chest is Recommended", (t) => {
    t.true(fractal.isRecommended(helper.achievementWithRewards(
        helper.rewardId(helper.ItemId.FractalExpertResearchChest))));
});

test("Achievement with other rewards is not Recommended", (t) => {
    t.false(fractal.isRecommended(helper.achievementWithRewards(
        helper.rewardId(helper.ItemId.FractalMasterChest))));
});

test("Achievement with rewards Fractal Research Chest and others is not Recommended", (t) => {
    t.false(fractal.isRecommended(helper.achievementWithRewards(
        helper.rewardId(helper.ItemId.FractalAdeptResearchChest),
        helper.rewardId(helper.ItemId.FractalMasterChest))));
});

test("Achievement with no rewards is not Recommended", (t) => {
    t.false(fractal.isRecommended(helper.achievementWithRewards()));
});

test("Fix Daily Recommended Fractal by appending fractal name", (t) => {
    const someRecommendedDailyFractal = helper.achievementWithName("41");
    const fixed = fractal.fixRecommendedName(someRecommendedDailyFractal, "en");

    t.is(fixed.name, "41 (Twilight Oasis)");
});

test("Name of Recommended Fractal is inferred from first set of consecutive integers", (t) => {
    const someRecommendedDailyFractal = helper.achievementWithName("foo 42 67 baz");
    const fixed = fractal.fixRecommendedName(someRecommendedDailyFractal, "en");

    t.regex(fixed.name, /Captain Mai Trin Boss/);
    t.notRegex(fixed.name, /Swampland/);
});

test("Name of Recommended Fractal respects language", (t) => {
    const someRecommendedDailyFractal = helper.achievementWithName("41");
    const fixed = fractal.fixRecommendedName(someRecommendedDailyFractal, "de");

    t.is(fixed.name, "41 (Zwielichtoase)");
});
