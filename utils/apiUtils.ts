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
    const zaraCoatName = responseBody.data[0].productName;
    const zaraCoatProductId = responseBody.data[0]._id;
    return {
      status: response.status(),
      body: responseBody,
      zaraCoatName, 
      zaraCoatProductId};
  }
}