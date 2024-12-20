# Package Delivery System

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Running the Project

Note that you must run the frontend and the backend of the project simultaneously. In our case, for the backend, the port was set to 7086 in the .env.local file.

## Running the Frontend

After cloning the project, be sure to a valid .env.local under `/frontend` like so:

```sh
AUTH_SECRET=""

NODE_TLS_REJECT_UNAUTHORIZED=0

NEXT_PUBLIC_BACKEND_URL="https://localhost:7086"
```

Be sure that the port of the backend corresponds to the port your backend instance is running on.

First, run install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

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

#### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Running the Backend

1. Download Visual Studio Community Edition - https://visualstudio.microsoft.com/downloads/. Download asp .net within Visual Studio as well.

2. You **may** have to download SDK 8.0.403 - https://dotnet.microsoft.com/en-us/download/dotnet/8.0.

3. Clone the project onto your computer.

4. Open the project using Visual Studio, in the following directory: SOEN343_Omnivox_2\backend\backend.

5. Open a terminal in the directory mentioned in step 4 and run the command: dotnet restore

6. In the same directory, run the command: setx ASPNETCORE_ENVIRONMENT "Development"

7. Restart your Visual Studio

8. Run the project.
