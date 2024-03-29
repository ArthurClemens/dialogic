import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useDisplayLogic } from '../../lib/util';

/**
 * Empty page that just redirects to /profile.
 */

function EditProfile() {
  const router = useRouter();
  const { dialogPath, dialogAsPath } = useDisplayLogic();

  useEffect(() => {
    router.replace(dialogPath, dialogAsPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>&nbsp;</div>;
}

export default EditProfile;
