# chat-app

Please follow the below steps to run this application.

1. Clone the code in your local machine from github.
2. Run the npm install or npm i command in this folder.
3. Please check MongoDB is installed in your machine or not. Please install, if it is not installed.
4. Run npm start command to run the application
5. Then you can open the below link in your browser: http://localhost:4000

API details:

<!-- To save message -->
Request URL : http://localhost:4000/api/messages
Request Method : POST
Request Body : {
    sender : "ABC",
    receiver : "",
    room : "PQR",
    message : "Hi, How are you?",
    createdAt: "12-12-2020"
}

<!-- To get all messages -->
Request URL : http://localhost:4000/api/messages
Request Method : GET

<!-- To get only latest messages -->
Request URL : http://localhost:4000/api/messages?message=latest
Request Method : GET

<!-- To update read flag -->
Request URL : http://localhost:4000/api/messages
Request Method : PUT
Request Body : {
    _id: "message_id"
}

Note: To perform private chat you have to follow the below steps:
1. Enter you name and submit.
2. You have to select with whom you want to send message. So when you will get any user in left before sending this you have to select. After select send him message.

Happy Coding!!