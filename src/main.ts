import * as core from "@actions/core";

import { storePlan, getPlan, taintPlan } from "./actions";

(async function () {
  const action = core.getInput("action");

  switch (action) {
    case "storePlan":
      await storePlan();
      break;
    case "getPlan":
      await getPlan();
      break;
    case "taintPlan":
      await taintPlan();
      break;
    default:
      core.setFailed(`Invalid action: ${action}`);
  }
})();
