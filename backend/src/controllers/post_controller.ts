import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import PostService from "../services/post_service";
import post_model from "../models/post_model";

class PostController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }

  async getAll(req: AuthResquest, res: Response) {
    const userIdObject = PostService.convertToIdObject(req.user._id);

    try {
      const posts = await Post.find();

      const output = await Promise.all(
        posts.map(async (post) => {
          const postOwner = await PostService.getOwnerObj(post);

          return {
            ...post.toObject(), // Convert Mongoose document to plain JavaScript object
            ownerUsername: postOwner.username,
            ownerFirstName: postOwner.firstname,
            ownerPhoneNumber: postOwner.phoneNumber,
            isLikedByUser: PostService.getIsLikedByUser(post, userIdObject),
            isPostOwner: PostService.getIsPostOwner(post, userIdObject),
            numOfLikes: PostService.getNumOfLikes(post),
            numOfComments: PostService.getNumOfComments(post),
          };
        })
      );

      res.send(output);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getAllByUser(req: AuthResquest, res: Response) {
    req.body.query = { ownerId: req.params.id };

    super.get(req, res);
  }

  async createPost(req: AuthResquest, res: Response) {
    const filename = (req.file as Express.Multer.File).filename;
    const description = req.body.description;
    const breed = req.body.breed;
    const breedId = req.body.breedId;

    if (!filename || filename === "")
      return res.status(400).send("Image is required");
    if (!description || description === "")
      return res.status(400).send("Description is required");
    if (!breed || breed === "")
      return res.status(400).send("Breed is required");
    if (!breedId) return res.status(400).send("Breed is required");

    try {
      await post_model.create({
        description: description,
        image: filename,
        breed: breed,
        breedId: Number.parseInt(breedId),
        ownerId: req.user._id,
        likes: [],
      });

      console.log("Post created successfully");
      res.status(201).send();
    } catch (err) {
      res.status(500).send("Fail: " + err.message);
    }
  }

  async like(req: AuthResquest, res: Response) {
    try {
      const userId = PostService.convertToIdObject(req.user._id);
      const postObj = await Post.findById(req.body._id);

      req.body = PostService.like(postObj, userId);

      super.putById(req, res);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async dislike(req: AuthResquest, res: Response) {
    try {
      const userId = PostService.convertToIdObject(req.user._id);
      const postObj = await Post.findById(req.body._id);

      req.body = PostService.dislike(postObj, userId);

      super.putById(req, res);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async deleteById(req: AuthResquest, res: Response) {
    try {
      const postObj = await this.model.findById(req.body._id);
      await this.model.deleteOne({ _id: postObj._id });
      PostService.deleteRelatedComments(postObj);

      res.status(201).send(postObj);
    } catch (err) {
      res.status(406).send("fail: " + err.message);
    }
  }
}

export default new PostController();
