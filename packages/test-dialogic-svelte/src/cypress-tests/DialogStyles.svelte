<script>
  import { Dialog, dialog } from "dialogic-svelte";
  import Default from "./content/Default.svelte";
  import Buttons from "./Buttons.svelte";
  import { createFns } from "./createFns";

  const fns = createFns({
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
</script>

<div class="test">
  <Buttons {...fns} />
  <div class="spawn default-spawn">
    <Dialog />
  </div>
</div>
