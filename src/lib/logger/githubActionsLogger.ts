import * as core from "@actions/core";

import { ILogger } from "./ilogger";
export class GitHubActionsLogger implements ILogger {
  debug(message: string): void {
    core.debug(message);
  }
  info(message: string): void {
    core.info(message);
  }
  error(message: string | Error): void {
    core.error(message);
  }
}
