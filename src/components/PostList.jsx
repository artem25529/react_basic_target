import { createContext, forwardRef } from 'react';
import Post from './Post.jsx';
import '../styles/PostList.css';

const PostListContext = createContext();

function PostList({ posts, shouldUpdate }, ref) {
  return (
    <PostListContext.Provider value={{ shouldUpdate }}>
      <ul className="post-list">
        {posts.map((post, idx, arr) => (
          <li key={post.id} ref={arr.length - 1 === idx ? ref : null}>
            <Post post={post} />
          </li>
        ))}
      </ul>
    </PostListContext.Provider>
  );
}

export default forwardRef(PostList);
export { PostListContext };
