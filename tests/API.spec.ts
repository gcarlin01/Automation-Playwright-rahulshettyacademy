import {test, expect, request} from '@playwright/test';
import {usersLoginData} from '../utils/usersLoginData';


let token: string;
const baseUrl = "https://rahulshettyacademy.com";
const payLoad = {userEmail: usersLoginData.userOne.email, userPassword: usersLoginData.userOne.password}

test.describe("API Test", () => {

  test.beforeAll("Post /api/ecom/auth/login ", async ({request}) => {
    const response = await request.post(`${baseUrl}/api/ecom/auth/login`, 
    {
      data: payLoad
    } );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    token = responseBody.token;
   
  });
  test ("Logs in using previously created token", async ({page}) => 
  {
    await page.addInitScript(value => {
      window.localStorage.setItem('token',value);
    }, token);
    await page.goto("https://rahulshettyacademy.com/client");
  });

  test ("Post /api/ecom/product/get-all-products ", async ({request}) => {
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
});
