User Manual

1) In order to run this project the user must have node.js , npm, mysql setup on their system.

For node.js installation :
https://nodejs.org/en/download/stable/
or https://nodejs.org/en/download/package-manager/#osx

For npm installation :
http://blog.npmjs.org/post/85484771375/how-to-install-npm

For mysql installation :
https://www.digitalocean.com/community/tutorials/a-basic-mysql-tutorial

2) Import the sql dump given in the project folder with name realtimeNotification.sql to your mysql database.

3) Change the database connection details in server.js file .

4) For running the node server you have to install the node modules which can be installed using the command npm install (only this command is required as the modules needed as we will use package.json to install node modules).

5)Run the node server using the command :
node server.js

6)Open you web browser and type http://localhost:8000 and tick the checkbox against the user and fields you want to subscribe.


