export const store = {
  email: 'allan@company.com',
  count: 0,
  increment: () => {
    store.count += 1;
  },
  setEmail: (newEmail: string) => {
    store.email = newEmail;
  },
};

export type TStore = typeof store;
