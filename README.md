![alt](http://i.imgur.com/ZHmiWGx.png)
----
**Monolith** is a web service platform for the [Golden](https://github.com/MrHuds0n/golden) Android Netrunner tournament software.

## Installation:
- Download and install [RethinkDB](https://www.rethinkdb.com/)
- Clone the repository.  
```
git clone http://github.com/mrhuds0n/monolith
cd monolith
```
- Install [Yarn](https://yarnpkg.com/en/docs/install).
- Configure the database.
  - Run `yarn db`
  - Go to [`localhost:8080`](http://localhost:8080)
  - Go to Tables and delete the default database.
  - Create a database `monolith`.

  - Create a file `/src/secret.js` and copy-paste the following:

  ```
  export default {
  	adminPassword: ""
  }
  ```

  - If you're going to be securing your database with an [admin password](https://rethinkdb.com/docs/security/#the-admin-account), edit the entry above with the password.

- In a separate terminal install packages with `yarn`.
- Run `yarn start`. The site should be under [`localhost:3000`](http://localhost:3000).
