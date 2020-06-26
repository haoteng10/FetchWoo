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

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.render('home');
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
      console.log("Total of items:", response.headers['x-wp-total']);
    })
    .catch((error) => {
      console.log("Error!");
    });
});

app.get('/retrieve', async (req, res) => {
  // Fetch products
  const fetchProducts = await api.get("products", {});
  // Fetch categories
  const fetchCategories = await api.get("products/categories");

  let filteredResult = {};
  //Sort by categories
  fetchCategories.data.forEach((category) => {
    filteredResult[category.name] = [];
    fetchProducts.data.forEach((item) => {
      let containsCate = false;

      item.categories.forEach((itemCate) => {
        if (itemCate.name == category.name){
          containsCate = true;
        }
      });

      if (containsCate){
        filteredResult[category.name].push(item);
      }

    });
  });
  
  // res.json(filteredResult);
  res.render('retrieve', {filteredResult});
});

app.listen(port, () => console.log(`FetchWoo app listening at http://localhost:${port}`));