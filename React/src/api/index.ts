import * as products from "./products";
import * as todos from "./todos";
import * as product from "./product";
import * as login from "./login";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  email: string;
  role: string;
  nameIdentifier: string;
  name:string;
}

class API {
  products: typeof products;
  todos: typeof todos;
  product: typeof product;
  login: typeof login;

  constructor() {
    this.login = login;
    this.products = products;
    this.todos = todos;
    this.product = product;
  }

  decodeToken(token: string): DecodedToken {
    try {
      const decoded = jwtDecode(token) as Record<string, unknown>;
      return {
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] as string,
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string,
        nameIdentifier: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] as string,
		name: decoded ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string,
      };
    } catch {
      throw new Error("Invalid or malformed JWT token");
    }
  }
}

const api = new API();
export default api;