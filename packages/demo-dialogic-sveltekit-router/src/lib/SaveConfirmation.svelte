<script context="module" lang="ts">
	export const createSaveConfirmationData = (SaveConfirmationComponent: typeof SaveConfirmation__SvelteComponent_) => ({
		dialogic: {
			component: SaveConfirmationComponent,
			className: 'demo-notification',
			styles: (domElement: HTMLElement) => {
				const height = domElement.getBoundingClientRect().height;

				return {
					default: {
						transition: 'all 350ms ease-in-out'
					},
					showStart: {
						transform: `translate3d(0, ${height}px, 0)`
					},
					showEnd: {
						transform: 'translate3d(0, 0px,  0)',
						transitionDelay: '500ms'
					},
					hideEnd: {
						transitionDuration: '450ms',
						transform: `translate3d(0, ${height}px, 0)`
					}
				};
			}
		},
		content: 'E-mail address updated'
	});
</script>

<script lang="ts">
	export let content: string;
</script>

<div class="notification-content" data-test-id="notification">{content}</div>
