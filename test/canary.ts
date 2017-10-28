import test from "ava";

test("canary sync", (t) => {
    t.pass();
});

test("canary async", async (t) => {
    const foo = Promise.resolve("foo");
    t.is(await foo, "foo");
});
