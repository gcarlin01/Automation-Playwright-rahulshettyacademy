import { APIRequestContext,  } from '@playwright/test';
import {usersLoginData} from '../utils/usersLoginData';


export class ApiUtils {
  baseUrl: string;
  request: APIRequestContext;




  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async loginAndGetToken() {
    
    const loginPayLoad = {
      userEmail: usersLoginData.userOne.email, userPassword: usersLoginData.userOne.password
    }; 

    const response = await this.request.post(`${this.baseUrl}/api/ecom/auth/login`,
      {
       data: loginPayLoad 
      });
      
    const responseBody = await response.json();
    const userId: string = responseBody.userId;
    const token: string = responseBody.token;
      
    return {
      status: response.status(),
      body: responseBody,
      token, 
      userId};
   }

  async getAllProducts(token: string) {
    const response = await this.request.post(`${this.baseUrl}/api/ecom/product/get-all-products`,
      {
        data: {
          "productName": "",
          "minPrice": null,
          "maxPrice": null,
          "productCategory": [],
          "productSubCategory": [],
          "productFor": []
        },
        headers: {
          'Authorization': token,
          'Content-Type': "application/json"
        }
      });
    const responseBody = await response.json();
    return {
      status: response.status(),
      body: responseBody,
    };
  }

  async addProductToCart(token: string, userId: string, productId: string, productName: string) {
    const response = await this.request.post(`${this.baseUrl}/api/ecom/user/add-to-cart`,
    {
      data: {

        "_id": userId,

        "product": {

          "_id": productId,
          "productName": productName,
          }
      },
      
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    const responseBody = await response.json();
    return {
      status: response.status(),
      body: responseBody};
  }

  async getCartCount(token: string, userId: string) { 
    const response = await this.request.get(`${this.baseUrl}/api/ecom/user/get-cart-count/${userId}`,
    {
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    const responseBody = await response.json();
    return {
      status: response.status(),
      body: responseBody};
  }

  async getCartProducts(token: string, userId: string) {
    const response = await this.request.get(`${this.baseUrl}/api/ecom/user/get-cart-products/${userId}`,
    {
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    const responseBody = await response.json();
    return {
      status: response.status(),
      body: responseBody};
  }

  async removeProductFromCart(token: string, userId: string, productId: string) {
    const response = await this.request.delete(`${this.baseUrl}/api/ecom/user/remove-from-cart/${userId}/${productId}`,
    {
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    const responseBody = await response.json();
    return {
      status: response.status(),
      body: responseBody};
  }

  async createOrder(token: string, productId: string, country: string) {
    const orderPayLoad = {orders:[{country:country,productOrderedId:productId}]};
    const response = await this.request.post(`${this.baseUrl}/api/ecom/order/create-order`,
    {
      data: orderPayLoad,
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    const responseBody = await response.json();
    const orderId: string = responseBody.orders[0];
    return {
      status: response.status(),
      body: responseBody,
      orderId};
     
  }

  async getOrdersForCustomer(token: string, userId: string) {
    const response = await this.request.get(`${this.baseUrl}/api/ecom/order/get-orders-for-customer/${userId}`,
    {
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    const responseBody = await response.json();
    return {
      status: response.status(),
      body: responseBody};
  }

  async deleteOrder(token: string, orderId: string) {
    const response = await this.request.delete(`${this.baseUrl}/api/ecom/order/delete-order/${orderId}`,
    {
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    const responseBody = await response.json();
    return {
      status: response.status(),
      body: responseBody};
  }

}