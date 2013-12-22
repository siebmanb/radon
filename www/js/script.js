var UNSAVED = new Array();
$(document).ready(function() {

	// SQL management
	newDB("radon", "1.0", "radon", 200000);
	var CUR_DOC = -1;

	areTipsRead();

	// already seen tutorial ?
	if (localStorage.first == 'true') {
		openNotes();
	} else {
		prefill();
		localStorage.first = 'true';
	}

	// home btn
	$('body').on('click','#gotonotes.btnactive',function() {
		openNotes();
	});

	$('#gototips').on('click',function() {
		openTips();
		tipsRead();
	});
	// end home btn

	// tips
	$$('#tips').swipeRight(function() {
		backToHomeFromTips();
	});
	// end tips

	// notes btn
	$$('#addNote').touch(function() {
		newDocument();
	});
	// end notes btn

	// info btn
	$$('#infoBtn').touch(function() {
		backToHome();
	});
	// end info btn

	// Toolbar btn
	$$('.btn-toolbar .fui-new').touch(function() {
		$('.btn-toolbar .btn span.active').removeClass('active');
		$(this).addClass('active');
		showTextForm();
		makeReportDiscrete();
	});

	$$('.btn-toolbar .fui-chat').touch(function() {
		$('.btn-toolbar .btn span.active').removeClass('active');
		$(this).addClass('active');
		showQuoteForm();
		makeReportDiscrete();
	});

	$$('.btn-toolbar .fui-list').touch(function() {
		$('.btn-toolbar .btn span.active').removeClass('active');
		$(this).addClass('active');
		showListForm();
		makeReportDiscrete();
	});

	$$('.btn-toolbar .fui-checkbox-checked').touch(function() {
		$('.btn-toolbar .btn span.active').removeClass('active');
		$(this).addClass('active');
		showTaskForm();
		makeReportDiscrete();
	});

	$$('.btn-toolbar .fui-heart').touch(function() {
		$('.btn-toolbar .btn span.active').removeClass('active');
		$(this).addClass('active');
		showLikeForm();
		makeReportDiscrete();
	});

	$$('.btn-toolbar .fui-arrow-right').touch(function() {
		$('.btn-toolbar .btn span.active').removeClass('active');
		addLine();
	});
	// end Toolbar btn

	// submit buttons
	$$('#submitQuote').touch(function() {
		setTimeout(function(){
			addQuote();
		},300);
	});

	$$('#submitText').touch(function() {
		setTimeout(function(){
			addText();
		},300);
	});

	$$('#submitList').touch(function() {
		setTimeout(function(){
			addList();
		},300);
	});

	$$('#submitTask').touch(function() {
		setTimeout(function(){
			addTask();
		},300);
	});

	$$('#submitLike').touch(function() {
		setTimeout(function(){
			addLike();
		},300);
	});
	// end submit buttons

	// interactions
	$$('#mask').touch(function() {
		if ($('footer').hasClass('below')) {
			editModeOn();
		} else {
			editModeOff();
		}
		undoReportDiscrete();
	});

	$$('#report').touch(function() {
		undoReportDiscrete();
		removeForm();
	});

	$$('#edit .el').swipeLeft(function() {
		showDeleteEl($$(this));
	});

	$$('#listNotes li').swipeLeft(function() {
		showDeleteDoc($$(this));
	});

	$$('body').swipeRight(function() {	
		if($('#deleteEl').is(':visible') || $('#deleteDoc').is(':visible')) {
			hideDelete();
		} else if ($('#edit').is(':visible')) { 
			backToNotes();
		} else if ($('#notes').is(':visible')) {
			backToHome();
		}
	});

	$$('#deleteEl').touch(function() {
		var el = $('#deleteEl').attr('el-rel');

		$("[el='" + el + "']").css('opacity',0);
		setTimeout(function(){
			$("[el='" + el + "']").remove();
		},500);
		removeElement(el);

		hideDelete();
	});

	$$('#deleteDoc').touch(function() {
		setTimeout(function(){
			var el = $('#deleteDoc').attr('el-rel');
			$("[data-id='" + el + "']").css('opacity',0);

			$("[data-id='" + el + "']").remove();

			// no more docs ?
			if ($('#listNotes').html() == '') {
				$('#notnotesyet').show();
			}

			removeDocument(el);
			hideDelete();
		},500);
	});

	$$('#edit .el').swipeRight(function() {
		hideDelete();
	});

	$$('#edit .el').doubleTap(function() {
		editEl($$(this));
	});

//	$$('.editForm').swipeDown(function() {
//	removeForm();
//	});

	$('#title').on('change',function() {
		updateDocName();
	});

	$$('#edit').hold(function() {
		showModal();
	});

	$('#maskModal').on('click', function() {
		$(this).hide();
		$('#modal').css('opacity',0);
	});

	$('#modal').on('click', function() {
		sendEmail();
	});
	// end interactions

});


function scrollToBottom(instantly) {
	$("body").animate({scrollTop: $('body')[0].scrollHeight}, instantly ? 0 : 1000);
}

/**** Report ****/
function makeReportDiscrete() {
	$('#edit').addClass('discrete');
}

function undoReportDiscrete() {
	$('#edit').removeClass('discrete');
}

function addLine() {
	removeBottomSpace();
	var rel = getElID();
	$("<div " + getIDAttr(rel) + "class='el hrEl'></div>").hide().appendTo('#report').show(400);
	addElement(rel,'hrEl','',CUR_DOC);
	scrollToBottom();
}

function removeForm() {
	$('.submit').remove();
	saveUnsavedContent();
	$('.editForm').remove();
	$('.updating').removeClass('updating');
}

function showFormAndSubmit(form,submit) {
	setTimeout(function() {
		$(form).addClass('visible');
		setTimeout(function(){
			$(form + ' textarea').focus();
			$(form + ' input').focus();
		},400);
		$(submit).addClass('visible');
	});
}

function hideFormAndSubmit(form,submit) {
	$(form).removeClass('visible');
	$(submit).removeClass('visible');
	$('.btn-toolbar .btn span.active').removeClass('active');
}

function addSubmit(code) {
	$('footer').prepend(code);
}

function addToReport(input,classN,val,fromdb) {

	// el-rel defined ?
	if(!fromdb && $(input).attr('el-rel') != undefined) {
		var rel = $(input).attr('el-rel');
		$('[el="' + $(input).attr('el-rel') + '"]').html(val);
	} else {
		var rel = (fromdb ? input : getElID());

		switch (classN) {
		case 'hrEl':
			$("<div " + getIDAttr(rel) + "class='el hrEl'></div>").hide().appendTo('#report').show(400);
			break;
		case 'likeEl':
			$("<div" + getIDAttr(rel) + "class='el " + classN+ "'><span class='fui-heart'></span>" + val + "</div>").css('opacity',0).appendTo('#report');
			break;
		case 'taskEl':
			$("<div" + getIDAttr(rel) + "class='el " + classN+ "'><span class='fui-checkbox-checked'></span>" + val + "</div>").css('opacity',0).appendTo('#report');
			break;
		default:
			$("<div" + getIDAttr(rel) + "class='el " + classN+ "'>" + val + "</div>").css('opacity',0).appendTo('#report');
		}

		setTimeout(function(){
			$("[el='" + rel + "']").css('opacity',1);
		},1);
	}

	addElement(rel,classN,val,CUR_DOC);
}

function showModal() {
	$('#modal').css('opacity',1);
	$('#maskModal').show();
}

/***************/

/**** Quote ****/
function showQuoteForm(el,val) {
	deleteForms();
	addSubmit("<span class='input-icon fui-check-inverted submit' id='submitQuote'></span><form class='editForm' id='quoteForm'><textarea id='quote' placeholder='an amazing quote'></textarea></form>");

	if (el != undefined) {
		$('#quoteForm').attr('el-rel',el);
	} else {
		disableUpdatedEl();
	}

	$('#quote').val(val != undefined ? val : UNSAVED['quoteForm']);

	showFormAndSubmit('#quoteForm','#submitQuote');	
}

function addQuote() {
	var val = $('#quote').val();
	val = replaceAll(val,'\n','<br>');
	var newEl = ($('#quoteForm').attr('el-rel') == undefined);

	addToReport('#quoteForm','quoteEl',val);
	removeForm();
	removeBottomSpace();
	hideFormAndSubmit('#quoteForm','#submitQuote');
	undoReportDiscrete();
	if (newEl) scrollToBottom();
	disableUpdatedEl();
	UNSAVED['quoteForm'] = '';
}
/***************/

/**** Text ****/
function showTextForm(el,val) {
	deleteForms();
	addSubmit("<span class='input-icon fui-check-inverted submit' id='submitText'></span><form class='editForm' id='textForm'><textarea id='text' placeholder='just some text'></textarea></form>");

	if (el != undefined) {
		$('#textForm').attr('el-rel',el);
	} else {
		disableUpdatedEl();
	}
	$('#text').val(val != undefined ? val : UNSAVED['textForm']);

	showFormAndSubmit('#textForm','#submitText');
}

function addText() {
	var val = $('#text').val();
	val = replaceAll(val,'\n','<br>');
	var newEl = ($('#textForm').attr('el-rel') == undefined);

	addToReport('#textForm','textEl',val);
	removeForm();
	removeBottomSpace();
	hideFormAndSubmit('#textForm','#submitText');
	undoReportDiscrete();
	if (newEl) scrollToBottom();
	disableUpdatedEl();
	UNSAVED['textForm'] = '';
}
/***************/

/**** List ****/
function showListForm(el,val) {
	deleteForms();
	addSubmit("<span class='input-icon fui-check-inverted submit' id='submitList'></span><form class='editForm' id='listForm'><textarea id='list' placeholder='an interesting list'></textarea></form>");

	if (el != undefined) {
		$('#listForm').attr('el-rel',el);
	} else {
		disableUpdatedEl();
	}
	$('#list').val(val != undefined ? val : UNSAVED['listForm']);

	showFormAndSubmit('#listForm','#submitList');
}

function addList() {
	var val = $('#list').val();
	var lines = val.split('\n');
	var newEl = ($('#listForm').attr('el-rel') == undefined);

	// building the result
	var ret = "<p>" + lines[0] + " :</p><ul>";
	for (var i = 1 ; i < lines.length ; i++) {
		ret += '<li>' + lines[i] + '</li>';
	}
	ret += '</ul>';

	addToReport('#listForm','listEl',ret);
	removeForm();
	removeBottomSpace();
	hideFormAndSubmit('#listForm','#submitList');
	undoReportDiscrete();
	if (newEl) scrollToBottom();
	disableUpdatedEl();
	UNSAVED['listForm'] = '';
}
/***************/

/**** Task ****/
function showTaskForm(el,val) {
	deleteForms();
	addSubmit("<span class='input-icon fui-check-inverted submit' id='submitTask'></span><form class='editForm' id='taskForm'><input type='text' id='task' placeholder='a task to do'></form>");

	if (el != undefined) {
		$('#taskForm').attr('el-rel',el);
	} else {
		disableUpdatedEl();
	}
	$('#task').val(val != undefined ? val : UNSAVED['taskForm']);

	showFormAndSubmit('#taskForm','#submitTask');

	$('#task').on('keydown',function(event) {
		if(event.keyCode == 13) {
			event.preventDefault();
			addTask();
			return false;
		}
	});
}

function addTask() {
	var val = $('#task').val();
	var newEl = ($('#taskForm').attr('el-rel') == undefined);

	addToReport('#taskForm','taskEl',val);
	removeForm();
	removeBottomSpace();
	hideFormAndSubmit('#taskForm','#submitTask');
	undoReportDiscrete();
	if (newEl) scrollToBottom();
	disableUpdatedEl();
	UNSAVED['taskForm'] = '';
}
/***************/

/**** Like ****/
function showLikeForm(el,val) {
	deleteForms();
	addSubmit("<span class='input-icon fui-check-inverted submit' id='submitLike'></span><form class='editForm' id='likeForm'><input type='text' id='like' placeholder='something inspiring'></form>");

	if (el != undefined) {
		$('#likeForm').attr('el-rel',el);
	} else {
		disableUpdatedEl();
	}
	$('#like').val(val != undefined ? val : UNSAVED['likeForm']);

	showFormAndSubmit('#likeForm','#submitLike');

	$('#like').on('keydown',function(event) {
		if(event.keyCode == 13) {
			event.preventDefault();
			addLike();
			return false;
		}
	});
}

function addLike() {
	var val = $('#like').val();
	var newEl = ($('#likeForm').attr('el-rel') == undefined);

	addToReport('#likeForm','likeEl',val);
	removeForm();
	removeBottomSpace();
	hideFormAndSubmit('#likeForm','#submitLike');
	undoReportDiscrete();
	if (newEl) scrollToBottom();
	disableUpdatedEl();
	UNSAVED['likeForm'] = '';
}
/***************/

/**** Navbar ****/
function deleteForms() {
	saveUnsavedContent();
	$('.editForm').remove();
	$('.submit').remove();
}	
/***************/

/**** Open page ****/
function openHome() {
	$('#home').show();
	$('#edit').hide();
	$('#notes').hide();
	$('#tips').hide();
}

function openNotes() {
	$('#home').hide();
	$('#notes').show();
	$('#edit').hide();
	$('#tips').hide();
	getAllDocs();
}

function openTips() {
	$('#home').hide();
	$('#notes').hide();
	$('#edit').hide();
	$('#tips').show();
}

function backToNotes() {
	hideDelete();

	$('#home').hide();
	$( "#edit" ).animate({
		opacity: 0,
	}, 500, function() {
		$('#edit').hide();
		$('#edit').css('opacity',1);
		$('#notes').show();
	});

	getAllDocs();
}

function backToHome() {
	hideDelete();

	$( "#notes" ).animate({
		opacity: 0,
	}, 500, function() {
		$('#notes').hide();
		$('#notes').css('opacity',1);
		$('#home').show();
	});
}

function backToHomeFromTips() {
	$( "#tips" ).animate({
		opacity: 0,
	}, 500, function() {
		$('#tips').hide();
		$('#tips').css('opacity',1);
		$('#home').show();
	});
}

function openEdit() {
	$('#home').hide();
	$('#edit').show();
	$('#tips').hide();
	$('#notes').hide();
}
/***************/


/**** IDs ****/
function getElID() {
	// random based on current time + random letters (in case of date change)
	var rand = Math.random().toString(36).substring(7);
	return (new Date().getTime() + rand);
}

function getIDAttr(id) {
	return " el='" + id + "' ";
}

function getDocID() {
	var rand = Math.ceil(Math.random()*99999);

	while ($('[el=' + rand + ']').length > 0) {
		rand = Math.ceil(Math.random()*3);
	}

	return rand;
}
/*************/


/**** Interaction ****/
function showDeleteEl(callback) {
	$('#deleteEl').remove();
	$('body').append("<div id='deleteEl'><span class='input-icon fui-cross'></span></div>");
	$('#deleteEl').css('top',(callback[0].offsetTop + 5) + 'px');
	$('#deleteEl').addClass('right');
	$('#deleteEl').attr('el-rel',callback.attr('el'));
}

function showDeleteDoc(callback) {
	$('#deleteDoc').remove();
	$('body').append("<div id='deleteDoc'><span class='input-icon fui-cross'></span></div>");
	$('#deleteDoc').css('top',(callback[0].offsetTop - 4) + 'px');
	$('#deleteDoc').addClass('right');
	$('#deleteDoc').attr('el-rel',callback.attr('data-id'));
}

function hideDelete() {
	$('#deleteEl').removeClass('right');
	setTimeout(function(){
		$('#deleteEl').remove();
	},500);

	$('#deleteDoc').removeClass('right');
	setTimeout(function(){
		$('#deleteDoc').remove();
	},500);
}

function removeBottomSpace() {
	$('#xtraspace').remove();
}

function editEl(callback) {
	editModeOn();

	var c = callback[0].className;

	// highlighting element
	animateUpdatedEl(callback.attr('el'));

	if (c.indexOf('quoteEl') != -1) {
		var val = callback.html();
		val = replaceAll(val,'<br>','\n');
		showQuoteForm(callback.attr('el'),val);
	} 

	else if (c.indexOf('textEl') != -1) {
		var val = callback.html();
		val = replaceAll(val,'<br>','\n');
		showTextForm(callback.attr('el'),val);
	}

	else if (c.indexOf('listEl') != -1) {
		// formatting value
		var val = callback.html();
		val = replaceAll(val,'<li>','\n');
		val = replaceAll(val,'</li>','');
		val = replaceAll(val,'<ul>','');
		val = replaceAll(val,'</ul>','');
		val = replaceAll(val,'<p>','');
		val = replaceAll(val,':</p>','');

		showListForm(callback.attr('el'),val);
	}

	else if (c.indexOf('taskEl') != -1) {
		var val = callback.html();
		val = replaceAll(val,'<span class="fui-checkbox-checked"></span>','');
		showTaskForm(callback.attr('el'),val);
	}

	else if (c.indexOf('likeEl') != -1) {
		var val = callback.html();
		val = replaceAll(val,'<span class="fui-heart"></span>','');
		showLikeForm(callback.attr('el'),val);
	}
}

function animateUpdatedEl(el) {
	$("[el='" + el + "']").addClass('updating');
}

function disableUpdatedEl() {
	$(".el.updating").removeClass('updating');
}

function editModeOn() {
	$('#titleDiv').hide();
	$('#title').show();
	$('footer').removeClass('below');
	makeReportDiscrete();
//	listenToScroll();
}

function editModeOff() {
	$('#titleDiv').show();
	$('#title').hide();
	$('#titleDiv').css('color', ($('#titleDiv').html() == 'untitled' ? '#CACAC9' : '#1abc9c' ));
	$('footer').addClass('below');
	undoReportDiscrete();
	removeForm();
//	unlistenToScroll();
}

function sendEmail() {
	var title = $('#title').val();
	var body = '';
	$('#report .el').each(function() {
		if ($(this).hasClass('textEl')) {
			body += $(this).html() + '%0D%0A%0D%0A';
		} else if ($(this).hasClass('hrEl')) {
			body += '---%0D%0A%0D%0A';
		} else if ($(this).hasClass('quoteEl')) {
			body += '"' + $(this).html() + '"' + '%0D%0A%0D%0A';
		} else if ($(this).hasClass('taskEl')) {
			body += 'ToDo: ' + $(this).text() + '%0D%0A%0D%0A';
		} else if ($(this).hasClass('likeEl')) {
			body += $(this).text() + '%0D%0A%0D%0A';
		} else if ($(this).hasClass('listEl')) {
			var val = replaceAll($(this).html(),'<li>',"%0D%0A- ");
			val = replaceAll(val,'</li>','');
			val = replaceAll(val,'<ul>','');
			val = replaceAll(val,'</ul>','');
			val = replaceAll(val,'<p>','');
			val = replaceAll(val,'</p>','');
			body += val + '%0D%0A%0D%0A';
		}
	});
	window.location='mailto:?subject=' + title + '&body=' + body;
}

function saveUnsavedContent() {
	var input = $('.editForm.visible input[type="text"]').val();
	var textarea = $('.editForm.visible textarea').val();
	var val = (input != undefined ? input : '') + (textarea != undefined ? textarea : '');
	var id = $('.editForm.visible').attr('id');

	if (val != undefined) {
		UNSAVED[id] = val;
	}

}
/*************/

/**** Notes ****/
function newDocument() {
	CUR_DOC = getDocID();
	addDocument(CUR_DOC,'');
	$('#title').val('');
	editModeOn();
	$('#report').html('');
	openEdit();
}

function updateDocName() {
	$('#titleDiv').html($('#title').val());
	addDocument(CUR_DOC,$('#title').val());
}

function getAllDocs() {
	$('#listNotes').html('');

	getSQL('SELECT * FROM document ',callback);

	var _this = this;
	function callback(tx, results) {
		// Nothing
		if (results.rows.length == 0) {
			$('#notnotesyet').show();
			return true;
		}
		$('#notnotesyet').hide();

		for (var i = 0 ; i < results.rows.length ; i++) {
			var name = (results.rows.item(i).name == '' ? 'untitled' : results.rows.item(i).name);
			var id = results.rows.item(i).id;
			var classn = (results.rows.item(i).name == '' ? 'empty' : '');

			$('#listNotes').append('<li class="' + classn + '" data-id="' + id + '">' + name + '</li>');
		}

		$('#listNotes li').on('click',function() {
			openDocument($$(this).attr('data-id'),$$(this).html());
		});
	}
}

function openDocument(id,title) {
	hideDelete();
	CUR_DOC = id;
	getSQL('SELECT * FROM element WHERE document="' + CUR_DOC + '"',callback);
	openEdit();
	$('#title').val(title == 'untitled' ? '' : title);
	$('#titleDiv').html(title == 'untitled' ? 'untitled' : title);
	$('#titleDiv').css('color', (title == 'untitled' ? '#CACAC9' : '#1abc9c' ));
	$('#report').html('');
	editModeOff();
	$('#report').css('padding-top',$('#edit .header').height() + 'px');
	undoReportDiscrete();
	deleteForms();

	var _this = this;
	function callback(tx, results) {
		for (var i = 0 ; i < results.rows.length ; i++) {
			var classname = results.rows.item(i).classname;
			var id = results.rows.item(i).id;
			var content = results.rows.item(i).content;
			addToReport(id,classname,content,true);
		}
	}
}
/*************/


/**** MISC ****/
function replaceAll(
		strSrc,
		strTarget, // The substring you want to replace
		strSubString // The string you want to replace in.
) {
	var strText = strSrc;
	var intIndexOfMatch = strText.indexOf( strTarget );

	// Keep looping while an instance of the target string
	// still exists in the string.
	while (intIndexOfMatch != -1){
		// Relace out the current instance.
		strText = strText.replace( strTarget, strSubString )

		// Get the index of any next matching substring.
		intIndexOfMatch = strText.indexOf( strTarget );
	}

	// Return the updated string with ALL the target strings
	// replaced out with the new substring.
	return( strText );
}

function replaceQuotes(val) {
	return replaceAll(val,'"',"''");
}


function prefill() {
	getSQL('SELECT * FROM document WHERE id="1"',callback);

	var _this = this;
	function callback(tx, results) {
		if (results.rows.length == 0) {
			addDocument(1,"Notes from my happy life (example)");
			addElement(1,'textEl',"A few notes from my happy life. Looking back now is like reading a book about my life..." ,1);
			addElement(2,'hrEl',"" ,1);
			addElement(3,'quoteEl',"I have a dream that one day this nation will rise up and live out the true meaning of its creed: « We hold these truths to be self-evident, that all men are created equal. »" ,1);
			addElement(4,'taskEl',"Remember to pick up the milk on the way home, and ask my wife to marry me." ,1);
			addElement(5,'likeEl',"“If you don’t build your dream, someone else will hire you to help them build theirs.”" ,1);
			addElement(6,'listEl',"<p>Thing to do before 50:</p><ul><li>travel around the world</li><li>swim with sharks</li><li>learn the piano</li><li>build my own company</li></ul>" ,1);
		}
	}
}

/*************/
