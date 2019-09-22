import { useEffect, useState, useRef } from "react";
import { states, Dialogic } from "dialogic";

export const useDialogic = () => {
  const [store, setStore] = useState<Dialogic.NamespaceStore>({});  
  const isMountedRef = useRef<boolean>(false);

  useEffect(
    () => {
      isMountedRef.current = true;

      states.map(({ store }) => {
        if (isMountedRef.current) {
          setStore({
            ...store
          })
        }
      });

      return () => {
        isMountedRef.current = false;
      }
    },
    []
  );
  
  return [
    store
  ];
};
