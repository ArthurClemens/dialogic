<script>
  import { Dialog, dialog } from "dialogic-svelte";
  import Default from "./content/Default.svelte";
  import Buttons from "./Buttons.svelte";
  import { createFns } from "./createFns.ts";

  const fns1 = createFns({
    instance: dialog,
    component: Default,
    title: "DialogStyles",
    styles: (domElement) => {
      const height = domElement.getBoundingClientRect().height;
      return {
        default: {
          transition: "all 300ms ease-in-out",
        },
        showStart: {
          opacity: "0",
          transform: `translate3d(0, ${height}px, 0)`,
        },
        showEnd: {
          opacity: "1",
          transform: "translate3d(0, 0px,  0)",
        },
        hideEnd: {
          transitionDuration: "450ms",
          transform: `translate3d(0, ${height}px, 0)`,
          opacity: "0",
        },
      }
    },
  });
  const fns2 = createFns({
    instance: dialog,
    component: Default,
    title: "DialogStyles combi",
    className: "dialog",
    styles: (domElement) => {
      const height = domElement.getBoundingClientRect().height;
      return {
        default: {
          transition: "all 300ms ease-in-out",
        },
        hideEnd: {
          transitionDuration: "450ms",
          transform: `translate3d(0, ${height}px, 0)`,
          opacity: "0",
        },
      }
    },
  });
</script>

<div class="test">
  <Buttons {...fns1} />
  <Buttons {...fns2} name="combi" />
  <div class="spawn default-spawn">
    <Dialog />
  </div>
</div>
