# Whale Xe - Car Rental Application

![Whale Xe](public/logo/logo.png)

## Overview

Whale Xe is a modern, responsive web application for car rentals built with Next.js and Tailwind CSS. The platform allows users to search for vehicles, compare options, and make reservations seamlessly. Our goal is to provide a delightful car rental experience with an intuitive interface and comprehensive features.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Development](#development)
  - [Running the Development Server](#running-the-development-server)
  - [Code Style and Linting](#code-style-and-linting)
  - [Component Development](#component-development)
- [Building and Deployment](#building-and-deployment)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User-friendly Interface**: Clean and intuitive design for easy navigation
- **Vehicle Search**: Filter cars by location, dates, and vehicle type
- **Booking System**: Seamless reservation process
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dynamic Content**: Latest news and fleet information
- **FAQ Section**: Common questions answered for better user experience

## Project Structure

The project is organized as follows:

```
app/
├── api/                  # API routes
├── components/           # Shared components
├── fonts/                # Custom fonts
├── layout.js             # Root layout
├── page.js               # Home page
└── ...                   # Other pages and folders
public/
├── logo/                 # Logo and branding assets
├── images/               # Images used in the project
└── ...                   # Other static assets
styles/
├── globals.css           # Global styles
└── ...                   # Other style files
package.json              # Project metadata and dependencies
next.config.js            # Next.js configuration
tailwind.config.js        # Tailwind CSS configuration
```

## Getting Started

To get started with Whale Xe, follow these steps:

### Prerequisites

Ensure you have the following installed:

- Node.js (14.x or later)
- npm or Yarn
- PostgreSQL (for the database)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/whale-xe.git
   cd whale-xe
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the database:

   ```bash
   # Create a new PostgreSQL database
   createdb whalexe

   # Run migrations
   npm run migrate
   ```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/whalexe
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Development

During development, you can use the following commands:

- `npm run dev` or `yarn dev`: Start the development server
- `npm run build` or `yarn build`: Build the project for production
- `npm run start` or `yarn start`: Start the production server

### Running the Development Server

To run the development server, use the following command:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Code Style and Linting

We use ESLint and Prettier for code quality and formatting. To check for issues, run:

```bash
npm run lint
# or
yarn lint
```

To automatically fix issues, run:

```bash
npm run lint:fix
# or
yarn lint:fix
```

### Component Development

For developing components in isolation, we recommend using [Storybook](https://storybook.js.org/). To start Storybook, run:

```bash
npm run storybook
# or
yarn storybook
```

## Building and Deployment

To build and deploy the application, follow these steps:

1. Build the project:

   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:

   ```bash
   npm run start
   # or
   yarn start
   ```

For deployment, we recommend using [Vercel](https://vercel.com/), as it provides seamless integration with Next.js applications. Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Integration

Whale Xe integrates with various APIs for data and functionality:

- **Payment Gateway**: Secure payment processing
- **Maps and Geolocation**: Location services for finding vehicles
- **Email Service**: Sending booking confirmations and notifications

## Contributing

We welcome contributions to Whale Xe! To contribute, follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them
4. Push to your forked repository
5. Create a pull request describing your changes

Please ensure your code follows the project's coding standards and passes all tests.

## License

Whale Xe is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This README was generated with ❤️ by the Whale Xe team.
