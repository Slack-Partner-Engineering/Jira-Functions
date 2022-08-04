import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { create_issue } from "./create_issue.ts";

Deno.test("Epoch to human readable date test", () => {
  const mentions = create_issue("No one is here to help");
  assertEquals(mentions, []);
});

Deno.test("getMentions matches a mention", () => {
  const mentions = getMentions("<@ABC123> is here to help");
  assertEquals(mentions, ["<@ABC123>"]);
});

Deno.test("getMentions matches multiple mentions", () => {
  const mentions = getMentions("<@ABC123|frodo> <@XYZ123> are here to help");
  assertEquals(mentions, ["<@frodo>", "<@XYZ123>"]);
});
