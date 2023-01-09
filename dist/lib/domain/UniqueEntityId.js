"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueEntityId = void 0;
const uuid_1 = require("uuid");
const Identifier_1 = require("./Identifier");
class UniqueEntityId extends Identifier_1.Identifier {
    constructor(id) {
        super(id ? id : (0, uuid_1.v4)());
    }
}
exports.UniqueEntityId = UniqueEntityId;
