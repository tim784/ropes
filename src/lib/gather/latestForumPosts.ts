import { User } from './user';
import { querySelector, querySelectorAll } from './util';
import { parseEmpDate } from "../util";

export type LatestForumPost = {
  title: string;
  href: string;
  author: User;
  lastUpdated: Date;
};

function getLatestForumPost(spanElement: Element): LatestForumPost {
  const [titleAnchorElement, userAnchorElement] = querySelectorAll('a', spanElement)!;

  const title = titleAnchorElement.textContent!;
  const href = titleAnchorElement.getAttribute('href')!;

  const userName = userAnchorElement.textContent!;
  const userHref = userAnchorElement.getAttribute('href')!;
  const author = User.fromNameAndHref(userName, userHref);

  const timeSpan = querySelector('span.time', spanElement)!;
  const lastUpdatedText = timeSpan.getAttribute('title')!;
  const lastUpdated = parseEmpDate(lastUpdatedText);

  return {
    title,
    href,
    author,
    lastUpdated
  };
}

export function getLatestForumPosts(doc: Document): LatestForumPost[] {
  const postElements = querySelectorAll('.latest_threads > span', doc);
  const posts =  postElements.map(getLatestForumPost);
  return posts;
}
