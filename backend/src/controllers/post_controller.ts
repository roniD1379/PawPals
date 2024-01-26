import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import PostService from "../services/post_service";
import post_model from "../models/post_model";
import post_service from "../services/post_service";

const FEED_PAGE_SIZE = 5;
const PROFILE_FEED_PAGE_SIZE = 12;

class PostController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }

  async getFeedPosts(req: AuthRequest, res: Response) {
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

  async getUserPosts(req: AuthRequest, res: Response) {
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

  async createPost(req: AuthRequest, res: Response) {
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
      const post = await post_model.create({
        description: description,
        image: filename,
        breed: breed,
        breedId: Number.parseInt(breedId),
        ownerId: req.user._id,
        likes: [],
      });

      console.log("Post created successfully");
      res.status(201).send(post);
    } catch (err) {
      res.status(500).send("Fail: " + err.message);
    }
  }

  async like(req: AuthRequest, res: Response) {
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

  async dislike(req: AuthRequest, res: Response) {
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

  async deletePostById(req: AuthRequest, res: Response) {
    const postId = req.params.id;

    if (!postId || postId === "")
      return res.status(400).send("Post ID is required");

    try {
      const postObj = await Post.findById(postId);
      if (!postObj) return res.status(400).send("Post not found");
      if (postObj.ownerId.toString() !== req.user._id)
        return res.status(401).send("Unauthorized"); // You can not delete a post that is not yours

      // Deleting the post and it's comments
      await Post.deleteOne({ _id: postObj._id });
      PostService.deleteRelatedComments(postObj);

      res.status(200).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async editById(req: AuthRequest, res: Response) {
    const postId = req.body.postId;
    const description = req.body.description;
    const breed = req.body.breed;
    const breedId = req.body.breedId;

    if (!description || description === "")
      return res.status(400).send("Description is required");
    if (!breed || breed === "")
      return res.status(400).send("Breed is required");
    if (!breedId) return res.status(400).send("Breed is required");

    try {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          description,
          breed,
          breedId,
        },
        { new: true }
      );

      if (!updatedPost) return res.status(400).send("Post not found");

      res.status(200).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new PostController();
