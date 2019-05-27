# Node.js oAuth Demo App - Salesforce as IDP
This is a demo application that showcases an implementation of oAuth from Salesforce in Node.js. 

## Installation
Firstly, setup your Salesforce Org with a [connected app](https://trailhead.salesforce.com/en/projects/workshop-electric-imp/steps/connected-app-setup). Remember! You will have to come back here and update your callback URL once you get it. 

### Building the App locally
Before you start, make sure you've got Redis running locally. (If not, it's okay - [we can wait](https://redis.io/topics/quickstart))

Firstly, clone (or fork and clone) the App.
````
git clone https://github.com/adamSellers/Salesforce-oAuth-Demo.git
````
Change directories and install stuff
````
cd Salesforce-oAuth-Demo && npm install
````
Create the .env file
````
touch .env
````
Then add the following config vars
````
CLIENTID={your salesforce client id}
CLIENTSECRET={your salesforce client secret}
CALLBACKURL=http://localhost:3001/salesforce/auth
REDISSECRET={A super secret string}
REDIS_URL={your redis URL}
SALESFORCE_ENDPOINT={your salesforce login endpoint, ie https://login.salesforce.com or a community URL}
````
remember, head back to your connected app and update that Callback URL!

Once all that is done, you are good to go!
````
npm start
````
Then navigate to [http://localhost:3001](http://localhost:3001) to get started.

### Or you can do it much easier in Heroku.. 
[![Heroku Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/adamSellers/Salesforce-oAuth-Demo.git) 

Once you have your app, be sure to set the following Config Vars:

1. CLIENTDID: This is your Salesforce connected app client ID. 
2. CLIENTSECRET: This is your Salesforce connected app secret.
3. CALLBACKURL: this will be https://{YOURAPPNAME}.herokuapp.com/salesforce/auth
4. SALESFORCE_ENDPOINT: this is your login endpoint for SF (eg: https://login.salesforce.com or a community URL)

Then let the hapiness commence!