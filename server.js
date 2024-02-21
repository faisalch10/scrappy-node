const puppeteer = require('puppeteer');
const { createObjectCsvWriter } = require('csv-writer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  await page.goto('https://carbooth.ca/marketplace/');

  const cars = await page.evaluate(() => {
    const carElements = document.querySelectorAll(
      '.vehica-car-card-row-wrapper'
    );
    const cars = [];
    carElements.forEach(element => {
      const name = element
        .querySelector('.vehica-car-card-row__name')
        .textContent.trim();
      const imageLink = element
        .querySelector('.vehica-car-card__image')
        .querySelector('img')
        .getAttribute('src');
      const price = element
        .querySelector('.vehica-car-card__price-mobile')
        .textContent.trim();
      const year = element
        .querySelector('.vehica-car-card__info__single:nth-child(1) span')
        .textContent.trim();
      const mileage = element
        .querySelector('.vehica-car-card__info__single:nth-child(2) span')
        .textContent.trim();
      const transmission = element
        .querySelector('.vehica-car-card__info__single:nth-child(3) span')
        .textContent.trim();
      const fuelType = element
        .querySelector('.vehica-car-card__info__single:nth-child(4) span')
        .textContent.trim();
      const driveType = element
        .querySelector('.vehica-car-card__info__single:nth-child(5) span')
        .textContent.trim();
      cars.push({
        name,
        imageLink,
        price,
        year,
        mileage,
        transmission,
        fuelType,
        driveType,
      });
    });
    return cars;
  });

  await browser.close();

  const csvWriter = createObjectCsvWriter({
    path: 'cars.csv',
    header: [
      { id: 'name', title: 'Name' },
      { id: 'imageLink', title: 'Image Link' },
      { id: 'price', title: 'Price' },
      { id: 'year', title: 'Year' },
      { id: 'mileage', title: 'Mileage' },
      { id: 'transmission', title: 'Transmission' },
      { id: 'fuelType', title: 'Fuel Type' },
      { id: 'driveType', title: 'Drive Type' },
    ],
  });

  await csvWriter.writeRecords(cars);

  console.log('CSV file has been saved.');
})();
