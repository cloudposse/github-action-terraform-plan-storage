"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerraformPlan = void 0;
const crypto_1 = require("@lib/crypto");
const domain_1 = require("@lib/domain");
const infrastructure_1 = require("@lib/infrastructure");
class TerraformPlan extends domain_1.AggregateRoot {
    constructor(props, id) {
        super(props, id);
    }
    get component() {
        return this.props.component.value;
    }
    get stack() {
        return this.props.stack.value;
    }
    get owner() {
        return this.props.repository.owner;
    }
    get repository() {
        return this.props.repository.name;
    }
    get branch() {
        return this.props.branch.value;
    }
    get commit() {
        return this.props.commit.value;
    }
    get tainted() {
        return this.props.tainted;
    }
    get contents() {
        return this.props.contents;
    }
    get hash() {
        return this.props.hash;
    }
    static create(props, id) {
        const guardArgs = [
            { argument: props.contents, argumentName: "contents" },
        ];
        const guardResult = infrastructure_1.Guard.againstNullOrUndefinedBulk(guardArgs);
        if (guardResult.isFailure) {
            return infrastructure_1.Result.fail(guardResult.getErrorValue());
        }
        const defaultValues = Object.assign(Object.assign({}, props), { hash: (0, crypto_1.calculateHash)(props.contents), dateTimeCreated: props.dateTimeCreated
                ? props.dateTimeCreated
                : new Date(), tainted: props.tainted ? props.tainted : false });
        const terraformPlan = new TerraformPlan(defaultValues, id);
        return infrastructure_1.Result.ok(terraformPlan);
    }
}
exports.TerraformPlan = TerraformPlan;
