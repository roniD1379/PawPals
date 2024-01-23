import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import PostService from "../services/post_service";
import post_model from "../models/post_model";
import post_service from "../services/post_service";

const FEED_PAGE_SIZE = 5;
const PROFILE_FEED_PAGE_SIZE = 12;

class PostController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }

  async get(req: AuthResquest, res: Response) {
    const userIdObject = PostService.convertToIdObject(req.user._id);
    let posts = null;

    try {
      if (req.body.query) {
        posts = await Post.find(req.body.query).exec();
      } else {
        posts = await Post.find();
      }

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

  async getFeedPosts(req: AuthResquest, res: Response) {
    try {
      const userIdObject = PostService.convertToIdObject(req.user._id);
      let posts = [];

      const page = req.params.page ? parseInt(req.params.page) : 1;
      const skip = page === 0 ? 0 : (page - 1) * FEED_PAGE_SIZE;

      posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(FEED_PAGE_SIZE);

      const formattedPosts = await post_service.formatPosts(
        posts,
        userIdObject
      );
      res.status(200).send(formattedPosts);
    } catch (err) {
      console.log("Failed to get feed posts: " + err.message);
      res.status(500).json({ message: err.message });
    }
  }

  async getUserPosts(req: AuthResquest, res: Response) {
    try {
      const userIdObject = PostService.convertToIdObject(req.user._id);
      let posts = [];
      const page = req.params.page ? parseInt(req.params.page) : 1;
      const skip = page === 0 ? 0 : (page - 1) * PROFILE_FEED_PAGE_SIZE;

      posts = await Post.find({ ownerId: userIdObject })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(PROFILE_FEED_PAGE_SIZE);

      const formattedPosts = await post_service.formatPosts(
        posts,
        userIdObject
      );
      res.status(200).send(formattedPosts);
    } catch (err) {
      console.log("Failed to get user posts: " + err.message);
      res.status(500).json({ message: err.message });
    }
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
      const postObj = await Post.findById(req.body.postId);
      if (!postObj) return res.status(400).send("Post not found");

      await PostService.like(postObj, userId);
      res.status(200).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async dislike(req: AuthResquest, res: Response) {
    try {
      const userId = PostService.convertToIdObject(req.user._id);
      const postObj = await Post.findById(req.body.postId);
      if (!postObj) return res.status(400).send("Post not found");

      await PostService.dislike(postObj, userId);
      res.status(200).send();
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
      res.status(500).json({ message: err.message });
    }
  }
}

export default new PostController();
