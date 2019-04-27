var mysql = require('mysql');
const COMMENT_FIELDS = ['userID', 'tshirtID', 'text'];
const LIKE_FIELDS = ['userID', 'commentID'];
const MEDAL_FIELDS = ['shortText', 'imageAddress'];
const RANKING_FIELDS = ['value', 'userID', 'tshirtID'];
const TSHIRT_FIELDS = ['name', 'image', 'html', 'shortText', 'price', 'ranking', 'userID'];
const TSHIRTTAGS_FIELDS = ['tshirtID', 'tagName'];
const USERMEDAL_FIELDS = ['userID', 'medalID'];
const USER_FIELDS = ['email', 'password', 'role', 'fullName', 'dateOfBirth', 'language', 'theme', 'verify', 'token'];


var pool  = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'metamebelmodern'
});

var getConnection = function(callback) {
	pool.getConnection(function(err, connection) {
		callback(err, connection);
	});
};

var createPromise = function (query) {
	return new Promise((resolve, reject) => {
		getConnection((err, connection) => {
            // console.log(query);
			connection.query(query, function(err, rows) {
				if (err) reject(err);
				resolve(rows);
			});
			connection.release();
		});
	});
}


var getEntity = function (table, where, orderBy, limit) {
	return createPromise(createSelectQuery(table, where, orderBy, limit));
}

var createSelectQuery = function (table, where, orderBy, limit) {
	where = (where != null && where != '') ? 'WHERE ' + where + ' ' : '';
	orderBy = (orderBy != null && orderBy != '') ? 'ORDER BY ' + orderBy + ' ' : '';
	limit = (limit != null && limit != '') ? 'LIMIT ' + limit : '';
	return 'SELECT * FROM ' + table + ' ' + where + orderBy + limit;
}

var deleteEntity = function (table, where) {
    return createPromise(createDeleteQuery(table, where));
}

var createDeleteQuery = function (table, where) {
    where = (where != null && where != '') ? 'WHERE ' + where + ' ' : '';
    return 'DELETE FROM ' + table + ' ' + where;
}

var insertEntity = function (table, entity) {
    return createPromise(createInsertQuery(table, entity));
}

var createInsertQuery = function (table, entity) {
    return 'INSERT INTO ' + table + '(' + getEntityFields(table) + ') VALUES(' + getEntityValues(entity) + ')';
}

var updateEntity = function (table, id, entity) {
    delete entity.id;
    return createPromise(createUpdateQuery(table, id, entity));
}

var createUpdateQuery = function (table, id, entity) {
    return 'UPDATE ' + table + ' SET ' + getSettedValues(entity, checkFieldType(table)) + ' WHERE id=' + id;
}


var getSettedValues = function (entity, fields) {
    return prepareQuery(entity, fields);
}

var getEntityValues = function (entity) {
    return prepareQuery(entity, null);
}

var prepareQuery = function (entity, fields) {
    var result = '';
    entity = Object.values(entity);
    for (var i = 0; i < entity.length; i++) {
        var apos = (typeof entity[i]) !== 'number' ? '"' : '';
        if(fields != null) 
            result += ' ' + fields[i] + '=' + apos + entity[i] + apos;
        else
            result += apos + entity[i] + apos;
        if (i != entity.length-1) result +=',';
    }
    return result;
}

var getEntityFields = function (table) {
    return (checkFieldType(table)).toString();
}

var checkFieldType = function (table) {
    switch(table) {
        case 'comments': return COMMENT_FIELDS;
        case 'likes': return LIKE_FIELDS;
        case 'medals': return MEDAL_FIELDS;
        case 'rankings': return RANKING_FIELDS;
        case 'tshirts': return TSHIRT_FIELDS;
        case 'tshirttags': return TSHIRTTAGS_FIELDS;
        case 'usermedals': return USERMEDAL_FIELDS;
        case 'users': return USER_FIELDS;
    }
}



// getEntity('tshirts', 'id >= 1', 'id').then(result => {
//   console.log(result);
// }).catch(error => {
// 	console.error(error);
// });

// deleteEntity('users', 'id = 1').then(result => {
//   	console.log(result);
// }).catch(error => {
// 	console.error(error);
// });

// insertEntity('comments',  {'userID': 2, 'tshirtID': 3, 'text': 'Майка как майка!'}).then(result => {
//     console.log(result);
// }).catch(error => {
//     console.error(error);
// });

// updateEntity('comments',  6, {'userID': 2, 'tshirtID': 3, 'text': 'Майка как майка! Ок она!'}).then(result => {
//     console.log(result);
// }).catch(error => {
//     console.error(error);
// });


module.exports = {
    insertEntity: insertEntity,
    getEntity: getEntity,
    updateEntity: updateEntity,
    deleteEntity: deleteEntity,
}