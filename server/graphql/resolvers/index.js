const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
    // if we ever return query or mutatation that returns Post
    // it must apply these attributes
    Post: {
        likeCount(parent){
            // console.log(parent);
            return parent.likes.length
        },
        commentCount: (parent) => parent.comments.length
    },

    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
};