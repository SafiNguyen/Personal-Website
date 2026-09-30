import { getBlogPosts } from "../../lib/blog";
import NewsBrowser from "./NewsBrowser";

export default function NewsPage() {
  return <NewsBrowser posts={getBlogPosts()} />;
}