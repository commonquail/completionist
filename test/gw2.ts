import test from "ava";
import { id } from "../src/gw2";
import mkmacro from "./helpers/mkmacro";

const macro = mkmacro((t, input, expected) => {
     t.is(id({ id: input }), expected);
});

test("gw2.id of", macro, -1, -1);
test("gw2.id of", macro, 0, 0);
test("gw2.id of", macro, 1, 1);
test("gw2.id of", macro, 2, 2);
