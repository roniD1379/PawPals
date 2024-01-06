import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<ModelType>{

    model: Model<ModelType>
    constructor(model: Model<ModelType>) {
        this.model = model;
    }

    async get(req: Request, res: Response) {
        console.log("get all");
        try {
            if (req.query.name) {
                const obj = await this.model.find({ name: req.query.name });
                res.send(obj);
            } else {
                const obj = await this.model.find();
                res.send(obj);
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        console.log("get by id:" + req.params.id);
        try {
            const obj = await this.model.findById(req.params.id);
            res.send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async post(req: Request, res: Response) {
        console.log("post:" + req.body);
        try {
            const findUsername = await this.model.findOne({ 'username': req.body.username});
            console.log("adsdasdfcsfccfs  "+findUsername)
            if(findUsername!=null){
                throw "Username exists";
            }
            const obj = await this.model.create(req.body);
            res.status(201).send(obj);
        } catch (err) {
            console.log("got intoooooooooooooooooo")
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }

    putById(req: Request, res: Response) { //todo
        res.send("put by id: " + req.params.id);
    }

    deleteById(req: Request, res: Response) { //todo
        res.send("delete user by id: " + req.params.id);
    }
}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseController<ModelType>(model);
}

export default createController;