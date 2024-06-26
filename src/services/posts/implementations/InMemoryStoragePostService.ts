import { Post } from '../../../@types/Post';
import {
  createPostRequest,
  CreatePostRequest,
  deletePostRequest,
  DeletePostRequest,
  getPostsQuery,
  GetPostsQuery,
  GetPostsResponse,
} from '../../../contracts/postContracts';
import { randomString } from '../../../utils/randomString';
import { wait } from '../../../utils/wait';
import { IPostService } from '../IPostService';

import { mockedPosts } from './mockedPosts';

const USE_SIMULATION_DELAY = true;

async function processDelay() {
  if (USE_SIMULATION_DELAY) {
    await wait();
  }
}

export class InMemoryPostService implements IPostService {
  private posts: Post[] = [...mockedPosts];

  async getPosts(query: GetPostsQuery): Promise<GetPostsResponse> {
    const { limit, page } = getPostsQuery.parse(query);

    await processDelay();

    const posts = this.posts.slice((page - 1) * limit, page * limit);

    return {
      posts,
      totalPages: Math.ceil(this.posts.length / limit),
    };
  }

  async createPost(dto: CreatePostRequest): Promise<Post> {
    const { name, message, imageURL } = createPostRequest.parse(dto);

    await processDelay();

    const post: Post = {
      id: randomString(),
      name,
      message,
      imageURL,
    };

    this.posts.unshift(post);

    return post;
  }

  async deletePost(dto: DeletePostRequest): Promise<void> {
    const { id } = deletePostRequest.parse(dto);

    await processDelay();

    this.posts = this.posts.filter((post: Post) => post.id !== id);
  }
}
