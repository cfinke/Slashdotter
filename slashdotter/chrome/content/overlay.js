var SLASHDOTTER = {
	prefs : null,
	
	modCheckTimeoutID : null,
	modAlert : null,
	
	onload : function () {
		removeEventListener("load", SLASHDOTTER.onload, false);
		
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
		
		SLASHDOTTER.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.slashdotter.");
		SLASHDOTTER.modAlert = document.getElementById("slashdotter-modalert-panel");
		
		if (SLASHDOTTER.modAlert && SLASHDOTTER.prefs.getBoolPref("modCheck")){
			SLASHDOTTER.checkForModeratorPoints();
		}
		
		addEventListener("unload", SLASHDOTTER.unload, false);
	},
	
	unload : function () {
		removeEventListener("unload", SLASHDOTTER.unload, false);
		
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
		
		if (SLASHDOTTER.prefs.getBoolPref("showCCLinks") || SLASHDOTTER.prefs.getBoolPref("showMDLinks") || SLASHDOTTER.prefs.getBoolPref("showGCLinks")){
			SLASHDOTTER.cacheLinks(page);
		}
				
		if (SLASHDOTTER.prefs.getBoolPref("enableCommentToggles")){
			SLASHDOTTER.addCommentToggles(page);
		}

		if (SLASHDOTTER.prefs.getBoolPref("commentIndent")){
			SLASHDOTTER.increasePadding(page);
		}
		
		try {
			var sectionStyle = SLASHDOTTER.prefs.getCharPref("style." + section);
		
			if (sectionStyle != ''){
				SLASHDOTTER.applyStyle(page, sectionStyle);
			}
		} catch (e) {
			// A section we don't know about.
		}
	},
	
	checkForModeratorPoints : function () {
		if (SLASHDOTTER.modCheckTimeoutID){
			clearTimeout(SLASHDOTTER.modCheckTimeoutID);
		}
		
		if (SLASHDOTTER.prefs.getBoolPref("modCheck")) {
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
			
			SLASHDOTTER.modCheckTimeoutID = setTimeout(function () { SLASHDOTTER.checkForModeratorPoints(); }, 6 * 60 * 60 * 1000);
		}
		else {
			SLASHDOTTER.modAlert.setAttribute("hidden","true");
		}
	},
	
	// @done
	cacheLinks : function (page) {
		SLASHDOTTER.$(page).find("div.body  div[id^='text'] a[href]").each(function () {
			var alink = this;
			
			tmp = alink.href;
		
			if (tmp){
				if ((tmp.indexOf('slashdot.org/') == -1) && (tmp.indexOf('.nyud.net:8090') == -1) && (tmp.indexOf('http://') == 0)){
					if (SLASHDOTTER.prefs.getBoolPref("showGCLinks")){					
						var googLink = page.createElement('a');
						googLink.setAttribute("href",'http://www.google.com/search?q=cache:' + tmp);
						googLink.setAttribute("title","Google Cache Link");
						googLink.appendChild(page.createTextNode("[GC]"));
				
						alink.parentNode.insertBefore(googLink, alink.nextSibling);					
						alink.parentNode.insertBefore(page.createTextNode(" "), alink.nextSibling);
					}
				
					if (SLASHDOTTER.prefs.getBoolPref("showMDLinks")){
						var mdLink = page.createElement('a');
						mdLink.setAttribute("href",'http://www.mirrordot.com/find-mirror.html?' + tmp);
						mdLink.setAttribute("title","MirrorDot Link");
						mdLink.appendChild(page.createTextNode("[MD]"));

						alink.parentNode.insertBefore(mdLink, alink.nextSibling);					
						alink.parentNode.insertBefore(page.createTextNode(" "), alink.nextSibling);
					}
				
					if (SLASHDOTTER.prefs.getBoolPref("showCCLinks")){
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
		});
	},
	
	// @done
	addQuickReply : function () {
		if (SLASHDOTTER.prefs.getBoolPref("enableQuickReply")){
			var url = window.content.location.href;
			
			if (url.match(/(\w*\.)?slashdot.org\/story/i) ||
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
	
	// @done
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
	
	// @done
	disableQuickReply : function () {
		if (document.getElementById("slashdotterQROptionDivider")){
			document.getElementById('contentAreaContextMenu').removeChild(document.getElementById("slashdotterQROptionDivider"));
		}
		
		if (document.getElementById("slashdotterQROption")){
			document.getElementById('contentAreaContextMenu').removeChild(document.getElementById("slashdotterQROption"));
		}
	},
	
	// @done
	quickReply : function (event) {
		if (event.which == 2 || event.metaKey || event.ctrlKey) var inNewTab = true;
		else inNewTab = false;
		
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
				if (replyLink.nodeName == "A"){
					var linkURL = "http:" + replyLink.getAttribute("href") + "&postercomment=" + encodeURIComponent(SLASHDOTTER.prefs.getCharPref("replyFormat").replace(/%s/g, theSelection.toString()));
					
					if (inNewTab || SLASHDOTTER.prefs.getBoolPref("replyInNewTab")){
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
					textfield.value = SLASHDOTTER.prefs.getCharPref("replyFormat").replace(/%s/g, theSelection.toString());
					
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
	
	// @done
	getCommentContainer : function (node) {
		while (node){
			if ((node.nodeName == "DIV") && ((node.className.indexOf("commentBody") != -1) || (node.className == "body"))){
				return node;
			}
			
			node = node.parentNode;
		}
		
		return null;
	},
	
	// @done
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
	
	// @done
	addCommentToggles : function (page) {
		SLASHDOTTER.$(page).find("li.comment.contain div.commentSub").each(function () {
			var thisComment = this;
			
			if (SLASHDOTTER.$(this).parents("li.comment:first").find("li.comment").length > 0) {
				var thisNode = SLASHDOTTER.getNextReplyLink(thisComment);
		
				if (thisNode){
					thisNode = thisNode.parentNode.parentNode.parentNode;
			
					var toggleSpan = page.createElement("span");
					toggleSpan.setAttribute("class","nbutton");
					toggleSpan.innerHTML = '<p><b><a href="javascript:void(0);" onclick="for (var z in this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes){ if (this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[z].nodeName == \'UL\'){ if (this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[z].style.display != \'none\') { this.innerHTML = \'Show Replies\'; this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[z].style.display = \'none\'; } else { this.innerHTML = \'Hide Replies\'; this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[z].style.display = \'\'; } } }">Hide Replies</a></b></p>';
			
					thisNode.parentNode.insertBefore(toggleSpan, thisNode);				
					thisNode.parentNode.insertBefore(page.createTextNode(" "), thisNode);
				}
			}
		});
	},
	
	// @done, except for ponies
	applyStyle : function (page, style) {
		SLASHDOTTER.$(page).find("link.data-skin[rel='stylesheet']").remove();
		
		var head = page.getElementsByTagName("head")[0];
		
		if (style != 'main'){
			var styleNode = page.createElement("link");
			styleNode.rel = "stylesheet";
			styleNode.type = "text/css";
			styleNode.media = "screen, projection";
			styleNode.setAttribute("class", "data-skin");
			
			if (style != 'ponies'){
//				styleNode.href = 'chrome://slashdotter/skin/ponies/style.css';
//			}
//			else {
				styleNode.href = "//a.fsdn.com/sd/yui_" + style + ".css";
			}
			
			head.appendChild(styleNode);
		}
	},
	
	// @done
	increasePadding : function(page){
		SLASHDOTTER.$(page).find("head").append('<style type="text/css"> #commentlisting li.comment li.comment { margin-left: 3em; } </style>');
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