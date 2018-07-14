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

export class Activity {
    public static readonly CrabToss: Activity = {
        de: "Krebs-Wurfspiel",
        en: "Crab Toss",
        es: "Lanzamiento de cangrejos",
        fr: "Lancer de crabe",
        zh: null,
    };

    public static readonly KegBrawl: Activity = {
        de: "Fasskeilerei",
        en: "Keg Brawl",
        es: "Pelea de barricas",
        fr: "Bagarre de barils",
        zh: null,
    };

    public static readonly SanctumSprint: Activity = {
        de: "Refugiums-Sprint",
        en: "Sanctum Sprint",
        es: "Sprint del Sagrario",
        fr: "Course du Sanctuaire",
        zh: null,
    };

    public static readonly SouthsunSurvival: Activity = {
        de: "Südlicht-Überlebenskampf",
        en: "Southsun Survival",
        es: "Supervivencia en el Sol Austral",
        fr: "Survie à Sud-Soleil",
        zh: null,
    };

    public readonly de: string = "";
    public readonly en: string = "";
    public readonly es: string = "";
    public readonly fr: string = "";
    public readonly zh: null = null;

    private constructor() {}
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

export function activityFor(date: Date, lang: Lang): string | null {
    return activityCycle[date.getUTCDay()][lang];
}

export type Lang = "de" | "en" | "es" | "fr" | "zh";

export function langOf(s: string | null): Lang | null {
    if (s === "en" || s === "de" || s === "fr" || s === "es" || s === "zh") {
        return s;
    }
    return null;
}
