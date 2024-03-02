import { Page } from '@playwright/test';
import CartPage from './cartPage';
import DashboardPage from './dashboardPage';
import LoginPage from './loginPage';
import MyOrdersPage from './myOrdersPage';
import OrdersDetailsPage from './orderDetailsPage';
import OrderPage from './orderPage';
import ThanksPage from './thanksPage';


export default class POManager {
    page: any;
    cartPage: CartPage;
    dashboardPage: DashboardPage;
    loginPage: LoginPage;
    myOrdersPage: MyOrdersPage;
    ordersDetailsPage: OrdersDetailsPage;
    orderPage: OrderPage;
    thanksPage: ThanksPage;
    
    
    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.myOrdersPage = new MyOrdersPage(this.page);
        this.ordersDetailsPage = new OrdersDetailsPage(this.page);
        this.orderPage = new OrderPage(this.page);
        this.thanksPage = new ThanksPage(this.page);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getDashboardPage() {
        return this.dashboardPage;
    }

    getMyOrdersPage() {
        return this.myOrdersPage;
    }

    getOrdersDetailsPage() {
        return this.ordersDetailsPage;
    }

    getOrderPage() {
        return this.orderPage;
    }

    getThanksPage() {
        return this.thanksPage;
    }

    getCartPage() {
        return this.cartPage;
    }
}


