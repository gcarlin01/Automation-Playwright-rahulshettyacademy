import {test, expect, request} from '@playwright/test';
import {usersLoginData} from '../utils/usersLoginData';


let token: string;
let userId: string;
const baseUrl = "https://rahulshettyacademy.com";
const payLoad = {userEmail: usersLoginData.userOne.email, userPassword: usersLoginData.userOne.password}

test.describe("API Tests", () => {

  test.beforeAll("POST /api/ecom/auth/login ", async ({request}) => {
    const response = await request.post(`${baseUrl}/api/ecom/auth/login`, 
    {
      data: payLoad
    } );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    userId = responseBody.userId;
    token = responseBody.token;
   
  });
  test ("Logs in using previously created token", async ({page}) => 
  {
    await page.addInitScript(value => {
      window.localStorage.setItem('token',value);
    }, token);
    // If auth is passed through cookies use this example: await context.addCookies([{name:"csrftoken", value: "mytokenvalue123", url: "your.application.url"}]);
    await page.goto("https://rahulshettyacademy.com/client");
  });

  test ("POST /api/ecom/product/get-all-products ", async ({request}) => {
    const response = await request.post(`${baseUrl}/api/ecom/product/get-all-products`,
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
    })
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data[0].productName).toBe('ZARA COAT 3')
    expect(responseBody.message).toBe('All Products fetched Successfully')
  })

  test (`GET api/ecom/user/get-cart-count/${userId} `, async ({page, request}) => {
    // This dummy eCommerce website intentionally resets the cart for security or user experience reasons everytime the user logs in.
    // In order to properly test this endpoint, we need to:
    // 1. Confirm that the cart is empty
    // 2. Add a product to the cart
    // 3. Confirm that the cart has one product 
  
    const response = await request.get(`${baseUrl}/api/ecom/user/get-cart-count/${userId}`,
    {
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('No Product in Cart')
  })
  

});