const puppeteer = require('puppeteer');
const { createObjectCsvWriter } = require('csv-writer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  await page.goto('https://carbooth.ca/marketplace/');

  const cars = await page.evaluate(() => {
    const carElements = document.querySelectorAll(
      '.vehica-car-card-row-wrapper.vehica-car'
    );
    const cars = [];
    carElements.forEach(element => {
      const id = element.getAttribute('data-id');
      const name = element
        .querySelector('.vehica-car-card-row__name')
        .textContent.trim();
      const srcsetAttribute = element
        .querySelector('.vehica-car-card__image')
        .querySelector('img')
        .getAttribute('srcset');
      const srcsetArray = srcsetAttribute.split(',');
      const imageLink = srcsetArray[0].trim().split(' ')[0];
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
      const link = element
        .querySelector('.vehica-car-card-link')
        .getAttribute('href');
      cars.push({
        id,
        name,
        imageLink,
        price,
        year,
        mileage,
        transmission,
        fuelType,
        driveType,
        link,
      });
    });
    return cars;
  });

  await browser.close();

  const csvWriter = createObjectCsvWriter({
    path: 'cars.csv',
    header: [
      { id: 'id', title: 'ID' },
      { id: 'name', title: 'Name' },
      { id: 'imageLink', title: 'Image Link' },
      { id: 'price', title: 'Price' },
      { id: 'year', title: 'Year' },
      { id: 'mileage', title: 'Mileage' },
      { id: 'transmission', title: 'Transmission' },
      { id: 'fuelType', title: 'Fuel Type' },
      { id: 'driveType', title: 'Drive Type' },
      { id: 'link', title: 'Link' },
    ],
  });

  await csvWriter.writeRecords(cars);

  console.log('CSV file has been saved.');
})();
