Write a simple script which:

1. Accepts a Wikipedia link - return/throw an error if the link is not a valid wiki link
2. Accepts a valid integer between 1 to 3 - call it n
3. Scrape the link provided in Step 1, for the first 10 unique (not previously added already) wiki links embedded in the page and store them in a data structure of your choice.
4. Repeat Step 3 for all newly found links and store them in the same data structure
5. This process should terminate after n cycles.

Optional:

1. Optimize your code not to visit any links you've already visited.
2. Write the results ( all found links, total count, unique count ) to a CSV/JSON file.

To run the script, from the Visual Code terminal using the following command:

node .\tests\wikiTestWithInput.js
Then enter a Wikipedia link, for example https://en.wikipedia.org/wiki/Moon
Then enter the number of cycles, for example 2

An example is as follows:
Please enter a Wikipedia link: https://en.wikipedia.org/wiki/Moon
Please enter the number of cycles (1-3): 2
Visiting: https://en.wikipedia.org/wiki/Moon
Visiting: https://en.wikipedia.org/wiki/Main_Page
Results written to wikipedia_links.json
Total links found: 2658
Unique links found: 1647
Process completed successfully.
