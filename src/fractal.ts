import nameOfScale from "./fractalnames";
import { Achievement } from "./gw2";

// Probably not less robust than scanning localisable texts
// or maintaining achievement IDs.
const enum FractalChest {
    Master = 78572,
    InitiateResearch = 68126,
    AdeptResearch = 77580,
    ExpertResearch = 79800,
}

export function isT4(achievement: Achievement): boolean {
    if (achievement.rewards && achievement.rewards.length) {
        return achievement.rewards.every((r) => r.id === FractalChest.Master);
    }
    return false;
}

export function isRecommended(achievement: Achievement): boolean {
    if (achievement.rewards && achievement.rewards.length) {
        return achievement.rewards.every((r) => {
            return r.id === FractalChest.InitiateResearch ||
                r.id === FractalChest.AdeptResearch ||
                r.id === FractalChest.ExpertResearch;
        });
    }
    return false;
}

export function fixRecommendedName(achievement: Achievement): Achievement {
    const scale = extractScale(achievement);
    return {
        bits: achievement.bits,
        description: achievement.description,
        flags: achievement.flags,
        icon: achievement.icon,
        id: achievement.id,
        locked_text: achievement.locked_text,
        name: `${achievement.name} (${nameOfScale[scale]})`,
        point_cap: achievement.point_cap,
        prerequisites: achievement.prerequisites,
        requirement: achievement.requirement,
        rewards: achievement.rewards,
        tiers: achievement.tiers,
        type: achievement.type,
    };
}

function extractScale(fractal: Achievement): number {
    const matches = /\d+/.exec(fractal.name);
    if (matches) {
        return parseInt(matches[0], 10);
    }
    throw new Error(`No Fractal scale in name: ${fractal.name}`);
}
