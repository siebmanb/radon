
var DEBUG = true;
var CREATE_DB = [
//'DROP TABLE document', 'DROP TABLE element', 'DROP TABLE options',
'CREATE TABLE IF NOT EXISTS document (id, name, PRIMARY KEY (id))',
'CREATE TABLE IF NOT EXISTS options (id, name, PRIMARY KEY (id))',
'CREATE TABLE IF NOT EXISTS element (id, classname, content, document, PRIMARY KEY (id))'
];

/**
 * Création d'une base de données locale
 * @param {String} name nom de la base
 * @param {String} version version de la base
 * @param {String} displayName nom affiché de la base
 * @param {Number} size taille de la base
 */
function newDB(name, version, displayName, size) {
	DB = window.openDatabase(name, version, displayName, size);
	DB.transaction(createDB, errorDB, successDB);
}

/**
 * Exécution des requêtes de création de la base
 * stockées dans le tableau CREATE_DB
 * @param {Object} tx pointeur sur la base, automatiquement renseigné
 */
function createDB(tx) {
	for (var i = 0; i < CREATE_DB.length ; i++) {
		tx.executeSql(CREATE_DB[i]);
	}
}

/**
 * Requête SQL d'insertion
 * @param {String} req requête SQL
 * @param {Object} tx pointeur sur la base
 */
function insertSQL(req,fn) {
	DB.transaction(function(tx) {
		tx.executeSql(req);
	}, errorReqDB, fn);
}

/**
 * Requête SQL de récupération
 * @param {String} req requête SQL
 * @param {Object} tx pointeur sur la base
 */
function getSQL(req,fn) {
	DB.transaction(function(tx) {
		tx.executeSql(req, [], fn, errorReqDB);
	}, errorReqDB);

	// Accès aux datas : results.rows.item(i).email 
//	function querySuccess(tx, results) {
	// results ici
	// results.rows.item(i)
//	}
}

/**
 * Callback d'erreur à la création de la base
 * @param {Object} err objet d'erreur
 */
function errorDB(err) {
	console.log(err);
	if (DEBUG) alert("Erreur à la création: " + err.message);
}

/**
 * Callback de succès de la création de la base
 */
function successDB(err) {

}

/**
 * Callback d'erreur d'une requête SQL
 * @param {Object} err objet d'erreur
 */
function errorReqDB(err) {
	if (DEBUG) alert("Erreur à la requête: " + err.message);
}

/**
 * Callback de succès d'une requête SQL
 */
function successReqDB(err) {
}





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