const SYSTEM_ERROR_HEAD = 'В системе - СБОЙ!';
const E404_ERROR_HEAD = 'Страница не обнаружена!';
const SERVER_PORT = 3000;

var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mysql = require('./queryer');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var crypto = require('crypto');
const sendmail = require('sendmail')();
var messages =require('./messages');

//Настройки

Date.prototype.toISO = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [
        this.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('');
};


app.use('/public', express.static('public'));

app.use(
    session({
        secret: 'HelloMMM',
        store: new FileStore(),
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 3*60*60*1000,
        },
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

require('./auth');

app.use(function(req, res, next){
    if(req.session.passport.user == undefined) {
        app.locals.user = null;
        next();
    } else {
        mysql.getEntity('users', 'id=' + req.session.passport.user).then(users => {
            app.locals.user = users[0];
            next();
        }).catch(error => {
            res.render('error', {error: error, title: SYSTEM_ERROR_HEAD});
        });
    }
});

var createToken = function () {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
}


//Главные страницы

app.get('/', function (req, res) {
    mysql.getEntity('tshirts', '', 'id desc', '3').then(newEntitys => {
        mysql.getEntity('tshirts', '', 'ranking desc', '3').then(bestEntitys => {
            res.render('index', {newEntitys: newEntitys, bestEntitys: bestEntitys, user: app.locals.user});
        }).catch(error => {
            res.render('error', {error: error, title: SYSTEM_ERROR_HEAD});
        });
    }).catch(error => {
        res.render('error', {error: error, title: SYSTEM_ERROR_HEAD});
    });
});

app.get('/about', urlencodedParser, function (req, res) {
    res.render('about', {user: app.locals.user});
});

app.get('/payment', urlencodedParser, function (req, res) {
    res.render('payment', {user: app.locals.user});
});

app.get('/pickup', urlencodedParser, function (req, res) {
    res.render('pickup', {user: app.locals.user});
});

//Аутентификация

var authFun = function (req, res, next) {
    if(req.isAuthenticated()){
        if(req.path == '/auth') res.redirect('/');              
        else next();    
    } else {
        if(req.path == '/auth') next();
        else res.redirect('/auth');     
    }
}

var verifyFun = function (req, res, next) {
    mysql.getEntity('users', 'id=' + req.session.passport.user).then(users => {
        if(users[0].verify == 0) {
            res.redirect('/verify');
        } else if (req.path == '/verify'){
            res.redirect('/');
        }
        next();
    }).catch(error => {
        res.render('error', {error: error, title: SYSTEM_ERROR_HEAD});
    });
}

var doAuth = function (req, res, path) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            res.render('error', {error: err, title: SYSTEM_ERROR_HEAD});
        }
        if (!user) {
            return res.redirect('/auth'); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                res.render('error', {error: err, title: SYSTEM_ERROR_HEAD});
            }
            console.log(user, path)
            return res.redirect(path);
        });
    })(req, res);
}

var doMail = function (mailTo, message) {
    sendmail({ 
        from: 'admin.mmm@yourdomain.com', 
        to: mailTo, 
        subject: message.head, 
        html: message.body, 
    }, function(err, reply) {}); 
}

app.get('/auth', urlencodedParser, authFun, function (req, res) {
    res.render('auth', {isRegistry: req.query.reg, user: app.locals.user});
});

app.post('/auth', urlencodedParser, function (req, res) {
    return doAuth(req, res, '/mypage') 
});

var createUser = function (body, token) {
    return {
        email: body.email,
        password: body.password,
        role: 0, 
        fullName: body.fullName, 
        dateOfBirth: body.date, 
        language: body.language, 
        theme: body.theme, 
        veriryd: 0, 
        token: token
    }
}
app.post('/registry', urlencodedParser, function (req, res) {
    var token = createToken();
    var user = createUser(req.body, token);
    mysql.insertEntity('users', user).then(result => {
        messages.verifyMessage.body = messages.verifyMessage.body.replace("TO_REPLACE", token);
        doMail(user.email, messages.verifyMessage);
        return doAuth(req, res, '/verify');
    }).catch(error => {
       res.render('error', {error: error, title: SYSTEM_ERROR_HEAD});
    });});


app.get('/mypage', urlencodedParser, authFun, verifyFun, function (req, res) {  
    res.send('Hello User');
});

app.get('/logout', urlencodedParser, function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/verify', urlencodedParser, verifyFun, function (req, res) {
    res.render('verify');
});

app.post('/verify', urlencodedParser, function (req, res) {
    if(req.body.button == "newquery") {
        mysql.getEntity('users', 'id=' + req.session.passport.user).then(users => {
            doMail(user.email, messages.verifyMessage);
            res.render('verify');
        }).catch(error => {
            res.render('error', {error: error, title: SYSTEM_ERROR_HEAD});
        });
    } else if(req.body.button == "remove") {
        mysql.deleteEntity('users', 'id=' + req.session.passport.user).then(result => {
            req.logout();
            res.redirect('/');
        }).catch(error => {
            res.render('error', {error: error, title: SYSTEM_ERROR_HEAD});
        });
    } else {
        res.render('error', {error: "Request Body is not valid!", title: SYSTEM_ERROR_HEAD});
    }
});


app.get('/tokenverify/:tokenid', urlencodedParser, function (req, res) {
    mysql.getEntity('users', 'token="' + req.params.tokenid + '"').then(users => {
        var user = users[0];
        user.verify = 1;
        user.dateOfBirth  = user.dateOfBirth.toISO();
        mysql.updateEntity('users', user.id, user).then(result => {
            req.body.email = user.email;
            req.body.password = user.password;
            // doAuth(req, res, '/mypage');
            return doAuth(req, res, '/mypage');
        }).catch(error => {
            res.render('error', {error: error, title: SYSTEM_ERROR_HEAD});
        });
    }).catch(error => {
        res.render('error', {error: error, title: SYSTEM_ERROR_HEAD});
    });
});

//Страница 404


app.use(function(req, res, next){
    res.status(404);
    if (req.accepts('html')) {
        res.render('error', {error: 'Ошибка 404: Страница "' + req.url + '" не найдена', title: E404_ERROR_HEAD});
    } else if (req.accepts('json')) {
        res.send({ error: 'Not found' });
    }
});



app.listen(3000, function () {
    console.log('Server running on port №3000...');
});

