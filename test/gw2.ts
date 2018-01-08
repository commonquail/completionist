import test from "ava";
import { Activity, activityFor, id } from "../src/gw2";
import mkmacro from "./helpers/mkmacro";

const macro = mkmacro((t, input, expected) => {
     t.is(id({ id: input }), expected);
});

test("gw2.id of", macro, -1, -1);
test("gw2.id of", macro, 0, 0);
test("gw2.id of", macro, 1, 1);
test("gw2.id of", macro, 2, 2);

const dailyActivity = mkmacro((t, dayOfWeek: string, expected: Activity) => {
    const activity = activityFor(new Date(dayOfWeek));

    t.is(activity, expected);
});

test("gw2.activityFor Sunday is Keg Brawl",             dailyActivity, "2018-01-07", Activity.KegBrawl);
test("gw2.activityFor Monday is Crab Toss",             dailyActivity, "2018-01-08", Activity.CrabToss);
test("gw2.activityFor Tuesday is Sanctum Sprint",       dailyActivity, "2018-01-09", Activity.SanctumSprint);
test("gw2.activityFor Wednesday is Southsun Survival",  dailyActivity, "2018-01-10", Activity.SouthsunSurvival);
test("gw2.activityFor Thursday is Crab Toss",           dailyActivity, "2018-01-11", Activity.CrabToss);
test("gw2.activityFor Friday is Sanctum Sprint",        dailyActivity, "2018-01-12", Activity.SanctumSprint);
test("gw2.activityFor Saturday is Southsun Survival",   dailyActivity, "2018-01-13", Activity.SouthsunSurvival);
test("gw2.activityFor loops around",                    dailyActivity, "2018-01-14", Activity.KegBrawl);
