import { useRouter } from "next/router";

export const useDisplayLogic = () => {
  const router = useRouter();

  const dialogPath = "/profile?action=edit";
  const dialogAsPath = "/profile/edit";
  const dialogReturnPath = "/profile";
  const isShowDialog = router.query.action === "edit";

  return {
    dialogPath,
    dialogAsPath,
    dialogReturnPath,
    isShowDialog,
  };
};
