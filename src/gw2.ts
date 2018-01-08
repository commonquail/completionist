export const enum Access {
    GuildWars2 = "GuildWars2",
    HeartOfThorns = "HeartOfThorns",
}

export interface DailyAchievement {
    readonly id: number;
    readonly level: {
        readonly min: number,
        readonly max: number;
    };
    readonly required_access: Access[];
}

export interface Daily {
    readonly pve: DailyAchievement[];
    readonly pvp: DailyAchievement[];
    readonly wvw: DailyAchievement[];
    readonly fractals: DailyAchievement[];
    readonly special: DailyAchievement[];
}

export const enum AchievementType {
    Default = "Default",
    ItemSet = "ItemSet",
}

export const enum BitType {
    Text = "Text",
    Item = "Item",
    Minipet = "Minipet",
    Skin = "Skin",
}

export interface Bit {
    readonly type: BitType;
    readonly id?: number;
    readonly text?: string;
}

export const enum RewardType {
    Coins = "Coins",
    Item = "Item",
    Mastery = "Mastery",
    Title = "Title",
}

export interface Reward {
    readonly type: RewardType;
    readonly id?: number;
    readonly count?: number;
    readonly region?: string;
}

export interface Achievement {
    readonly id: number;
    readonly icon?: string;
    readonly name: string;
    readonly description: string;
    readonly requirement: string;
    readonly locked_text: string;
    readonly type: AchievementType;
    readonly flags: string[];
    readonly tiers: any[];
    readonly prerequisites?: number[];
    readonly rewards?: Reward[];
    readonly bits?: Bit[];
    readonly point_cap?: number;

}

export function id(v: { readonly id: number }): number {
    return v.id;
}

export const enum Activity {
    CrabToss = "Crab Toss",
    KegBrawl = "Keg Brawl",
    SanctumSprint = "Sanctum Sprint",
    SouthsunSurvival = "Southsun Survival",
}

const activityCycle = [
    Activity.KegBrawl,
    Activity.CrabToss,
    Activity.SanctumSprint,
    Activity.SouthsunSurvival,
    Activity.CrabToss,
    Activity.SanctumSprint,
    Activity.SouthsunSurvival,
];

export function activityFor(date: Date): Activity {
    return activityCycle[date.getUTCDay()];
}
