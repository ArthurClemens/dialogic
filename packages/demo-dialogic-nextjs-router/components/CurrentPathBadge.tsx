import { useRouter } from 'next/router';

export function CurrentPathBadge() {
  const router = useRouter();

  return (
    <div className='control path-control'>
      <span className='tag' data-test-id='current-path'>
        {router.asPath}
      </span>
    </div>
  );
}
