import {test, expect} from '@playwright/test';
import {usersLoginData} from '../utils/usersLoginData';
import { faker } from '@faker-js/faker'
import {ApiUtils}  from '../utils/apiUtils';
import productsDataset from '../utils/productsDataset';

const firstProductInDataset = productsDataset[0]; // ZARA COAT 3
let token: string;
let userId: string;
let orderId: string;
const baseUrl = "https://rahulshettyacademy.com";


test.describe("API Tests @API", () => {
  

  test.beforeAll("POST /api/ecom/auth/login", async ({request}) => {
    const apiUtils = new ApiUtils(request, baseUrl);
    const response = await apiUtils.loginAndGetToken();
    token = response.token
    userId = response.userId
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login Successfully');

  });
 
  test ("Logs in using previously created token", async ({page}) => 
  {
    await page.addInitScript(value => {
      window.localStorage.setItem('token',value);
    }, token);
    // If auth is passed through cookies use this example: await context.addCookies([{name:"csrftoken", value: "mytokenvalue123", url: "your.application.url"}]);
    await page.goto("https://rahulshettyacademy.com/client");
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL("https://rahulshettyacademy.com/client/dashboard/dash");
  });

  test ("POST /api/ecom/product/get-all-products", async ({request}) => {
    const apiUtils = new ApiUtils(request, baseUrl);
    const response = await apiUtils.getAllProducts(token);
    expect(response.status).toBe(200);
    expect(response.body.data[0].productName).toBe(firstProductInDataset.productName);
    expect(response.body.message).toBe('All Products fetched Successfully');
    
  });

  test (`GET {api/ecom/user/get-cart-count/${userId}}, POST {/api/ecom/user/add-to-cart} and DELETE {/api/ecom/user/remove-from-cart/${userId}/${firstProductInDataset.productId}}`, async ({request}) => {

    // This dummy eCommerce website intentionally resets the cart for security or user experience reasons everytime the user logs in.
    // In order to properly test these endpoints, in this same test we need to:
    // 1. Confirm that the cart is empty
    // 2. Add a product to the cart
    // 3. Confirm that the cart has that one product 
    // 4. Remove the product from the cart

    // 1. Confirm that the cart is empty
    const apiUtils = new ApiUtils(request, baseUrl);
    const response = await apiUtils.getCartCount(token, userId);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('No Product in Cart')

    // 2. Add a product to the cart
    const result = await apiUtils.addProductToCart(token, userId, firstProductInDataset.productId, firstProductInDataset.productName);
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('Product Added To Cart')
    
    // 3. Confirm that the cart has that one product
    const responseWithProduct = await apiUtils.getCartProducts(token, userId);
    expect (responseWithProduct.status).toBe(200);
    expect(responseWithProduct.body.products[0].productName).toBe(firstProductInDataset.productName);
    expect(responseWithProduct.body.products[0]._id).toBe(firstProductInDataset.productId);
    expect(responseWithProduct.body.count).toBe(1)
    expect(responseWithProduct.body.message).toBe('Cart Data Found')

    // 4. Remove the product from the cart
    const responseAfterDelete = await apiUtils.removeProductFromCart(token, userId, firstProductInDataset.productId);
    expect(responseAfterDelete.status).toBe(200);
    expect(responseAfterDelete.body.message).toBe('Product Removed from cart')
  })
  
  test (`POST {/api/ecom/order/create-order}, GET {/api/ecom/order/get-orders-for-customer/${userId}} and DELETE {/api/ecom/order/delete-order/${orderId}}`, async ({request}) => {
    // Posts an order
    const apiUtils = new ApiUtils(request, baseUrl);
    const response = await apiUtils.createOrder(token, firstProductInDataset.productId, faker.location.country());
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Order Placed Successfully');
    expect(response.body.productOrderId).toEqual([firstProductInDataset.productId]);
    const orderId = response.orderId;

    // Gets orders for customer and confirms previous order is there
    const result = await apiUtils.getOrdersForCustomer(token, userId);
    expect(result.status).toBe(200);
    expect(result.body.data[0]._id).toBe(orderId);
    expect(result.body.data[0].orderById).toBe(userId);
    expect(result.body.data[0].orderBy).toBe(usersLoginData.userOne.email);
    expect(result.body.data[0].productName).toBe(firstProductInDataset.productName);
    expect(result.body.message).toBe("Orders fetched for customer Successfully")
    
    // Deletes the order
    const deleteResult = await apiUtils.deleteOrder(token, orderId);
    expect(deleteResult.status).toBe(200);
    expect(deleteResult.body.message).toBe("Orders Deleted Successfully")

  })
});
