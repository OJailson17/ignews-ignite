import Link from 'next/link';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import styles from './styles.module.scss';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface Posts {
  posts: Post[];
}

interface Data {
  title: [
    {
      type: string;
      text: string;
    },
  ];
  content: [
    {
      type: string;
      text: string;
    },
  ];
}
interface PostDataResponse {
  results: {
    uid?: string;
    slugs: string[];
    last_publication_date: string | null;
    data: Data;
  }[];
}

export default function Posts({ posts }: Posts) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response: PostDataResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'publication')],
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 100,
    },
  );

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find(content => content.type === 'paragraph')?.text ??
        '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        },
      ),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
