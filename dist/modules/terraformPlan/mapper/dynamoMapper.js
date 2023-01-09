"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerraformPlanDynamoDBMapper = void 0;
const lib_1 = require("../../../lib");
const mapper_1 = require("../../../lib/repository/mapper");
const domain_1 = require("../domain");
const TerraformPlan_1 = require("../domain/TerraformPlan");
const TerraformPlanBranch_1 = require("../domain/TerraformPlanBranch");
const TerraformPlanRepository_1 = require("../domain/TerraformPlanRepository");
const TerraformPlanStack_1 = require("../domain/TerraformPlanStack");
class TerraformPlanDynamoDBMapper extends mapper_1.Mapper {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toDomain(raw) {
        const planOrError = TerraformPlan_1.TerraformPlan.create({
            branch: TerraformPlanBranch_1.TerraformPlanBranch.create({ value: raw.branch }).getValue(),
            commit: raw.commit,
            component: domain_1.TerraformPlanComponent.create({
                value: raw.component,
            }).getValue(),
            stack: TerraformPlanStack_1.TerraformPlanStack.create({
                value: raw.stack,
            }).getValue(),
            repository: TerraformPlanRepository_1.TerraformPlanRepository.create({
                owner: raw.owner,
                name: raw.repository,
            }).getValue(),
            tainted: raw.tainted,
            contents: "",
        }, new lib_1.UniqueEntityId(raw.id));
        if (planOrError.isFailure) {
            throw new Error("Error converting DynamoDB item to domain");
        }
        return planOrError.getValue();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toPersistence(domain) {
        const item = {
            id: { S: domain.id.toString() },
            branch: { S: domain.branch },
            commit: { S: domain.commit },
            component: { S: domain.component },
            hash: { S: domain.hash || "" },
            owner: { S: domain.owner },
            repository: { S: domain.repository },
            stack: { S: domain.stack },
            tainted: { BOOL: domain.tainted },
        };
        return item;
    }
}
exports.TerraformPlanDynamoDBMapper = TerraformPlanDynamoDBMapper;
