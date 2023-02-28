import Head from 'next/head';
import Link from 'next/link';

import { CurrentPathBadge } from '../components';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div data-test-id='home-page'>
        <h1 className='title'>Home</h1>
        <CurrentPathBadge />
        <p className='intro'>
          This demo shows <code>UseDialog</code> that allows for a declarative
          way of controlling dialogs. The Profile dialog responds to the route,
          and is automatically hidden when using the browser&apos;s back button.
        </p>
        <div className='buttons'>
          <Link
            href='/profile'
            className='button is-link'
            data-test-id='btn-profile'
          >
            Go to Profile
          </Link>
        </div>
      </div>
    </>
  );
}
