import * as products from "./products";
import * as todos from "./todos";
import * as product from "./product";
import * as login from "./login";
import * as sale from "./sales"
import * as user from "./user";

class API {
  products: typeof products;
  user: typeof user;
  todos: typeof todos;
  product: typeof product;
  login: typeof login;
  sale: typeof sale;

  constructor() {
    this.sale =sale;
    this.user = user;
    this.login = login;
    this.products = products;
    this.todos = todos;
    this.product = product;
  }
}

const api = new API();
export default api;