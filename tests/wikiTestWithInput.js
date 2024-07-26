const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const readline = require("readline");

// Check whether a given url is a valid wikipedia link
function isWikipediaLink(url) {
  const regex = /^https:\/\/en\.wikipedia\.org\/wiki\/.+/;
  return regex.test(url);
}

// based on the given url to scrape wikipedia pages
async function scrapeWikipediaPage(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const foundLinks = [];

    $('a[href^="/wiki/"]').each((index, element) => {
      const href = $(element).attr("href");
      const fullUrl = `https://en.wikipedia.org${href}`;
      foundLinks.push(fullUrl);
    });

    return foundLinks;
  } catch (error) {
    console.error(`Error occurred while scraping ${url}: ${error.message}`);
    return [];
  }
}

/*
 * write the result to a jason file (total links count, unique links count and the unique link urls)
 */
function writeToJsonFile(results, filename) {
  const data = {
    "total Links count": results.length,
    "unique links count": new Set(results).size,
    uniqueLinks: [...new Set(results)],
    links: results,
  };

  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`Results written to ${filename}`);
}

// Main function to execute the script
async function main(wikiLink, nCycles) {
  //Check whether the input url is valid wikipedia link
  if (!isWikipediaLink(wikiLink)) {
    throw new Error("Invalid Wikipedia link provided.");
  }

  // Check whether the input number of cycles is a number between 1 and 3
  if (!Number.isInteger(nCycles) || nCycles < 1 || nCycles > 3) {
    throw new Error(
      "Invalid number of cycles. Please provide an integer between 1 and 3."
    );
  }

  let visitedLinks = new Set();
  let results = [];
  let queue = [wikiLink];

  for (let cycle = 0; cycle < nCycles; cycle++) {
    let newLinks = [];

    while (queue.length > 0) {
      const currentLink = queue.shift();

      if (visitedLinks.has(currentLink)) {
        continue;
      }

      visitedLinks.add(currentLink);
      console.log(`Visiting: ${currentLink}`);

      const scrapedLinks = await scrapeWikipediaPage(currentLink);
      newLinks.push(...scrapedLinks);

      if (results.length >= 10) {
        break;
      }
    }

    queue.push(...newLinks);
    results.push(...newLinks);
  }

  const jsonFilename = "wikipedia_links.json";
  writeToJsonFile(results, jsonFilename);
  console.log(`Total links found: ${results.length}`);
  console.log(`Unique links found: ${new Set(results).size}`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Enter a wikipedia link url, the number of cycles, then start to execute the script
rl.question("Please enter a Wikipedia link: ", (wikipediaLink) => {
  rl.question("Please enter the number of cycles (1-3): ", (nCycles) => {
    nCycles = parseInt(nCycles, 10);

    main(wikipediaLink, nCycles)
      .then(() => {
        console.log("Process completed successfully.");
        rl.close();
      })
      .catch((error) => {
        console.error(`Error in main function: ${error.message}`);
        rl.close();
      });
  });
});

// Example use and input
// node wikiTestWithInput.js
// https://en.wikipedia.org/wiki/Moon
// 2
