# BoardInfinityBackendTask

BoardInfinity App

## Installation
	
Use the following command to install NodeJS in Ubuntu.

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```
To check th version of NodeJs

```bash
nodejs -v
```

## How to run the application

First go to application folder and run below command
and then go to client folder and run below command again

```
npm install
```
to Run the application hit below command 

```bash
 npm start
```
after that you can check all API using POSTMAN/CURL that running on PORT 4000.

## Routes

```bash /api/v1.0/user/signup ``` --> for signup the user.

BODY {
    "firstName": "XXXX",
    "lastName": "XXXXX",
    "email": "XXXXX",
    "password": "XXXX",
    "mobileno": "+91 XXXXXXXXXX",
    "userType": "USER/OWNER/ADMIN"
}

RESPONSE {
    "token": "XXXXXXXX"
}

```bash /api/v1.0/user/login ``` --> for login the user.

BODY {
    "email": "XXXXXX",
    "password": "XXXXXX"
}

RESPONSE {
    "token": "XXXXXXXX"
}

```bash /api/v1.0/admin ``` --> for route is having access of admin then the owner will also have access for that route.

HEADERS {
	x-auth-token: XXXXXXXX
}

```bash /api/v1.0/owner ``` --> for route is having access of owner then admin or user can't access it.

HEADERS {
	x-auth-token: XXXXXXXX
}

```bash /api/v1.0/user ``` --> for router is having access of user then the owner and admin will be restricted for that route.

HEADERS {
	x-auth-token: XXXXXXXX
}

```bash /api/v1.0/forget/password ``` --> for send email to reset password.

BODY {
    "email": "besta@plussmail.com"
}

```bash /reset/password?token=XXXXXXXX ``` --> Reset the password using this link.

BODY {
    "password": "XXXXXXXX"
}

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)


