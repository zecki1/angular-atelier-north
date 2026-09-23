import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('navegação', () => {
  test('home carrega e acessa as demais páginas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(/Atelier|Design/i, { timeout: 15_000 });

    await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Trabalho' }).click();
    await expect(page).toHaveURL(/\/work/);
    await expect(page.getByRole('heading', { level: 1, name: /Seleção/ })).toBeVisible();

    await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Sobre' }).click();
    await expect(page).toHaveURL(/\/about/);

    await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Contato' }).click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.getByRole('heading', { level: 1, name: /Vamos/ })).toBeVisible();
  });

  test('work filtra e pagina a listagem', async ({ page }) => {
    await page.goto('/work');
    await expect(page.getByRole('heading', { level: 1, name: /Seleção/ })).toBeVisible();

    const activePage = () => page.locator('button[aria-current="page"]');

    await page.getByText('Web', { exact: true }).first().click();
    await expect(page.locator('article')).toHaveCount(6);
    await expect(activePage()).toHaveText('1');

    await page.getByRole('button', { name: 'Próxima página' }).click();
    await expect(page.locator('article')).toHaveCount(6);
    await expect(activePage()).toHaveText('2');
  });
});

test.describe('acessibilidade', () => {
  test('sem violações graves ou críticas nas 4 páginas', async ({ page }) => {
    for (const path of ['/', '/work', '/about', '/contact']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page }).analyze();
      const majors = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(majors, `violações em ${path}`).toEqual([]);
    }
  });
});