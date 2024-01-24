# Shopify App Template - Node

This is a template for building a [Shopify app](https://shopify.dev/docs/apps/getting-started) using Node and React. It contains the basics for building a Shopify app.


## Backend Architecture Overview

The backend of our application is structured into three main components, each with a specific responsibility:

    1. router.js (Routing): This file contains all the routes of the application. It acts as the entry point for incoming requests and directs them to the appropriate controller based on the URL and HTTP method.

    1. controllers.js (Request Handling): This file consists of controllers that handle incoming requests. Controllers process the data sent in the request, perform the required operations, and return the appropriate responses. They act as an intermediary between the frontend requests and backend database operations.

    1. models.js (Database Interactions): This file includes models that directly interact with the database. It contains the logic for querying, updating, and manipulating the database based on the requirements of the controllers. Models ensure that the data in the database is correctly accessed and modified as per the business logic.

This modular architecture helps in maintaining a clean separation of concerns, making the application easier to manage, understand, and develop further.

## Interaction Flow and Backend Integration

    • Checkbox Interaction: Whenever a user interacts with a checkbox in the UI, the checkedItems array is updated. This array keeps track of all selected product IDs.

    • Save Operation: When the "Save" button is clicked, the checkedItems array, along with the checkoutToken, is sent to the backend. This request includes the sessionToken in the request headers to ensure proper authorization.

    • Backend Processing: Upon receiving the request, the backend updates the database. It stores an entry in the savedcart table, which consists of two columns:
        • checkoutToken: A unique token representing the checkout session.
        • products: A JSON string containing an array of the selected product IDs.

## API Integration



The component interacts with two main API endpoints:

    1. Save Selected Items
        Endpoint: POST https://{redirect_urls}/api/addCart
        Payload:
            checkoutToken (String): Token representing the checkout session.
            productIds (Array): IDs of the selected products.
        Response: A confirmation message upon successful operation.

    2. Clear Saved Items
        Endpoint: POST https://{redirect_urls}/api/deleteCart
        Payload:
            checkoutToken (String): Token representing the checkout session.
        Response: A confirmation message upon successful clearing of items.

