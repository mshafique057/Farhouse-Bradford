import { Link, useParams } from 'react-router-dom';
import { useAsync } from '../lib/utils.js';
import { getPost } from '../lib/api.js';
import Rich from '../components/Rich.jsx';
import { fmtDate } from './Home.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading } = useAsync(() => getPost(slug), [slug]);
  if (loading) return <div className="container page-head" />;
  if (!post) {
    return (
      <div className="container page-head">
        <h1>Post not found</h1>
        <Link to="/blog" className="text-link">
          Back to blog
        </Link>
      </div>
    );
  }
  return (
    <article className="container narrow section-tight">
      <Link to="/blog" className="text-link">
        ← All posts
      </Link>
      <h1 className="post-title">{post.title}</h1>
      <time className="post-date">{fmtDate(post.created_at)}</time>
      {post.cover_url && <img className="rounded post-cover" src={post.cover_url} alt="" />}
      <Rich text={post.content} />
    </article>
  );
}
