"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.SavePlanGitHubController = void 0;
const core = __importStar(require("@actions/core"));
const infrastructure_1 = require("@lib/infrastructure");
class SavePlanGitHubController extends infrastructure_1.GitHubBaseController {
    constructor(useCase) {
        super();
        this.useCase = useCase;
        this.useCase = useCase;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const componentInput = core.getInput("component");
            const stackInput = core.getInput("stack");
            const planPathInput = core.getInput("planPath");
            const guardResult = infrastructure_1.Guard.againstNullOrUndefinedBulk([
                { argumentName: "component", argument: componentInput },
                { argumentName: "stack", argument: stackInput },
                { argumentName: "planPath", argument: planPathInput },
            ]);
            if (!guardResult.isSuccess) {
                return this.fail(guardResult.getErrorValue());
            }
            const request = {
                branch: this.branch,
                commit: this.sha,
                component: componentInput,
                name: this.repository,
                planPath: planPathInput,
                owner: this.owner,
                stack: stackInput,
            };
            try {
                const result = yield this.useCase.execute(request);
                if (result.isLeft()) {
                    const error = result.value;
                    console.log(error.getErrorValue());
                    return this.fail(error.getErrorValue().message || error.getErrorValue());
                }
                else {
                    return this.ok({});
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                return this.fail(error);
            }
        });
    }
}
exports.SavePlanGitHubController = SavePlanGitHubController;
