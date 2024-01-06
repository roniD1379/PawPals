"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
//import https from 'https';
const http_1 = __importDefault(require("http"));
//import fs from 'fs';
(0, app_1.default)().then((app) => {
    if (process.env.NODE_ENV !== 'production') {
        http_1.default.createServer(app).listen(process.env.PORT);
    }
    // const options = {
    //   key: fs.readFileSync('../client-key.pem'),
    //   cert: fs.readFileSync('../client-cert.pem')
    // };
    // https.createServer(options, app).listen(process.env.HTTPS_PORT);
});
//# sourceMappingURL=server.js.map