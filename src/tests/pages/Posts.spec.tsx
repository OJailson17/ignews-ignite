import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';

import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic');

const posts = {
  slug: 'my-new-post',
  title: 'My New Post',
  excerpt: 'Post excerpt',
  updatedAt: 'February 07',
};

describe('Posts page', () => {
  it('Renders correctly', () => {
    render(<Posts posts={[posts]} />);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('Post excerpt')).toBeInTheDocument();
  });

  it('Loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
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
                  text: 'Some content',
                },
              ],
            },
            last_publication_date: '02-07-2022',
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My New Post',
              excerpt: 'Some content',
              updatedAt: '07 de fevereiro de 2022',
            },
          ],
        },
      }),
    );
  });
});
