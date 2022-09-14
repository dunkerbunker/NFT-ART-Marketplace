export const getCreators = (nfts) => {
  if (nfts) {
    const creators = nfts.reduce((creatorObject, nft) => {
      (creatorObject[nft.seller] = creatorObject[nft.seller] || []).push(nft);

      return creatorObject;
    }, {});

    return Object.entries(creators).map((creator) => {
      const seller = creator[0];
      const sum = creator[1].map((item) => Number(item.price)).reduce((prev, curr) => prev + curr, 0);

      return ({ seller, sum });
    });
  }
};

// {
//     'A': [{}]
//     'B': [{}]
//     'C': [{}]
// }

// exampme input and output

// Input

// [
//     {price:'2', seller "A"},
//     {price:'3', seller "B"},
//     {price:'3', seller "A"},
//     {price:'4', seller "C"},
// ]

// Output

// [
//     {price:'5', seller "A"},
//     {price:'4', seller "C"},
//     {price:'3', seller "B"},
// ]
