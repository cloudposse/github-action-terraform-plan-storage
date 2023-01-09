"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerraformPlanRepository = void 0;
const domain_1 = require("@lib/domain");
const infrastructure_1 = require("@lib/infrastructure");
class TerraformPlanRepository extends domain_1.ValueObject {
    constructor(props) {
        super(props);
    }
    get owner() {
        return this.props.owner;
    }
    get name() {
        return this.props.name;
    }
    static create(props) {
        const ownerNullGuardResult = infrastructure_1.Guard.againstNullOrUndefined(props.owner, "owner");
        if (ownerNullGuardResult.isFailure) {
            return infrastructure_1.Result.fail(ownerNullGuardResult.getErrorValue());
        }
        const nameNullGuardResult = infrastructure_1.Guard.againstNullOrUndefined(props.name, "name");
        if (nameNullGuardResult.isFailure) {
            return infrastructure_1.Result.fail(nameNullGuardResult.getErrorValue());
        }
        const ownerMinGuardResult = infrastructure_1.Guard.againstMinLength(this.minLength, props.owner, "owner");
        if (ownerMinGuardResult.isFailure) {
            return infrastructure_1.Result.fail(ownerMinGuardResult.getErrorValue());
        }
        const nameMinGuardResult = infrastructure_1.Guard.againstMinLength(this.minLength, props.name, "name");
        if (nameMinGuardResult.isFailure) {
            return infrastructure_1.Result.fail(nameMinGuardResult.getErrorValue());
        }
        const ownerMaxGuardResult = infrastructure_1.Guard.againstMaxLength(this.maxLength, props.owner, "owner");
        if (ownerMaxGuardResult.isFailure) {
            return infrastructure_1.Result.fail(ownerMaxGuardResult.getErrorValue());
        }
        const nameMaxGuardResult = infrastructure_1.Guard.againstMaxLength(this.maxLength, props.name, "name");
        if (nameMaxGuardResult.isFailure) {
            return infrastructure_1.Result.fail(nameMaxGuardResult.getErrorValue());
        }
        return infrastructure_1.Result.ok(new TerraformPlanRepository(props));
    }
}
exports.TerraformPlanRepository = TerraformPlanRepository;
TerraformPlanRepository.minLength = 2;
TerraformPlanRepository.maxLength = 100;
