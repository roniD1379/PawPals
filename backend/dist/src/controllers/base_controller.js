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
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
        this.model = model;
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get all");
            try {
                if (req.query.name) {
                    const obj = yield this.model.find({ name: req.query.name });
                    res.send(obj);
                }
                else {
                    const obj = yield this.model.find();
                    res.send(obj);
                }
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get by id:" + req.params.id);
            try {
                const obj = yield this.model.findById(req.params.id);
                res.send(obj);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("post:" + req.body);
            try {
                const findUsername = yield this.model.findOne({ 'username': req.body.username });
                console.log("adsdasdfcsfccfs  " + findUsername);
                if (findUsername != null) {
                    throw "Username exists";
                }
                const obj = yield this.model.create(req.body);
                res.status(201).send(obj);
            }
            catch (err) {
                console.log("got intoooooooooooooooooo");
                console.log(err);
                res.status(406).send("fail: " + err.message);
            }
        });
    }
    putById(req, res) {
        res.send("put by id: " + req.params.id);
    }
    deleteById(req, res) {
        res.send("delete user by id: " + req.params.id);
    }
}
exports.BaseController = BaseController;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map