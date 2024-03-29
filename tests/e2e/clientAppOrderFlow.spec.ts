import { test, expect } from '@playwright/test';
import { usersLoginData } from '../../utils/usersLoginData';
import POManager from '../../pages/POManager';
import productsDataset from '../../utils/productsDataset';
import { ApiUtils } from '../../utils/apiUtils';

productsDataset.forEach((product) => {
  const productName = product.productName;
  test.describe("Client App Order Flow @regression", () => {
    test.use({ storageState: "loggedInStateQA1.json" });
    test(`User is able to place an order for ${productName}`, async ({ page }) => {
      const poManager = new POManager(page);
      const loginPage = poManager.getLoginPage();
      await loginPage.goTo();

      // Redirects to Dashboard
      const dashboardPage = poManager.getDashboardPage();

      // Searches and adds product to cart
      await dashboardPage.searchAndAddToCart(productName);

      // Goes to cart
      await dashboardPage.goToCart();
      const cartPage = poManager.getCartPage();

      // Checks if product is displayed in cart
      expect(await cartPage.checkIfProductIsDisplayed(productName)).toBeTruthy();
      await cartPage.goToCheckout();

      // Checks-out
      const orderPage = poManager.getOrderPage();

      // Fills form
      // Country is selected from dropdown
      await orderPage.searchCountryAndSelect("pe");

      // Checks that email is pre-filled
      expect(await orderPage.getFormEmailId()).toBe(usersLoginData.userOne.email);
      
      // Places order
      await orderPage.placeOrder();

      // Gets to "thankyou" page
      const thanksPage = poManager.getThanksPage();
      expect (await thanksPage.getThanksMessage()).toContain("Thankyou for the order.");
      const orderId = await thanksPage.getOrderId()?? "";
      
      // Navigates to My Orders
      await dashboardPage.goToMyOrders();

      // Confirms orderID and goes into view order details
      const myOrdersPage = poManager.getMyOrdersPage();
      await myOrdersPage.searchOrderAndClickOnViewDetails(orderId);
        
      // Views and confirms orderId in order details
      const orderDetailsPage = poManager.getOrdersDetailsPage();
      const orderIdDetails = await orderDetailsPage.getOrderId();
      expect(orderId).toContain(orderIdDetails);
    })

    test.afterAll("Clean up orders using API requests", async ({ request }) => {
      const baseUrl = "https://rahulshettyacademy.com";
      const apiUtils = new ApiUtils(request, baseUrl);
      const response = await apiUtils.loginAndGetToken();
      const token = response.token;
      const userId = response.userId;
      await apiUtils.cleanUpOrders(token, userId);
    });
  })
});
