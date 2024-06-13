var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const dotenv = require("dotenv");
const { Server } = require('socket.io');
const connectDB = require('./config/database')
const api = require('./api')
const io = new Server({
  cors: {
    origin: "http://localhost:5173"
  }
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

dotenv.config();
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173']
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

let onlineUser = [];

const addNewUser = (userId, socketId) => {
  !onlineUser.some((user) => user.userId == userId) &&
    onlineUser.push({ userId, socketId })
}

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId == userId)
}

io.on('connection', (socket) => {

  socket.on("newUser", (userId) => {
    addNewUser(userId, socket.id)
  })
  socket.on("sendNotification", ({ senderId, receiverId, courseId, title, body }) => {
    console.log(receiverId)
    const receiver = getUser(receiverId);
    io.to(receiver?.socketId).emit("getNotification", {
      senderId,
      courseId,
      title: title,
      body: body
    })
  })
  socket.on("disconnect", () => {
    removeUser(socket.id)
  })
});

io.listen(5000)

app.use('/api', api);

app.use(function (req, res, next) {
  console.log('404');
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
