export const delay = async (amount) =>
  await new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, amount);
  });
