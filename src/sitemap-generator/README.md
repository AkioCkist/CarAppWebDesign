# Sitemap Generator

This project is a simple sitemap generator that creates XML sitemaps for websites. It fetches URLs from a specified source and formats them into a sitemap structure suitable for submission to Google Search Console.

## Project Structure

```
sitemap-generator
├── src
│   ├── index.js           # Entry point of the application
│   ├── sitemapGenerator.js # Contains the function to generate the sitemap
│   └── utils
│       └── urlFetcher.js   # Fetches URLs from a specified source
├── package.json           # Configuration file for npm
├── .gitignore             # Specifies files to be ignored by Git
└── README.md              # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd sitemap-generator
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To generate a sitemap, run the following command:

```
node src/index.js
```

You can customize the URL fetching process by modifying the `fetchUrls` function in `src/utils/urlFetcher.js`.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.