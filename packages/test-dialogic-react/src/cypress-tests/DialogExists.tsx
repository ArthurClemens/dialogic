import React from 'react';
import { createFns } from './createFns';
import { Default } from '../content/Default';
import { Buttons } from './Buttons';
import { dialog, Dialog, useDialogicState } from 'dialogic-react';

export default () => {
  useDialogicState();
  const fns1 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    title: 'Default',
  });
  const fns2 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    id: '1',
    title: 'ID',
  });
  const fns3 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    spawn: '1',
    title: 'Spawn',
  });
  const fns4 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    spawn: '1',
    id: '1',
    title: 'Spawn and ID',
  });

  return (
    <div className="test">
      <div
        className="control"
        data-test-id="count-all"
      >{`Exists any: ${dialog.exists().toString()}`}</div>
      <div
        className="control"
        data-test-id="count-id"
      >{`Exists id: ${dialog.exists({ id: '1' }).toString()}`}</div>
      <div
        className="control"
        data-test-id="count-spawn"
      >{`Exists spawn: ${dialog.exists({ spawn: '1' }).toString()}`}</div>
      <div
        className="control"
        data-test-id="count-spawn-id"
      >{`Exists spawn, id: ${dialog
        .exists({ spawn: '1', id: '1' })
        .toString()}`}</div>
      <div className="content">
        <Buttons {...fns1} />
        <Buttons {...fns2} id="1" />
        <Buttons {...fns3} spawn="1" />
        <Buttons {...fns4} spawn="1" id="1" />
      </div>
      <div className="spawn default-spawn">
        <Dialog />
      </div>
      <div className="spawn custom-spawn">
        <Dialog spawn="1" />
      </div>
    </div>
  );
};
