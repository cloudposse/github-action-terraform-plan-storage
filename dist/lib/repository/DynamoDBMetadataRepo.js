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
exports.DynamoDBMetadataRepo = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoDBMetadataRepo {
    constructor(dynamo, tableName) {
        this.dynamo = dynamo;
        this.tableName = tableName;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load(commit, component) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    commit: { S: commit },
                    component: { S: component },
                },
            };
            const command = new client_dynamodb_1.GetItemCommand(params);
            const response = yield this.dynamo.send(command);
            if (response.Item) {
                return {
                    id: response.Item.id.S,
                    branch: response.Item.branch.S,
                    commit: response.Item.commit.S,
                    component: response.Item.component.S,
                    hash: response.Item.hash.S,
                    owner: response.Item.owner.S,
                    repository: response.Item.repository.S,
                    stack: response.Item.stack.S,
                    tainted: response.Item.tainted.BOOL,
                };
            }
            return null;
        });
    }
    save(metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    id: { S: metadata.id.toString() },
                    branch: { S: metadata.branch },
                    commit: { S: metadata.commit },
                    component: { S: metadata.component },
                    hash: { S: metadata.hash || "" },
                    owner: { S: metadata.owner },
                    repository: { S: metadata.repository },
                    stack: { S: metadata.stack },
                    tainted: { BOOL: metadata.tainted },
                },
            };
            const command = new client_dynamodb_1.PutItemCommand(params);
            yield this.dynamo.send(command);
        });
    }
}
exports.DynamoDBMetadataRepo = DynamoDBMetadataRepo;
