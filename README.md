# Social Media API [![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Overview
A Social Media API designed to manage users, their posts (termed "thoughts"), and reactions to these posts. It includes functionalities like creating, updating, and deleting user profiles and posts, as well as managing reactions and user connections through adding and removing friends.

## Table of Contents
- [Features](#features)
- [Usage](#usage)
- [Contributing](#contributing)
- [Social Media API Tutorial Video](#social-media-api-tutorial-video)
- [Questions](#questions)
- [Credits](#credits)
- [License](#license)

## Features

1. User Model

    * Manages user data with fields for 'username', 'email', and arrays for 'thoughts' and 'friends'. The 'username' and 'email' fields are required and must be unique. The userRoutes in combination with the userController allows for creating, updating, and deleting users as well as adding and removing friends.

2. Thought Model

    * Manages thought data with fields for 'thoughtText', 'createdAt', 'username', and an array for 'reactions'. This represents thoughts posted by various users. The thoughtRoutes in combination with the thoughtController allows for creating, updating, and deleting thoughts. These thoughts are linked to users via MongoDB's 'ObjectId' references.

3. Reaction Schema

    * A subdocument in the Thought model used to store reactions to thoughts. Each reaction has a 'reactionBody', 'username', and 'createdAt' field.

4. Virtuals

    * We have implemented virtuals in the User and Thought models to allow dynamic tracking of 'reactionCount' and 'friendCount'.

5. Seeding

    * A seed file has been included for seeding of initial data for development and testing purposes, ensuring that duplicate entries are avoided and that the database is populated with initial data correctly.

6. User Data

    * The models and controllers are designed in a way to ensure that when a user is deleted, all associated thoughts are also removed, preventing orphaned data from cluttering the database.

7. Technologies Used

    * JavaScript
    * Express.js
    * MongoDB
    * Mongoose
    * Nodemon
    * VSCode
    * Git Bash
    * GitHub

## Usage

To use this API, follow these steps:

    1. Clone the repository

    2. Install necessary dependencies using command "npm install" in your terminal

    3. Optional - Seed your database with the initial data provided using command "npm run seed" in your terminal

## Contributing

To contribute to this project, follow these steps:

    1. Fork the repository

    2. Create a new branch for your contribution

    3. Make your changes and commit them

    4. Push your local branch to the remote repository and submit a pull request

## Social Media API Tutorial Video

To view the successful testing of this API, click [here](https://drive.google.com/file/d/1ud2H61gVAObP5pFZSt5cuARcnAVptl0k/view).

## Questions
You can find my GitHub profile [here](https://www.github.com/JoshMassa). 

If you have any questions, you can email me by clicking [here](mailto:joshuamassapelletier@outlook.com).

## Credits

Mongoose Docs - https://mongoosejs.com/docs/index.html

## License

This project is covered under the GPL v2.0 license.

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)