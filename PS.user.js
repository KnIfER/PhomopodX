// ==UserScript==
// @name         PS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://127.0.0.1:8080/base/photos/0
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @require      file:///D:\Code\FigureOut\chrome\extesions\TamperMonkey\PS.user.js
// ==/UserScript==

var d = document, w0=window, win=window.unsafeWindow||window, bank=win._PS_bank;
if(!bank) {
	bank = win._PS_bank = {};
} else {
	bank.unreg();
}
var unregs = [];
bank.unreg = function () {
	for(var i=0;i<unregs.length;i++) {
		unregs[i]();
	}
	return 0;
};

function addEvent(a, b, c, d) {
	if(!d) d = win;
	d.addEventListener(a, b, c);
	unregs.push(function(){ d.removeEventListener(a, b, c)} );
}
function delEvent(a, b, c, d) {
	if(!d) d = win;
	d.removeEventListener(a, b, c);
}


	var cman = gc('cmanager');

	
	debug("PSPS", win)
	
	const originalRemove_ = Element.prototype.removeChild;
	var hack = 0;

	// Override the remove method
	Element.prototype.removeChild = function(e) {
		// Check if the element should be protected
		// if (!e.classList || e.classList.contains('fp-player')) {
		// 	console.log('removeChild to remove protected element prevented.');
		// 	throw 1;
		// 	return; // Prevent removal
		// }
		
		if(hack) {
			var ret = originalRemove_.call(this, e);
			setTimeout(() => {
				this.append(e);
			}, 1000);
			return ret;
		}
		
		// // Call the original remove method for other elements
		originalRemove_.call(this, e);
	};
	
	
	// setTimeout(() => {
	// 	hack = 1;
	// }, 1000);
	
	
	
	
	setTimeout(() => {
		cman = gc('cmanager');
		de('cman', cman)
		
		
	}, 250);

	addEvent('pointerup', e=>{
		// setTimeout(() => {
		// 	lastTool = win.currentTool||lastTool;
		// }, 350);
		if(cman.children.length==3 && gc('contextpanel', cman)) {
			var fileMenu = document.querySelector("body > div.flexrow.phomopodX > div > div.cmanager > div.contextpanel > div:nth-child(11)");
			if(fileMenu)
			if(fileMenu.innerText.startsWith('导出') || fileMenu.innerText.startsWith('Export')) {
				de('yes')
				fileMenu.click();
				var moreBtn = document.querySelector("body > div.flexrow.phomopodX > div > div.cmanager > div:nth-child(4) > div:nth-child(6)")
				// if(moreBtn) {
					moreBtn.click();
				// }
				
			}
		}
	}, 1)

	var lastClipReq = 0;
	
	addEvent('contextmenu', e=>{
		var t = e.target;
		de(t);
		if(cman.children.length>3) {
			var menu = gcp('enab', t, 3);
			if(menu) {
				// de(t)
				lastClipReq = Date.now();
				t = menu.innerText;
				var idx = t.indexOf('.');
				if(idx>0) {
					var A = t.slice(0, idx).trim().toLowerCase()
					var B = t.slice(idx+1).trim()
					de('AABB', A, B)
					if(A==B) {
						menu.click();
						var saveBtn = gc("fitem spread bbtn");
						de('saveBtn::', saveBtn)
						if(saveBtn) {
							lastClipReq = Date.now();
							saveBtn.click();
							closeWindow(saveBtn);
						}
					}
				}
				return;
			}
			stop(e);
		}
		
		if(t.tagName==='BUTTON') {
			var btn = t;
			if(btn.classList.contains('fitem') && (btn.innerText.includes('保存')||btn.innerText.includes('Save'))) {
				lastClipReq = Date.now();
				btn.click();
				closeWindow(btn);
				stop(e);
			}
		}
	}, 1)


	addEvent('keyup', e=>{
		if(e.code==='KeyI' ){ //&& switched_picker     switch back
			if(e.timeStamp-lastPickTm>350)
				switchTool(lastTool = prevTool)
			stop(e)
		}
		switched_picker = 0;
	}, true);
	
	function closeWindow(btn) {
		// gc('cross', gcp('window', btn)).click();
		clickElement(gc('cross', gcp('window', btn)))
	}
	
	function twoDigSize(sz) {
		return Math.round(sz/1024*100)/100;
	}
	
	URL.createObjectURLRaw ||= URL.createObjectURL;
	URL.createObjectURL = function(blob) {
		de('Intercepted blob:', blob, blob.type);
		
		if (blob.type.startsWith('image/') && (Date.now()-lastClipReq)<1350) { // 
			createImageBitmap(blob).then(imageBitmap => {
				const canvas = document.createElement('canvas');
				canvas.width = imageBitmap.width;
				canvas.height = imageBitmap.height;
				const context = canvas.getContext('2d');
				context.drawImage(imageBitmap, 0, 0);
	
				canvas.toBlob(async (canvasBlob) => {
					try {
						await navigator.clipboard.write([
							new ClipboardItem({ [canvasBlob.type]: canvasBlob })
						]);
						de('Image copied to clipboard');
						toast('已复制图像::'+imageBitmap.width+'x'+imageBitmap.height);
					} catch (err) {
						de('Failed to copy image to clipboard:', err);
					}
				}, blob.type);
			});
			// return 0;
			throw 1;
		} 
		
		// const reader = new FileReader();
		// reader.onload = function(event) {
		// 	de('Blob content:', event.target.result);
		// };
		// reader.readAsText(blob);
		
		return URL.createObjectURLRaw.call(URL, blob);
	};


	US_addStyle(`
html,body{
	color-scheme:light only;
}
.contextpanel{
	color-scheme:auto;
}
.cross{
}
.window .cross{
    background-size: 22px;
    background-position-y: 55%;
    background-position-x: 50%;
    background-repeat: no-repeat;
    padding: 11px;
    margin: 10px;
    right: 0;
    position: absolute;
}
	`, 'PS')

	
	
	
	
	win.lastTool = 19;
	var prevTool = 19;
	function switchTool(e) {
		switch_tool(e)
	}
	var lastPickTm = 0
	
	addEvent('click', e=>{
		if(lastTool==13 && e.timeStamp-lastPickTm<750) {
			toast("pick")
		}
		lastPickTm = 0
	}, true);
	var switched_picker = false;
	addEvent('keydown', e=>{
		if(e.code==='KeyI'){
			stopX(e)
			switched_picker = 1;
			if(lastTool!=13) {
				lastPickTm = e.timeStamp;
				prevTool = lastTool;
				switch_tool(lastTool = 13);
			}
		}
		if(e.code==='KeyB'){
			stopX(e)
			switch_tool(lastTool = 19)
		}
		if(e.code==='KeyG'){
			stopX(e)
			switch_tool(26)
		}
	}, true);