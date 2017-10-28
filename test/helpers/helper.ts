import * as gw2 from "../../src/gw2";

export const enum ItemId {
    FractalMasterChest = 78572,
    FractalExpertChest = 78613,
    FractalInitiateResearchChest = 68126,
    FractalAdeptResearchChest = 77580,
    FractalExpertResearchChest = 79800,
}

export function achievementWithRewards(...r: gw2.Reward[]): gw2.Achievement {
    return {
        description: "bar",
        flags: [],
        id: 42,
        locked_text: "",
        name: "foo",
        requirement: "",
        rewards: r,
        tiers: [],
        type: gw2.AchievementType.Default,
    };
}

export function rewardId(item: ItemId): gw2.Reward {
    return {
        count: 1,
        id: item,
        type: gw2.RewardType.Item,
    };
}

export function achievementWithName(n: string) {
    return {
        description: "foo",
        flags: [],
        id: 42,
        locked_text: "",
        name: n,
        requirement: "",
        rewards: [],
        tiers: [],
        type: gw2.AchievementType.Default,
    };
}

export function someRecommendedFractal(n: string): gw2.Achievement {
    return {
        description: "bar",
        flags: [],
        id: 42,
        locked_text: "",
        name: n,
        requirement: "",
        rewards: [rewardId(ItemId.FractalAdeptResearchChest)],
        tiers: [],
        type: gw2.AchievementType.Default,
    };
}
