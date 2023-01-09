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
exports.retrieveFromS3 = exports.storeInS3 = exports.buildKey = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Client_1 = require("./s3Client");
const buildKey = (repository, branch, commit, hash) => [repository, branch, commit, hash].join("/");
exports.buildKey = buildKey;
const storeInS3 = (bucketName, key, body) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: body,
    };
    const command = new client_s3_1.PutObjectCommand(params);
    yield s3Client_1.s3Client.send(command);
});
exports.storeInS3 = storeInS3;
const retrieveFromS3 = (bucketName, key, body) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: body,
    };
    const command = new client_s3_1.GetObjectCommand(params);
    const result = yield s3Client_1.s3Client.send(command);
    const contents = yield ((_a = result === null || result === void 0 ? void 0 : result.Body) === null || _a === void 0 ? void 0 : _a.transformToString());
    return contents;
});
exports.retrieveFromS3 = retrieveFromS3;
