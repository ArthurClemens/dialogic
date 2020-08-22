import React from 'react';
import { createFns } from './helpers/createFns';
import { Default } from '../content/Default';
import { Buttons } from './helpers/buttons';
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
  const fns5 = createFns({
    instance: dialog,
    component: Default,
    className: 'dialog',
    spawn: '2',
    queued: true,
    title: 'Spawn queued',
  });

  return (
    <div className="test">
      <div
        className="control"
        data-test-id="count-all"
      >{`Count all: ${dialog.getCount()}`}</div>
      <div
        className="control"
        data-test-id="count-id"
      >{`Count id: ${dialog.getCount({ id: '1' })}`}</div>
      <div
        className="control"
        data-test-id="count-spawn"
      >{`Count spawn: ${dialog.getCount({ spawn: '1' })}`}</div>
      <div
        className="control"
        data-test-id="count-spawn-id"
      >{`Count spawn, id: ${dialog.getCount({ spawn: '1', id: '1' })}`}</div>
      <div
        className="control"
        data-test-id="count-spawn-queued"
      >{`Count spawn, queued: ${dialog.getCount({ spawn: '2' })}`}</div>
      <div className="content">
        <Buttons {...fns1} />
        <Buttons {...fns2} id="1" />
        <Buttons {...fns3} spawn="1" />
        <Buttons {...fns4} spawn="1" id="1" />
        <Buttons {...fns5} spawn="2" name="queued" />
      </div>
      <div className="spawn default-spawn">
        <Dialog />
      </div>
      <div className="spawn custom-spawn">
        <Dialog spawn="1" />
      </div>
      <div className="spawn custom-spawn">
        <Dialog spawn="2" />
      </div>
    </div>
  );
};
