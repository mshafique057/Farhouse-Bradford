import { useSite } from '../lib/SiteContext.jsx';
import { useAsync } from '../lib/utils.js';
import { getPosts } from '../lib/api.js';
import PageHead from '../components/PageHead.jsx';
import { PostCard } from './Home.jsx';

export default function Blog() {
  const p = useSite().settings.pages.blog;
  const { data, loading } = useAsync(() => getPosts(), []);
  return (
    <>
      <PageHead title={p.title} intro={p.intro} />
      <section className="container section-tight">
        <div className="post-grid">
          {(data || []).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {!loading && !data?.length && <p className="empty">No posts yet.</p>}
      </section>
    </>
  );
}
