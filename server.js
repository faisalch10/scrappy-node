const puppeteer = require('puppeteer');
const { createObjectCsvWriter } = require('csv-writer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  await page.goto('https://carbooth.ca/marketplace/');

  const carLinks = await page.evaluate(() => {
    const linkElements = document.querySelectorAll('.vehica-car-card-link');
    const links = [];
    linkElements.forEach(element => {
      const link = element.getAttribute('href');
      const id = element
        .closest('.vehica-car-card-row-wrapper')
        .getAttribute('data-id');
      const price = element
        .closest('.vehica-car-card-row-wrapper')
        .querySelector('.vehica-car-card__price-mobile')
        .textContent.trim();
      const mileage = element
        .closest('.vehica-car-card-row-wrapper')
        .querySelector('.vehica-car-card__info__single:nth-child(2) span')
        .textContent.trim();
      const name = element
        .closest('.vehica-car-card-row-wrapper')
        .querySelector('.vehica-car-card-row__name')
        .textContent.trim();
      links.push({ id, name, link, price, mileage });
    });
    return links;
  });

  const cars = [];
  for (const { id, name, link, price, mileage } of carLinks) {
    await page.goto(link);

    const carData = await page.evaluate(() => {
      const attributes = document.querySelectorAll(
        '.vehica-car-attributes-grid .vehica-grid__element'
      );
      const data = {};
      attributes.forEach(attribute => {
        const name = attribute
          .querySelector('.vehica-car-attributes__name')
          .textContent.trim()
          .replace(':', '');
        const value = attribute
          .querySelector('.vehica-car-attributes__values')
          .textContent.trim();
        data[name] = value;
      });
      const imageLink = document
        .querySelector('.vehica-swiper-wrapper [data-index="0"]')
        .getAttribute('data-src');
      data['ImageLink'] = imageLink;
      return data;
    });

    carData['id'] = id;
    carData['Name'] = name;
    carData['Price'] = price;
    carData['Mileage'] = mileage;
    carData['Link'] = link;
    cars.push(carData);
  }

  await browser.close();

  const csvWriter = createObjectCsvWriter({
    path: 'car_data.csv',
    header: [
      { id: 'id', title: 'ID' },
      { id: 'Name', title: 'Name' },
      { id: 'Condition', title: 'Condition' },
      { id: 'Make', title: 'Make' },
      { id: 'Model', title: 'Model' },
      { id: 'Year', title: 'Year' },
      { id: 'Kilometers', title: 'Kilometers' },
      { id: 'Engine Size', title: 'Engine Size' },
      { id: 'Fuel Type', title: 'Fuel Type' },
      { id: 'Transmission', title: 'Transmission' },
      { id: 'Cylinders', title: 'Cylinders' },
      { id: 'Drive Type', title: 'Drive Type' },
      { id: 'Color', title: 'Color' },
      { id: 'Dealership', title: 'Dealership' },
      { id: 'Price', title: 'Price' },
      { id: 'ImageLink', title: 'Image Link' },
      { id: 'Mileage', title: 'Mileage' },
      { id: 'Link', title: 'Link' },
    ],
  });

  await csvWriter.writeRecords(cars);

  console.log('CSV file with car data has been saved.');
})();
