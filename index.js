const SYSTEM_ERROR_HEAD = 'В системе - СБОЙ!';
const E404_ERROR_HEAD = 'Страница не обнаружена!';
const SERVER_PORT = 3000;
const SELECT_USERMEDALS = 'SELECT * FROM medals JOIN usermedals ON medals.id=usermedals.medalD WHERE usermedals.userID=';
const SELECT_USER_AND_TSHIRT = 'SELECT tshirts.*, users.fullName FROM tshirts JOIN users ON tshirts.userID=users.id WHERE tshirts.id=';
const SELECT_COMMENTS = 'SELECT comments.*, users.fullName, COUNT(likes.id) as quantity FROM comments LEFT JOIN likes ON comments.id=likes.commentID JOIN users ON users.id=comments.userID WHERE comments.tshirtID=';
const SELECT_BEST_TAGS = 'SELECT tagName FROM tshirttags GROUP BY tagName ORDER BY COUNT(*) DESC'
const SELECT_ORDER_USER = 'SELECT users.email FROM users JOIN orders ON users.id = orders.userID WHERE orders.id='

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
const phantom = require('phantom');
var Localize = require('localize');
var myLocalize = new Localize(JSON.parse(require('fs').readFileSync(__dirname + "/locale/locales.json", "utf8")));


Date.prototype.toISO = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [
        this.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('-');
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
    // console.log(req.session)
    myLocalize.setLocale("RU");
    if(req.session.passport == undefined) {
        next();
    } else if(req.session.passport.user == undefined) {
        app.locals.user = null;
        next();
    } else {
        mysql.getEntity('users', 'id=' + req.session.passport.user).then(users => {
            app.locals.user = users[0];
            myLocalize.setLocale(app.locals.user.language);
            next();
        }).catch(error => {
            res.render('error', {error: error, title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
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
            res.render('index', {newEntitys: newEntitys, bestEntitys: bestEntitys, user: app.locals.user, myLocalize: myLocalize});
        }).catch(error => {
            res.render('error', {error: error, title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
        });
    }).catch(error => {
        res.render('error', {error: error, title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
    });
});

app.get('/about', urlencodedParser, function (req, res) {
    res.render('about', {user: app.locals.user, myLocalize: myLocalize});
});

app.get('/payment', urlencodedParser, function (req, res) {
    res.render('payment', {user: app.locals.user, myLocalize: myLocalize});
});

app.get('/pickup', urlencodedParser, function (req, res) {
    res.render('pickup', {user: app.locals.user, myLocalize: myLocalize});
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
    if(!req.isAuthenticated()) res.redirect('/');
    mysql.getEntity('users', 'id=' + req.session.passport.user).then(users => {
        if(users[0].verify == 0 && req.path != '/verify') {
            res.redirect('/verify');
        } else if (users[0].verify != 0 && req.path == '/verify'){
            res.redirect('/');
        }
        next();
    }).catch(error => {
        res.render('error', {error: error, title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
    });
}

var doAuth = function (req, res, path) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            res.render('error', {error: err, title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
        }
        if (!user) {
            return res.redirect('/auth'); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                res.render('error', {error: err, title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
            }
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
    res.render('auth', {isRegistry: req.query.reg, user: app.locals.user, myLocalize: myLocalize});
});

app.post('/auth', urlencodedParser, function (req, res) {
    var path = req.session.passport == undefined ? '/' : '/users/' + req.session.passport.user; 
    return doAuth(req, res, path) 
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
       res.render('error', {error: error, title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
    });
});


// app.get('/users/' + req.session.passport.user, urlencodedParser, authFun, verifyFun, function (req, res) {  
//     res.redirect('/users/' + req.session.passport.user);
// });


app.get('/users/:index', urlencodedParser, authFun, verifyFun, function (req, res) {  
    mysql.getEntity('users', 'id=' + req.params.index + ' OR id=' + req.session.passport.user).then(users => {
        mysql.getEntity('tshirts', 'userID=' + req.params.index).then(tshirts => {
            if(users.length < 1){
                res.redirect('/');
            } else {
                var user = users[0].id ==  req.session.passport.user ? users[0]: users[1];
                var thisUser = users[0].id ==  req.session.passport.user ? users[1]: users[0];
                thisUser = thisUser == undefined ? user : thisUser;
                mysql.getEntity('users').then(allUsers => {
                    mysql.getByQuery(SELECT_USERMEDALS + user.id).then(medals => {
                        // user.dateOfBirth  = user.dateOfBirth.toISO();
                        res.render('userpanel', {user: user, tshirts: tshirts, allUsers: allUsers, thisUser: thisUser, medals: medals, myLocalize: myLocalize});
                    }).catch(error => { 
                        res.redirect('/');
                    });
                }).catch(error => { 
                    res.redirect('/');
                });
            }
        }).catch(error => { 
            res.redirect('/');
        });
    }).catch(error => { 
        res.redirect('/');
    });
});

app.get('/tshirt/:index', urlencodedParser, authFun, verifyFun, function (req, res) {  
        mysql.getByQuery(SELECT_USER_AND_TSHIRT + req.params.index).then(tshirts => {
            mysql.getByQuery(SELECT_USERMEDALS + tshirts[0].userID).then(medals => {
                mysql.getEntity('rankings', 'userID=' + app.locals.user.id + ' AND tshirtID=' + tshirts[0].id).then(rankings => {
                    mysql.getByQuery(SELECT_COMMENTS + tshirts[0].id + ' GROUP BY comments.id').then(comments => {
                        mysql.getEntity('likes', 'userID=' + app.locals.user.id).then(likes => {
                            mysql.getEntity('tshirttags', 'tshirtID=' + tshirts[0].id).then(tags => {
                                console.log(medals);
                                res.render('tshirt', {user: app.locals.user, tshirt: tshirts[0], rankings: rankings[0], comments: comments, likes: likes, tags: tags, myLocalize: myLocalize, medals: medals});
                            }).catch(error => { 
                                res.redirect('/');
                            });
                        }).catch(error => { 
                            res.redirect('/');
                        });
                    }).catch(error => { 
                        res.redirect('/');
                    });
                }).catch(error => { 
                    res.redirect('/');
                });
            }).catch(error => { 
                res.redirect('/');
            });
        }).catch(error => { 
            res.redirect('/');
        });
});

app.get('/edit_tshirt/:index', urlencodedParser, authFun, verifyFun, function (req, res) {  
    mysql.getEntity('tshirttags', 'tshirtID=' + req.params.index ).then(thisTags =>  { 
        mysql.getByQuery(SELECT_BEST_TAGS).then(tags =>  { 
            mysql.getEntity('tshirts', 'id=' + req.params.index).then(tshirts =>  {
                if(req.params.index == 0) {
                    res.render('edittshirt', {user: app.locals.user, tshirt:  null, tags: tags, thisTags: thisTags, myLocalize: myLocalize});
                } else if(tshirts.length > 0) {
                    res.render('edittshirt', {user: app.locals.user, tshirt:  tshirts[0], tags: tags, thisTags: thisTags, myLocalize: myLocalize});
                } else {
                    res.redirect('/');
                }
            }).catch(error => { 
                res.redirect('/');
            });
        }).catch(error => { 
            res.redirect('/');
        });
    }).catch(error => { 
        res.redirect('/');
    });
});


app.get('/logout', urlencodedParser, function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/verify', urlencodedParser, verifyFun, function (req, res) {
    res.render('verify', {myLocalize: myLocalize});
});

app.post('/verify', urlencodedParser, function (req, res) {
    if(req.body.button == "newquery") {
        mysql.getEntity('users', 'id=' + req.session.passport.user).then(users => {
            messages.verifyMessage.body = messages.verifyMessage.body.replace("TO_REPLACE", users[0].token);
            doMail(users[0].email, messages.verifyMessage);
            res.render('verify', {myLocalize: myLocalize});
        }).catch(error => {
            res.render('error', {error: error, title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
        });
    } else if(req.body.button == "remove") {
        mysql.deleteEntity('users', 'id=' + req.session.passport.user).then(result => {
            req.logout();
            res.redirect('/');
        }).catch(error => {
            res.render('error', {error: error, title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
        });
    } else {
        res.render('error', {error: "Request Body is not valid!", title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
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
            return doAuth(req, res, '/users/' + req.session.passport.user);
        }).catch(error => {
            res.render('error', {error: error, title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
        });
    }).catch(error => {
        res.render('error', {error: error, title: SYSTEM_ERROR_HEAD, myLocalize: myLocalize});
    });
});

// For: AJAX

app.post('/savesetting', urlencodedParser, function (req, res) {
    res.send( saveUser(req.body, 1));
});

var saveUser = function (user, savetype) {
    if(user.id == 0) return addUser(user);
    mysql.getEntity('users', 'id=' + user.id).then(users => {
        var entityUser = savetype == 1 ? updateUser (users[0], user) : updateUserByAdmin (users[0], user);
        mysql.updateEntity('users', entityUser.id, entityUser).then(result => {
            return 'OK';
        }).catch(error => {
            return 'ERROR';
        });
    }).catch(error => {
        return 'ERROR';
    });
}

var addUser = function (user) {
    delete user.id;
    user.language = "RU";
    user.theme = "WHITE";
    user.verify = 0;
    user.token = createToken();
    mysql.insertEntity('users', user).then(result => {
        return 'OK';
    }).catch(error => {
        return 'ERROR';
    });
}

var updateUserByAdmin = function (lastUser, newData) {
    lastUser.fullName = newData.fullName;
    lastUser.role = newData.role;
    lastUser.dateOfBirth = newData.date;
    lastUser.email = newData.email;
    lastUser.password = newData.password;
    return lastUser;
}

var updateUser = function (lastUser, newData) {
    lastUser.language = newData.language;
    lastUser.theme = newData.theme;
    lastUser.fullName = newData.fullName;
    lastUser.dateOfBirth = newData.date;
    lastUser.password = newData.password;
    return lastUser;
}

app.post('/removeuser', urlencodedParser, function (req, res) {
    removeEntity(req, res, 'users');
});

app.post('/removetshirt', urlencodedParser, function (req, res) {
    console.log(req.body.id)
    removeEntity(req, res, 'tshirts');
});

var removeEntity = function (req, res, table) {
    mysql.deleteEntity(table, 'id=' + req.body.id).then(result => {
        res.send('OK');
    }).catch(error => {
        res.send('ERROR');
    });
}

app.post('/saveuser', urlencodedParser, function (req, res) {
    res.send( saveUser(req.body, 0));
});

app.get('/download/:index', urlencodedParser, authFun, verifyFun, function (req, res) {  
    mysql.getEntity('tshirts', 'id=' + req.params.index).then(tshirts => {
        var name = __dirname + '/public/tshirts/tshirt' + tshirts[0].id + '.pdf'
        phantom.create().then(function(ph) {
            ph.createPage().then(function(page) {
                page.open('http://localhost:3000/tshirt_html/' + tshirts[0].id).then(function(status) {
                    page.render(name).then(function() {
                        res.sendFile(name);
                        ph.exit();
                    });
                });
            });
        });
        // res.send('tshirt.pdf');
    }).catch(error => { 
        console.log(error)
        res.redirect('/');
    });
});

app.get('/tshirt_html/:index', urlencodedParser, function (req, res) {  
    mysql.getEntity('tshirts', 'id=' + req.params.index).then(tshirts => {
        res.send(tshirts[0].html)
    }).catch(error => { 
        console.log(error)
        res.redirect('/');
    });
});

app.post('/saveranking', urlencodedParser, function (req, res) {
    mysql.getEntity('rankings', 'userID=' + req.body.userID + " AND tshirtID=" + req.body.tshirtID).then(rankings => {
        if(rankings.length < 1) {
            mysql.insertEntity('rankings', req.body).then(result => {
                res.send('OK');
            }).catch(error => {
                res.send('ERROR');
            });
        } else {
            mysql.updateEntity('rankings', rankings[0].id  , req.body).then(result => {
                res.send('OK');
            }).catch(error => {
                res.send('ERROR');
            });
        }
    }).catch(error => {
        res.send('ERROR');
    });
});


app.post('/addorder', urlencodedParser, function (req, res) {
    var order = req.body;
    order.userID = order.userID * 1;
    mysql.insertEntity('orders', order).then(result => {
        mysql.getEntity('orders', '', 'id DESC').then(orders => {
            res.send(orders[0]);
        }).catch(error => {
            res.send('ERROR');
        });
    }).catch(error => {
        res.send('ERROR');
    });
});


app.post('/addordertshirt', urlencodedParser, function (req, res) {
    var orderTshirt = req.body;
    mysql.insertEntity('ordertshirts', orderTshirt).then(result => {
        res.send('OK');
    }).catch(error => {
        res.send('ERROR');
    });
});

app.post('/addmail', urlencodedParser, function (req, res) {
    var id = req.body.id;
    console.log(id)
    mysql.getEntity('orders', 'id=' + id).then(orders => {
        mysql.getEntity('ordertshirts', 'orderID=' + id).then(orderTshirts => {
            mysql.getByQuery(SELECT_ORDER_USER + id).then(orderUser => {
                doMail(orderUser.email + ", " + "maxtitovitch@mail.ru", createMessage(orders[0], orderTshirts));
                res.send('OK');
            }).catch(error => {
                res.send('ERROR');
            });
        }).catch(error => {
            res.send('ERROR');
        });
    }).catch(error => {
        res.send('ERROR');
    });
});

var createMessage = function (order, orderTshirts) {
    var head ="Новый заказ ОФОРМЛЕН!", body;
    body = "<h1>Поступил новый заказ</h1>";
    body += '<p><b>Адрес доставки: </b>' + order.address + '</p>';
    body += '<p><b>Контактный телефон: </b>' + order.phone + '</p>';
    body += '<p><b>ИД Пользователя: </b>' + order.userID + '</p>';
    for (var i = 0; i < orderTshirts.length; i++) {
        body += '<div><h2>Товар#' + (i+1) + '</h2>';
            body += '<p><b>ИД Товара: </b>' + orderTshirts[i].tshirtID + '</p>';
            body += '<p><b>Пол: </b>' + orderTshirts[i].gender + '</p>';
            body += '<p><b>Размер: </b>' + orderTshirts[i].size + '</p>';
            body += '<p><b>Цвет (HEX): </b>' + orderTshirts[i].color + '</p>';
        body += '</div>';
    }
    return {head: head, body: body};
}

//Страница 404

app.use(function(req, res, next){
    res.status(404);
    if (req.accepts('html')) {
        res.render('error', {error: 'Ошибка 404: Страница "' + req.url + '" не найдена', title: E404_ERROR_HEAD, myLocalize: myLocalize});
    } else if (req.accepts('json')) {
        res.send({ error: 'Not found' });
    }
});



app.listen(3000, function () {
    console.log('Server running on port №3000...');
});


