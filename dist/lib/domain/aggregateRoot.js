"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateRoot = void 0;
const Entity_1 = require("./Entity");
class AggregateRoot extends Entity_1.Entity {
    get id() {
        return this._id;
    }
}
exports.AggregateRoot = AggregateRoot;
