import { test, expect } from '@playwright/test';

test.describe('ShopNest — Add to cart', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('adds Wireless Mouse to cart and shows success toast', async ({ page }) => {
    await page.getByTestId('add-to-cart-wireless-mouse').click();

    await expect(page.getByRole('status')).toHaveText('Item added to cart!');
    await expect(page.getByLabel('Cart item count')).toHaveText('1');
  });

});
