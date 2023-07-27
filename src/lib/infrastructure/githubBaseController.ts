import * as core from "@actions/core";
import * as github from "@actions/github";

import { IController } from "./controller";

export abstract class GitHubBaseController implements IController {
  public readonly action: string;
  public readonly actor: string;
  public readonly branch: string;
  public readonly isMergeEvent: boolean;
  public readonly pr: number;
  public readonly repoOwner: string;
  public readonly ref: string;
  public readonly repoName: string;
  public readonly sha: string;

  constructor() {
    this.action = github.context.action;
    this.actor = github.context.actor;
    this.branch = github.context.payload.pull_request?.head.ref || "main";
    this.isMergeEvent =
      github.context.eventName === "pull_request" &&
      github.context.payload.pull_request?.merged;
    this.pr = github.context.payload.pull_request?.number || 0;
    this.repoOwner = github.context.repo.owner;
    this.ref = github.context.ref;
    this.repoName = github.context.repo.repo;
    this.sha = github.context.payload.pull_request?.head.sha || github.context.sha;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  public async execute(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  public ok(outputs: { [name: string]: string }) {
    const keys = Object.keys(outputs);
    keys.forEach((key) => {
      core.setOutput(key, outputs[key]);
    });
  }

  public fail(error: Error | string) {
    core.setFailed(error);
  }
}
