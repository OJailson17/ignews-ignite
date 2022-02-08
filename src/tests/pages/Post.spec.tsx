import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession } from 'next-auth/client';

import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updatedAt: 'February 07',
};

describe('Post page', () => {
  it('Renders correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
  });

  it('redirect user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {
        slug: 'my-new-post',
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: `/posts/preview/my-new-post`,
          permanent: false,
        },
      }),
    );
  });

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: 'heading',
              text: 'My New Post',
            },
          ],
          content: [
            {
              type: 'paragraph',
              text: 'Post content',
            },
          ],
        },
        last_publication_date: '02-07-2022',
      }),
    } as any);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    });

    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {
        slug: 'my-new-post',
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post content</p>',
            updatedAt: '07 de fevereiro de 2022',
          },
        },
      }),
    );
  });
});
