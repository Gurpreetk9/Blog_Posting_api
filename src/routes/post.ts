import express, { Response, Request, Router } from "express";
import { z } from "zod";
import Post from "../model/postModel";

const route: Router = express.Router();

const postValidate = z.object({
  title: z.string(),
  content: z.string(),
  category: z.string(),
  tags: z.string().array().min(1),
});
type dataType = z.infer<typeof postValidate>;

route.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const data: dataType = req.body;
    console.log(data);

    const postData = postValidate.safeParse(data);

    if (!postData.success) {
      return res.status(401).json({
        message: "Validation error",
      });
    }

    const post = new Post(data);
    post.createdAt = new Date();
    await post.save();

    res.status(201).send("New Blog posted");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in posting blog");
  }
});

route.put("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const postid = req.params.id;

    const data = req.body;
    const { success } = postValidate.safeParse(data);
    if (!success) {
      return res.status(401).json({
        message: "Validation error",
      });
    }
    const post = await Post.findById(postid);

    if (!post) {
      return res.status(404).send("post doesn't found");
    }

    post.title = data.title;
    post.content = data.content;
    post.category = data.category;
    post.tags = data.tags;
    post.updatedAt = new Date();

    await post.save();

    res.status(201).send("Blog post updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in updating blog");
  }
});

route.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    await post.deleteOne({ _id: req.params.id });

    return res.status(204).send("Post deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in deleting blog");
  }
});

route.get("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.status(200).json({
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

route.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const term: string | undefined = req.query.term?.toString();

    if (!term) {
      const AllPost = await Post.find({});
      return res.status(200).json({
        AllPost,
      });
    } else {
      const filterPost = await Post.find({ $text: { $search: term } });

      res.status(200).json({
        filterPost,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

export default route;
