import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest} from "../common/auth_middleware";
import PostService from "../services/post_service";

class PostController extends BaseController<IPost>{
    constructor() {
        super(Post)
    }

    async get(req: AuthResquest, res: Response) {
        const userIdObject = PostService.convertToIdObject(req.user._id)
        let posts = null;

        try {

            if (req.body.query) {
                posts = await Post.find((req.body.query)).exec();
            }
            else {
                posts = await Post.find();
            }

            const output = await Promise.all(posts.map(async post => 
                {
                    const postOwner = await PostService.getOwnerObj(post);

                    return {
                        ...post.toObject(), // Convert Mongoose document to plain JavaScript object
                        ownerUsername: postOwner.username,
                        ownerFirstName: postOwner.firstname,
                        ownerPhoneNumber: postOwner.phoneNumber,
                        isLikedByUser: PostService.getIsLikedByUser(post,userIdObject),
                        isPostOwner: PostService.getIsPostOwner(post, userIdObject),
                        numOfLikes: PostService.getNumOfLikes(post),
                        numOfComments: PostService.getNumOfComments(post)
                    }
                }));

            res.send(output);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getTenLatestPosts(req: AuthResquest, res: Response) {
        
        req.body.query = {},{},{ sort: { 'created_at' : -1 }, limit: 10};
        //req.body.query = {ownerId: req.params.id};

        this.get(req, res);
    }

    async getAllByUser(req: AuthResquest, res: Response) {
        req.body.query = {ownerId: req.params.id};

        this.get(req, res);
    }

    async post(req: AuthResquest, res: Response) {
        req.body.likes = [];
        req.body.ownerId = req.user._id;
        
        super.post(req, res);
    }

    async like(req: AuthResquest, res: Response) {
        
        try {
            const userId = PostService.convertToIdObject(req.user._id);
            const postObj = await Post.findById(req.body._id);
            
            req.body = PostService.like(postObj,userId);
            
            super.putById(req, res);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async dislike(req: AuthResquest, res: Response) {

        try {
            const userId = PostService.convertToIdObject(req.user._id);
            const postObj = await Post.findById(req.body._id);
            
            req.body = PostService.dislike(postObj,userId);
            
            super.putById(req, res);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async deleteById(req: AuthResquest, res: Response) { 

        try {
            const postObj = await this.model.findById(req.body._id);
            await this.model.deleteOne({_id: postObj._id});

            PostService.deleteRelatedComments(postObj);

            res.status(201).send(postObj);
            
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new PostController();
