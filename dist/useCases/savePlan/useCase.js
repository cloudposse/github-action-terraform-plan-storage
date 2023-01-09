"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveTerraformPlanUseCase = void 0;
const fs_1 = require("fs");
const infrastructure_1 = require("@lib/infrastructure");
const terraformPlan_1 = require("@modules/terraformPlan");
const system_1 = require("../../lib/system");
const errors_1 = require("./errors");
const readPlanFile = (pathToPlan) => __awaiter(void 0, void 0, void 0, function* () {
    const planFileExists = (0, fs_1.existsSync)(pathToPlan);
    if (!planFileExists) {
        return (0, infrastructure_1.left)(new errors_1.SaveTerraformPlanErrors.FileNotFoundError(pathToPlan));
    }
    const planContents = yield (0, system_1.readFile)(pathToPlan);
    if (!planContents) {
        return (0, infrastructure_1.left)(new errors_1.SaveTerraformPlanErrors.EmptyPlanError());
    }
    return planContents;
});
class SaveTerraformPlanUseCase {
    constructor(metaDataRepository, planRepository, codeRepository) {
        this.metaDataRepository = metaDataRepository;
        this.planRepository = planRepository;
        this.codeRepository = codeRepository;
    }
    execute(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    const branchOrError = terraformPlan_1.TerraformPlanBranch.create({ value: req.branch });
                    if (branchOrError.isFailure) {
                        return (0, infrastructure_1.left)(branchOrError);
                    }
                    const branch = branchOrError.getValue();
                    const commitOrError = terraformPlan_1.TerraformPlanCommit.create({ value: req.commit });
                    if (commitOrError.isFailure) {
                        return (0, infrastructure_1.left)(commitOrError);
                    }
                    const commit = commitOrError.getValue();
                    const componentOrError = terraformPlan_1.TerraformPlanComponent.create({
                        value: req.component,
                    });
                    if (componentOrError.isFailure) {
                        return (0, infrastructure_1.left)(componentOrError);
                    }
                    const component = componentOrError.getValue();
                    const stackOrError = terraformPlan_1.TerraformPlanStack.create({
                        value: req.stack,
                    });
                    if (stackOrError.isFailure) {
                        return (0, infrastructure_1.left)(stackOrError);
                    }
                    const stack = stackOrError.getValue();
                    const contents = yield readPlanFile(req.planPath);
                    if (typeof contents != "string") {
                        return contents;
                    }
                    const repositoryOrError = terraformPlan_1.TerraformPlanRepository.create({
                        owner: req.owner,
                        name: req.name,
                    });
                    const repository = repositoryOrError.getValue();
                    if (repositoryOrError.isFailure) {
                        return (0, infrastructure_1.left)(repositoryOrError);
                    }
                    const props = {
                        branch,
                        contents,
                        commit,
                        component,
                        stack,
                        repository,
                        tainted: false,
                    };
                    const terraformPlanOrError = terraformPlan_1.TerraformPlan.create(props);
                    if (terraformPlanOrError.isFailure) {
                        return (0, infrastructure_1.left)(terraformPlanOrError);
                    }
                    const terraformPlan = terraformPlanOrError.getValue();
                    this.metaDataRepository.save(terraformPlan);
                    this.planRepository.save(terraformPlan);
                }
                catch (err) {
                    return (0, infrastructure_1.left)(new infrastructure_1.AppError.UnexpectedError(err));
                }
                return (0, infrastructure_1.right)(infrastructure_1.Result.ok());
            }
            catch (err) {
                return (0, infrastructure_1.left)(new infrastructure_1.AppError.UnexpectedError(err));
            }
        });
    }
}
exports.SaveTerraformPlanUseCase = SaveTerraformPlanUseCase;
