# Serverless SaaS Boilerplate

This project is started with the [Serverless SaaS Boilerplate](https://serverless.page/), a React starter-kit that is bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

For the most up-to-date documentation go to: [serverless-saas.sidepage.co](https://serverless-saas.sidepage.co)

## Get Started

The first time you setup a new project you can run `npm run install:initial`. This will install all dependencies in both the root and /functions directory. It will also copy the the `.env.local.example` file and rename it to `env.local` (you still need to update this with your credentials later). After running this command (or doing the steps manually), you should be able to run `npm run dev` to start the server on [localhost:3000](http://localhost:3000).

To be able to use all features included in this starter kit you need to set up a couple of things before you can use them. It might take you up to an hour to completely set up everything you need. Please follow the instructions for each subject in order for it to work (order does not matter):

1. Set up NetlifyCMS. [Instructions](#Netlify-CMS).
2. Set up a Firebase project, with Cloud Firestore and Cloud Functions. [Instructions](#Firebase).
3. Create a Stripe account and set up your subscription product. [Instructions](#Payments-with-Stripe).
4. Create a Postmark account and set up your email templates. [Instructions](#Emails-with-Postmark).

When all these steps are completed, make sure you have run `npm install` or `yarn` both inside your project directory as your `/functions` folder and run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To be able login to the admin panel, follow [the instructions](#Admin-dashboard) of the Admin dashboard section.

## Netlify CMS

Netlify CMS is an open-source git-based content management library. Content is stored in your Git repository alongside your code for easier versioning, multi-channel publishing, and the option to handle content updates directly in Git. It's like a UI for editing your markdown files that we use to show the landing page and the blog posts.

- Create a new repository on [Github](https://github.com/)
- Open `cms/config.js` in this project and update `backend.repo` with your new repository name.
- Push the code of this project to this new repo.

You can now start the project with `yarn dev` or `npm run dev`, navigate to `http://localhost:3000/admin`, and select the CMS button that brings you to `/admin/cms`. You can now login with Github and manage the content of the landing page of blog posts with a nice UI. When you make a change you can hit the "Publish" button, this will result in making a commit to your repository with the changes made to the corresponding markdown file.

Note: Before you deploy your application, don't forget to update the `SEO` component with your meta tags.

#### Test

You can use the `test-repo` backend to try out Netlify CMS without connecting to a Git repo. With this backend, you can write and publish content normally, but any changes will disappear when you reload the page.

Note: The test-repo backend can't access your local file system, nor does it connect to a Git repo, thus you won't see any existing files while using it.

To enable this backend, add the `test-repo` string to your `cms/config.js` file:

```
backend: {
    name: 'test-repo',
    ...
},
```

Note: When you deploy your app NOT to Netlify, you need to run your own authentication server to use GitHub authentication for NetlifyCMS. This is already implemented for your with some Cloud Functions (see `/functions/oauth/`), but you still need to follow the steps described [here](#Deploy-on-Vercel) before you deploy to production.

Note: It's recommended to connect your git repo with Vercel (or Netlify) for automatic deployments on each push to the project. When you hit the "publish" button inside the CMS, a commit will be made to your repo that includes the changes you made to the page. With automatic deployments activated this means a deployment will be triggered after you publish any changes. After this deployment, your changes will be live.

## Firebase

Firebase helps you build apps fast, without managing infrastructure. It is built on Google infrastructure and scales automatically, for even the largest apps. It also starts completely free, and when you start to grow you will only pay for what you use.

Before you start creating your Firebase project, be sure you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed globally by running `npm install -g firebase-tools`. We use it to manage and deploy the project to Firebase.

### Create a Firebase project

Go to [https://firebase.google.com/](https://firebase.google.com/), click the "Get started" button, and follow the instructions to create your project.

Once your project is created, you should register your app inside the Firebase console. From the project overview page, click the web icon to add Firebase to your web application. Once created, you will receive your firebase config, which should look something like this:

```jsx
var firebaseConfig = {
  apiKey: 'xxxx',
  authDomain: 'your-project-name.firebaseapp.com',
  databaseURL: 'https://your-project-name.firebaseio.com',
  projectId: 'your-project-name',
  storageBucket: 'your-project-name.appspot.com',
  messagingSenderId: 'xxx',
  appId: 'xxx',
  measurementId: 'G-xxx',
};
```

We should now activate the signup methods that we would like to add to our app. Navigate to "Authentication" and start by activating the "Email/password" method.

### Cloud Firestore

Cloud Firestore](https://firebase.google.com/docs/firestore) is a flexible, scalable database from Firebase. It offers seamless integration with Firebase and other Google Cloud Platform products, like Cloud Functions. And just like Firebase, it starts completely free. Only when your application starts to scale, you might exceed the free plan, but even then you only pay for what you use.

To setup Firestore, go to your Firebase console and navigate to "Database" and click the first "Create database" button to add Cloud Firestore to your project.

We need the save our Firebase configuration to some [environment variables](https://nextjs.org/docs/basic-features/environment-variables).

Next.js comes with built-in support for environment variables, which allows you to [use `.env.local` to load environment variables](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables) and [expose environment variables to the browser](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser).

Go to your `.env.local` file (or create it if it's not there yet). Then, past in the example below and change the dummy data with your Firebase credentials.

```jsx
NEXT_PUBLIC_FIREBASE_API_KEY = 'yourapikey';
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'yourappname.firebaseapp.com';
NEXT_PUBLIC_FIREBASE_DATABASE_URL = 'https://yourappname.firebaseio.com';
NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'yourappname';
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'yourappname.appspot.com';
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'yoursenderid';
NEXT_PUBLIC_FIREBASE_APP_ID = 'yourappid';
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = 'yourmeasurementid';
```

Keep in mind that when you deploy your application, you first need to set your production environment variables. When deploying on [Vercel](https://vercel.com) you can configure secrets in the [Environment Variables](https://vercel.com/docs/v2/build-step#environment-variables) section of the project in the Vercel dashboard.

### Cloud Functions

[Cloud Functions](https://firebase.google.com/docs/functions) for Firebase is a serverless framework that lets you automatically run backend code in response to events triggered by Firebase features and HTTPS requests. Your code is stored in Google's cloud and runs in a managed environment. There's no need to manage and scale your own servers.

Cloud Functions are already set up in this project, but you first need to deploy them to your Firebase project before they work: `firebase deploy --only functions`. Make sure you have run `npm run build` inside your `/functions` folder. The easiest way is to just always run `npm run build && firebase deploy --only functions` from your within your `/functions` folder.

The Cloud Functions in this project rely on certain variables. If you want to use all of the functionalities, like updating subscriptions or sending emails, please first follow the instructions to set up Stripe and Postmark before you try this out.

#### Emulators

You cal also run the functions locally by running `firebase emulators:start`. You should build your functions when you make changes, so you probably want to run `npm run build && firebase emulators:start`. You should create a `runtimeconfig.json` file inside your functions folder to use environment variables inside the emulators when developing locally. You can take a look at the example file at `functions/runtimeconfig.example.json`.

Make sure you uncomment the code inside `config/firebase.ts` to let the application use the functions emulator.

```
if (process.env.NODE_ENV === 'development') {
  functions.useFunctionsEmulator('http://localhost:5001');
}
```

When you start the emulators you can view the status and logs in the Emulator UI at http://localhost:4000.

### Firebase Security Rules

[Firebase Security Rules](https://firebase.google.com/docs/rules) stand between your data and malicious users. You can write simple or complex rules that protect your app's data to the level of granularity that your specific app requires.

Rules use the following syntax:

```
service <<name>> {
  // Match the resource path.
  match <<path>> {
    // Allow the request if the following conditions are true.
    allow <<methods>> : if <<condition>>
  }
}
```

This starter kit comes with a set of basic Firebase rules and helper functions so you can easily protect your DB.
You can see and manage the rules inside the `firestore.rules` file at the root of this project.

When you make changes to the `firestore.rules`, make sure you deploy them by running `firebase deploy --only firestore:rules`.
You can also access your rules from the Firebase console. Select your project, then navigate to Cloud Firestore and click Rules once you're in the correct database.

### Deploy

To deploy your Functions or Rules simply run `firebase deploy`. You could also specify what you want to deploy, like `firebase deploy --only functions`.

#### Firebase Hosting

`firebase deploy --only hosting:app`

(Firebase Hosting)[https://medium.com/wesionary-team/deploying-next-js-application-on-firebase-platform-using-cloud-function-with-firebase-hosting-920157f03267]

```
// monkey patch to deploy nextServer to firebase functions
// firebase.json

  "functions": {
    ...
    "source": ".",
    "runtime": "nodejs12"
```

then `firebase deploy --only functions:nextServer`

## Payments with Stripe

Stripe is the most popular payment processor for internet businesses. This project comes with Stripe integration for handling subscription payments. For this, we make use of Stripe Checkout and Stripe Billing Customer Portal.

- Stripe Checkout creates a secure, Stripe-hosted payment page that lets you collect payments quickly. It works across devices and is designed to increase your conversion.
- The stripe Customer portal is a secure, Stripe-hosted page that lets your customers manage their subscriptions and billing details.

#### Getting started

Before integrating the customer portal, you must configure its functionality and branding in the Stripe Dashboard. These settings determine the actions that your users can take using the portal. Its features depend on your product and price catalog, so there are different settings for live mode and test mode. Navigate to the portal settings to configure the portal: https://dashboard.stripe.com/test/settings/billing/portal

Set a product catalog
If you allow customers to change their subscriptions, you also need to set a product catalog. This includes the products and prices that your customers can upgrade or downgrade to. The portal displays the following attributes of your product catalog:

- Product: name and description—these attributes are editable in the Dashboard and API.
- Price: amount, currency, and billing interval—these attributes are immutable and can only be set on creation in the Dashboard and API.

Start doing this by following these steps:

- Create a subscription product on stripe and name it, for example, "Pro Plan".
- Add multiple prices to the product, for example, "Hobby: €29" and "Premium: €49".
- Go to `config/stripe.ts` and add the price ID of your just created prices in the plan objects. You can change the values to your needs.
- Get your API keys. To interact with the Stripe API you need to have a Publishable and Secret API key, you can find them in your [Dashboard](https://dashboard.stripe.com/test/apikeys). When in development, you can use the test key token.
- Add them to Firebase with the following command: `firebase functions:config:set stripe.publishable_key=<YOUR PUBLISHABLE KEY> stripe.test_key=<YOUR TEST KEY>`
- Add your Stripe publishable key to `.env.local` like this `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<YOUR PUBLISHABLE KEY>`

Note: make sure you are on the Blaze plan of Firebase, otherwise you cannot connect to an external API (like Stripe).

Note: For testing, you can use credit card number `4242 4242 4242 4242`. Read more about testing with Stripe [here](https://stripe.com/docs/testing).

Note: If you want to start a project locally with the Cloud Functions Emulator, make sure they have access to your environment variables by creating a .runtimeconfig.json. There is an example file inside the project that you can copy and add your variables to. Or if you have already added your variables to firebase you can extract them with this command: `firebase functions:config:get > .runtimeconfig.json`.

Note: Because we use TypeScript, we need to rebuild and run the emulators every time we make a change to our functions. This sucks a little, but luckily it's pretty fast.

```jsx
npm run build && firebase emulators:start
```

## Emails with Postmark

Every SaaS application needs to send some transactional emails. Think about sending a welcome email to new users, an email to invite new users to your company/team, and an email to notify you whenever that a team member has joined.

Sending these types of emails can be done easily with Cloud Functions. You can call the function from your front-end application, or you can listen to changes in your Firestore to trigger an email.

In this project, we have a couple of emails we send out by using [Postmark](https://postmarkapp.com/). This is one of the many email providers that is specialized in sending transactional emails. We have tried out different providers for this starter-kit and found that Postmark is in our opinion the best fit. They provide a higher delivery rate than most other providers and also some great email templates to get started quickly.

If you rather want to use a different provider, you could easily adjust the related Cloud Functions to fit your needs. For example, Sendgrid has a very similar npm package to achieve the same thing. Just make sure you provide the correct link (including the teamId) to the "team invite" email.

This project includes the following Cloud Functions that trigger an email:

- `onNewUserSetup` - This function is automatically called whenever a new user signs up and sends out a welcome email.
- `sendTeamInviteEmail` - This is a callable function and will be called from the `invite/index.ts` page.
- `onTeamMemberCreate` - This function is automatically called whenever a new user signs up and gets added to a team. It sends out an email to the owner of the team to inform. (TODO)

Note: Make sure you replace `http://localhost:3000` with your own domain inside the `sendWelcomeEmail` function before you deploy to production.

#### Get started

To get started you need to do the following:

Setup your account

- Create your account on Postmark (https://account.postmarkapp.com/sign_up).
- Go through the steps to set up your Sender Signature
- Go to Your Server overview, select "API tokens" and generate your API key
- Save your API keys to your Firebase environment variables by running `firebase functions:config:set postmark.api_key=<YOUR_KEY_HERE>`

Create the email templates

- In Postmark, go to your server overview and select "Templates"
- Click the "Add template" button and select the "Welcome" template
- You can adjust this template to your needs, just make sure you provide the dynamic variables in the `onNewUserSetup` function.
- Hit the save button and copy the template ID (usually right above the save button).
- Save your template ID to your Firebase environment variables by running the following command in your terminal: `firebase functions:config:set postmark.welcome_template_id=<TEMPLATE_ID_HERE>`
- Now go back to the template overview and select the "User invitation" template
- Again, you can adjust this template to your needs but make sure you provide the dynamic variables in the `sendTeamInviteEmail` function.
- Hit the save button and copy the template ID
- Save your template ID to your Firebase environment variables by running: `firebase functions:config:set postmark.team_invite_template_id=<TEMPLATE_ID_HERE>`

That's it.

---

## Teams

This project sets you up to built multi-tenant SaaS applications. Here is a quick summary of what is implemented for you. If your application does not require Teams, you could remove all code related to Teams.

#### On Sign up

When a user signs up, we automatically create a team for that user. It's important to understand that this only happens when no team ID is provided during sign up. If we do have a team ID, this means the user is joining an existing team. If you look at the `onUserCreate` Cloud Function inside `functions/users/index.ts` you see that we call the `createTeam` function when a new user document is created (and no team ID is provided). When we create a new team, we make the team ID the same as the user ID so we can easily check the user's plan when team members are logged in (in the `getPlan` helper you can see that we check if the user is a team owner and if not, we check the plan of the team owner).

When a new team is created, another Cloud Function runs to update the team owners' document. The `onTeamCreate` function will set the `isTeamOwner` property to `true` on the user that signed up.

#### Invite members

Team owners can invite new members to their team. Invites are send by calling the Cloud Function `sendTeamInviteEmail` from `pages/account/team`. If you have set up Postmark, then this will send out an email with an invite link. This link will contain the following query params: `teamId=<TEAM_ID>&email=<INVITED_EMAIL>`. When the invited user goes to that page we fetch the Team name and pre-fill the email field. When this user signs up, the same `onUserCreate` functions get called but this time it will not create a team but updates the user inside the team with the given ID. If the user exists on the team, the status will be updated to `active`.

Note: Users can only be part of 1 team. They can't join multiple teams or be both team owner as a member of a different team.

#### How to use

When you want to scope newly created documents to a certain team, it's recommended to create sub-collections inside the team document. For example, a team member creates a "project", you could have the following structure: `/teams/{teamId}/projects`. This way, you can simply fetch all projects of a certain team with `db.collection("teams").doc("team-123").collection("projects").get()`. It's recommended to always save the userId on the project document as well, so you can list all project created by a single users like `db.collection("teams").doc("team-123").collection("projects").where("userId", "==", "user-123").get()`.

You do not have to use sub-collections. A different way would be to save the team ID on the project document, so you can query for all projects with a given teamID. Just keep in mind that this will result in a lot more reads, especially when your application starts to grow. Since Firestore has a pay-for-what-you-use pricing model, it's recommended to think about how you structure your data so you have a little reads/writes as possible. If you do this well, you can start completely free or at least keep your bills very low. Check out this short video on [How to NOT get a 30K Firebase Bill](https://www.youtube.com/watch?v=Lb-Pnytoi-8).

---

## Admin dashboard

When your app is in production and people start to use it, it's nice an admin panel where you can view and edit data of your project. The [Firebase console](https://console.firebase.google.com/) is a great start, but to give you a custom overview of the most important data in your app you might want to build an admin dashboard.

This boilerplate comes with a simple admin dashboard that you can use to build upon. A page with a list of all your users in your database is included. This admin can be extended with any data that you would like to add.

To be able to use the Admin dashboard follow these steps:

- Make sure you have created an account in your app (start the development server, go to `/signup`, and create an account).
- Login to your [Firebase console](https://console.firebase.google.com/) and navigate to "Cloud Firestore".
- Select the user document that is associated with your personal account and update the `isAdmin` property to `true`.
- Go back to your app, log out and login again, and then navigate to `/admin`.
- You should now be able to select the admin button navigate to the admin dashboard at `/admin/dashboard`.

---

## Environment variables

Next.js comes with built-in support for environment variables, which allows you to use .env.local to load environment variables and expose environment variables to the browser.

Steps to set up your environment variables:

- Duplicate the `.env.local.example` file and rename it to `.env.local`
- Enter your project values to the variables

Note: When you deploy your application, you first need to set your production environment variables. When deploying on [Vercel](https://vercel.com/) you can configure secrets in the [Environment Variables](https://vercel.com/docs/build-step#environment-variables) section of the project in the Vercel dashboard.

For Firebase functions you need to add your secrets like API keys with the Firebase CLI. For example:
`firebase functions:config:set stripe.secret="mysecretkey"`

You could create a `runtimeconfig.json` file inside your functions folder to use environment variables inside the emulators when developing locally. You can take a look at the example file at `functions/runtimeconfig.example.json`.

---

## Deployment

When you are ready to deploy your application to production make sure you search for `https://demo.serverless.page/` inside the project and replace it with your base URL (if you haven't done so already). You could choose to host your application on services like Firebase Hosting, Netlify, Vercel, Render, etc. Below you can read some more instructions on which steps to take when you deploy your app.

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import) from the creators of Next.js. Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. Make sure you set up your production environment variables. You can configure secrets in the [Environment Variables](https://vercel.com/docs/build-step#environment-variables) section of the project in the Vercel dashboard.

One important thing to consider when deploying to Vercel is that you need to run your own authentication server to use GitHub authentication for NetlifyCMS. To do this follow these steps:

#### Create an OAuth app

In GitHub, go to your Account Settings, and click Oauth Applications under Developer Settings (or use [this shortcut](https://github.com/settings/developers)).
Select "Register a new application" and fill in your app information. -
You can read more about that in the [documentation](https://www.netlifycms.org/docs/backends-overview/#github-backend) or simply follow [this tutorial](https://docs.netlify.com/visitor-access/oauth-provider-tokens/#setup-and-settings) to set this up. On localhost, you won't find any problems, but when you deploy your application (and not host it on Netlify) you will get a "No Auth Provider Found" message. The authorization callback URL will need to be configured once you have the Firebase Function URL for the service to work.

#### Configure the Firebase environment

Set the `oauth.client_id` and `oauth.client_secret` Firebase environment variables using the values from the GitHub OAuth app:

`firebase functions:config:set oauth.client_id=yourclientid oauth.client_secret=yourclientsecret`

For GitHub Enterprise and GitLab, you will need to set the `oauth.git_hostname` environment variable.

For GitLab you will also need to set the following additional environment variables as specified:

```
oauth.provider=gitlab
oauth.scopes=api
oauth.authorize_path=/oauth/authorize
oauth.token_path=/oauth/token
```

#### Deploy the Cloud Functions

Uncomment the line in `functions/index.ts` that imports the oauth functions and run `yarn deploy:functions`.

### Deploy on Netlify

Before deploying your application to Netlify you have to use the [next-on-netlify](https://github.com/netlify/next-on-netlify) NPM package, a utility for hosting NextJS applications with Server-Side Rendering on Netlify. It wraps your NextJS application in a tiny compatibility layer so that pages can be server-side rendered with Netlify functions. You can follow [these steps](https://www.netlify.com/blog/2020/06/10/2-ways-to-create-server-rendered-routes-using-next.js-and-netlify/) or just check out the README of [next-on-netlify](https://github.com/netlify/next-on-netlify).

### Deploy to Firebase Hosting

If you want to keep everything in one place, you may want to host you application on [Firebase](https://firebase.google.com/docs/hosting) as well. [This tutorial](https://medium.com/wesionary-team/deploying-next-js-application-on-firebase-platform-using-cloud-function-with-firebase-hosting-920157f03267) explains to you all the steps you need to take to make that happen.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
