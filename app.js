const path = require('path');
// external modules
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');

// local modules
const hostRouter = require("./routes/host");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const rootdir = require("./util/rootdir");
const errorCon = require("./controllers/error");
const razorpayRoutes = require('./routes/razorpay');

const DB_PATH = "mongodb+srv://harshsinha:SYYI3oAhWZaFZo99@cluster0.0tjinsk.mongodb.net/air?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
    uri: DB_PATH,
    collection: 'sessions'
});

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
    secret: 'Coding',
    resave: false,
    saveUninitialized: true,
    store: store
}));

// Custom middleware to set isLoggedIn
app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    next();
});

// Routers and static files
app.use(userRouter);
app.use('/host', hostRouter);
app.use(authRouter);
app.use(express.static(path.join(rootdir, 'public')));
app.use('/razorpay', razorpayRoutes);

// Error handler (should be last)
app.use(errorCon.geterror);

const port = 4007;

mongoose.connect(DB_PATH).then(() => {
    app.listen(port, () => {
        console.log(`Server running on address http://localhost:${port}`);
    });
}).catch(err => {
    console.log('Error while connecting to mongo ', err);
});