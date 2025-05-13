import * as products from "./products";
import * as todos from "./todos";
import * as product from "./product"
class API {
	products: typeof products;
	todos: typeof todos;
	product: typeof product;

	constructor() {
		this.products = products;
		this.todos = todos;
		this.product =product
	}
}

const api = new API();

export default api;
