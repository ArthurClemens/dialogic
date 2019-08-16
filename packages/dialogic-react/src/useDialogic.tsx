import { useEffect, useState } from "react";
import { states, Dialogic } from "dialogic";

export const useDialogic = () => {
  const [store, setStore] = useState<Dialogic.NamespaceStore>({});  

  useEffect(() => {
    states.map(({ store }) => {
      setStore({
        ...store
      })
    });
  }, []);
  
  return [
    store
  ];
};
