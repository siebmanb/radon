
var DEBUG = true;
var CREATE_DB = [
//'DROP TABLE document', 'DROP TABLE element', 'DROP TABLE options',
'CREATE TABLE IF NOT EXISTS document (id, name, PRIMARY KEY (id))',
'CREATE TABLE IF NOT EXISTS options (id, name, PRIMARY KEY (id))',
'CREATE TABLE IF NOT EXISTS element (id, classname, content, document, PRIMARY KEY (id))'
];

/**
 * Creation of a local database
 */
function newDB(name, version, displayName, size) {
	DB = window.openDatabase(name, version, displayName, size);
	DB.transaction(createDB, errorDB, successDB);
}

/**
 * Execution of request stored in the array CREATE_DB
 * @param {Object} tx pointer on the database, automatically created
 */
function createDB(tx) {
	for (var i = 0; i < CREATE_DB.length ; i++) {
		tx.executeSql(CREATE_DB[i]);
	}
}

/**
 * SQL insert request
 * @param {String} req request
 * @param {Object} tx pointer on database
 */
function insertSQL(req,fn) {
	DB.transaction(function(tx) {
		tx.executeSql(req);
	}, errorReqDB, fn);
}

/**
 * SQL get request
 * @param {String} req request SQL
 * @param {Object} tx pointer on database
 */
function getSQL(req,fn) {
	DB.transaction(function(tx) {
		tx.executeSql(req, [], fn, errorReqDB);
	}, errorReqDB);
}

/**
 * Error callback on database creation
 * @param {Object} err error object
 */
function errorDB(err) {
	console.log(err);
	if (DEBUG) alert("Error during creation: " + err.message);
}

/**
 * Success callback on database creation
 */
function successDB(err) {

}

/**
 * Error callback on SQL request
 * @param {Object} err error object
 */
function errorReqDB(err) {
	if (DEBUG) alert("Error on request: " + err.message);
}

/**
 * Success callback on SQL request
 */
function successReqDB(err) {}





/**
 * Add a document
 */
function addDocument(id,name) {
	insertSQL('REPLACE INTO document (id,name) VALUES ("' + id + '","' + replaceQuotes(name) + '")');
}

/**
 * Remove a document
 */
function removeDocument(id) {
	insertSQL('DELETE FROM document WHERE id="' + id + '"');
}

/**
 * Add an element
 */
function addElement(id,classname,content,document) {
	insertSQL('REPLACE INTO element (id,classname,content,document) VALUES ("' + id + '","' + classname + '","' + replaceQuotes(content) + '","' + document + '")');
}

/**
 * Remove an element
 */
function removeElement(id) {
	insertSQL('DELETE FROM element WHERE id="' + id + '"');
}

/**
 * Manage tips read of not
 */
function tipsRead() {
	$('#gotonotes').addClass('btnactive')
	insertSQL('REPLACE INTO options (id,name) VALUES ("0","tipsread")');
}

function areTipsRead() {
	getSQL('SELECT * FROM options WHERE id="0"',callback);

	function callback(tx, results) {
		if (results.rows.length > 0) $('#gotonotes').addClass('btnactive');
		else $('#gotonotes').removeClass('btnactive');
	}
}