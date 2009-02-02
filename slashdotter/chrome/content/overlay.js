var SLASHDOTTER = {
	prefs : null,
	
	modCheckTimeoutID : null,
	modAlert : null,
	
	onload : function () {
		var appcontent = document.getElementById("appcontent");
		
		if (!appcontent) {
			appcontent = document.getElementById("content");
		}
		
		if (appcontent) {
			appcontent.addEventListener("DOMContentLoaded", function (event) { SLASHDOTTER.DOMContentLoaded(event); }, true);
		}
		
		try {
			document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function () { SLASHDOTTER.addQuickReply(); }, false);
		} catch (noContextMenu) {
		}
		
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.slashdotter.");
		this.modAlert = document.getElementById("slashdotter-modalert-panel");
		
		if (this.modAlert && this.prefs.getBoolPref("modCheck")){
			this.checkForModeratorPoints();
		}
	},
	
	DOMContentLoaded : function (event) {
		var page = event.target;
		
		try {
			if (!page.location.host.match(/slashdot\.org$/)) {
				return;
			}
		} catch (e) {
			return;
		}
		
		var section = page.location.host.substring(0, page.location.host.indexOf("."));
		
		if (section == "slashdot") {
			section = "main";
		}
		
		if (this.prefs.getBoolPref("showCCLinks") || this.prefs.getBoolPref("showMDLinks") || this.prefs.getBoolPref("showGCLinks")){
			this.cacheLinks(page);
		}
				
		if (this.prefs.getBoolPref("enableCommentToggles")){
			this.addCommentToggles(page);
		}

		if (this.prefs.getBoolPref("ajaxReplies")){		
			this.ajaxifyReplyLinks(page);
		}
				
		if (this.prefs.getBoolPref("ajaxRestOfComment")){		
			this.ajaxifyRestOfCommentLinks(page);
		}

		if (this.prefs.getBoolPref("commentIndent")){
			this.increasePadding(page);
		}
		
		var sectionStyle = this.prefs.getCharPref("style." + section);
		
		if (sectionStyle != ''){
			this.applyStyle(page, sectionStyle);
		}
	},
	
	checkForModeratorPoints : function () {
		if (this.modCheckTimeoutID){
			clearTimeout(this.modCheckTimeoutID);
		}
		
		if (this.prefs.getBoolPref("modCheck")) {
			var req = new XMLHttpRequest();
			
			try {
				req.open("GET","http://slashdot.org/",true);
				
				req.onreadystatechange = function (event) {
					if (req.readyState == 4) {
						try {
							if (req.status == 200){
								if ((req.responseText.indexOf("Use it or lose it!") != -1) || (req.responseText.indexOf("Use 'em or lose 'em!") != -1)){
									SLASHDOTTER.modAlert.setAttribute("hidden","false");
								}
								else {
									SLASHDOTTER.modAlert.setAttribute("hidden","true");
								}
							}
							else {
								SLASHDOTTER.modAlert.setAttribute("hidden","true");
							}
						}
						catch (e) {
							SLASHDOTTER.modAlert.setAttribute("hidden","true");
						}
					}
				};
				
				req.send(null);
			}
			catch (e) {
				this.modAlert.setAttribute("hidden","true");
			}
			
			this.modCheckTimeoutID = setTimeout(function () { SLASHDOTTER.checkForModeratorPoints(); }, 6 * 60 * 60 * 1000);
		}
		else {
			this.modAlert.setAttribute("hidden","true");
		}
	},
	
	cacheLinks : function (page) {
		var links = page.evaluate("//div[@class='body']/div//a[@href]", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
	
		var alink = links.iterateNext();
		var linkList = [];
						
		while (alink){
			linkList.push(alink);
			
			alink = links.iterateNext();
		}
		
		for (var i = 0; i < linkList.length; i ++){
			alink = linkList[i];
			
			tmp = alink.href;
			
			if (tmp){
				if ((tmp.indexOf('slashdot.org/') == -1) && (tmp.indexOf('.nyud.net:8090') == -1) && (tmp.indexOf('http://') == 0)){
					if (this.prefs.getBoolPref("showGCLinks")){					
						var googLink = page.createElement('a');
						googLink.setAttribute("href",'http://www.google.com/search?q=cache:' + tmp);
						googLink.setAttribute("title","Google Cache Link");
						googLink.appendChild(page.createTextNode("[GC]"));
					
						alink.parentNode.insertBefore(googLink, alink.nextSibling);					
						alink.parentNode.insertBefore(page.createTextNode(" "), alink.nextSibling);
					}
					
					if (this.prefs.getBoolPref("showMDLinks")){
						var mdLink = page.createElement('a');
						mdLink.setAttribute("href",'http://www.mirrordot.com/find-mirror.html?' + tmp);
						mdLink.setAttribute("title","MirrorDot Link");
						mdLink.appendChild(page.createTextNode("[MD]"));

						alink.parentNode.insertBefore(mdLink, alink.nextSibling);					
						alink.parentNode.insertBefore(page.createTextNode(" "), alink.nextSibling);
					}
					
					if (this.prefs.getBoolPref("showCCLinks")){
						tmp = tmp.substr(7);
					
						if (tmp.indexOf('/')){
							tmp2 = tmp.substr(0,tmp.indexOf('/'));
							tmp3 = tmp.substr(tmp.indexOf('/'));
						}
						else{
							tmp2 = tmp;
							tmp3 = '';
						}
						
						newlink = 'http://'+tmp2+'.nyud.net:8090'+tmp3;
						
						var ccLink = page.createElement('a');
						ccLink.href = newlink;
						ccLink.host += ".nyud.net:8080";
						ccLink.setAttribute("title","Coral Cache Link");
						ccLink.appendChild(page.createTextNode("[CC]"));

						alink.parentNode.insertBefore(ccLink, alink.nextSibling);					
						alink.parentNode.insertBefore(page.createTextNode(" "), alink.nextSibling);
					}
				}
			}
		}
	},
	
	addQuickReply : function () {
		if (this.prefs.getBoolPref("enableQuickReply")){
			var url = window.content.location.href;
			
			if (url.match(/(\w*\.)?slashdot.org\/(article|comments|journal).pl/i) ||
				url.match(/(\w*\.)?slashdot.org\/\1\/.*\.shtml/i) ||
				url.match(/(\w*\.)?slashdot.org\/~(.*)\/journal\//i)){
				if (window.content.getSelection().toString() != ''){
					this.enableQuickReply();
				}
				else {
					this.disableQuickReply();
				}
			}
			else {
				this.disableQuickReply();
			}
		}
		else {
			this.disableQuickReply();
		}
	},
	
	enableQuickReply : function () {
		if (!document.getElementById("slashdotterQROptionDivider")){
			var qrDivider = document.createElement('menuseparator');
			qrDivider.setAttribute("id", "slashdotterQROptionDivider");
			document.getElementById('contentAreaContextMenu').appendChild(qrDivider);
		}
		
		if (!document.getElementById("slashdotterQROption")){
			var qrOption = document.createElement('menuitem');
			qrOption.setAttribute("id","slashdotterQROption");
			qrOption.setAttribute("oncommand","SLASHDOTTER.quickReply(event);");
			qrOption.setAttribute("accesskey","R");
			qrOption.setAttribute("label","Reply to Selected Text");
			document.getElementById('contentAreaContextMenu').appendChild(qrOption);
		}
	},
	
	disableQuickReply : function () {
		if (document.getElementById("slashdotterQROptionDivider")){
			document.getElementById('contentAreaContextMenu').removeChild(document.getElementById("slashdotterQROptionDivider"));
		}
		
		if (document.getElementById("slashdotterQROption")){
			document.getElementById('contentAreaContextMenu').removeChild(document.getElementById("slashdotterQROption"));
		}
	},
	
	quickReply : function (event) {
		if (event.which == 2 || event.metaKey || event.ctrlKey) var inNewTab = true;
		else inNewTab = false;
		
		var theSelection = window.content.getSelection();
		
		var theRange = theSelection.getRangeAt(0);
		var commentContainer;
		var replyLink;
		
		if (!(commentContainer = this.getCommentContainer(theRange.startContainer))){
			alert("Slashdotter Error: Could not find parent comment node of selected text");
		}
		else if (commentContainer != this.getCommentContainer(theRange.endContainer)){
			alert("Please only select text from one comment at a time.");
		}
		else {
			if (!(replyLink = this.getNextReplyLink(commentContainer))){
				alert("Slashdotter Error: Could not find 'Reply to This' link");
			}
			else {
				if (replyLink.nodeName == "A"){
					var linkURL = "http:" + replyLink.getAttribute("href") + "&postercomment=" + encodeURIComponent(this.prefs.getCharPref("replyFormat").replace(/%s/g, theSelection.toString()));
					
					if (inNewTab || this.prefs.getBoolPref("replyInNewTab")){
						openInNewTab(linkURL);
					}
					else {
						window.content.document.location.href = linkURL;
					}
				}
				else {
					var textfield = window.content.document.createElement("input");
					textfield.type = "hidden";
					textfield.name = "postercomment";
					textfield.value = this.prefs.getCharPref("replyFormat").replace(/%s/g, theSelection.toString());
					
					replyLink.parentNode.appendChild(textfield);
					
					var opfield = window.content.document.createElement("input");
					opfield.type = "hidden";
					opfield.name = "op";
					opfield.value = "Reply";
					
					replyLink.parentNode.appendChild(opfield);
					
					replyLink.parentNode.parentNode.submit();
				}
			}
		}
	},
	
	getCommentContainer : function (node) {
		while (node){
			if ((node.nodeName == "DIV") && ((node.className.indexOf("commentBody") != -1) || (node.className == "body"))){
				return node;
			}
			
			node = node.parentNode;
		}
		
		return null;
	},
	
	getNextReplyLink : function (node) {
		if (node){
			if (node.className == "commentBody"){
				try {
					var commentId = node.parentNode.id.replace("comment_", "");
					var replyLink = content.document.getElementById("reply_link_" + commentId).getElementsByTagName("a")[0];
					return replyLink;
				} catch (e) {
				}
			}
			else if (node.className == "commentSub") {
				try {
					var commentId = node.id.replace("comment_sub_", "");
					var replyLink = content.document.getElementById("reply_link_" + commentId).getElementsByTagName("a")[0];
					return replyLink;
				} catch (e) {
				}
			}
			else if (node.className == "body"){
				// Activate the Reply button
				var replyButtons = window.content.document.getElementsByName("op");
				
				for (var i = 0; i < replyButtons.length; i++){
					if (replyButtons[i].value == "Reply"){
						return replyButtons[i];
					}
				}
			}
		}
		
		return null;
	},
	
	addCommentToggles : function (page) {
		// Get all of the comments that also have replies
		var topComments = page.evaluate("//li[@class='comment' and ul[li]]/div/div[@class='commentSub']", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

		var comment = topComments.iterateNext();

		// Iterate through the comments and add them to an array, as we can't modify the results of the XPATH search.		
		var topCommentList = [];
		
		while (comment){
			topCommentList.push(comment);
			comment = topComments.iterateNext();
		}
		
		for (var i = 0; i < topCommentList.length; i++){
			var thisComment = topCommentList[i];
			var thisNode = this.getNextReplyLink(thisComment);
			
			if (thisNode){
				thisNode = thisNode.parentNode.parentNode.parentNode;
				
				var toggleSpan = page.createElement("span");
				toggleSpan.setAttribute("class","nbutton");
				toggleSpan.innerHTML = '<p><b><a href="javascript:void(0);" onclick="for (var z in this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes){ if (this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[z].nodeName == \'UL\'){ if (this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[z].style.display != \'none\') { this.innerHTML = \'Show Replies\'; this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[z].style.display = \'none\'; } else { this.innerHTML = \'Hide Replies\'; this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[z].style.display = \'\'; } } }">Hide Replies</a></b></p>';
				
				thisNode.parentNode.insertBefore(toggleSpan, thisNode);				
				thisNode.parentNode.insertBefore(page.createTextNode(" "), thisNode);
			}
		}			
	},
		
	applyStyle : function (page, style) {
		var head = page.getElementsByTagName("head")[0];
		
		var styles = page.getElementsByTagName("link");
		
		for (var i = 0; i < styles.length; i++){
			if (styles[i].getAttribute("rel") == "stylesheet"){
				if (styles[i].getAttribute("href").indexOf("slashdot_") != -1){
					styles[i].parentNode.removeChild(styles[i]);
					break;
				}
			}
		}
		
		if (style != 'main'){
			var styleNode = page.createElement("link");
			styleNode.rel = "stylesheet";
			styleNode.type = "text/css";
			styleNode.media = "screen, projection";
			
			if (style == 'ponies'){
				styleNode.href = 'chrome://slashdotter/skin/ponies/style.css';
			}
			else {
				styleNode.href = "//images.slashdot.org/slashdot_" + style + ".css";
			}
			
			head.appendChild(styleNode);
		}
	},
	
	ajaxifyReplyLinks : function (page) {
		// First do threshold links
		var links = page.evaluate("//ul[@id='commentlisting']//li/ul/li/b/a", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

		var alink = links.iterateNext();
		var linkList = [];
						
		while (alink){
			linkList.push(alink);
			
			alink = links.iterateNext();
		}
		
		for (var i = 0; i < linkList.length; i++){
			alink = linkList[i];
			
			if (alink.setAttribute){
				alink.setAttribute("onclick","var a=this.parentNode.parentNode;a.style.color = '#888888';a.innerHTML = 'Loading comment(s)...';var r=new XMLHttpRequest();r.open('GET','"+alink.href+"',true);r.onreadystatechange=function(evt){if (r.readyState==4){if(r.status==200){var t=r.responseText;var x=t.indexOf('<ul id=\"commentlisting\"');x=t.indexOf('>',x);var y=t.lastIndexOf('</ul>');t = t.substring((x+1),y);t=t.substring(0,t.lastIndexOf('</ul>'));a.parentNode.style.backgroundColor='#ffffee';a.parentNode.innerHTML=t;}else{alert(\"Unable to retrieve comment(s).\");}}};r.send(null);return false;");
			}
		}
		
		// Now do threaded type links
		links = page.evaluate("//ul[@id='commentlisting']//li/ul/li/a", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

		alink = links.iterateNext();
		linkList = [];
						
		while (alink){
			linkList.push(alink);
			
			alink = links.iterateNext();
		}
		
		for (var i = 0; i < linkList.length; i++){
			alink = linkList[i];
			
			if (alink.setAttribute){
				var linkID = alink.href.split('#')[1];
				
				alink.setAttribute("onclick","var a=this;a.style.color = '#888888';a.innerHTML = 'Loading comment...';a.parentNode.removeChild(a.nextSibling);var r=new XMLHttpRequest();r.open('GET','"+alink.href+"',true);r.onreadystatechange=function(evt){if (r.readyState==4){if(r.status==200){var t=r.responseText;var x=t.indexOf('<li id=\"tree_" + linkID + "\" class=\"comment\">');t = t.substring(x+39);var lines = t.split(\"\\n\"); var t = '';  for (var i = 0; i < lines.length; i++) { if (lines[i-2] == '</div>' && lines[i-1] == '</div>') { break; } else { t += lines[i] + \"\\\n\"; } } var q=document.createElement('div');q.innerHTML=t;q.style.backgroundColor='#ffffee';q.style.backgroundImage='';if (a == a.parentNode.lastChild) { a.parentNode.appendChild(q); } else { a.parentNode.insertBefore(q, a.nextSibling);}a.parentNode.removeChild(a);a.parentNode.style.backgroundImage='';}else{alert(\"Unable to retrieve comment.\");}}};r.send(null);return false;");
			}
		}
	},

	increasePadding : function(page){
		var links = page.evaluate("//div[@id='contents']//ul//li//ul", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

		var alink = links.iterateNext();
		var linkList = [];
						
		while (alink){
			linkList.push(alink);
			
			alink = links.iterateNext();
		}
		
		for (var i = 0; i < linkList.length; i++){
			alink = linkList[i];
			
			if (alink.style){
				alink.style.paddingLeft = '3em';
			}
		}
	},
			
	ajaxifyRestOfCommentLinks : function (page) {
		var links = page.evaluate("//div[@class='commentBody']/div[@class='commentshrunk']//a", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		
		var alink = links.iterateNext();
		var linkList = [];
						
		while (alink){
			linkList.push(alink);
			
			alink = links.iterateNext();
		}
		
		for (var i = 0; i < linkList.length; i++){
			alink = linkList[i];
			
			if (alink.setAttribute){
				alink.setAttribute("onclick","var a=this.parentNode.parentNode;this.parentNode.style.color = '#888888';this.parentNode.innerHTML = 'Loading comment...';var r=new XMLHttpRequest();r.open('GET','"+alink.href+"',true);r.onreadystatechange=function(evt){if (r.readyState==4){if(r.status==200){var t=r.responseText;var x=t.indexOf('<div class=\"commentBody\">');t=t.substring((x+25),t.lastIndexOf('</div>'));a.innerHTML=t;}else{alert(\"Unable to retrieve comment.\");}}};r.send(null);return false;");
			}
		}
	}
};

function openInNewTab(url){
	var browser = window.gBrowser || window.parent.gBrowser;
	
	var theTab = browser.addTab(url);
	
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	
	var loadInBackground = false;
	
	try {
		loadInBackground = prefs.getBoolPref("browser.tabs.loadBookmarksInBackground");
	} catch (e) {
	}
	
	if (!loadInBackground){
		browser.selectedTab = theTab;
	}
}