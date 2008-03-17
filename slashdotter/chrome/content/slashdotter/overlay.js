var SLASHDOTTER = {
	browser : null,
	prefs : null,
	
	showCCLinks : true,
	showMDLinks : false,
	showGCLinks : false,

	quickReplyEnabled : true,
	replyInNewTab : false,
	commentTogglesEnabled : true,
	
	replyFormat : "<blockquote><i>%s</i></blockquote>",
	
	style : {
		apple : "",
		interviews : "",
		books : "",
		main : "",
		science : "",
		politics : "",
		games : "",
		linux : "",
		it : "",
		hardware : "",
		developers : "",
		ask : "",
		yro : ""
	},
	
	ajaxReplies : true,
	
	ajaxRestOfComment : true,
	quickParentLinksEnabled : true,
	
	squareCorners : false,
	commentIndent : true,
	moveMoreLink : true,
	
	modCheck : true,
	modCheckTimeoutID : null,
	
	modAlert : null,
	
	onload : function () {
		SLASHDOTTER.browser = window.gBrowser || window.parent.gBrowser || document.getElementById("content");
		SLASHDOTTER.browser.addEventListener("contextmenu", SLASHDOTTER.addQuickReply, true);
				
		SLASHDOTTER.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.slashdotter.");
		
		SLASHDOTTER.modAlert = document.getElementById("slashdotter-modalert-panel");
		
		SLASHDOTTER.loadPrefs();
	},
	
	loadPrefs : function () {
		try {
			SLASHDOTTER.showCCLinks = SLASHDOTTER.prefs.getBoolPref("showCCLinks");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("showCCLinks",SLASHDOTTER.showCCLinks);
		}
		
		try {
			SLASHDOTTER.showMDLinks = SLASHDOTTER.prefs.getBoolPref("showMDLinks");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("showMDLinks",SLASHDOTTER.showMDLinks);
		}
		
		try {
			SLASHDOTTER.showGCLinks = SLASHDOTTER.prefs.getBoolPref("showGCLinks");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("showGCLinks",SLASHDOTTER.showGCLinks);
		}
		
		try {
			SLASHDOTTER.quickParentLinksEnabled = SLASHDOTTER.prefs.getBoolPref("quickParentLinksEnabled");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("quickParentLinksEnabled",SLASHDOTTER.quickParentLinksEnabled);
		}
		
		try {
			SLASHDOTTER.commentTogglesEnabled = SLASHDOTTER.prefs.getBoolPref("enableCommentToggles");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("enableCommentToggles",SLASHDOTTER.commentTogglesEnabled);
		}
		
		try {
			SLASHDOTTER.ajaxReplies = SLASHDOTTER.prefs.getBoolPref("ajaxReplies");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("ajaxReplies",SLASHDOTTER.ajaxReplies);
		}
		
		try {
			SLASHDOTTER.ajaxRestOfComment = SLASHDOTTER.prefs.getBoolPref("ajaxRestOfComment");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("ajaxRestOfComment",SLASHDOTTER.ajaxRestOfComment);
		}
		
		try {
			SLASHDOTTER.replyFormat = SLASHDOTTER.prefs.getCharPref("replyFormat");
		} catch (e) {
			try {
				SLASHDOTTER.prefs.setCharPref("replyFormat",SLASHDOTTER.replyFormat);
			} catch (e){
			}
		}
		
		try {
			SLASHDOTTER.quickReplyEnabled = SLASHDOTTER.prefs.getBoolPref("enableQuickReply");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("enableQuickReply", SLASHDOTTER.quickReplyEnabled);
		}
		
		try {
			SLASHDOTTER.replyInNewTab = SLASHDOTTER.prefs.getBoolPref("replyInNewTab");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("replyInNewTab", SLASHDOTTER.replyInNewTab);
		}
		
		try {
			SLASHDOTTER.squareCorners = SLASHDOTTER.prefs.getBoolPref("squareCorners");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("squareCorners", SLASHDOTTER.squareCorners);
		}
		
		try {
			SLASHDOTTER.commentIndent = SLASHDOTTER.prefs.getBoolPref("commentIndent");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("commentIndent", SLASHDOTTER.commentIndent);
		}
		
		try {
			SLASHDOTTER.moveMoreLink = SLASHDOTTER.prefs.getBoolPref("moveMoreLink");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("moveMoreLink", SLASHDOTTER.moveMoreLink);
		}
		
		try {
			SLASHDOTTER.modCheck = SLASHDOTTER.prefs.getBoolPref("modCheck");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("modCheck", SLASHDOTTER.modCheck);
		}
		
		try {
			SLASHDOTTER.style.apple = SLASHDOTTER.prefs.getCharPref("style.apple");
			SLASHDOTTER.style.interviews = SLASHDOTTER.prefs.getCharPref("style.interviews");
			SLASHDOTTER.style.books = SLASHDOTTER.prefs.getCharPref("style.books");
			SLASHDOTTER.style.games = SLASHDOTTER.prefs.getCharPref("style.games");
			SLASHDOTTER.style.main = SLASHDOTTER.prefs.getCharPref("style.main");
			SLASHDOTTER.style.science = SLASHDOTTER.prefs.getCharPref("style.science");
			SLASHDOTTER.style.politics = SLASHDOTTER.prefs.getCharPref("style.politics");
			SLASHDOTTER.style.linux = SLASHDOTTER.prefs.getCharPref("style.linux");
			SLASHDOTTER.style.it = SLASHDOTTER.prefs.getCharPref("style.it");
			SLASHDOTTER.style.hardware = SLASHDOTTER.prefs.getCharPref("style.hardware");
			SLASHDOTTER.style.developers = SLASHDOTTER.prefs.getCharPref("style.developers");
			SLASHDOTTER.style.ask = SLASHDOTTER.prefs.getCharPref("style.ask");
			SLASHDOTTER.style.yro = SLASHDOTTER.prefs.getCharPref("style.yro");
		} catch (e) {
			SLASHDOTTER.prefs.setCharPref("style.apple", SLASHDOTTER.style.apple);
			SLASHDOTTER.prefs.setCharPref("style.interviews", SLASHDOTTER.style.interviews);
			SLASHDOTTER.prefs.setCharPref("style.books", SLASHDOTTER.style.books);
			SLASHDOTTER.prefs.setCharPref("style.games", SLASHDOTTER.style.games);
			SLASHDOTTER.prefs.setCharPref("style.main", SLASHDOTTER.style.main);
			SLASHDOTTER.prefs.setCharPref("style.science", SLASHDOTTER.style.science);
			SLASHDOTTER.prefs.setCharPref("style.politics", SLASHDOTTER.style.politics);
			SLASHDOTTER.prefs.setCharPref("style.linux", SLASHDOTTER.style.linux);
			SLASHDOTTER.prefs.setCharPref("style.it", SLASHDOTTER.style.it);
			SLASHDOTTER.prefs.setCharPref("style.hardware", SLASHDOTTER.style.hardware);
			SLASHDOTTER.prefs.setCharPref("style.developers", SLASHDOTTER.style.developers);
			SLASHDOTTER.prefs.setCharPref("style.ask", SLASHDOTTER.style.ask);
			SLASHDOTTER.prefs.setCharPref("style.yro", SLASHDOTTER.style.yro);
		}
		
		if (SLASHDOTTER.modCheck){
			SLASHDOTTER.checkForModeratorPoints();
		}
	},
	
	DOMContentLoaded : function (event) {
		var page = event.target;
		
		if ((page.location.protocol == "http:")||(page.location.protocol == "https:")){
			const isSlashdot = /(\w*\.)?slashdot\.org$/i;
			
			if (!isSlashdot.test(page.location.host)) {
				return;
			}
		}
		else {
			return;
		}
		
		var section = page.location.host.substring(0, page.location.host.indexOf("."));
		if (section == "slashdot") {
			section = "main";
		}
		
		SLASHDOTTER.loadPrefs();
				
		if (SLASHDOTTER.showCCLinks || SLASHDOTTER.showMDLinks || SLASHDOTTER.showGCLinks){
			SLASHDOTTER.cacheLinks(page);
		}
				
		if (SLASHDOTTER.quickParentLinksEnabled){
			SLASHDOTTER.quickParentLinks(page);
		}
				
		if (SLASHDOTTER.commentTogglesEnabled){
			SLASHDOTTER.addCommentToggles(page);
		}

		if (SLASHDOTTER.ajaxReplies){		
			SLASHDOTTER.ajaxifyReplyLinks(page);
		}
				
		if (SLASHDOTTER.ajaxRestOfComment){		
			SLASHDOTTER.ajaxifyRestOfCommentLinks(page);
		}

		if (SLASHDOTTER.squareCorners){
			SLASHDOTTER.removeRoundedCorners(page);
		}
		
		if (SLASHDOTTER.commentIndent){
			SLASHDOTTER.increasePadding(page);
		}
		
		eval("var sectionStyle = SLASHDOTTER.style." + section + ";");
		
		if (sectionStyle != ''){
			SLASHDOTTER.applyStyle(page, sectionStyle);
		}
	},
	
	checkForModeratorPoints : function () {
		if (SLASHDOTTER.modCheckTimeoutID){
			clearTimeout(SLASHDOTTER.modCheckTimeoutID);
		}
		
		try {
			SLASHDOTTER.modCheck = SLASHDOTTER.prefs.getBoolPref("modCheck");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("modCheck", SLASHDOTTER.modCheck);
		}
		
		if (SLASHDOTTER.modCheck){
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
				SLASHDOTTER.modAlert.setAttribute("hidden","true");
			}
			
			SLASHDOTTER.modCheckTimeoutID = setTimeout('SLASHDOTTER.checkForModeratorPoints();',6 * 60 * 60 * 1000);
		}
		else {
			SLASHDOTTER.modAlert.setAttribute("hidden","true");
		}
	},
	
	cacheLinks : function (page) {
		var links = page.evaluate("//div[@class='intro']//a[@href]", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
	
		var alink = links.iterateNext();
		var linkList = [];
						
		while (alink){
			linkList.push(alink);
			
			alink = links.iterateNext();
		}
		
		for (var i in linkList){
			alink = linkList[i];
			
			tmp = alink.href;
			
			if (tmp){
				if ((tmp.indexOf('slashdot.org/') == -1) && (tmp.indexOf('.nyud.net:8090') == -1) && (tmp.indexOf('http://') == 0)){
					if (SLASHDOTTER.showGCLinks){					
						var googLink = page.createElement('a');
						googLink.setAttribute("href",'http://www.google.com/search?q=cache:' + tmp);
						googLink.setAttribute("title","Google Cache Link");
						googLink.appendChild(page.createTextNode("[GC]"));
					
						alink.parentNode.insertBefore(googLink, alink.nextSibling);					
						alink.parentNode.insertBefore(page.createTextNode(" "), alink.nextSibling);
					}
					
					if (SLASHDOTTER.showMDLinks){
						var mdLink = page.createElement('a');
						mdLink.setAttribute("href",'http://www.mirrordot.com/find-mirror.html?' + tmp);
						mdLink.setAttribute("title","MirrorDot Link");
						mdLink.appendChild(page.createTextNode("[MD]"));

						alink.parentNode.insertBefore(mdLink, alink.nextSibling);					
						alink.parentNode.insertBefore(page.createTextNode(" "), alink.nextSibling);
					}
					
					if (SLASHDOTTER.showCCLinks){
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
		try {
			SLASHDOTTER.quickReplyEnabled = SLASHDOTTER.prefs.getBoolPref("enableQuickReply");
		} catch (e) {
			SLASHDOTTER.prefs.setBoolPref("enableQuickReply", SLASHDOTTER.quickReplyEnabled);
		}
		
		if (SLASHDOTTER.quickReplyEnabled){
			var url = window.content.location.href;
			
			if (url.match(/(\w*\.)?slashdot.org\/(article|comments|journal).pl/i) ||
				url.match(/(\w*\.)?slashdot.org\/\1\/.*\.shtml/i) ||
				url.match(/(\w*\.)?slashdot.org\/~(.*)\/journal\//i)){
				if (window.content.getSelection().toString() != ''){
					SLASHDOTTER.enableQuickReply();
				}
				else {
					SLASHDOTTER.disableQuickReply();
				}
			}
			else {
				SLASHDOTTER.disableQuickReply();
			}
		}
		else {
			SLASHDOTTER.disableQuickReply();
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
			qrOption.setAttribute("oncommand","SLASHDOTTER.quickReply();");
			qrOption.setAttribute("onclick","if (event.which == 1) { SLASHDOTTER.quickReply(); } else if (event.which == 2) { SLASHDOTTER.quickReply(true);}");
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
	
	quickReply : function (inNewTab) {
		if (!inNewTab) inNewTab = false;
		
		var theSelection = window.content.getSelection();
		
		var theRange = theSelection.getRangeAt(0);
		var commentContainer;
		var replyLink;
		
		if (!(commentContainer = SLASHDOTTER.getCommentContainer(theRange.startContainer))){
			alert("Slashdotter Error: Could not find parent comment node of selected text");
		}
		else if (commentContainer != SLASHDOTTER.getCommentContainer(theRange.endContainer)){
			alert("Please only select text from one comment at a time.");
		}
		else {
			if (!(replyLink = SLASHDOTTER.getNextReplyLink(commentContainer))){
				alert("Slashdotter Error: Could not find 'Reply to This' link");
			}
			else {
				try {
					SLASHDOTTER.replyFormat = SLASHDOTTER.prefs.getCharPref("replyFormat");
				} catch (e) {
					try {
						SLASHDOTTER.prefs.setCharPref("replyFormat",SLASHDOTTER.replyFormat);
					} catch (e){
					}
				}
				
				if (!inNewTab){
					try {
						SLASHDOTTER.replyInNewTab = SLASHDOTTER.prefs.getBoolPref("replyInNewTab");
					} catch (e) {
						SLASHDOTTER.prefs.setBoolPref("replyInNewTab",SLASHDOTTER.replyInNewTab);
					}
				}
				
				if (replyLink.nodeName == "A"){
					var linkURL = "http:" + replyLink.getAttribute("href") + "&postercomment=" + encodeURIComponent(SLASHDOTTER.replyFormat.replace(/%s/g, theSelection.toString()));
					
					if (inNewTab || SLASHDOTTER.replyInNewTab){
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
					textfield.value = SLASHDOTTER.replyFormat.replace(/%s/g, theSelection.toString());
					
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
				while (node) {
					if (node.className == 'commentSub'){
						break;
					}
					else {
						node = node.nextSibling;
					}
				}
				
				if (node){
					for (var i = 0; i < node.childNodes.length; i++){
						if ((node.childNodes[i].nodeName == "A") && (node.childNodes[i].innerHTML == "Reply to This")){
							return node.childNodes[i];
						}
					}
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
		
		for (var i in topCommentList){
			var thisComment = topCommentList[i];
			var thisNode = null;
			
			// Add toggle button before the Reply to This link.
			for (var x in thisComment.childNodes){
				// Find the Reply to This link
				thisNode = thisComment.childNodes[x];
				
				if ((thisNode.nodeName == 'A') && (thisNode.href)){
					if (thisNode.innerHTML == 'Reply to This'){
						break;
					}
				}
				
				if (x == (thisComment.childNodes.length - 1)){
					thisNode = null;
					break;
				}
			}
			
			if (thisNode){
				var hiddenReplies = 0;
				// thisNode == "reply to this" link
				
				var toggleLink = page.createElement('a');
				toggleLink.href = 'javascript:void(0);';
				toggleLink.appendChild(page.createTextNode("Hide Replies"));
				toggleLink.setAttribute("onclick","for (var z in this.parentNode.parentNode.parentNode.childNodes){ if (this.parentNode.parentNode.parentNode.childNodes[z].nodeName == 'UL'){ if (this.parentNode.parentNode.parentNode.childNodes[z].style.display != 'none') { this.innerHTML = 'Show Replies'; this.parentNode.parentNode.parentNode.childNodes[z].style.display = 'none'; } else { this.innerHTML = 'Hide Replies'; this.parentNode.parentNode.parentNode.childNodes[z].style.display = ''; } } }");
				
				thisComment.insertBefore(toggleLink, thisNode);				
				thisComment.insertBefore(page.createTextNode(" | "), thisNode);
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
		
		for (var i in linkList){
			alink = linkList[i];
			
			if (alink.setAttribute){
				alink.setAttribute("onclick","var a=this.parentNode.parentNode;a.style.color = '#888888';a.innerHTML = 'Loading comment(s)...';var r=new XMLHttpRequest();r.open('GET','"+alink.href+"',true);r.onreadystatechange=function(evt){if (r.readyState==4){if(r.status==200){var t=r.responseText;var x=t.indexOf('<ul id=\"commentlisting\">');var y=t.lastIndexOf('</ul>');t = t.substring((x+24),y);t=t.substring(0,t.lastIndexOf('</ul>'));a.parentNode.style.backgroundColor='#ffffee';a.parentNode.innerHTML=t;}else{alert(\"Unable to retrieve comment(s).\");}}};r.send(null);return false;");
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
		
		for (var i in linkList){
			alink = linkList[i];
			
			if (alink.setAttribute){
				var linkID = alink.href.split('#')[1];
				
				alink.setAttribute("onclick","var a=this;a.style.color = '#888888';a.innerHTML = 'Loading comment...';a.parentNode.removeChild(a.nextSibling);var r=new XMLHttpRequest();r.open('GET','"+alink.href+"',true);r.onreadystatechange=function(evt){if (r.readyState==4){if(r.status==200){var t=r.responseText;var x=t.indexOf('<li id=\"tree_" + linkID + "\" class=\"comment\">');t = t.substring(x+39);var lines = t.split(\"\\n\"); var t = '';  for (var i = 0; i < lines.length; i++) { if (lines[i-2] == '</div>' && lines[i-1] == '</div>') { break; } else { t += lines[i] + \"\\\n\"; } } var q=document.createElement('div');q.innerHTML=t;q.style.backgroundColor='#ffffee';q.style.backgroundImage='';if (a == a.parentNode.lastChild) { a.parentNode.appendChild(q); } else { a.parentNode.insertBefore(q, a.nextSibling);}a.parentNode.removeChild(a);a.parentNode.style.backgroundImage='';}else{alert(\"Unable to retrieve comment.\");}}};r.send(null);return false;");
			}
		}
	},
	
	removeRoundedCorners : function (page) {
		SLASHDOTTER.removeRoundedCornersMain(page);
		SLASHDOTTER.removeRoundedCornersSub(page);
		SLASHDOTTER.removeRoundedCornersBlock(page);	
	},
	
	removeRoundedCornersMain : function(page){
		var links = page.evaluate("//div[@class='generaltitle']/div[@class='title']/h3", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

		var alink = links.iterateNext();
		var linkList = [];
						
		while (alink){
			linkList.push(alink);
			
			alink = links.iterateNext();
		}
		
		for (var i in linkList){
			alink = linkList[i];
			
			if (alink.style){
				alink.style.background = 'transparent';
			}
		}
	},
	
	removeRoundedCornersSub : function(page){
		var links = page.evaluate("//div[@class='commentTop']/div[@class='title']/h4", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

		var alink = links.iterateNext();
		var linkList = [];
						
		while (alink){
			linkList.push(alink);
			
			alink = links.iterateNext();
		}
		
		for (var i in linkList){
			alink = linkList[i];
			
			if (alink.style){
				alink.style.background = 'transparent';
			}
		}
	},
	
	removeRoundedCornersBlock : function(page){
		var links = page.evaluate("//div[@id='slashboxes']/div[@class='block']/div[@class='title']/h4", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

		var alink = links.iterateNext();
		var linkList = [];
						
		while (alink){
			linkList.push(alink);
			
			alink = links.iterateNext();
		}
		
		for (var i in linkList){
			alink = linkList[i];
			
			if (alink.style){
				alink.style.background = 'transparent';
			}
		}
		
		page.getElementById('links-sections-title').style.background = 'url(//images.slashdot.org/block-title-bg.png)';
	},

	increasePadding : function(page){
		var links = page.evaluate("//div[@id='contents']//ul//li//ul", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

		var alink = links.iterateNext();
		var linkList = [];
						
		while (alink){
			linkList.push(alink);
			
			alink = links.iterateNext();
		}
		
		for (var i in linkList){
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
		
		for (var i in linkList){
			alink = linkList[i];
			
			if (alink.setAttribute){
				alink.setAttribute("onclick","var a=this.parentNode.parentNode;this.parentNode.style.color = '#888888';this.parentNode.innerHTML = 'Loading comment...';var r=new XMLHttpRequest();r.open('GET','"+alink.href+"',true);r.onreadystatechange=function(evt){if (r.readyState==4){if(r.status==200){var t=r.responseText;var x=t.indexOf('<div class=\"commentBody\">');var y=t.indexOf('[ <a href=\"');t = t.substring((x+25),y);t=t.substring(0,t.lastIndexOf('</div>'));a.innerHTML=t;}else{alert(\"Unable to retrieve comment.\");}}};r.send(null);return false;");
			}
		}
	},
	
	quickParentLinks : function (page) {
		var links = page.evaluate("//div[@class='commentSub']/a[last()]", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

		var alink = links.iterateNext();
		var linkList = [];
						
		while (alink){
			if (alink.innerHTML == 'Parent'){
				linkList.push(alink);
			}
			
			alink = links.iterateNext();
		}
		
		for (var i = 0; i < linkList.length; i++){
			alink = linkList[i];

			var pid = alink.getAttribute("href").split("cid=")[1];
			
			if (pid){
				var parentLink = page.evaluate("//a[@name='" + pid + "']", page, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
			
				if (parentLink){
					alink.href = "#" + pid;
				}
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