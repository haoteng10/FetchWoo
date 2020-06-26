const express = require('express');
const app = express();
const port = 3000;

require('dotenv').config();
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: "http://localhost",
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  version: "wc/v3"
});

app.get('/', (req, res) => {
    res.send("Enabled");
});

app.get('/test', (req, res) => {
  // List products
  api.get("products", {
    per_page: 20, // 20 products per page
  })
    .then((response) => {
      // Successful request
      console.log("Success!");
      res.json(response.data);
      // console.log("Total of pages:", response.headers['x-wp-totalpages']);
      console.log("Total of items:", response.headers['x-wp-total']);
    })
    .catch((error) => {
      console.log("Error!");
    });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));