import axios from "axios";
import { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import * as env from "./env";
import * as fractal from "./fractal";
import * as gw2 from "./gw2";

const baseUri = env.production ? "https://api.guildwars2.com/v2" : "http://localhost:3000/v2";

export function getAchievements(ids: ReadonlyArray<{ readonly id: number }>):
    AxiosPromise<ReadonlyArray<gw2.Achievement>> {
    return axios.get(baseUri + "/achievements", {
        params: {
            ids: ids.map(gw2.id).join(","),
            lang: "en",
        },
    });
}

export function getFunDailies(dailies: gw2.Daily): void {
    seedHtml(dailies);

    markFavorites();

    const achievements = dailies.pve.filter(fullyLevelled).concat(
        dailies.wvw,
        dailies.fractals);

    getAchievements(achievements)
        .then(axiosData)
        .then(cleanUpDailyNames)
        .then(populateDailies)
        .then(arrangeFractalDailies)
        .catch(error);
}

export function fullyLevelled(a: gw2.DailyAchievement) {
    return a.level.max === 80;
}

function arrangeFractalDailies() {
    const fractals = document.querySelector(".fractals")!;
    const oldParent = fractals.children[1];

    // HTMLCollection to Array.
    // Firefox 57: fastest.
    // Chrome 63: not fastest but still twice as fast as Firefox.
    // https://jsperf.com/nodelist-to-array/27
    const sortedFractals: Element[] = [];
    sortedFractals.push.apply(sortedFractals, oldParent.children);

    sortedFractals.sort(sortOrderComparator);

    // This would be an appropriate place to remove non-T4, non-recommended
    // fractal dailies, using .slice(-6). However, moving from displaying all
    // 15 to only 6 causes jank. We could hide the 9 superfluous containers
    // from the outset but then we have to account for that when sorting the
    // DOM elements. Instead, we use a CSS trick to always hide the first 9
    // fractal dailies.

    const newParent = document.createElement("div");
    for (const f of sortedFractals) {
        newParent.appendChild(f);
    }

    fractals.replaceChild(newParent, oldParent);
}

export function sortOrderComparator(a: Element, b: Element): number {
    const left = parseInt(a.getAttribute("data-sort-order") || "0", 10);
    const right = parseInt(b.getAttribute("data-sort-order") || "0", 10);

    return left < right ? -1 : left === right ? 0 : 1;
}

function axiosData<T>(response: AxiosResponse<T>): T {
    return response.data;
}

export function cleanUpDailyNames(
    data: ReadonlyArray<gw2.Achievement>,
): ReadonlyArray<gw2.Achievement> {
    const dailies = [... data];

    for (let index = 0; index < dailies.length; index++) {
        const a = dailies[index];
        if (fractal.isRecommended(a)) {
            dailies[index] = fractal.fixRecommendedName(a);
        } else if (fractal.isT4(a)) {
            dailies[index] = fractal.fixT4Name(a);
        } else if (isDailyActivityParticipation(a)) {
            const today = new Date();
            dailies[index] = fixDailyActivityName(a, today);
        }
    }

    return dailies;
}

export function isDailyActivityParticipation(
    a: Readonly<gw2.Achievement>,
): boolean {
    return a.id === 1939;
}

export function fixDailyActivityName(
    a: Readonly<gw2.Achievement>,
    date: Date,
): gw2.Achievement {
    return {
        bits: a.bits,
        description: a.description,
        flags: a.flags,
        icon: a.icon,
        id: a.id,
        locked_text: a.locked_text,
        name: `${a.name} (${gw2.activityFor(date)})`,
        point_cap: a.point_cap,
        prerequisites: a.prerequisites,
        requirement: a.requirement,
        rewards: a.rewards,
        tiers: a.tiers,
        type: a.type,
    };
}

export function icon(a: { readonly icon?: string }): string {
    return a.icon || "https://render.guildwars2.com/file/483E3939D1A7010BDEA2970FB27703CAAD5FBB0F/42684.png";
}

export function seedHtml(dailies: gw2.Daily): void {
    seedDailies(".pve", dailies.pve.filter(fullyLevelled));
    seedDailies(".wvw", dailies.wvw);
    seedDailies(".fractals", dailies.fractals);
}

export function seedDailies(
    selector: string,
    achievements: ReadonlyArray<gw2.DailyAchievement>,
): void {
    const e = document.querySelector(selector);
    const div = document.createElement("div");
    let html = "";
    for (const a of achievements) {
        html += `<div id="daily-${a.id}" data-aid="${a.id}" class="daily-achievement" title="${a.id}">
        <img src="${icon({ icon: undefined })}" alt="${a.id}"/>
        <span>Daily ${a.id}</span>
        </div>`;
    }
    div.innerHTML = html;
    e!.appendChild(div);
}

function populateDailies(dailies: ReadonlyArray<gw2.Achievement>): void {
    for (const a of dailies) {
        const e = document.getElementById(`daily-${a.id}`)!;
        const img = (e.children[0] as HTMLImageElement);
        const txt = (e.children[1] as HTMLSpanElement);
        img.src = icon(a);
        img.alt = a.name;

        if (fractal.isRecommended(a)) {
            e.classList.add("recommended");
            e.setAttribute("data-sort-order", "1");
        } else if (fractal.isT4(a)) {
            e.classList.add("t4");
            e.setAttribute("data-sort-order", "2");
        }

        txt.textContent = a.name;
        e.title = a.requirement;
    }
}

export function error(err: AxiosError) {
    if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        const e = document.querySelector(".header");
        const div = document.createElement("div");
        div.classList.add("error");
        div.textContent = err.response.data.text ||
            err.response.data.error;
        e!.appendChild(div);
    } else if (err.request) {
        console.log(err.request);
    } else {
        console.log("Error", err.message);
    }
    console.log(err.config);
}

export function markFavorites(): void {
    if (!db) {
        return;
    }

    const favoritesStore = db
        .transaction("favorites", "readonly")
        .objectStore("favorites");

    const request = favoritesStore.openCursor();
    request.onerror = (e) => {
        console.log(e);
    };

    const favoriteAchievements: number[] = [];
    request.onsuccess = (e) => {
        const cursor =
            (e.target as IdbCursorWithValue<{ id: number; }>).result;
        if (cursor) {
            favoriteAchievements.push(cursor.value.id);
            cursor.continue();
        } else {
            favoriteAchievements.forEach(markFavorite);
        }
    };
}

export function markFavorite(id: number): void {
    const el = document.getElementById(`daily-${id}`);
    if (el) {
        el.classList.add("favorite");
    }
}

export function findNearest(start: HTMLElement, selector: string): HTMLElement | null {
    let target: HTMLElement | null = start;
    while (target && !target.matches(selector)) {
        target = target.parentElement;
    }
    return target;
}

export function toggleFavorite(event: MouseEvent): void {
    if (!db) {
        return;
    }

    if (event.target instanceof HTMLElement) {
        const target = findNearest(event.target, "div.daily-achievement");

        if (!target) {
            return;
        }

        event.stopPropagation();

        const favoritesStore = db
            .transaction("favorites", "readwrite")
            .objectStore("favorites");

        const aid = parseInt(target.getAttribute("data-aid") as string, 10);

        const exists = favoritesStore.get(aid);
        exists.onsuccess = () => {
            if (exists.result) {
                const remove = favoritesStore.delete(aid);
                remove.onsuccess = () => target.classList.remove("favorite");
            } else {
                const insert = favoritesStore.put({ id: aid });
                insert.onsuccess = () => target.classList.add("favorite");
            }
        };
    }
}

let db: IDBDatabase | null;

export function main() {
    const request = window.indexedDB.open("completionist", 1);
    request.onerror = (err) => {
        console.log("Failure to initialize IndexedDB, achievement favorites will be unavailable.",
            err);
    };

    request.onsuccess = (event) => {
        db = db || (event.target as IdbEventTarget<IDBDatabase>).result;
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        db = (event.target as IdbEventTarget<IDBDatabase>).result;
        const store = db.createObjectStore("favorites", { keyPath: "id" });
        store.createIndex("aid", "id", { unique: true });
    };

    document.addEventListener("click", toggleFavorite);
    axios.get<gw2.Daily>(baseUri + "/achievements/daily")
        .then(axiosData)
        .then(getFunDailies)
        .catch(error);
}
