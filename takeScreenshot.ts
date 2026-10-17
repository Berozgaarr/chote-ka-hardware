import puppeteer from 'puppeteer-core';
import path from 'path';

async function main() {
  const chromePath = path.join(
    process.env.LOCALAPPDATA || '',
    'Google', 'Chrome', 'Application', 'chrome.exe'
  );

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle', '--window-size=1280,800'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Wait for 3D model, textures, and CSS3D iframe to render
  await new Promise(r => setTimeout(r, 2000));

  // 1. Hero 3/4 Perspective View (showing full base puck, logo, spindle, and display)
  await page.evaluate(() => {
    const app = (window as any).__app;
    if (app) {
      app.controls.target.set(0, 1.25, 0);
      app.camera.position.set(2.8, 2.2, 3.8);
      app.controls.update();
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(process.cwd(), 'device_iso_view.png') });

  // 2. Direct Front Elevation View
  await page.evaluate(() => {
    const app = (window as any).__app;
    if (app) {
      app.controls.target.set(0, 1.20, 0);
      app.camera.position.set(0, 1.35, 4.8);
      app.controls.update();
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(process.cwd(), 'device_front_view.png') });

  // 3. Side Profile View (showing thin profile, rotating rod & hinge)
  await page.evaluate(() => {
    const app = (window as any).__app;
    if (app) {
      app.controls.target.set(0, 1.20, 0);
      app.camera.position.set(4.6, 1.35, 0);
      app.controls.update();
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(process.cwd(), 'device_side_view.png') });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(process.cwd(), 'device_side_view.png') });

  // 4. Rear View (showing the rotation rod, hinge barrel, side pivot discs, and rear shell)
  await page.evaluate(() => {
    const app = (window as any).__app;
    if (app) {
      app.controls.target.set(0, 1.3, 0);
      app.camera.position.set(0, 1.8, -4.2);
      app.controls.update();
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(process.cwd(), 'device_rear_view.png') });

  console.log('ALL_VIEWS_SAVED');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
