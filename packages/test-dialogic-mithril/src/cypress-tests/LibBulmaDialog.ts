import { Dialog, dialog } from 'dialogic-mithril';
import m from 'mithril';

const DemoContent = {
  view: () =>
    m('article', { class: 'media' }, [
      m(
        'div',
        { class: 'media-left' },
        m(
          'figure',
          { class: 'image is-64x64' },
          m('img', {
            src: 'https://bulma.io/images/placeholders/128x128.png',
            alt: 'Image',
          }),
        ),
      ),
      m('div', { class: 'media-content' }, [
        m(
          'div',
          { class: 'content' },
          m('p', [
            m('strong', 'John Smith'),
            m('small', ' '),
            m('small', '@johnsmith'),
            m('small', '31m'),
            m('br'),
            ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis. ',
          ]),
        ),
        m(
          'nav',
          { class: 'level is-mobile' },
          m('div', { class: 'level-left' }, [
            m(
              'a',
              { class: 'level-item', 'aria-label': 'retweet' },
              m(
                'span',
                { class: 'icon is-small' },
                m(
                  'svg',
                  {
                    class: 'svg-inline--fa fa-retweet fa-w-20',
                    'aria-hidden': 'true',
                    'data-prefix': 'fas',
                    'data-icon': 'retweet',
                    role: 'img',
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: '0 0 640 512',
                    'data-fa-i2svg': '',
                  },
                  m('path', {
                    fill: 'currentColor',
                    d: 'M629.657 343.598L528.971 444.284c-9.373 9.372-24.568 9.372-33.941 0L394.343 343.598c-9.373-9.373-9.373-24.569 0-33.941l10.823-10.823c9.562-9.562 25.133-9.34 34.419.492L480 342.118V160H292.451a24.005 24.005 0 0 1-16.971-7.029l-16-16C244.361 121.851 255.069 96 276.451 96H520c13.255 0 24 10.745 24 24v222.118l40.416-42.792c9.285-9.831 24.856-10.054 34.419-.492l10.823 10.823c9.372 9.372 9.372 24.569-.001 33.941zm-265.138 15.431A23.999 23.999 0 0 0 347.548 352H160V169.881l40.416 42.792c9.286 9.831 24.856 10.054 34.419.491l10.822-10.822c9.373-9.373 9.373-24.569 0-33.941L144.971 67.716c-9.373-9.373-24.569-9.373-33.941 0L10.343 168.402c-9.373 9.373-9.373 24.569 0 33.941l10.822 10.822c9.562 9.562 25.133 9.34 34.419-.491L96 169.881V392c0 13.255 10.745 24 24 24h243.549c21.382 0 32.09-25.851 16.971-40.971l-16.001-16z',
                  }),
                ),
              ),
            ),
            m(
              'a',
              { class: 'level-item', 'aria-label': 'like' },
              m(
                'span',
                { class: 'icon is-small' },
                m(
                  'svg',
                  {
                    class: 'svg-inline--fa fa-heart fa-w-16',
                    'aria-hidden': 'true',
                    'data-prefix': 'fas',
                    'data-icon': 'heart',
                    role: 'img',
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: '0 0 512 512',
                    'data-fa-i2svg': '',
                  },
                  m('path', {
                    fill: 'currentColor',
                    d: 'M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z',
                  }),
                ),
              ),
            ),
          ]),
        ),
      ]),
    ]),
};

const BulmaDialogComponent = (isModal: boolean = false) => ({
  view: () =>
    m('.modal.is-active', [
      m('.modal-background', {
        onclick: () => !isModal && dialog.hide(),
      }),
      m('.modal-content', m('.bulma-dialog-content-box', m(DemoContent))),
      m('.modal-close.is-large', {
        onclick: () => dialog.hide(),
      }),
    ]),
});

export default () => ({
  view: () =>
    m('.test', [
      m('.buttons', [
        m(
          '.button',
          {
            onclick: () => {
              dialog.show({
                dialogic: {
                  component: BulmaDialogComponent(),
                  className: 'dialog',
                },
              });
            },
          },
          'Show dialog',
        ),
        m(
          '.button',
          {
            onclick: () => {
              dialog.show({
                dialogic: {
                  component: BulmaDialogComponent(true),
                  className: 'dialog',
                },
              });
            },
          },
          'Show modal dialog',
        ),
      ]),
      m('.bulma', m(Dialog)),
    ]),
});
