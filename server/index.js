//dependency imports
const { ApolloServer, PubSub } = require("apollo-server");
//orm library that lets us interface to mongodb
const mongoose = require("mongoose");

//relative imports
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config.js");

const pubsub = new PubSub();

const PORT = process.env.port || 5000

//server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: PORT });
  })
  .then(res => {
    console.log(`Server running at ${res.url}`);
  })
  .catch(err => {
    console.error(err);
  });
