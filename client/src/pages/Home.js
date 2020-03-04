import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
  // const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);

  // console.log(error)
  // console.log(data)

  // if (loading) return <div>Loading</div>;
  // if (error) return <p>ERROR</p>;
  // if (!data) return <p>Not found</p>;

  // const posts = data.getPosts;
  // console.log(posts);
  const { user } = useContext(AuthContext);

  let posts = "";
  //graphQl tends to return data
  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);

  console.log(error);
  console.log(`Loading: ${loading}`);
  console.log(data);

  if (data) {
    posts = { data: data.getPosts };
  }

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h3 style={{color: '#3a8fff'}}>SauceSay Anything!</h3>
        <h1>Recent Posts</h1>
      </Grid.Row>
      {user && (
        <Grid.Column>
          <PostForm />
        </Grid.Column>
      )}
      {loading ? (
        <h1>Loading posts..</h1>
      ) : (
        <Transition.Group>
          {posts.data &&
            posts.data.map(post => (
              <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                <PostCard post={post} />
              </Grid.Column>
            ))}
        </Transition.Group>
      )}
      <Grid.Row></Grid.Row>
    </Grid>
  );
}

export default Home;
