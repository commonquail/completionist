import ava, { AssertContext, Macro } from "ava";

function mkmacro(macro: Macro<AssertContext>): Macro<AssertContext> {
    macro.title = (provided, input, expected) => `${provided} ${input} = ${expected}`.trim();
    return macro;
}

export default mkmacro;
