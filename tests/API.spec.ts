import {test, expect, request} from '@playwright/test';
// const tokenValue = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWRlNWU5YWE4NmY4Zjc0ZGM4OWVjMzAiLCJ1c2VyRW1haWwiOiJRQTJAdGVzdGVyLmNvbSIsInVzZXJNb2JpbGUiOjU1NTU1NTU1NTUsInVzZXJSb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MDkwNzIwNDksImV4cCI6MTc0MDYyOTY0OX0.n-udeFNEkj3G0RTOnshhegAbblTkSXqoTwxzw5nXKiw"
const tokenValue = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWRjZWU5OGE4NmY4Zjc0ZGM4ODQ0ZjEiLCJ1c2VyRW1haWwiOiJRQUB0ZXN0ZXIuY29tIiwidXNlck1vYmlsZSI6NTU1NTU1NTU1NSwidXNlclJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcwOTEzOTE5NywiZXhwIjoxNzQwNjk2Nzk3fQ.EbMigbIb5SmjiTRvMNHkA_ssc5ApMYemZVsb_hCMiYk"
test.describe("API Test", () => {
  // test.use({ storageState: "notLoggedInState.json" });
  test ("API Test", async ({page}) => 
  {
    await page.addInitScript(value => {
      window.localStorage.setItem('token',value);
    }, tokenValue);
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerlink*='myorders']").click();
  });

  test ("API Test 2 ", async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/client");
  });
});