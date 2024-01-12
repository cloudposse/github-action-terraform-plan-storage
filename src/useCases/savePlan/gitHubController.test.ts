// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: "./.env.test" });
import fs from "fs";

import * as core from "@actions/core";
import * as github from "@actions/github";

import mockContext from "../../__fixtures__/github_context.json";
import {
  ICodeRepository,
  IMetadataRepository,
  IPlanRepository
} from "../../lib/repository";

import { SavePlanGitHubController } from "./gitHubController";
import { SaveTerraformPlanUseCase } from "./useCase";

jest.mock("@actions/core");
jest.mock("@actions/github");

const getMockRepositories = () => {
  const metaDataRepositoryMock: IMetadataRepository = {
    save: jest.fn().mockResolvedValue(Promise.resolve()),
    loadByCommit: jest.fn(),
    loadLatestForPR: jest.fn()
  };

  const planRepositoryMock: IPlanRepository = {
    save: jest.fn(),
    load: jest.fn()
  };

  const codeRepositoryMock: ICodeRepository = {
    save: jest.fn(),
    load: jest.fn()
  };

  return { metaDataRepositoryMock, planRepositoryMock, codeRepositoryMock };
};

const setupMocks = () => {
  jest.spyOn(core, "getInput").mockImplementation((name: string) => {
    switch (name) {
      case "component":
        return "component";
      case "stack":
        return "stack";
      case "planPath":
        return "./terraform.plan";
      default:
        return "";
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jest.replaceProperty(github, "context", { ...mockContext } as any);

  jest.mock("fs");
  jest.spyOn(fs, "existsSync").mockReturnValue(true);
  jest
    .spyOn(fs, "readFileSync")
    .mockReturnValueOnce(Buffer.from("This is the plan"));

  jest.spyOn(core, "setFailed");
};
describe("SavePlanGitHubController", () => {
  let processEnv: NodeJS.ProcessEnv;
  let metaDataRepoMock: IMetadataRepository;
  let planRepoMock: IPlanRepository;
  let codeRepoMock: ICodeRepository;
  let controller: SavePlanGitHubController;

  beforeEach(() => {
    processEnv = process.env;
    process.env.GITHUB_REPOSITORY = "owner/repo";

    const { metaDataRepositoryMock, planRepositoryMock, codeRepositoryMock } =
      getMockRepositories();
    metaDataRepoMock = metaDataRepositoryMock;
    planRepoMock = planRepositoryMock;
    codeRepoMock = codeRepositoryMock;
    setupMocks();
    const useCase = new SaveTerraformPlanUseCase(
      metaDataRepoMock,
      planRepoMock,
      codeRepoMock
    );
    controller = new SavePlanGitHubController(useCase);
  });

  afterEach(() => {
    process.env = processEnv;
    jest.clearAllMocks();
  });

  it("should read the component input", async () => {
    await controller.execute();
    expect(core.getInput).toBeCalledWith("component");
  });

  it("should read the stack input", async () => {
    await controller.execute();
    expect(core.getInput).toBeCalledWith("stack");
  });

  it("should read the planPath input", async () => {
    await controller.execute();
    expect(core.getInput).toBeCalledWith("planPath");
  });

  it("should save the metadata", async () => {
    await controller.execute();
    expect(metaDataRepoMock.save).toBeCalled();
  });

  it("should save the plan", async () => {
    await controller.execute();
    expect(planRepoMock.save).toBeCalled();
  });

  it("should not call setFailed", async () => {
    await controller.execute();
    expect(core.setFailed).not.toBeCalled();
  });
});
