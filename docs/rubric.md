### General Purpose
    1. Website allows users to make a accounts and get information based on their preferences.
    2. Merged both external APIs, NY Times and Charity Navigator, in a way that gave user's information valid to them.
    3. Information displayed to users was done so in an easy way to interact with.
    4. The website was navigable with no issues from moving in between pages.
    5. User's could change account info and delete their accounts.
### Security
    1. Implemented user authentication with PassportJS to ensure access to certain information and account info was restricted to logged in users.
    2. Implemented the encryption of passwords to keep user's info safely stored in database.
    3. Deleting account's removed user information entirely from the database.
    4. Updated passwords were also encrypted and replaced the former in the database.
### Backend
    1. Routing was done appropriately to allow for the correct resources to be accessed.
    2. User login status was checked when accessing anything under the '/private' routing, such as app and account pages.
    3. Error handling was implemented so the server would not simply break whenever an error occurred.
    4. Any invalid request was handled appropriately.
### Frontend
    1. Styling made use of Bootstrap and custom CSS to make a friendly user interface.
    2. All HTML and CSS written functioned properly and does not include broken and unimplemented features.
    3. Calls to server done asynchronously and returned useful info.
    4. All calls were error checked.
    5. Information rendered into app and account info pages was done with the correct styling and layout.
    6. All information sent to server about users was sent in correct format for backend to handle.