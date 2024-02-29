import {test, expect, request} from '@playwright/test';
import {usersLoginData} from '../utils/usersLoginData';
import { faker } from '@faker-js/faker'



let token: string;
let userId: string;
let zaraCoatProductId: string;
let orderId: string;
const baseUrl = "https://rahulshettyacademy.com";
const loginPayLoad = {userEmail: usersLoginData.userOne.email, userPassword: usersLoginData.userOne.password};


test.describe("API Tests", () => {

  test.beforeAll("POST /api/ecom/auth/login and POST /api/ecom/product/get-all-products", async ({request}) => {
    const response = await request.post(`${baseUrl}/api/ecom/auth/login`, 
    {
      data: loginPayLoad   
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    userId = responseBody.userId;
    token = responseBody.token;

    const result = await request.post(`${baseUrl}/api/ecom/product/get-all-products`,
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
    expect(result.status()).toBe(200);
    const resultBody = await result.json();
    expect(resultBody.data[0].productName).toBe('ZARA COAT 3')
    zaraCoatProductId = (resultBody.data[0]._id);
    expect(resultBody.message).toBe('All Products fetched Successfully')
   
  });
  test ("Logs in using previously created token", async ({page}) => 
  {
    await page.addInitScript(value => {
      window.localStorage.setItem('token',value);
    }, token);
    // If auth is passed through cookies use this example: await context.addCookies([{name:"csrftoken", value: "mytokenvalue123", url: "your.application.url"}]);
    await page.goto("https://rahulshettyacademy.com/client");
  });

  test (`GET api/ecom/user/get-cart-count/${userId} and POST /api/ecom/user/add-to-cart`, async ({request}) => {

    // This dummy eCommerce website intentionally resets the cart for security or user experience reasons everytime the user logs in.
    // In order to properly test these endpoints, in this same test we need to:
    // 1. Confirm that the cart is empty
    // 2. Add a product to the cart
    // 3. Confirm that the cart has that one product 
    
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

    const result = await request.post(`${baseUrl}/api/ecom/user/add-to-cart`,
    {
      data: {

        "_id": userId,

        "product": {

          "_id": zaraCoatProductId,
          "productName": "ZARA COAT 3",
          "productCategory": "fashion",
          "productSubCategory": "shirts",
          "productPrice": 31500,
          "productDescription": "Zara coat for Women and girls",
          "productImage": "https://rahulshettyacademy.com/api/ecom/uploads/productImage_1650649434146.jpeg",
          "productRating": "0",
          "productTotalOrders": "0",
          "productStatus": true,
          "productFor": "women",
          "productAddedBy": "admin@gmail.com",
          "__v": 0
          }
      },
      
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    expect(result.status()).toBe(200);
    const resultBody = await result.json();
    expect(resultBody.message).toBe('Product Added To Cart')

    const responseWithProduct = await request.get(`${baseUrl}/api/ecom/user/get-cart-count/${userId}`,
    {
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    expect(responseWithProduct.status()).toBe(200);
    const responseWithProductBody = await responseWithProduct.json();
    expect(responseWithProductBody.count).toBe(1)
    expect(responseWithProductBody.message).toBe('Cart Data Found')
  })
  
  test (`POST {/api/ecom/order/create-order}, GET {/api/ecom/order/get-orders-for-customer/${userId}} and DELETE {/api/ecom/order/delete-order/${orderId}}`, async ({request}) => {
    const orderPayLoad = {orders:[{country:faker.location.country(),productOrderedId:zaraCoatProductId}]};
    const response = await request.post(`${baseUrl}/api/ecom/order/create-order`,
    {
      data: orderPayLoad,
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Order Placed Successfully')
    expect(responseBody.productOrderId).toEqual([zaraCoatProductId])
    const orderId: string = responseBody.orders[0];
    
    const result = await request.get(`${baseUrl}/api/ecom/order/get-orders-for-customer/${userId}`,
    {
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    expect(result.status()).toBe(200);
    const resultBody = await result.json();
    expect(resultBody.data[0]._id).toBe(orderId);
    expect(resultBody.data[0].orderById).toBe(userId);
    expect(resultBody.data[0].orderBy).toBe(usersLoginData.userOne.email);
    expect(resultBody.data[0].productName).toBe('ZARA COAT 3');
    console.log(resultBody);
    expect(resultBody.message).toBe("Orders fetched for customer Successfully")

    const deleteResult = await request.delete(`${baseUrl}/api/ecom/order/delete-order/${orderId}`,
    {
      headers: {
        'Authorization': token,
        'Content-Type': "application/json"
      }
    })
    expect(deleteResult.status()).toBe(200);
    const deleteResultBody = await deleteResult.json();
    expect(deleteResultBody.message).toBe("Orders Deleted Successfully")
  })
});
