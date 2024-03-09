import {test, expect} from '@playwright/test';
import {ApiUtils}  from '../utils/apiUtils';
import productsDataset from '../utils/productsDataset';
import { faker } from '@faker-js/faker'

const secondProductInDataset = productsDataset[1]; // ADIDAS ORIGINAL
const baseUrl = "https://rahulshettyacademy.com";
let token: string;
let userId: string;
let orderId: string;
const fakeOrderId = faker.string.alphanumeric(24);
const fakePayLoadOrders = { data: [], message: "No Orders" };

test.beforeAll("Logs in and creates an order", async ({request}) => {
  // 
  const apiUtils = new ApiUtils(request, baseUrl);
  const response = await apiUtils.loginAndGetToken();
  token = response.token
  userId = response.userId
  const result = await apiUtils.createOrder(token, secondProductInDataset.productId, faker.location.country());
  orderId = result.orderId;
});
test ("Intercepts call and fakes response when getting the orders for the customer @networkIntercept", async ({page}) => {
  await page.addInitScript(value => {
    window.localStorage.setItem('token',value);
  }, token);
  
  await page.goto("https://rahulshettyacademy.com/client");
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL("https://rahulshettyacademy.com/client/dashboard/dash");

  await page.route(`https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/${userId}`, async route => {
    const response = await page.request.fetch(route.request());
    let body = JSON.stringify(fakePayLoadOrders);
    route.fulfill(
      {
      response,
      body,
      }
    );
});

await page.locator("button[routerlink*='myorders']").click();
  await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")

  expect(await page.locator(".mt-4").textContent()).toContain("No Orders");

});

test ("Intercepts call and fakes request rerouting call to try and get other user order details @networkIntercept @networkSecurity", async ({page, request}) => {
  await page.addInitScript(value => {
    window.localStorage.setItem('token',value);
  }, token);
  
  await page.goto("https://rahulshettyacademy.com/client");
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL("https://rahulshettyacademy.com/client/dashboard/dash");
  await page.locator(".card-body b").first().waitFor();
  await page.locator("button[routerlink*='myorders']").click();
  await page.route(`https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=${orderId}`,
   (route) => 
   route.continue({
    url: `https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=${fakeOrderId}`,
   })
  );
  await page.locator("button:has-text('View')").first().click();
  await expect(page.locator("p").last()).toHaveText(
    "You are not authorize to view this order"
  );

  // clean up
  const apiUtils = new ApiUtils(request, baseUrl);
  const deleteResult = await apiUtils.deleteOrder(token, orderId);
  expect(deleteResult.status).toBe(200);
  expect(deleteResult.body.message).toBe("Orders Deleted Successfully")
});