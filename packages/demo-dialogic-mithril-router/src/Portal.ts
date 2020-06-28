import m from 'mithril';

import { Dialog } from 'dialogic-mithril';

const root = document.body.appendChild(document.createElement('div'));
root.setAttribute('id', 'dialog');
m.render(root, m(Dialog));
