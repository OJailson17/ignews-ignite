import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { mocked } from 'jest-mock';
import { SignInButton } from '.';

jest.mock('next-auth/client');

describe('SignInButton component', () => {
  it('renders correctly if user is not authenticated', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  });

  it('renders correctly if user is authenticated', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        expires: 'fake-test',
      },
      false,
    ]);

    render(<SignInButton />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
