module.exports = {
  CORS_HEADERS: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  },

  PRODUCTS: [
    {
      id: 'foo-100',
      name: 'Cat Emoji NFT',
      description: 'Cool Cat Emoji NFT pack',
      unitPrice: 1000,
    },
    {
      id: 'foo-200',
      name: 'Dog Emoji NFT',
      description: 'Downward Dog Emoji NFT pack',
      unitPrice: 1200,
    },
  ],
};
