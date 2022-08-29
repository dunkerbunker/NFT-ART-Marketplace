// function to make a random id of length passed in
export const makeId = (length) => {
  let result = '';
  // allowed characters to use in id
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i += 1) {
    // get a random index from 0 to length of characters
    // and add it to result
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
