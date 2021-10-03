<script context="module">
  export const createSaveConfirmationProps = SaveConfirmationComponent => ({
    dialogic: {
      component: SaveConfirmationComponent,
      className: 'demo-notification',
      styles: domElement => {
        const height = domElement.getBoundingClientRect().height;

        return {
          default: {
            transition: 'all 350ms ease-in-out',
          },
          showStart: {
            transform: `translate3d(0, ${height}px, 0)`,
          },
          showEnd: {
            transform: 'translate3d(0, 0px,  0)',
            transitionDelay: '500ms',
          },
          hideEnd: {
            transitionDuration: '450ms',
            transform: `translate3d(0, ${height}px, 0)`,
          },
        };
      },
    },
    content: 'E-mail address updated',
  });
</script>

<script>
  export let content;
</script>

<div class="notification-content" data-test-id="notification">{content}</div>
