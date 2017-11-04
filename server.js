const jsonServer = require("json-server");
const fs = require("fs");
const server = jsonServer.create();
const middlewares = jsonServer.defaults({ readOnly: true });

server.use(middlewares);

const achievements = {};
const achievementIds = [];

fs.readFile("samples/achievements.json", "utf-8", function (err, data) {
    if (err) throw err;

    const sampleAchievements = JSON.parse(data);
    for (a of sampleAchievements) {
        achievements[a.id] = a;
    }
    achievementIds.push(...Object.keys(achievements).map(id => parseInt(id, 10)));
});

server.get("/v2/achievements", (req, res) => {
    const ids = req.query.ids;
    if (ids === undefined) {
        res.json(achievementIds);
    } else if (ids === "") {
        res.status(400).json({ text: "missing ids value" });
    } else {
        let status = 200;
        let data = [];
        const warnings = [];

        for (id of ids.split(",")) {
            if (achievements[id]) {
                data.push(achievements[id]);
            } else {
                warnings.push(`299 ${req.hostname} "Unknown id ${id}" "${new Date().toUTCString()}"`);
            }
        }

        if (data.length === 0) {
            status = 404;
            data = { text: "all ids provided are invalid" };
        } else if (warnings.length) {
            // Only set Warning on partial response.
            status = 206;
            res.set("Warning", warnings.join(","));
        }

        res.status(status).json(data);
    }
});

server.get("/v2/achievements/daily", (req, res) => {
    serveFile(res, "samples/daily.json");
});

server.listen(3000, () => console.log("http://localhost:3000"));

function serveFile(res, path) {
    res.json(JSON.parse(fs.readFileSync(path, "utf-8")));
}
