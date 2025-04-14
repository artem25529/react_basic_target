import performAPICall from '../utils/performAPICall.js';
import getResourceAsync from '../utils/getResouceAsync.js';

const POSTS_URL = 'http://localhost:3000/posts';

const postService = {
  getPosts(searchParams, page, limit, setResponse) {
    const params = {};

    if (searchParams?.query) {
      params.q = searchParams.query;
    }

    if (searchParams?.sort) {
      params._sort = `statistics.${searchParams.sort}`;
      params._order = searchParams?.order || 'asc';
    }

    params._page = page || 1;
    params._limit = limit || 5;

    performAPICall(POSTS_URL, params, 'GET', null, setResponse);
  },

  getPostsWUrlParams(urlParams = {}, setResponse) {
    performAPICall(POSTS_URL, urlParams, 'GET', null, setResponse);
  },

  async getPostsByFieldsAsync(fields) {
    return await getResourceAsync(POSTS_URL, fields);
  },

  async updatePost(post) {
    const dataForUpdate = { ...post };
    delete dataForUpdate.id;

    const response = await fetch(`${POSTS_URL}/${post.id}`, {
      method: 'PATCH',
      body: JSON.stringify(dataForUpdate),

      headers: { 'Content-Type': 'application/json' },
    });

    return await response.json();
  },

  async deletePost(id) {
    const response = await fetch(`${POSTS_URL}/${id}`, {
      method: 'DELETE',
    });

    return await response.json();
  },

  async createPost(post) {
    const response = await fetch(POSTS_URL, {
      method: 'POST',
      body: JSON.stringify(post),

      headers: { 'Content-Type': 'application/json' },
    });

    return await response.json();
  },
};

export default postService;
