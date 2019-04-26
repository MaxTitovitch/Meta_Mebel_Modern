const SYSTEM_ERROR_HEAD = 'В системе - СБОЙ!';
const E404_ERROR_HEAD = 'Страница не обнаружена!';
const SERVER_PORT = 3000;

var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mysql = require('./queryer');

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
	mysql.getEntity('tshirts', '', 'id desc', '3').then(newEntitys => {
		mysql.getEntity('tshirts', '', 'ranking desc', '3').then(bestEntitys => {
			res.render('index', {newEntitys: newEntitys, bestEntitys: bestEntitys});
		}).catch(error => {
			res.render('error', {error: error, title: SYSTEM_ERROR_HEAD});
		});
	}).catch(error => {
		res.render('error', {error: error, title: SYSTEM_ERROR_HEAD});
	});
});

app.get('/about', urlencodedParser, function (req, res) {
	res.render('about');
});

app.get('/payment', urlencodedParser, function (req, res) {
	res.render('payment');
});

app.get('/pickup', urlencodedParser, function (req, res) {
    res.render('pickup');
});

app.get('/auth', urlencodedParser, function (req, res) {
    res.render('auth', {isRegistry: req.query.reg});
});

app.post('/auth', urlencodedParser, function (req, res) {
    console.log(req.body);
    res.redirect('/');
});

app.post('/registry', urlencodedParser, function (req, res) {
    console.log(req.body);
    res.redirect('/');
});



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

