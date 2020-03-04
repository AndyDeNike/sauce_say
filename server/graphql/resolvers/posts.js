const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getPosts(_, { username }) {
      console.log("getPosts Query activated!");
      try {
        //find all
        if (username) {
          const postsSort = await Post.find().sort({ createdAt: -1 });
          const posts = postsSort.filter(p => p.username === username);
          return posts;
        } else {
          const posts = await Post.find().sort({ createdAt: -1 });
          console.log(posts);
          return posts;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      console.log("getPost Query activated!");
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      console.log("createPost Mutation activated!");
      const user = checkAuth(context);
      // console.log(user);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post
      });

      return post;
    },
    async deletePost(_, { postId }, context) {
      console.log("deletePost Mutation activated!");
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted succesfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find(like => like.username === username)) {
          // Post already likes, unlike it
          post.likes = post.likes.filter(like => like.username !== username);
          await post.save();
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    }
  },
  // web sockets listen in for new posts and capture them
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST")
    }
  }
};
