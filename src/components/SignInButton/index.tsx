<<<<<<< HEAD
import { signIn, signOut, useSession } from "next-auth/client";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import styles from "./styles.module.scss";
=======
import { signIn, signOut, useSession } from 'next-auth/client';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';
>>>>>>> master

export function SignInButton() {
  const [session] = useSession();

  return session ? (
    <button
<<<<<<< HEAD
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <FaGithub color="#04d361" />
      {session.user?.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn("github")}
    >
      <FaGithub color="#eba417" />
=======
      type='button'
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <FaGithub color='#04d361' />
      {session.user?.name}
      <FiX color='#737380' className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type='button'
      className={styles.signInButton}
      onClick={() => signIn('github')}
    >
      <FaGithub color='#eba417' />
>>>>>>> master
      Sign in with Github
    </button>
  );
}
