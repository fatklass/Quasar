// Source: lib/QJSON.class.js
/*
	Simple JSON Controller for Quasar
*/
var QJSON = function (name, fromData) {
	if (fromData){
		var json = localStorage.getItem(name);
		
		if( typeof json == "undefined" || json == null){
			json = {};
		}	
		this.initialize( json );
	}else
		this.initialize(name);
};

QJSON.prototype = {
	dataname : "",
	cache : {},
	initialize : function (json) {
		if (json.constructor == "".constructor) {
			this.load(json);
		} else {
			this.cache = json;
		}
	},
	load : function (name) {
		this.dataname = name;
		this.cache = JSON.parse(localStorage.getItem(name));
		if (this.cache === null) {
			this.cache = {};
			this.save();
		}
	},
	save : function () {
		localStorage.setItem(this.dataname, JSON.stringify(this.cache));
	},
	get : function (index) {
		if (typeof this.cache[index] !== "undefined") {
			return this.cache[index];
		}
		if (index.constructor == new Number().constructor) {
			var i = 0;
			for (var chave in this.cache) {
				if (i == index) {
					return this.cache[chave];
				}
				i++;
			}
		}
		return null;
	},
	swap : function (chave1, chave2) {
		if (this.get(chave1) === null || this.get(chave2) === null)
			return;
		var temp = this.get(chave1);
		this.set(chave1, this.get(chave2));
		this.set(chave2, temp);
	},
	set : function (name, val) {
		this.cache[name] = val;
	},
	add : function (chave, val) {
		this.set(chave, val);
	},
	remove : function (name) {
		var n = {};
		for (var chave in this.cache) {
			if (chave !== name) {
				n[chave] = this.cache[chave];
			}
		}
		this.cache = n;
	},
	toString : function () {
		return JSON.stringify(this.cache);
	},
	toJSON : function () {
		return this.cache;
	},
	contains : function (chave) {
		if (typeof this.cache[chave] !== "undefined") {
			return true;
		}
		return false;
	},
	length : function () {
		var i = 0;
		for (var chave in this.cache) {
			i++;
		}
		return i;
	},
	first : function () {
		for (var chave in this.cache) {
			return this.cache[chave];
		}
	},
	firstKey : function () {
		for (var chave in this.cache) {
			return chave;
		}
	},
	getIndexOf : function (item) {
		var i = 0;
		for (var chave in this.cache) {
			if (chave == item)
				return i;
			i++;
		}
		return null;
	}
};

// Source: lib/custom.prototype.js
String.prototype.replaces = function (a, b) {
	return this.replace(a, b);
};
String.prototype.replaceAll = function (de, para) {
	var str = this;
	var pos = str.indexOf(de);
	while (pos > -1) {
		str = str.replace(de, para);
		pos = str.indexOf(de);
	}
	return (str);
};
String.prototype.contains = function (a) {
	if (this.indexOf(a) > -1)
		return true;
	else
		return false;
};

// Source: lib/jquery-ui.min.js
/*! jQuery UI - v1.11.2 - 2014-11-02
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, sortable.js, tabs.js, tooltip.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

(function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){function t(t,s){var n,a,o,r=t.nodeName.toLowerCase();return"area"===r?(n=t.parentNode,a=n.name,t.href&&a&&"map"===n.nodeName.toLowerCase()?(o=e("img[usemap='#"+a+"']")[0],!!o&&i(o)):!1):(/input|select|textarea|button|object/.test(r)?!t.disabled:"a"===r?t.href||s:s)&&i(t)}function i(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}e.ui=e.ui||{},e.extend(e.ui,{version:"1.11.2",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({scrollParent:function(t){var i=this.css("position"),s="absolute"===i,n=t?/(auto|scroll|hidden)/:/(auto|scroll)/,a=this.parents().filter(function(){var t=e(this);return s&&"static"===t.css("position")?!1:n.test(t.css("overflow")+t.css("overflow-y")+t.css("overflow-x"))}).eq(0);return"fixed"!==i&&a.length?a:e(this[0].ownerDocument||document)},uniqueId:function(){var e=0;return function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++e)})}}(),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(i){return t(i,!isNaN(e.attr(i,"tabindex")))},tabbable:function(i){var s=e.attr(i,"tabindex"),n=isNaN(s);return(n||s>=0)&&t(i,!n)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(t,i){function s(t,i,s,a){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),a&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===i?["Left","Right"]:["Top","Bottom"],a=i.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+i]=function(t){return void 0===t?o["inner"+i].call(this):this.each(function(){e(this).css(a,s(this,t)+"px")})},e.fn["outer"+i]=function(t,n){return"number"!=typeof t?o["outer"+i].call(this,t):this.each(function(){e(this).css(a,s(this,t,!0,n)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),disableSelection:function(){var e="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.bind(e+".ui-disableSelection",function(e){e.preventDefault()})}}(),enableSelection:function(){return this.unbind(".ui-disableSelection")},zIndex:function(t){if(void 0!==t)return this.css("zIndex",t);if(this.length)for(var i,s,n=e(this[0]);n.length&&n[0]!==document;){if(i=n.css("position"),("absolute"===i||"relative"===i||"fixed"===i)&&(s=parseInt(n.css("zIndex"),10),!isNaN(s)&&0!==s))return s;n=n.parent()}return 0}}),e.ui.plugin={add:function(t,i,s){var n,a=e.ui[t].prototype;for(n in s)a.plugins[n]=a.plugins[n]||[],a.plugins[n].push([i,s[n]])},call:function(e,t,i,s){var n,a=e.plugins[t];if(a&&(s||e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType))for(n=0;a.length>n;n++)e.options[a[n][0]]&&a[n][1].apply(e.element,i)}};var s=0,n=Array.prototype.slice;e.cleanData=function(t){return function(i){var s,n,a;for(a=0;null!=(n=i[a]);a++)try{s=e._data(n,"events"),s&&s.remove&&e(n).triggerHandler("remove")}catch(o){}t(i)}}(e.cleanData),e.widget=function(t,i,s){var n,a,o,r,h={},l=t.split(".")[0];return t=t.split(".")[1],n=l+"-"+t,s||(s=i,i=e.Widget),e.expr[":"][n.toLowerCase()]=function(t){return!!e.data(t,n)},e[l]=e[l]||{},a=e[l][t],o=e[l][t]=function(e,t){return this._createWidget?(arguments.length&&this._createWidget(e,t),void 0):new o(e,t)},e.extend(o,a,{version:s.version,_proto:e.extend({},s),_childConstructors:[]}),r=new i,r.options=e.widget.extend({},r.options),e.each(s,function(t,s){return e.isFunction(s)?(h[t]=function(){var e=function(){return i.prototype[t].apply(this,arguments)},n=function(e){return i.prototype[t].apply(this,e)};return function(){var t,i=this._super,a=this._superApply;return this._super=e,this._superApply=n,t=s.apply(this,arguments),this._super=i,this._superApply=a,t}}(),void 0):(h[t]=s,void 0)}),o.prototype=e.widget.extend(r,{widgetEventPrefix:a?r.widgetEventPrefix||t:t},h,{constructor:o,namespace:l,widgetName:t,widgetFullName:n}),a?(e.each(a._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete a._childConstructors):i._childConstructors.push(o),e.widget.bridge(t,o),o},e.widget.extend=function(t){for(var i,s,a=n.call(arguments,1),o=0,r=a.length;r>o;o++)for(i in a[o])s=a[o][i],a[o].hasOwnProperty(i)&&void 0!==s&&(t[i]=e.isPlainObject(s)?e.isPlainObject(t[i])?e.widget.extend({},t[i],s):e.widget.extend({},s):s);return t},e.widget.bridge=function(t,i){var s=i.prototype.widgetFullName||t;e.fn[t]=function(a){var o="string"==typeof a,r=n.call(arguments,1),h=this;return a=!o&&r.length?e.widget.extend.apply(null,[a].concat(r)):a,o?this.each(function(){var i,n=e.data(this,s);return"instance"===a?(h=n,!1):n?e.isFunction(n[a])&&"_"!==a.charAt(0)?(i=n[a].apply(n,r),i!==n&&void 0!==i?(h=i&&i.jquery?h.pushStack(i.get()):i,!1):void 0):e.error("no such method '"+a+"' for "+t+" widget instance"):e.error("cannot call methods on "+t+" prior to initialization; "+"attempted to call method '"+a+"'")}):this.each(function(){var t=e.data(this,s);t?(t.option(a||{}),t._init&&t._init()):e.data(this,s,new i(a,this))}),h}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,i){i=e(i||this.defaultElement||this)[0],this.element=e(i),this.uuid=s++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=e(),this.hoverable=e(),this.focusable=e(),i!==this&&(e.data(i,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===i&&this.destroy()}}),this.document=e(i.style?i.ownerDocument:i.document||i),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(t,i){var s,n,a,o=t;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof t)if(o={},s=t.split("."),t=s.shift(),s.length){for(n=o[t]=e.widget.extend({},this.options[t]),a=0;s.length-1>a;a++)n[s[a]]=n[s[a]]||{},n=n[s[a]];if(t=s.pop(),1===arguments.length)return void 0===n[t]?null:n[t];n[t]=i}else{if(1===arguments.length)return void 0===this.options[t]?null:this.options[t];o[t]=i}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled",!!t),t&&(this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus"))),this},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_on:function(t,i,s){var n,a=this;"boolean"!=typeof t&&(s=i,i=t,t=!1),s?(i=n=e(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),e.each(s,function(s,o){function r(){return t||a.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?a[o]:o).apply(a,arguments):void 0}"string"!=typeof o&&(r.guid=o.guid=o.guid||r.guid||e.guid++);var h=s.match(/^([\w:-]*)\s*(.*)$/),l=h[1]+a.eventNamespace,u=h[2];u?n.delegate(u,l,r):i.bind(l,r)})},_off:function(t,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(i).undelegate(i),this.bindings=e(this.bindings.not(t).get()),this.focusable=e(this.focusable.not(t).get()),this.hoverable=e(this.hoverable.not(t).get())},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,o=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(o)&&o.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var o,r=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),o=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),o&&e.effects&&e.effects.effect[r]?s[t](n):r!==t&&s[r]?s[r](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}}),e.widget;var a=!1;e(document).mouseup(function(){a=!1}),e.widget("ui.mouse",{version:"1.11.2",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(t){if(!a){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(t),this._mouseDownEvent=t;var i=this,s=1===t.which,n="string"==typeof this.options.cancel&&t.target.nodeName?e(t.target).closest(this.options.cancel).length:!1;return s&&!n&&this._mouseCapture(t)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(t)!==!1,!this._mouseStarted)?(t.preventDefault(),!0):(!0===e.data(t.target,this.widgetName+".preventClickEvent")&&e.removeData(t.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return i._mouseMove(e)},this._mouseUpDelegate=function(e){return i._mouseUp(e)},this.document.bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),t.preventDefault(),a=!0,!0)):!0}},_mouseMove:function(t){if(this._mouseMoved){if(e.ui.ie&&(!document.documentMode||9>document.documentMode)&&!t.button)return this._mouseUp(t);if(!t.which)return this._mouseUp(t)}return(t.which||t.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted)},_mouseUp:function(t){return this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),a=!1,!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),function(){function t(e,t,i){return[parseFloat(e[0])*(p.test(e[0])?t/100:1),parseFloat(e[1])*(p.test(e[1])?i/100:1)]}function i(t,i){return parseInt(e.css(t,i),10)||0}function s(t){var i=t[0];return 9===i.nodeType?{width:t.width(),height:t.height(),offset:{top:0,left:0}}:e.isWindow(i)?{width:t.width(),height:t.height(),offset:{top:t.scrollTop(),left:t.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:t.outerWidth(),height:t.outerHeight(),offset:t.offset()}}e.ui=e.ui||{};var n,a,o=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,u=/top|center|bottom/,c=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=e.fn.position;e.position={scrollbarWidth:function(){if(void 0!==n)return n;var t,i,s=e("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),a=s.children()[0];return e("body").append(s),t=a.offsetWidth,s.css("overflow","scroll"),i=a.offsetWidth,t===i&&(i=s[0].clientWidth),s.remove(),n=t-i},getScrollInfo:function(t){var i=t.isWindow||t.isDocument?"":t.element.css("overflow-x"),s=t.isWindow||t.isDocument?"":t.element.css("overflow-y"),n="scroll"===i||"auto"===i&&t.width<t.element[0].scrollWidth,a="scroll"===s||"auto"===s&&t.height<t.element[0].scrollHeight;return{width:a?e.position.scrollbarWidth():0,height:n?e.position.scrollbarWidth():0}},getWithinInfo:function(t){var i=e(t||window),s=e.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType;return{element:i,isWindow:s,isDocument:n,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s||n?i.width():i.outerWidth(),height:s||n?i.height():i.outerHeight()}}},e.fn.position=function(n){if(!n||!n.of)return f.apply(this,arguments);n=e.extend({},n);var p,m,g,v,b,y,_=e(n.of),x=e.position.getWithinInfo(n.within),w=e.position.getScrollInfo(x),k=(n.collision||"flip").split(" "),T={};return y=s(_),_[0].preventDefault&&(n.at="left top"),m=y.width,g=y.height,v=y.offset,b=e.extend({},v),e.each(["my","at"],function(){var e,t,i=(n[this]||"").split(" ");1===i.length&&(i=l.test(i[0])?i.concat(["center"]):u.test(i[0])?["center"].concat(i):["center","center"]),i[0]=l.test(i[0])?i[0]:"center",i[1]=u.test(i[1])?i[1]:"center",e=c.exec(i[0]),t=c.exec(i[1]),T[this]=[e?e[0]:0,t?t[0]:0],n[this]=[d.exec(i[0])[0],d.exec(i[1])[0]]}),1===k.length&&(k[1]=k[0]),"right"===n.at[0]?b.left+=m:"center"===n.at[0]&&(b.left+=m/2),"bottom"===n.at[1]?b.top+=g:"center"===n.at[1]&&(b.top+=g/2),p=t(T.at,m,g),b.left+=p[0],b.top+=p[1],this.each(function(){var s,l,u=e(this),c=u.outerWidth(),d=u.outerHeight(),f=i(this,"marginLeft"),y=i(this,"marginTop"),D=c+f+i(this,"marginRight")+w.width,S=d+y+i(this,"marginBottom")+w.height,N=e.extend({},b),M=t(T.my,u.outerWidth(),u.outerHeight());"right"===n.my[0]?N.left-=c:"center"===n.my[0]&&(N.left-=c/2),"bottom"===n.my[1]?N.top-=d:"center"===n.my[1]&&(N.top-=d/2),N.left+=M[0],N.top+=M[1],a||(N.left=h(N.left),N.top=h(N.top)),s={marginLeft:f,marginTop:y},e.each(["left","top"],function(t,i){e.ui.position[k[t]]&&e.ui.position[k[t]][i](N,{targetWidth:m,targetHeight:g,elemWidth:c,elemHeight:d,collisionPosition:s,collisionWidth:D,collisionHeight:S,offset:[p[0]+M[0],p[1]+M[1]],my:n.my,at:n.at,within:x,elem:u})}),n.using&&(l=function(e){var t=v.left-N.left,i=t+m-c,s=v.top-N.top,a=s+g-d,h={target:{element:_,left:v.left,top:v.top,width:m,height:g},element:{element:u,left:N.left,top:N.top,width:c,height:d},horizontal:0>i?"left":t>0?"right":"center",vertical:0>a?"top":s>0?"bottom":"middle"};c>m&&m>r(t+i)&&(h.horizontal="center"),d>g&&g>r(s+a)&&(h.vertical="middle"),h.important=o(r(t),r(i))>o(r(s),r(a))?"horizontal":"vertical",n.using.call(this,e,h)}),u.offset(e.extend(N,{using:l}))})},e.ui.position={fit:{left:function(e,t){var i,s=t.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=e.left-t.collisionPosition.marginLeft,h=n-r,l=r+t.collisionWidth-a-n;t.collisionWidth>a?h>0&&0>=l?(i=e.left+h+t.collisionWidth-a-n,e.left+=h-i):e.left=l>0&&0>=h?n:h>l?n+a-t.collisionWidth:n:h>0?e.left+=h:l>0?e.left-=l:e.left=o(e.left-r,e.left)},top:function(e,t){var i,s=t.within,n=s.isWindow?s.scrollTop:s.offset.top,a=t.within.height,r=e.top-t.collisionPosition.marginTop,h=n-r,l=r+t.collisionHeight-a-n;t.collisionHeight>a?h>0&&0>=l?(i=e.top+h+t.collisionHeight-a-n,e.top+=h-i):e.top=l>0&&0>=h?n:h>l?n+a-t.collisionHeight:n:h>0?e.top+=h:l>0?e.top-=l:e.top=o(e.top-r,e.top)}},flip:{left:function(e,t){var i,s,n=t.within,a=n.offset.left+n.scrollLeft,o=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=e.left-t.collisionPosition.marginLeft,u=l-h,c=l+t.collisionWidth-o-h,d="left"===t.my[0]?-t.elemWidth:"right"===t.my[0]?t.elemWidth:0,p="left"===t.at[0]?t.targetWidth:"right"===t.at[0]?-t.targetWidth:0,f=-2*t.offset[0];0>u?(i=e.left+d+p+f+t.collisionWidth-o-a,(0>i||r(u)>i)&&(e.left+=d+p+f)):c>0&&(s=e.left-t.collisionPosition.marginLeft+d+p+f-h,(s>0||c>r(s))&&(e.left+=d+p+f))},top:function(e,t){var i,s,n=t.within,a=n.offset.top+n.scrollTop,o=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=e.top-t.collisionPosition.marginTop,u=l-h,c=l+t.collisionHeight-o-h,d="top"===t.my[1],p=d?-t.elemHeight:"bottom"===t.my[1]?t.elemHeight:0,f="top"===t.at[1]?t.targetHeight:"bottom"===t.at[1]?-t.targetHeight:0,m=-2*t.offset[1];0>u?(s=e.top+p+f+m+t.collisionHeight-o-a,e.top+p+f+m>u&&(0>s||r(u)>s)&&(e.top+=p+f+m)):c>0&&(i=e.top-t.collisionPosition.marginTop+p+f+m-h,e.top+p+f+m>c&&(i>0||c>r(i))&&(e.top+=p+f+m))}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments)},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments)}}},function(){var t,i,s,n,o,r=document.getElementsByTagName("body")[0],h=document.createElement("div");t=document.createElement(r?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},r&&e.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(o in s)t.style[o]=s[o];t.appendChild(h),i=r||document.documentElement,i.insertBefore(t,i.firstChild),h.style.cssText="position: absolute; left: 10.7432222px;",n=e(h).offset().left,a=n>10&&11>n,t.innerHTML="",i.removeChild(t)}()}(),e.ui.position,e.widget("ui.sortable",e.ui.mouse,{version:"1.11.2",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_isOverAxis:function(e,t,i){return e>=t&&t+i>e},_isFloating:function(e){return/left|right/.test(e.css("float"))||/inline|table-cell/.test(e.css("display"))},_create:function(){var e=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?"x"===e.axis||this._isFloating(this.items[0].item):!1,this.offset=this.element.offset(),this._mouseInit(),this._setHandleClassName(),this.ready=!0},_setOption:function(e,t){this._super(e,t),"handle"===e&&this._setHandleClassName()},_setHandleClassName:function(){this.element.find(".ui-sortable-handle").removeClass("ui-sortable-handle"),e.each(this.items,function(){(this.instance.options.handle?this.item.find(this.instance.options.handle):this.item).addClass("ui-sortable-handle")})},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").find(".ui-sortable-handle").removeClass("ui-sortable-handle"),this._mouseDestroy();for(var e=this.items.length-1;e>=0;e--)this.items[e].item.removeData(this.widgetName+"-item");return this},_mouseCapture:function(t,i){var s=null,n=!1,a=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(t),e(t.target).parents().each(function(){return e.data(this,a.widgetName+"-item")===a?(s=e(this),!1):void 0}),e.data(t.target,a.widgetName+"-item")===a&&(s=e(t.target)),s?!this.options.handle||i||(e(this.options.handle,s).find("*").addBack().each(function(){this===t.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(t,i,s){var n,a,o=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(t),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,o.cursorAt&&this._adjustOffsetFromHelper(o.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),o.containment&&this._setContainment(),o.cursor&&"auto"!==o.cursor&&(a=this.document.find("body"),this.storedCursor=a.css("cursor"),a.css("cursor",o.cursor),this.storedStylesheet=e("<style>*{ cursor: "+o.cursor+" !important; }</style>").appendTo(a)),o.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",o.opacity)),o.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",o.zIndex)),this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",t,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",t,this._uiHash(this));return e.ui.ddmanager&&(e.ui.ddmanager.current=this),e.ui.ddmanager&&!o.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(t),!0},_mouseDrag:function(t){var i,s,n,a,o=this.options,r=!1;for(this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-t.pageY<o.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+o.scrollSpeed:t.pageY-this.overflowOffset.top<o.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-o.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-t.pageX<o.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+o.scrollSpeed:t.pageX-this.overflowOffset.left<o.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-o.scrollSpeed)):(t.pageY-e(document).scrollTop()<o.scrollSensitivity?r=e(document).scrollTop(e(document).scrollTop()-o.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<o.scrollSensitivity&&(r=e(document).scrollTop(e(document).scrollTop()+o.scrollSpeed)),t.pageX-e(document).scrollLeft()<o.scrollSensitivity?r=e(document).scrollLeft(e(document).scrollLeft()-o.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<o.scrollSensitivity&&(r=e(document).scrollLeft(e(document).scrollLeft()+o.scrollSpeed))),r!==!1&&e.ui.ddmanager&&!o.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],a=this._intersectsWithPointer(s),a&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===a?"next":"prev"]()[0]!==n&&!e.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!e.contains(this.element[0],n):!0)){if(this.direction=1===a?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(t,s),this._trigger("change",t,this._uiHash());break}return this._contactContainers(t),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),this._trigger("sort",t,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(t,i){if(t){if(e.ui.ddmanager&&!this.options.dropBehaviour&&e.ui.ddmanager.drop(this,t),this.options.revert){var s=this,n=this.placeholder.offset(),a=this.options.axis,o={};a&&"x"!==a||(o.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft)),a&&"y"!==a||(o.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,e(this.helper).animate(o,parseInt(this.options.revert,10)||500,function(){s._clear(t)})}else this._clear(t,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var t=this.containers.length-1;t>=0;t--)this.containers[t]._trigger("deactivate",null,this._uiHash(this)),this.containers[t].containerCache.over&&(this.containers[t]._trigger("out",null,this._uiHash(this)),this.containers[t].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),e.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?e(this.domPosition.prev).after(this.currentItem):e(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(t){var i=this._getItemsAsjQuery(t&&t.connected),s=[];return t=t||{},e(i).each(function(){var i=(e(t.item||this).attr(t.attribute||"id")||"").match(t.expression||/(.+)[\-=_](.+)/);i&&s.push((t.key||i[1]+"[]")+"="+(t.key&&t.expression?i[1]:i[2]))}),!s.length&&t.key&&s.push(t.key+"="),s.join("&")},toArray:function(t){var i=this._getItemsAsjQuery(t&&t.connected),s=[];return t=t||{},i.each(function(){s.push(e(t.item||this).attr(t.attribute||"id")||"")}),s},_intersectsWith:function(e){var t=this.positionAbs.left,i=t+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,a=e.left,o=a+e.width,r=e.top,h=r+e.height,l=this.offset.click.top,u=this.offset.click.left,c="x"===this.options.axis||s+l>r&&h>s+l,d="y"===this.options.axis||t+u>a&&o>t+u,p=c&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>e[this.floating?"width":"height"]?p:t+this.helperProportions.width/2>a&&o>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&h>n-this.helperProportions.height/2},_intersectsWithPointer:function(e){var t="x"===this.options.axis||this._isOverAxis(this.positionAbs.top+this.offset.click.top,e.top,e.height),i="y"===this.options.axis||this._isOverAxis(this.positionAbs.left+this.offset.click.left,e.left,e.width),s=t&&i,n=this._getDragVerticalDirection(),a=this._getDragHorizontalDirection();return s?this.floating?a&&"right"===a||"down"===n?2:1:n&&("down"===n?2:1):!1},_intersectsWithSides:function(e){var t=this._isOverAxis(this.positionAbs.top+this.offset.click.top,e.top+e.height/2,e.height),i=this._isOverAxis(this.positionAbs.left+this.offset.click.left,e.left+e.width/2,e.width),s=this._getDragVerticalDirection(),n=this._getDragHorizontalDirection();return this.floating&&n?"right"===n&&i||"left"===n&&!i:s&&("down"===s&&t||"up"===s&&!t)},_getDragVerticalDirection:function(){var e=this.positionAbs.top-this.lastPositionAbs.top;return 0!==e&&(e>0?"down":"up")},_getDragHorizontalDirection:function(){var e=this.positionAbs.left-this.lastPositionAbs.left;return 0!==e&&(e>0?"right":"left")},refresh:function(e){return this._refreshItems(e),this._setHandleClassName(),this.refreshPositions(),this},_connectWith:function(){var e=this.options;return e.connectWith.constructor===String?[e.connectWith]:e.connectWith},_getItemsAsjQuery:function(t){function i(){r.push(this)}var s,n,a,o,r=[],h=[],l=this._connectWith();if(l&&t)for(s=l.length-1;s>=0;s--)for(a=e(l[s]),n=a.length-1;n>=0;n--)o=e.data(a[n],this.widgetFullName),o&&o!==this&&!o.options.disabled&&h.push([e.isFunction(o.options.items)?o.options.items.call(o.element):e(o.options.items,o.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),o]);for(h.push([e.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):e(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),s=h.length-1;s>=0;s--)h[s][0].each(i);return e(r)},_removeCurrentsFromItems:function(){var t=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=e.grep(this.items,function(e){for(var i=0;t.length>i;i++)if(t[i]===e.item[0])return!1;return!0})},_refreshItems:function(t){this.items=[],this.containers=[this];var i,s,n,a,o,r,h,l,u=this.items,c=[[e.isFunction(this.options.items)?this.options.items.call(this.element[0],t,{item:this.currentItem}):e(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=e(d[i]),s=n.length-1;s>=0;s--)a=e.data(n[s],this.widgetFullName),a&&a!==this&&!a.options.disabled&&(c.push([e.isFunction(a.options.items)?a.options.items.call(a.element[0],t,{item:this.currentItem}):e(a.options.items,a.element),a]),this.containers.push(a));for(i=c.length-1;i>=0;i--)for(o=c[i][1],r=c[i][0],s=0,l=r.length;l>s;s++)h=e(r[s]),h.data(this.widgetName+"-item",o),u.push({item:h,instance:o,width:0,height:0,left:0,top:0})},refreshPositions:function(t){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,a;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?e(this.options.toleranceElement,s.item):s.item,t||(s.width=n.outerWidth(),s.height=n.outerHeight()),a=n.offset(),s.left=a.left,s.top=a.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)a=this.containers[i].element.offset(),this.containers[i].containerCache.left=a.left,this.containers[i].containerCache.top=a.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();
return this},_createPlaceholder:function(t){t=t||this;var i,s=t.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=t.currentItem[0].nodeName.toLowerCase(),n=e("<"+s+">",t.document[0]).addClass(i||t.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tr"===s?t.currentItem.children().each(function(){e("<td>&#160;</td>",t.document[0]).attr("colspan",e(this).attr("colspan")||1).appendTo(n)}):"img"===s&&n.attr("src",t.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(e,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(t.currentItem.innerHeight()-parseInt(t.currentItem.css("paddingTop")||0,10)-parseInt(t.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(t.currentItem.innerWidth()-parseInt(t.currentItem.css("paddingLeft")||0,10)-parseInt(t.currentItem.css("paddingRight")||0,10)))}}),t.placeholder=e(s.placeholder.element.call(t.element,t.currentItem)),t.currentItem.after(t.placeholder),s.placeholder.update(t,t.placeholder)},_contactContainers:function(t){var i,s,n,a,o,r,h,l,u,c,d=null,p=null;for(i=this.containers.length-1;i>=0;i--)if(!e.contains(this.currentItem[0],this.containers[i].element[0]))if(this._intersectsWith(this.containers[i].containerCache)){if(d&&e.contains(this.containers[i].element[0],d.element[0]))continue;d=this.containers[i],p=i}else this.containers[i].containerCache.over&&(this.containers[i]._trigger("out",t,this._uiHash(this)),this.containers[i].containerCache.over=0);if(d)if(1===this.containers.length)this.containers[p].containerCache.over||(this.containers[p]._trigger("over",t,this._uiHash(this)),this.containers[p].containerCache.over=1);else{for(n=1e4,a=null,u=d.floating||this._isFloating(this.currentItem),o=u?"left":"top",r=u?"width":"height",c=u?"clientX":"clientY",s=this.items.length-1;s>=0;s--)e.contains(this.containers[p].element[0],this.items[s].item[0])&&this.items[s].item[0]!==this.currentItem[0]&&(h=this.items[s].item.offset()[o],l=!1,t[c]-h>this.items[s][r]/2&&(l=!0),n>Math.abs(t[c]-h)&&(n=Math.abs(t[c]-h),a=this.items[s],this.direction=l?"up":"down"));if(!a&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[p])return this.currentContainer.containerCache.over||(this.containers[p]._trigger("over",t,this._uiHash()),this.currentContainer.containerCache.over=1),void 0;a?this._rearrange(t,a,null,!0):this._rearrange(t,null,this.containers[p].element,!0),this._trigger("change",t,this._uiHash()),this.containers[p]._trigger("change",t,this._uiHash(this)),this.currentContainer=this.containers[p],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[p]._trigger("over",t,this._uiHash(this)),this.containers[p].containerCache.over=1}},_createHelper:function(t){var i=this.options,s=e.isFunction(i.helper)?e(i.helper.apply(this.element[0],[t,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||e("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&e.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var e=this.currentItem.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,e("document"===n.containment?document:window).width()-this.helperProportions.width-this.margins.left,(e("document"===n.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(t=e(n.containment)[0],i=e(n.containment).offset(),s="hidden"!==e(t).css("overflow"),this.containment=[i.left+(parseInt(e(t).css("borderLeftWidth"),10)||0)+(parseInt(e(t).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(e(t).css("borderTopWidth"),10)||0)+(parseInt(e(t).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(t.scrollWidth,t.offsetWidth):t.offsetWidth)-(parseInt(e(t).css("borderLeftWidth"),10)||0)-(parseInt(e(t).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(t.scrollHeight,t.offsetHeight):t.offsetHeight)-(parseInt(e(t).css("borderTopWidth"),10)||0)-(parseInt(e(t).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(t,i){i||(i=this.position);var s="absolute"===t?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,a=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():a?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():a?0:n.scrollLeft())*s}},_generatePosition:function(t){var i,s,n=this.options,a=t.pageX,o=t.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(t.pageX-this.offset.click.left<this.containment[0]&&(a=this.containment[0]+this.offset.click.left),t.pageY-this.offset.click.top<this.containment[1]&&(o=this.containment[1]+this.offset.click.top),t.pageX-this.offset.click.left>this.containment[2]&&(a=this.containment[2]+this.offset.click.left),t.pageY-this.offset.click.top>this.containment[3]&&(o=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1],o=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((a-this.originalPageX)/n.grid[0])*n.grid[0],a=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:a-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_rearrange:function(e,t,i,s){i?i[0].appendChild(this.placeholder[0]):t.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?t.item[0]:t.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(e,t){function i(e,t,i){return function(s){i._trigger(e,s,t._uiHash(t))}}this.reverting=!1;var s,n=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(s in this._storedCSS)("auto"===this._storedCSS[s]||"static"===this._storedCSS[s])&&(this._storedCSS[s]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!t&&n.push(function(e){this._trigger("receive",e,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||t||n.push(function(e){this._trigger("update",e,this._uiHash())}),this!==this.currentContainer&&(t||(n.push(function(e){this._trigger("remove",e,this._uiHash())}),n.push(function(e){return function(t){e._trigger("receive",t,this._uiHash(this))}}.call(this,this.currentContainer)),n.push(function(e){return function(t){e._trigger("update",t,this._uiHash(this))}}.call(this,this.currentContainer)))),s=this.containers.length-1;s>=0;s--)t||n.push(i("deactivate",this,this.containers[s])),this.containers[s].containerCache.over&&(n.push(i("out",this,this.containers[s])),this.containers[s].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,t||this._trigger("beforeStop",e,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.cancelHelperRemoval||(this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null),!t){for(s=0;n.length>s;s++)n[s].call(this,e);this._trigger("stop",e,this._uiHash())}return this.fromOutside=!1,!this.cancelHelperRemoval},_trigger:function(){e.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(t){var i=t||this;return{helper:i.helper,placeholder:i.placeholder||e([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:t?t.element:null}}}),e.widget("ui.tabs",{version:"1.11.2",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_isLocal:function(){var e=/#.*$/;return function(t){var i,s;t=t.cloneNode(!1),i=t.href.replace(e,""),s=location.href.replace(e,"");try{i=decodeURIComponent(i)}catch(n){}try{s=decodeURIComponent(s)}catch(n){}return t.hash.length>1&&i===s}}(),_create:function(){var t=this,i=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",i.collapsible),this._processTabs(),i.active=this._initialActive(),e.isArray(i.disabled)&&(i.disabled=e.unique(i.disabled.concat(e.map(this.tabs.filter(".ui-state-disabled"),function(e){return t.tabs.index(e)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):e(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var t=this.options.active,i=this.options.collapsible,s=location.hash.substring(1);return null===t&&(s&&this.tabs.each(function(i,n){return e(n).attr("aria-controls")===s?(t=i,!1):void 0}),null===t&&(t=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===t||-1===t)&&(t=this.tabs.length?0:!1)),t!==!1&&(t=this.tabs.index(this.tabs.eq(t)),-1===t&&(t=i?!1:0)),!i&&t===!1&&this.anchors.length&&(t=0),t},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):e()}},_tabKeydown:function(t){var i=e(this.document[0].activeElement).closest("li"),s=this.tabs.index(i),n=!0;if(!this._handlePageNav(t)){switch(t.keyCode){case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:s++;break;case e.ui.keyCode.UP:case e.ui.keyCode.LEFT:n=!1,s--;break;case e.ui.keyCode.END:s=this.anchors.length-1;break;case e.ui.keyCode.HOME:s=0;break;case e.ui.keyCode.SPACE:return t.preventDefault(),clearTimeout(this.activating),this._activate(s),void 0;case e.ui.keyCode.ENTER:return t.preventDefault(),clearTimeout(this.activating),this._activate(s===this.options.active?!1:s),void 0;default:return}t.preventDefault(),clearTimeout(this.activating),s=this._focusNextTab(s,n),t.ctrlKey||(i.attr("aria-selected","false"),this.tabs.eq(s).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",s)},this.delay))}},_panelKeydown:function(t){this._handlePageNav(t)||t.ctrlKey&&t.keyCode===e.ui.keyCode.UP&&(t.preventDefault(),this.active.focus())},_handlePageNav:function(t){return t.altKey&&t.keyCode===e.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):t.altKey&&t.keyCode===e.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):void 0},_findNextTab:function(t,i){function s(){return t>n&&(t=0),0>t&&(t=n),t}for(var n=this.tabs.length-1;-1!==e.inArray(s(),this.options.disabled);)t=i?t+1:t-1;return t},_focusNextTab:function(e,t){return e=this._findNextTab(e,t),this.tabs.eq(e).focus(),e},_setOption:function(e,t){return"active"===e?(this._activate(t),void 0):"disabled"===e?(this._setupDisabled(t),void 0):(this._super(e,t),"collapsible"===e&&(this.element.toggleClass("ui-tabs-collapsible",t),t||this.options.active!==!1||this._activate(0)),"event"===e&&this._setupEvents(t),"heightStyle"===e&&this._setupHeightStyle(t),void 0)},_sanitizeSelector:function(e){return e?e.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var t=this.options,i=this.tablist.children(":has(a[href])");t.disabled=e.map(i.filter(".ui-state-disabled"),function(e){return i.index(e)}),this._processTabs(),t.active!==!1&&this.anchors.length?this.active.length&&!e.contains(this.tablist[0],this.active[0])?this.tabs.length===t.disabled.length?(t.active=!1,this.active=e()):this._activate(this._findNextTab(Math.max(0,t.active-1),!1)):t.active=this.tabs.index(this.active):(t.active=!1,this.active=e()),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false","aria-expanded":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var t=this,i=this.tabs,s=this.anchors,n=this.panels;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist").delegate("> li","mousedown"+this.eventNamespace,function(t){e(this).is(".ui-state-disabled")&&t.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){e(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return e("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=e(),this.anchors.each(function(i,s){var n,a,o,r=e(s).uniqueId().attr("id"),h=e(s).closest("li"),l=h.attr("aria-controls");t._isLocal(s)?(n=s.hash,o=n.substring(1),a=t.element.find(t._sanitizeSelector(n))):(o=h.attr("aria-controls")||e({}).uniqueId()[0].id,n="#"+o,a=t.element.find(n),a.length||(a=t._createPanel(o),a.insertAfter(t.panels[i-1]||t.tablist)),a.attr("aria-live","polite")),a.length&&(t.panels=t.panels.add(a)),l&&h.data("ui-tabs-aria-controls",l),h.attr({"aria-controls":o,"aria-labelledby":r}),a.attr("aria-labelledby",r)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel"),i&&(this._off(i.not(this.tabs)),this._off(s.not(this.anchors)),this._off(n.not(this.panels)))},_getList:function(){return this.tablist||this.element.find("ol,ul").eq(0)},_createPanel:function(t){return e("<div>").attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(t){e.isArray(t)&&(t.length?t.length===this.anchors.length&&(t=!0):t=!1);for(var i,s=0;i=this.tabs[s];s++)t===!0||-1!==e.inArray(s,t)?e(i).addClass("ui-state-disabled").attr("aria-disabled","true"):e(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=t},_setupEvents:function(t){var i={};t&&e.each(t.split(" "),function(e,t){i[t]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(!0,this.anchors,{click:function(e){e.preventDefault()}}),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(t){var i,s=this.element.parent();"fill"===t?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var t=e(this),s=t.css("position");"absolute"!==s&&"fixed"!==s&&(i-=t.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=e(this).outerHeight(!0)}),this.panels.each(function(){e(this).height(Math.max(0,i-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):"auto"===t&&(i=0,this.panels.each(function(){i=Math.max(i,e(this).height("").height())}).height(i))},_eventHandler:function(t){var i=this.options,s=this.active,n=e(t.currentTarget),a=n.closest("li"),o=a[0]===s[0],r=o&&i.collapsible,h=r?e():this._getPanelForTab(a),l=s.length?this._getPanelForTab(s):e(),u={oldTab:s,oldPanel:l,newTab:r?e():a,newPanel:h};t.preventDefault(),a.hasClass("ui-state-disabled")||a.hasClass("ui-tabs-loading")||this.running||o&&!i.collapsible||this._trigger("beforeActivate",t,u)===!1||(i.active=r?!1:this.tabs.index(a),this.active=o?e():a,this.xhr&&this.xhr.abort(),l.length||h.length||e.error("jQuery UI Tabs: Mismatching fragment identifier."),h.length&&this.load(this.tabs.index(a),t),this._toggle(t,u))},_toggle:function(t,i){function s(){a.running=!1,a._trigger("activate",t,i)}function n(){i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),o.length&&a.options.show?a._show(o,a.options.show,s):(o.show(),s())}var a=this,o=i.newPanel,r=i.oldPanel;this.running=!0,r.length&&this.options.hide?this._hide(r,this.options.hide,function(){i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),n()}):(i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),r.hide(),n()),r.attr("aria-hidden","true"),i.oldTab.attr({"aria-selected":"false","aria-expanded":"false"}),o.length&&r.length?i.oldTab.attr("tabIndex",-1):o.length&&this.tabs.filter(function(){return 0===e(this).attr("tabIndex")}).attr("tabIndex",-1),o.attr("aria-hidden","false"),i.newTab.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0})},_activate:function(t){var i,s=this._findActive(t);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:e.noop}))},_findActive:function(t){return t===!1?e():this.tabs.eq(t)},_getIndex:function(e){return"string"==typeof e&&(e=this.anchors.index(this.anchors.filter("[href$='"+e+"']"))),e},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tablist.unbind(this.eventNamespace),this.tabs.add(this.panels).each(function(){e.data(this,"ui-tabs-destroy")?e(this).remove():e(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var t=e(this),i=t.data("ui-tabs-aria-controls");i?t.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):t.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(t){var i=this.options.disabled;i!==!1&&(void 0===t?i=!1:(t=this._getIndex(t),i=e.isArray(i)?e.map(i,function(e){return e!==t?e:null}):e.map(this.tabs,function(e,i){return i!==t?i:null})),this._setupDisabled(i))},disable:function(t){var i=this.options.disabled;if(i!==!0){if(void 0===t)i=!0;else{if(t=this._getIndex(t),-1!==e.inArray(t,i))return;i=e.isArray(i)?e.merge([t],i).sort():[t]}this._setupDisabled(i)}},load:function(t,i){t=this._getIndex(t);var s=this,n=this.tabs.eq(t),a=n.find(".ui-tabs-anchor"),o=this._getPanelForTab(n),r={tab:n,panel:o};this._isLocal(a[0])||(this.xhr=e.ajax(this._ajaxSettings(a,i,r)),this.xhr&&"canceled"!==this.xhr.statusText&&(n.addClass("ui-tabs-loading"),o.attr("aria-busy","true"),this.xhr.success(function(e){setTimeout(function(){o.html(e),s._trigger("load",i,r)},1)}).complete(function(e,t){setTimeout(function(){"abort"===t&&s.panels.stop(!1,!0),n.removeClass("ui-tabs-loading"),o.removeAttr("aria-busy"),e===s.xhr&&delete s.xhr},1)})))},_ajaxSettings:function(t,i,s){var n=this;return{url:t.attr("href"),beforeSend:function(t,a){return n._trigger("beforeLoad",i,e.extend({jqXHR:t,ajaxSettings:a},s))}}},_getPanelForTab:function(t){var i=e(t).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}}),e.widget("ui.tooltip",{version:"1.11.2",options:{content:function(){var t=e(this).attr("title")||"";return e("<a>").text(t).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_addDescribedBy:function(t,i){var s=(t.attr("aria-describedby")||"").split(/\s+/);s.push(i),t.data("ui-tooltip-id",i).attr("aria-describedby",e.trim(s.join(" ")))},_removeDescribedBy:function(t){var i=t.data("ui-tooltip-id"),s=(t.attr("aria-describedby")||"").split(/\s+/),n=e.inArray(i,s);-1!==n&&s.splice(n,1),t.removeData("ui-tooltip-id"),s=e.trim(s.join(" ")),s?t.attr("aria-describedby",s):t.removeAttr("aria-describedby")},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable(),this.liveRegion=e("<div>").attr({role:"log","aria-live":"assertive","aria-relevant":"additions"}).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body)},_setOption:function(t,i){var s=this;return"disabled"===t?(this[i?"_disable":"_enable"](),this.options[t]=i,void 0):(this._super(t,i),"content"===t&&e.each(this.tooltips,function(e,t){s._updateContent(t.element)}),void 0)},_disable:function(){var t=this;e.each(this.tooltips,function(i,s){var n=e.Event("blur");n.target=n.currentTarget=s.element[0],t.close(n,!0)}),this.element.find(this.options.items).addBack().each(function(){var t=e(this);t.is("[title]")&&t.data("ui-tooltip-title",t.attr("title")).removeAttr("title")})},_enable:function(){this.element.find(this.options.items).addBack().each(function(){var t=e(this);t.data("ui-tooltip-title")&&t.attr("title",t.data("ui-tooltip-title"))})},open:function(t){var i=this,s=e(t?t.target:this.element).closest(this.options.items);s.length&&!s.data("ui-tooltip-id")&&(s.attr("title")&&s.data("ui-tooltip-title",s.attr("title")),s.data("ui-tooltip-open",!0),t&&"mouseover"===t.type&&s.parents().each(function(){var t,s=e(this);s.data("ui-tooltip-open")&&(t=e.Event("blur"),t.target=t.currentTarget=this,i.close(t,!0)),s.attr("title")&&(s.uniqueId(),i.parents[this.id]={element:this,title:s.attr("title")},s.attr("title",""))}),this._updateContent(s,t))},_updateContent:function(e,t){var i,s=this.options.content,n=this,a=t?t.type:null;return"string"==typeof s?this._open(t,e,s):(i=s.call(e[0],function(i){e.data("ui-tooltip-open")&&n._delay(function(){t&&(t.type=a),this._open(t,e,i)})}),i&&this._open(t,e,i),void 0)},_open:function(t,i,s){function n(e){u.of=e,o.is(":hidden")||o.position(u)}var a,o,r,h,l,u=e.extend({},this.options.position);if(s){if(a=this._find(i))return a.tooltip.find(".ui-tooltip-content").html(s),void 0;i.is("[title]")&&(t&&"mouseover"===t.type?i.attr("title",""):i.removeAttr("title")),a=this._tooltip(i),o=a.tooltip,this._addDescribedBy(i,o.attr("id")),o.find(".ui-tooltip-content").html(s),this.liveRegion.children().hide(),s.clone?(l=s.clone(),l.removeAttr("id").find("[id]").removeAttr("id")):l=s,e("<div>").html(l).appendTo(this.liveRegion),this.options.track&&t&&/^mouse/.test(t.type)?(this._on(this.document,{mousemove:n}),n(t)):o.position(e.extend({of:i},this.options.position)),o.hide(),this._show(o,this.options.show),this.options.show&&this.options.show.delay&&(h=this.delayedShow=setInterval(function(){o.is(":visible")&&(n(u.of),clearInterval(h))},e.fx.interval)),this._trigger("open",t,{tooltip:o}),r={keyup:function(t){if(t.keyCode===e.ui.keyCode.ESCAPE){var s=e.Event(t);s.currentTarget=i[0],this.close(s,!0)}}},i[0]!==this.element[0]&&(r.remove=function(){this._removeTooltip(o)}),t&&"mouseover"!==t.type||(r.mouseleave="close"),t&&"focusin"!==t.type||(r.focusout="close"),this._on(!0,i,r)}},close:function(t){var i,s=this,n=e(t?t.currentTarget:this.element),a=this._find(n);a&&(i=a.tooltip,a.closing||(clearInterval(this.delayedShow),n.data("ui-tooltip-title")&&!n.attr("title")&&n.attr("title",n.data("ui-tooltip-title")),this._removeDescribedBy(n),a.hiding=!0,i.stop(!0),this._hide(i,this.options.hide,function(){s._removeTooltip(e(this))}),n.removeData("ui-tooltip-open"),this._off(n,"mouseleave focusout keyup"),n[0]!==this.element[0]&&this._off(n,"remove"),this._off(this.document,"mousemove"),t&&"mouseleave"===t.type&&e.each(this.parents,function(t,i){e(i.element).attr("title",i.title),delete s.parents[t]}),a.closing=!0,this._trigger("close",t,{tooltip:i}),a.hiding||(a.closing=!1)))},_tooltip:function(t){var i=e("<div>").attr("role","tooltip").addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||"")),s=i.uniqueId().attr("id");return e("<div>").addClass("ui-tooltip-content").appendTo(i),i.appendTo(this.document[0].body),this.tooltips[s]={element:t,tooltip:i}},_find:function(e){var t=e.data("ui-tooltip-id");return t?this.tooltips[t]:null},_removeTooltip:function(e){e.remove(),delete this.tooltips[e.attr("id")]},_destroy:function(){var t=this;e.each(this.tooltips,function(i,s){var n=e.Event("blur"),a=s.element;n.target=n.currentTarget=a[0],t.close(n,!0),e("#"+i).remove(),a.data("ui-tooltip-title")&&(a.attr("title")||a.attr("title",a.data("ui-tooltip-title")),a.removeData("ui-tooltip-title"))}),this.liveRegion.remove()}})});
// Source: src/quasar-dev.js
/*
 * Cria o super objeto Quasar
 * Com algums sub objetos, predefinidos para cada Screen
 */

Quasar = {
	config : {
		version : "2.2.2805",
		name : "Quasar",
		author : "Wesley Nascimento",
		/* Metodos de armazenamento */
		get : function (chave, def) {
			var data = new QJSON(game_data.player.name);
			return data.get(chave) === null ? def : data.get(chave);
		},
		set : function (chave, value) {
			var data = new QJSON(game_data.player.name);
			data.set(chave, value);
			data.save();
		}
	},

	/*
	 * Objeto de interface
	 * Responsavel pelo menu principal e todas as funções que alteram o HTML ou CSS do jogo
	 */
	interface : {
		cache : {},
		/* cache para elementos jQuery*/
		menu : {
			$buttons : null,
			$infos : null,
			$menu : null,
			$countDown : $("#countDown"),
			isPaused : false,
			ticker : [],
			init : function () {
				if (!premium) {
					Quasar.interface.menu.premiumChanges();
				}
				if ($("#quasar_menu").length > 0) {
					$("#quasar_menu").remove();
				}
				$('body').append('<section id="quasar_menu" class="quasar" style="display:none;"></section>');
				this.$menu = $("#quasar_menu");
				this.addHTML('<div id="quasarTitle" class="title">' + Quasar.config.name + '</br>v' + Quasar.config.version + '</div>');
				this.addHTML('<div id="quasarCount" class="section"><div id="countDown" class="timer" style="color: #9E0000; font-weight: 700; text-align: center; font-size: 14px;cursor: pointer;">00:00:00</div></div>');
				this.addHTML('<div id="quasarButtons" class="section"></div>');
				this.addHTML('<div id="quasarInfo" class="section"></div>');
				this.addHTML('<div id="quasarSlide" class="slider">&raquo;</div>');

				//Seleciona os elementos e armazena na cache
				this.$buttons = $("#quasarButtons");
				this.$infos = $("#quasarInfo");
				this.$countDown = $("#countDown");

				var that = this;

				this.$countDown.on("click", function () {
					var paused = that.isPaused;
					that.isPaused = (paused ? false : true);
					if (!paused) {
						UI.SuccessMessage("O temporarizador foi pausado.");
					} else {
						UI.SuccessMessage("O temporarizador retornou ao normal.");
					}
				});

				//Adiciona os botoes ao menu
				this.addButton(Quasar.lang.get("auto_farm"), Quasar.farm);
				//this.addButton(Quasar.lang.get("auto_farm_post"), "auto_farm_post", Quasar.farm_post.getStatus, Quasar.farm_post.setStatus);
				this.addButton(Quasar.lang.get("wall_drop"), Quasar.wall);
				this.addButton(Quasar.lang.get("auto_recruit"), Quasar.train);
				this.addButton(Quasar.lang.get("auto_build"), Quasar.main);
				this.addButton(Quasar.lang.get("am_farm"), Quasar.am_farm);
				this.addButton(Quasar.lang.get("dodge"), Quasar.dodge);
				this.addButton(Quasar.lang.get("coordinator"), Quasar.coordinator);
				this.addButton(Quasar.lang.get("anti_afk"), Quasar.nucleo);

				this.addActionButton(Quasar.lang.get("import_export"), function () {
					var html = "";
					html += "Importe e exporte os dados do seu Quasar e configurações.";
					html += '<table><tr>';
					html += '<td><input type="text" value="" id="import_val" placeholder="Importar codigo de configurações" size="20"><input type="button" value="Importar" id="btn_import"></td>';
					html += '<td><input type="text" value="" id="export_val" placeholder="Exportar configurações" size="20"><input type="button" value="Exportar" id="btn_export"></td>';
					html += '</tr></table>';
					var onDraw = function () {
						$("#btn_import").on("click", function () {
							var data = $("#import_val").val();
							if (data !== "") {
								Quasar.nucleo.importData(data);
							}
						});
						$("#btn_export").on("click", function () {
							var data = Quasar.nucleo.exportData();
							$("#export_val").val(data);
							$("#export_val").focus();
							$("#export_val").select();
						});
					};
					Quasar.interface.menu.popupBox(Quasar.lang.get("import_export"), html, 400, null, onDraw);
				});

				this.addActionButton(Quasar.lang.get("welcome_window"), Quasar.interface.menu.showWelcome);

				this.addActionButton(Quasar.lang.get("configuration"), function () {
					var onDraw = Quasar.interface.menu.configDraw;
					var html = Quasar.interface.menu.configHtml();					
					Quasar.interface.menu.popupBox(Quasar.lang.get("configuration"), html, 400, null, onDraw);
				});

				this.addInformation("Ping", "ping", function () {
					if (Quasar.interface.cache.$ping == null) {
						Quasar.interface.cache.$ping = $("#ping");
					}
					var pings = Quasar.config.get("pings", []);
					Quasar.interface.cache.$ping.text(pings[pings.length - 1] + "ms");
				});

				this.addInformation("Ping Médio", "aping", function () {
					if (Quasar.interface.cache.$aping == null) {
						Quasar.interface.cache.$aping = $("#aping");
					}
					var pings = Quasar.config.get("pings", []),
					mping;
					if (pings.length == 3) {
						var total = 0;
						for (var i = pings.length - 1; i > pings.length - 4; i--) {
							total += Number(pings[i]);
						}
						mping = Math.round(total / 3) + "ms";
					} else {
						mping = "Calc...";
					}

					Quasar.interface.cache.$aping.text(mping);
				});

				this.addInformation(Quasar.lang.get("attacks_today"), "attackcount", function () {
					if (Quasar.interface.cache.$attackcount == null) {
						Quasar.interface.cache.$attackcount = $("#attackcount");
					}

					var qjson = new QJSON("attacks", true);
					var date = $("#serverDate").text();
					if (!qjson.contains(date)) {
						qjson.add(date, 0);
						Quasar.config.set("attacks", qjson.toJSON());
					}
					var n = qjson.get(date);
					Quasar.interface.cache.$attackcount.text(n);
				}, function () {
					var title = Quasar.lang.get("attacks_today");
					var html = "";
					html += '<table class="vis nowrap tall" style="width: 100%"><tbody><tr><th>Date</th><th>Attacks</th></tr>';
					var attacks = new QJSON("attacks", true);
					for (var chave in attacks.cache) {
						html += '<tr><td>' + chave + '</td><td>' + attacks.get(chave) + '</td></tr>';
					}
					html += '</tbody></table>';
					Quasar.interface.menu.popupBox(title, html, 400, null, null);
				});

				var slider = Quasar.config.get('slider', true);

				this.showHideMenu(slider);

				$("#quasarSlide").on('click', function () {
					var slider = Quasar.config.get('slider', true);
					Quasar.config.set('slider', !slider);
					Quasar.interface.menu.showHideMenu(!slider);
				});

				$("#quasarLoading").fadeOut("slow");

				$("#quasar_menu").show();

				this.tick();
			},
			//Adiciona um HTML ao menu
			addHTML : function (html) {
				this.$menu.append(html);
			},
			//Adiciona um Botão ao menu
			addButton : function (text, menuObject) {
				menuObject.$element = $('<div class="button">' + text + '</div>');

				this.$buttons.append(menuObject.$element);

				var change = function () {
					if (menuObject.getStatus()) {
						menuObject.$element.addClass("active");
					} else {
						menuObject.$element.removeClass("active");
					}
				};

				menuObject.$element.on('click', function () {
					var status = menuObject.getStatus();
					menuObject.setStatus(!status);
					change();
				});
				change();
			},
			//Adiciona um botão de ação ao menu
			addActionButton : function (text, action) {
				var $element = $('<div class="button action">' + text + '</div>');
				$element.on('click', action);
				this.$buttons.append($element);
			},
			//Adiciona um texto de informação ao menu
			//As informaçoes podem ser tickaveis, ou seja, se atualizam
			addInformation : function (title, id, onTick, onClick) {
				if (typeof onClick == "undefined") {
					this.$infos.append('<div><b>' + title + '</b>: <span id="' + id + '"></span></div>');
				} else {
					this.$infos.append('<div><b>' + title + '</b>: <span id="' + id + '" style="font-weight: 700;color: #603000;"></span></div>');
					$("#" + id).on("click", onClick);
				}

				if (typeof onTick !== "undefined") {
					this.ticker.push(onTick);
				}
			},
			//Decrementa do contador regressivo e executa o callback
			countDown : function (time, callback) {
				if (time < 0) {
					callback();
					return;
				}
				if (!Quasar.interface.menu.isPaused) {
					this.$countDown.text(Quasar.utils.secToString(time));
					--time;
				}
				setTimeout(function () {
					Quasar.interface.menu.countDown(time, callback);
				}, 1000);
			},
			//Cria um popup
			popupBox : function (title, html, width, height, callback) {
				var preele = $("#quasar_popup");
				//Se já existem um pop up,
				//Remove executa uma animação do antigo saindo e o novo aparecendo
				if (preele.length > 0) {
					preele.fadeTo(500, 0, function () {
						preele.remove();
						Quasar.interface.menu.popupBox(title, html, width, height, callback);
					});
					return;
				}

				$('body').append('<div id="quasar_popup" class="popup_style ui-draggable" style="position: fixed;"></div>');

				var $ele = $("#quasar_popup");

				$ele.append('<div class="popup_menu"><span style="float: left;">' + title + '</span><a href="javascript:void(0);" id="closePop">x</a></div>');
				$("#closePop").on("click", Quasar.interface.menu.closePop);

				$ele.draggable();
				$ele.append('<div class="popup_content">' + html + '</div>');

				//Realiza os ajustes de posição e tamanho
				if (width !== null) {
					$ele.css('width', width);
				} else {
					$ele.css('width', 'auto');
				}

				if (height !== null) {
					$ele.css('height', height);
				} else {
					$ele.css('height', 'auto');
				}

				//Centraliza o elemento
				var left = (window.innerWidth / 2) - (width / 2);
				var top = (window.innerHeight / 2) - (parseInt($ele.css("height")) / 2);

				$ele.css('left', left);
				$ele.css('top', top > 10 ? top : 10);

				if (callback !== null) {
					callback();
				}
				$ele.fadeTo(500, 1);
			},
			closePop : function () {
				var $ele = $("#quasar_popup");

				$ele.fadeTo(500, 0, function () {
					$ele.remove();
				});
			},
			//Mostra ou esconde o menu
			showHideMenu : function (show) {
				var element = $("#quasar_menu");
				var slider = $("#quasarSlide");
				if (show) {
					element.animate({
						left : "0px"
					}, 500);
				} else {
					element.animate({
						left : "-143px"
					}, 500);
				}
			},
			tick : function () {
				//Async loop
				setTimeout(function () {
					Quasar.interface.menu.tick();
				}, 1000);
				for (var i = 0; i < this.ticker.length; i++) {
					this.ticker[i]();
				}
			},
			premiumChanges : function () {
				var screen = game_data.screen;
				var nVillId = Quasar.utils.getNextVillage();
				var pVillId = Quasar.utils.getPrevVillage();
				$("#menu_row2").prepend('<td class="box-item icon-box separate arrowCell" style="display:none;"><a id="village_switch_left" class="village_switch_link" href="?village=' + pVillId + '&screen=' + screen + '" accesskey="a"><span class="arrowLeft"> </span></a></td><td class="box-item icon-box arrowCell" style="display:none;"><a id="village_switch_right" class="village_switch_link" href="?village=' + nVillId + '&screen=' + screen + '" accesskey="d"><span class="arrowRight"> </span></a></td>');
				$(".box-item").show(1000);
			},
			configDraw : function () {
				$("#langSelect").val(Quasar.config.get("language", "en"));
				$("#save").on("click", function () {
					Quasar.config.set("language", $("#langSelect").val());
					Quasar.config.set("min_rand", $("#min_rand").val());
					Quasar.config.set("max_rand", $("#max_rand").val());
					Quasar.config.set("max_recruit_time", $("#max_recruit_time").val());

					var limit = (premium ? 5 : 2);
					if (Number($("#max_build_queue").val()) <= limit) {
						Quasar.config.set("max_build_queue", $("#max_build_queue").val());
					}

					Quasar.config.set("am_is_by_ratio", $("#am_is_by_ratio").is(":checked"));
					Quasar.config.set("attack_control", $("#attack_control").is(":checked"));
					Quasar.config.set("am_dis_ratio", $("#am_dis_ratio").val());
					Quasar.config.set("max_am_dis", $("#max_am_dis").val());
					Quasar.config.set("max_am_attacks", $("#max_am_attacks").val());
					Quasar.config.set("blue_reports", $("#blue_reports").is(":checked"));
					Quasar.config.set("yellow_reports", $("#yellow_reports").is(":checked"));
					Quasar.config.set("use_c_am", $("#use_c_am").is(":checked"));
					Quasar.config.set("stop_end_farm", $("#stop_end_farm").is(":checked"));
					Quasar.config.set("max_am_wall", $("#max_am_wall").val());
					Quasar.config.set("wall_drop_spy", $("#wall_drop_spy").val());
					Quasar.config.set("wall_drop_ram", $("#wall_drop_ram").val());
					Quasar.config.set("wall_drop_axe", $("#wall_drop_axe").val());
					Quasar.config.set("delete_most_attacked", $("#delete_most_attacked").val());
					Quasar.config.set("sound_alarm", $("#sound_alarm").is(":checked"));
					
					var dodge = $("#dodge_target").val();
					Quasar.config.set("dodge_target", dodge !== "" ? dodge : null);

					UI.SuccessMessage("Suas configurações foram salvas!");
				});
				
				var $tabs = $("#tabs");
				$tabs.tabs();
				//tooltip-style
				
				$tabs.tooltip({ 
					position: { 
						my: "left+15 center", 
						at: "right center",
						using: function( position, feedback ) {
							var $this = $( this );							
							$this.css( position );
							$this.css("z-index", 100000);
						}						
					},
					tooltipClass: "tooltip-style",
					track: true
				});
			},
			configHtml : function () {
				var html = '', select = '';
				
				html += '<div id="tabs">';
				html += '<ul>';
				html += '<li><a href="#tab-geral">Geral</a></li>';
				html += '<li><a href="#tab-as">Auto AS</a></li>';
				html += '<li><a href="#tab-wall">Muralha</a></li>';
				html += '</ul>';			
				
				
				select += "<select id='langSelect'>";
				for (var i in Quasar.lang) {
					if (typeof Quasar.lang[i].language !== "undefined") {
						select += "<option value='" + i + "'>" + Quasar.lang[i].language + "</option>";
					}
				}
				select += "</select>";
				
				html += '<div id="tab-geral">';
				html += '<table class="vis" style="width:100%"><tbody>';
				html += '<tr><th>Descrição</th><th>Valor</th></tr>';
				html += '<tr><td colspan="2"><strong>Geral</strong></td></tr>';
				html += '<tr><td>Linguagem: </td><td>'+ select +'</td></tr>';
				html += '<tr><td><span title="Define o tempo minimo em que o sistema gera o temporalizador aleatorio.">Tempo minimo para o temporalizador: </span></td><td><input type="text" id="min_rand" size="2" value="' + Quasar.config.get("min_rand", 300) + '"/>segundos</td></tr>';
				html += '<tr><td><span title="Define o tempo maximo em que o sistema gera o temporalizador aleatorio.">Tempo maximo para o temporalizador: </span></td><td><input type="text" id="max_rand" size="2" value="' + Quasar.config.get("max_rand", 900) + '"/>segundos</td></tr>';
				html += '<tr><td><span title="Define o tempo maximo da fila de recrutamento do Recrutador. Caso a fila esteja maior que esse limite, ele não irá recrutar.">Tempo maximo de recrutamento: </span></td><td><input type="text" id="max_recruit_time" size="2" value="' + Quasar.config.get("max_recruit_time", 8) + '"/> horas</td></tr>';
				html += '<tr><td><span title="Define a quantidade maxima de edificios que serão colocados na fila de recrutamento ao mesmo tempo.">Quantidade maxima de edificios na fila: </span></td><td><input type="text" id="max_build_queue" size="2" value="' + Quasar.config.get("max_build_queue", (premium ? 5 : 2)) + '"/></td></tr>';
				html += '<tr><td><span title="Usando o Farmador, deseja parar de farmar assim que estiver no final da lista de coordenadas?">Parar de farmar ao chegar no fim da lista: </span></td><td><input type="checkbox" id="stop_end_farm" ' + (Quasar.config.get("stop_end_farm", false) ? "checked" : "") + '/></td></tr>';
				html += '<tr><td>Tocar alarm quando aparecer um Captcha: </td><td><input type="checkbox" id="sound_alarm" ' + (Quasar.config.get("sound_alarm", true) ? "checked" : "") + '/></td></tr>';
				html += '<tr><td><span title="Define alvo para o dodge. O Dodge funciona apenas com uma aldeia.">Alvo para dodge: </span></td><td><input type="text" placeholder="123|456" id="dodge_target" size="3" value="' + Quasar.config.get("dodge_target", "") + '"/></td></tr>';
				html += '</tbody></table>';
				html += '</div>';
				
				html += '<div id="tab-as">';
				html += '<table class="vis" style="width:100%"><tbody>';
				html += '<tr><th>Descrição</th><th>Valor</th></tr>';
				html += '<tr><td colspan="2"><strong>Assistente de Saque</strong></td></tr>';
				html += '<tr><td><span title="Define a distancia maxima em que o Auto AS enviará um ataques.">Distancia de ataques maxima:</span></td><td><input type="text" id="max_am_dis" size="2" value="' + Quasar.config.get("max_am_dis", 20) + '"/>campos</td></tr>';
				html += '<tr><td><span title="Deseja que o Auto AS defina automaticamente quantos ataques pode ser enviado a uma aldeia baseado em sua distancia?">Usar sistema de razão?</span></td><td><input type="checkbox" id="am_is_by_ratio" ' + (Quasar.config.get("am_is_by_ratio", false) ? "checked" : "") + '/></td></tr>';
				html += '<tr><td><span title="Define quantos ataques podem ser enviados para cada campo de distancia. Pode ser um valor decimal ou inteiro.">Ataque por campo: </span></td><td><input type="text" id="am_dis_ratio" size="2" value="' + Quasar.config.get("am_dis_ratio", 1) + '"/>(Ex: 0.2)</td></tr>';
				html += '<tr><td><span title="Deseja que o Auto AS priorize a atacar aldeias que tenham menos ataques a caminho?">Usar controlador de ataques? </span></td><td><input type="checkbox" id="attack_control" ' + (Quasar.config.get("attack_control", false) ? "checked" : "") + '/></td></tr>';
				html += '<tr><td><span title="Define a quantidade maximas de ataques que serão enviadas a uma unica aldeia.">Quantidade maxima de ataques: </span></td><td><input type="text" id="max_am_attacks" size="2" value="' + Quasar.config.get("max_am_attacks", 2) + '"/></td></tr>';
				html += '<tr><td><span title="Define o nivel maximo de muralha aceito para que seja atacado.">Nivel maximo de muralha:</span></td><td><input type="text" id="max_am_wall" size="2" value="' + Quasar.config.get("max_am_wall", 3) + '"/></td></tr>';
				html += '<tr><td><span title="Deseja atacar aldeias cujo o ultimo relatorio foi de exploração?">Atacar relatorios de exploração? </span></td><td><input type="checkbox" id="blue_reports" ' + (Quasar.config.get("blue_reports", false) ? "checked" : "") + '/></td></tr>';
				html += '<tr><td><span title="Deseja que o Auto AS adicione automaticamente relatorios amarelos ou em que a muralha seja maior que o limite para a lista de aldeias em que a muralha deve ser derrubada?">Adicionar ao Derrubador de Muralhas?</span></td><td><input type="checkbox" id="yellow_reports" ' + (Quasar.config.get("yellow_reports", true) ? "checked" : "") + '/></td></tr>';
				html += '<tr><td><span title="Deseja que o Auto AS use o Template C para farma? Só são atacadas aldeias em que a soma dos recursos é maior que 1000.">Usar o templace C?:</span></td><td><input type="checkbox" id="use_c_am" ' + (Quasar.config.get("use_c_am", true) ? "checked" : "") + '/></td></tr>';
				html += '<tr><td><span title="Deseja deletar aldeias em que o limite de ataques simultaneos já foi atingido? Isso libera mais espaço na pagina do AS.">Deletar ataques acima do limite?:</span></td><td><input type="checkbox" id="delete_most_attacked" ' + (Quasar.config.get("delete_most_attacked", false) ? "checked" : "") + '/></td></tr>';
				html += '</tbody></table>';
				html += '</div>';
				
				html += '<div id="tab-wall">';
				html += '<table class="vis" style="width:100%"><tbody>';
				html += '<tr><th>Descrição</th><th>Valor</th></tr>';
				html += '<tr><td colspan="2"><strong>Configurações do Derrubador de Muralhas</strong></td></tr>';
				html += '<tr><td><span title="Quantidade de exploradores a enviar">Exploradores:</span></td><td><input type="text" id="wall_drop_spy" size="2" value="' + Quasar.config.get("wall_drop_spy", 1) + '"/></td></tr>';
				html += '<tr><td><span title="Quantidade de Arietes a enviar">Arietes:</span></td><td><input type="text" id="wall_drop_ram" size="2" value="' + Quasar.config.get("wall_drop_ram", 15) + '"/></td></tr>';
				html += '<tr><td><span title="Quantidade de Barbaros a enviar">Barbaros:</span></td><td><input type="text" id="wall_drop_axe" size="2" value="' + Quasar.config.get("wall_drop_axe", 30) + '"/></td></tr>';
				html += '</tbody></table>';
				html += '</div>';
				
				html += '</div>';
			
				html += '<div>';
				html += '<input  class="btn" type="button" id="save" value="Salvar"/>';
				html += '</div>';
				return html;
			},
			showWelcome : function () {
				var html = "";
				html += "<span style='size: 16px; font-weight: bold'>Sobre o Quasar.</span></br>";
				html += "Quasar é formado por um conjunto de ferramentas, cujo o intuito é fazer com que seja mais pratico jogar TribalWars.</br>";
				html += "Algumas dessas ferramentas são ilegais segundo as regras do jogo, esteja ciente que o mal uso ou uso excessivo pode causar o banimento de sua conta.</br>";
				html += "Quasar tem sido desenvolvido por <strong>Wesley Nascimento</strong> desde Novembro de 2013. E vem sido distribuido dentro da licensa Creative Commons.</br>";

				html += "<br><strong style='size: 16px; font-weight: bold'>Termos de uso e Politica de privacidade</strong></br>";
				html += "<ul>";
				html += "<li>O author não se resposabiliza por punições ou banimentos.</li>";
				html += "<li>Quasar envia informaçoes anonimas sobre seu uso para um servidor externo.</li>";
				html += "<li>O author não garante suporte ao projeto a longo prazo.</li>";
				html += "<li>O author se reserva ao direito de mudar esses termos a qualquer momento sem aviso previo ou posterior.</li>";
				html += "<li>Quasar armazena informações e configurações em seu navegador.</li>";
				html += "</ul>";
				html += "<span style='color:#c00; font-weight: bold'>Ao usar o Quasar você automaticamente está ciente e concorda com todos os termos listados acima.</span></br>";

				html += "<br><span style='size: 16px; font-weight: bold'>Terminando a instalação</span></br>";
				html += "Para que você possa executar o Quasar sem problemas ou conflitos é preciso que ele obtenha algumas informações da sua conta.</br>";
				html += "<ul>";
				html += "<li>Quantidade de aldeias.</li>";
				html += "<li>Identificação das aldeias.</li>";
				html += "<li>Se possui conta premium.</li>";
				html += "<li>Se possui assistente de saques.</li>";
				html += "<li>Quantidade de ataques chegando.</li>";
				html += "<li>Se está em modo de ferias.</li>";
				html += "<li>Se está como sitter.</li>";
				html += "</ul>";
				html += "<br>Essas informações serão obtidas automaticamente ao clicar no botão abaixo. Atenção você será redirecionado para outra pagina.</br>";
				html += "<center><a href='#' id='btn_first_use' class='evt-confirm btn'>Configurar</a></center></br>";

				html += '<center><a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Licença Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Quasar</span> de <a xmlns:cc="http://creativecommons.org/ns#" href="wesleynascimento.com/quasar" property="cc:attributionName" rel="cc:attributionURL">wesleynascimento.com/quasar</a> está licenciado com uma Licença <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons - Atribuição-NãoComercial 4.0 Internacional</a>.</center>';

				var callback = function () {
					$("#btn_first_use").on("click", function () {
						if (game_data.player.sitter === 0) {
							location.href = "?village=" + game_data.village.id + "&screen=overview_villages&mode=prod";
						} else {
							var sitter = location.href.match(/t=\d+/i);
							location.href = "?village=" + game_data.village.id + "&screen=overview_villages&mode=prod&" + sitter;
						}
					});
				};
				Quasar.interface.menu.popupBox("Bem vindo ao Quasar!", html, 600, null, callback);
			}
		},
		/*
		 * Cria a interface interna da Praça de Reunioes
		 */
		praca : function () {
			var html = '<table width="100%" class="paris-badge">';

			html += '<tr><td width="100%">';
			html += '<input type="text" id="coords" name="name" value="" style="width: 98%;" placeholder="Cole coordenadas para darmar aqui (ex: 666|666 666|666)">';
			html += '</td><td>';
			html += 'Em <span id="current">0</span> de <span id="number">0</span> coordenadas';
			html += '</td></tr>';

			html += '<tr><td>';
			html += '<input type="text" id="wall_coords" name="name" value="" style="width: 98%;" placeholder="Cole coordenadas para o derrubador de muralha (ex: 666|666 666|666)">';
			html += '</td><td>';
			html += '<span id="wall_number">0</span> coordenadas';
			html += '</td></tr>';

			html += '</table>';

			var $inside_table = $(html);
			var $main_table = $('<table class="content-border vis nowrap tall" width="100%" id="build_script" style="opacity:0">' + '<tr><th style="width: 66%">' + Quasar.lang.get("option") + ' [ <a id="ordenar">' + Quasar.lang.get("order") + '</a> | <a id="limpar">' + Quasar.lang.get("clean") + '</a> ]</th></tr>' + '<tr><td id="body" style="padding: 10px 5px;"></td></tr>' + '</table></br>');
			$main_table.find("#body").append($inside_table);
			$("#contentContainer").before($main_table);

			var $coords = $("#coords");
			var $number = $("#number");
			var $wallcoords = $("#wall_coords");
			var $wallnumber = $("#wall_number");
			var current = Quasar.config.get("index_" + game_data.village.id, 0);

			$("#current").text(current);
			var coords = Quasar.config.get("coords_" + game_data.village.id, []);

			$coords.val(coords.join(" "));

			$number.text(coords.length);
			$coords.on('change', function () {
				var coords = ele_coords.val().split(" ");
				$number.text(coords.length);
				Quasar.config.set("coords_" + game_data.village.id, coords);
			});
			var wall_coords = Quasar.config.get("wall_coords", []);
			$wallcoords.val(wall_coords.join(' '));

			$wallnumber.text(wall_coords.length);

			$wallcoords.on('change', function () {
				var coords = $wallcoords.val().split(" ");
				$wallnumber.text(coords.length);
				Quasar.config.set("wall_coords", coords);
			});

			$("#ordenar").on('click', function () {
				var mycoord = game_data.village.coord;
				var order = Quasar.utils.orderByDis(mycoord, $coords.val());
				$coords.val(order.join(" "));
				$number.text(order.length);
				Quasar.config.set("coords_" + game_data.village.id, order);
			});

			$("#limpar").on('click', function () {
				var clean = Quasar.utils.clean($coords.val());
				$coords.val(clean.join(" "));
				$number.text(clean.length);
				Quasar.config.set("coords_" + game_data.village.id, clean);
			});

			$("#btnOptions").on('click', function () {
				var title = Quasar.lang.get("option") + " - " + Quasar.lang.get("break_Wall");
				var html = '';
				Quasar.interface.menu.popupBox(title, html, 600, null, null);
			});

			$("#build_script").fadeTo(1000, 1);
		},
		ed_principal : {
			start : function () {
				var $bs = $("#build_script");
				if ($bs.length > 0) {
					$bs.remove();
					$("#img_addBuild").remove();
				}
				$("#buildings tr").each(function (index) {
					var $this = $(this);
					if (index == 0 || $this.find("td:eq(1) .inactive").length > 0) {
						$this.append("<td></td>");
						return true;
					}
					var edificil = $this.attr("id");
					$this.append("<td id='img_addBuild'><img class='build_cancel' data-ed='" + edificil + "' title='" + Quasar.lang.get('add_icon_title') + "' src='/graphic/overview/build.png'></img></td>");
				});

				var $main_table = $('<div style="margin-bottom: 10px"><table id="build_script" style="opacity:0" class="content-border vis nowrap tall" width="100%"><tr><th style="width: 66%">' + Quasar.lang.get("builds") + '(<span id="number"></span>) [ <a id="mostrar">' + Quasar.lang.get("show_link") + '</a> | <a id="limpar">' + Quasar.lang.get("clean") + '</a> | <a id="ordenar">' + Quasar.lang.get("order") + '</a>]</th></tr><tr><td id="main_order"></td></tr></table></div>' +
						'<div style="display:none; margin-bottom: 10px"><table id="sortable-list" class="content-border vis nowrap tall" width="100%" style="border-spacing: 2px !important;"></table></div>');
				$("#contentContainer").before($main_table);

				$("#mostrar").on('click', function () {
					var $div = $("#sortable-list").parent();
					var $this = $(this);
					if ($this.text() == Quasar.lang.get("show_link")) {
						$div.slideDown();
						$this.text(Quasar.lang.get("hide_link"));
					} else {
						$div.slideUp();
						$this.text(Quasar.lang.get("show_link"));
					}
				});

				$("#limpar").on("click", function () {
					Quasar.config.set("queue_" + game_data.village.id, []);
					Quasar.main.load();
				});

				$("#ordenar").on("click", function () {
					Quasar.main.order();
				});

				$("#build_script").fadeTo(1000, 1);
				$("#img_addBuild img").on('click', function () {
					var queue = Quasar.config.get("queue_" + game_data.village.id, []),
					build = $(this).attr("data-ed").replace("main_buildrow_", ""),
					nivel;
					//Pega o nivel atual do edificil
					if (typeof Quasar.main.niveis[build] !== "undefined") {
						nivel = Quasar.main.niveis[build] + 1;
					} else {
						nivel = Quasar.main.getCurrentNivel(build) + 1;
					}

					//Se o nivel maximo for atingido
					if (nivel > Quasar.game.builds[build].max) {
						UI.ErrorMessage("Edificil já atingiu nivel maximo.");
						return;
					}

					//Adiciona edifiicl a lista, salva e atualiza a interface
					queue.push(build);
					Quasar.config.set("queue_" + game_data.village.id, queue);
					Quasar.main.load();
					UI.SuccessMessage("Adicionado " + build + " nivel " + nivel + " a fila do construtor.");

					//Se o countdown estiver zerado, coloca-o para funcionar
					var secs = Quasar.utils.stringToSec($("#countDown").text());
					if (secs <= 0 && Quasar.main.getStatus()) {
						Quasar.utils.setReload("&screen=main");
					}
				});
			},
			cleanTables : function () {
				var $sortable = $("#sortable-list");
				$sortable.html("");
				var html = '<tr>';
				html += '<th style="width: 23%">' + Quasar.lang.get("build_queue") + '</th>';
				html += '<th>' + Quasar.lang.get("build_level") + '</th>';
				html += '<th colspan="3">' + Quasar.lang.get("price") + '</th>';
				html += '<th></th>';
				html += '<th></th>';
				html += '<th></th>';
				html += '</tr>';

				$("#newNivel").remove();

				$sortable.append(html);
			},
			makeSortable : function () {
				placeholder : "ui_active",
				$("#sortable-list tbody").sortable({
					forcePlaceholderSize : true,
					cursor : "move",
					revert : true,
					tolerance : "pointer",
					stop : function (event, ui) {
						var sorted = $(this).sortable("toArray");
						sorted.shift();
						Quasar.config.set("queue_" + game_data.village.id, sorted);
						Quasar.main.load();
					}
				}).disableSelection();
			},
			addToList : function (build, nivel, index) {
				var g = Quasar.game.builds[build];
				var ed = g.name,
				wood = parseInt(g.wood * Math.pow(g.fwood, (nivel - 1))),
				stone = parseInt(g.stone * Math.pow(g.fstone, (nivel - 1))),
				iron = parseInt(g.iron * Math.pow(g.firon, (nivel - 1))),
				pop = parseInt(g.pop * Math.pow(g.fpop, (nivel - 1))) - parseInt(g.pop * Math.pow(g.fpop, (nivel - 2)));

				var html = '';

				html += '<tr id="' + build + '" class="sortable_row">';
				html += '<td><img src="graphic/buildings/mid/' + build + '1.png" class="bmain_list_img"><a href="?village=43158&screen=' + build + '">' + ed + '</a></td>';
				html += '<td class="paris-badge">' + Quasar.lang.get("build_level") + ' ' + nivel + '</td>';
				html += '<td><span class="icon header wood"></span>' + wood + '</td>';
				html += '<td><span class="icon header stone"></span>' + stone + '</td>';
				html += '<td><span class="icon header iron"></span>' + iron + '</td>';
				html += '<td><span class="icon header population"></span>' + pop + '</td>';
				html += '<td><img class="tool_icon icon header" id="remove" data-ed="' + index + '" title="' + Quasar.lang.get("remove_icon_title") + '" src="/graphic/forum/thread_delete.png" /></td>';
				html += '<td><img src="/graphic/sorthandle.png" style="width: 11px; height:11px; ursor:pointer" id="move" data-ed="' + index + '" /></td>';
				html += '</tr>';

				$("#sortable-list").append(html);
				$("#main_order").append('<img src="/graphic/buildings/mid/' + build + '1.png" style="margin-left: 5px;">');

				var $row = $("#main_buildrow_" + build).find("span:eq(0)");
				if ($row.find("#newNivel").length > 0) {
					$row.find("#newNivel").text(' - (' + nivel + ')');
				} else {
					$row.append('<span style="font-size: 0.9em; color: #000AFF;" id="newNivel"> - (' + nivel + ')</span>');
				}
				$("#sortable-list #remove").last().on('click', function () {
					var build = Number($(this).attr("data-ed"));
					var queue = Quasar.config.get("queue_" + game_data.village.id, []);
					queue.splice(build, 1);
					Quasar.config.set("queue_" + game_data.village.id, queue);
					Quasar.main.load();
					UI.SuccessMessage(build + " removido do construtor.");
				});
			}
		},
		coordinator : {
			start : function(){
				var table = '';
					table += '<table class="vis" width="300">';
					table += '<tbody>';
					table += '<tr>';
						table += '<th colspan="2">';
						table += 'Coordenador';
						table += '</th>';
					table += '</tr>';
					
					table += '<tr>';
					table += '<td></td>';
					table += '<td></td>';
					table += '</tr>';
					
					table += '<tr>';
					table += '<td></td>';
					table += '<td></td>';
					table += '</tr>';
					
					table += '<tr>';
					table += '<td></td>';
					table += '<td></td>';
					table += '</tr>';
					
					table += '<tr>';
					table += '<td></td>';
					table += '<td></td>';
					table += '</tr>';
					
					table += '<tr>';
					table += '<td></td>';
					table += '<td></td>';
					table += '</tr>';
					
					table += '</tbody>';
					table += '</table>';
			
				var $table = $( table );
				
				$("#command-confirm-form").find("table:eq(0)").after( $table );
			}
		}
	},
	/*
	 * Nucleo do Quasar
	 * Inicia o objeto e toma as decisoes mais complexas
	 */
	nucleo : {
		/*
		 * Iniciador do nucleo, chamado quando a DOM esta pronta
		 */
		init : function () {
			console.log("Started");

			//Se estiver com o CAPTCHA do jogo na tela, nao faz nada, just cry :(
			if (Quasar.captcha.hasCaptcha()) {
				$("body").append('<object height="50" width="100" data="' + Loader.host + '/alarm.mp3"></object>');
				$(document).prop('title', 'Preencher Captcha');
				return;
			}

			//Inicia a linguagem
			Quasar.lang.init();

			//Se for o primeiro uso
			if (Quasar.config.get("last_version_used", null) === null) {
				if (game_data.screen == 'overview_villages') {
					Quasar.overview_villages.saveVillages();
					UI.SuccessMessage("Quasar obteve informações obre sua conta e está pronto para uso!");
					Quasar.config.set("last_version_used", Quasar.config.version);
					return;
				}
				Quasar.interface.menu.showWelcome();
			}
			//Se não for o primeiro uso, mas se for uma versão mais recente
			else if (Quasar.config.get("last_version_used", "") !== Quasar.config.version) {
				UI.SuccessMessage("Detectado uma nova versão do Quasar instalado!");
				Quasar.config.set("last_version_used", Quasar.config.version);
			}
			//Atualiza esta aldeia a lista de aldeias
			else {
				var v = new QJSON("villages", true);
				var coord = game_data.village.coord;
				if (!v.contains(coord)) {
					v.set(coord, game_data.village.id);
					Quasar.config.set("villages", v.toJSON());
				}
			}

			var url = location.href; //URL atual

			//Incrementa a contagem de execuçoes
			Quasar.config.set('total_execucoes', Quasar.config.get('total_execucoes', 0) + 1);

			//Atualiza lista de pings
			var ping = Loader.timeEnd - Loader.timeStart,
			pings = Quasar.config.get("pings", []);

			pings.push(ping);

			if (pings.length > 3) {
				pings.shift();
			}
			Quasar.config.set("pings", pings);

			//Pega um numero aleatorio, e se for igual a 10 abre uma pagina aleatoria
			if (Quasar.utils.random(0, 10) == 10) {
				Quasar.nucleo.abrirPaginaAleatoria();
			}

			//Decide qual Objeto irá abrir dependendo da tela que está aberta.
			switch (game_data.screen) {
				//Caso esteja a praça
			case 'place':
				//Se tiver a opção de confirmar envio. Então confirma
				if ($("#troop_confirm_go").length > 0) {
					if (Quasar.coordinator.getStatus()) {
						Quasar.coordinator.init();
					} else {
						Quasar.farm.doConfirm();
					}
				}
				//Se tiver um alvo, não faz nada
				else if (location.href.indexOf("target") > 0) {}
				//Se o modo estiver vazio ou estiver como "command"
				else if (game_data.mode === null || game_data.mode == "command") {

					//Se não for premium, atualiza a lista de ataques e retornos
					if (game_data.premium) {
						Quasar.map.updateAR();
					}
					//Toma decisoes conforme a prioridade
					if (Quasar.config.get("before_dodge_page", null) !== null) {
						Quasar.config.set("before_dodge_page", null);
					}
					//Se o farm retornar true, não executa as outras funcoes
					else if (Quasar.farm.init()) {}
					//Se wall retornar true, não executa as outras funcoes
					else if (Quasar.wall.init()) {}
					//Se chegar até aqui, tenta farmar usando o methodo de POST
					else {
						Quasar.farm_post.init();
					}
					//Inicia a interface da praça depois de todas as funcoes pra ganhar desempenho
					Quasar.interface.praca();
				}
				break;
			case 'map':
				Quasar.map.init();
				break;
			case 'overview':
				Quasar.overview.init();
				Quasar.dodge.init();
				break;
			case 'train':
				Quasar.train.init();
				break;
			case 'main':
				Quasar.main.init();
				break;
			case 'am_farm':
				Quasar.am_farm.init();
				break;
			case 'overview_villages':
				if (game_data.mode == "prod") {
					Quasar.overview_villages.saveVillages();
				} else if (game_data.mode == "incomings" && location.href.indexOf("subtype=attacks") > 0) {
					var last_page = Quasar.config.get("before_identify_page", null);
					if (last_page !== null) {
						Quasar.config.set("before_identify_page", null);
						location.href = last_page;
					}
				}
				break;
			case 'report':
				if (url.contains("&view=")) {
					Quasar.report.view();
				}
				break;
			default:
				break;
			}
			//Inicia a interface ao final para prover um melhor desempenho
			Quasar.interface.menu.init();
			Quasar.dodge.renameAttacks();
		},
		getStatus : function () {
			return Quasar.config.get('anti_afk', true);
		},
		setStatus : function (status) {
			return;
			//Can't disable anti-captcha
			Quasar.config.set('anti_afk', status);
		},
		abrirPaginaAleatoria : function () {
			var status = this.getStatus();
			Quasar.config.set('count', 0);
			if (!status)
				return;
			var base = '?village=' + game_data.village.id + '&screen=';
			var pages = ['forum', 'ally', 'ranking', 'ranking&mode=con_player', 'market', 'smith',
				'statue', 'farm', 'barracks', 'stable', 'garage', 'storage', 'hide', 'wall'];
			var index = Quasar.utils.random(0, pages.length - 1);
			var page = pages[index];
			$.get(base + page, function (html) {});
		},
		importData : function (data) {
			localStorage.setItem(game_data.player.name, data);
			Loader.goTo();
		},
		exportData : function () {
			return localStorage.getItem(game_data.player.name);
		}
	},
	captcha : {
		init : function () {
			this.pageInject();
			this.bind();
		},
		hasCaptcha : function () {
			return $("#bot_check_image").length > 0;
		},
		bind : function () {		
			$('#bot_check_form').submit(function (e) {
				e.preventDefault();
				code = $('#bot_check_code').val();
				$('#bot_check_code').val('');

				url = 'game.php';
				if (game_data.player.sitter > 0) {
					url += '?t=' + game_data.player.id;
				}

				$.post(url, {
					bot_check_code : code
				}, function (data) {
					alert( data );
					if (data.error) {
						$('#bot_check_error').show().text(data.error);
						$('#bot_check_image').attr('src', function () {
							var imagesource = $(this).attr('src');
							imagesource += '&' + new Date().getTime()

							return imagesource;
						});
					} else {
						//Envia um POST cross-domain,
						//Com o code e o parametro s do post
						location.href = "";
					}
				}, 'json');
			});
		},
		pageInject : function () {
			//$("body").append('<object height="50" width="100" data="' + Loader.host + '/alarm.mp3"></object>');
			$(document).prop('title', 'Preencher Captcha');
			var alarm = Loader.host + '/alarm.mp3';
			
            var vol = 50, 
			audio = new Audio();
            audio.src = alarm;
            audio.volume = vol / 100;
               
			if( Quasar.config.get("sound_alarm", true) ){
				window.setInterval( audio.play , 30 * 1000);
				audio.play();
			}
		}
	},
	coordinator : {
		init : function () {
			Quasar.interface.coordinator.start();
		},
		startTimer : function ($hours, $minutes, $seconds, $mileseconds, $timer, $panel) {

			if (!Quasar.utils.IsNumeric($hours.val()) || !Quasar.utils.IsNumeric($minutes.val()) || !Quasar.utils.IsNumeric($seconds.val()) || !Quasar.utils.IsNumeric($mileseconds.val())) {
				alert("Erro no formato do texto");
				return;
			}

			var serverTime = new Date();
			var schedule = new Date();
			schedule.setMilliseconds($mileseconds.val());
			schedule.setMinutes($minutes.val());
			schedule.setSeconds($seconds.val());
			schedule.setHours($hours.val());

			$timer.text(schedule.toTimeString());
			$timer.show();
			$panel.hide();

			setTimeout(function () {
				console.log("Attacked");
				$('#troop_confirm_go').click();
			}, schedule.getTime() - serverTime.getTime());
		},
		createSchedule : function( timeJSON ){
			
		},
		getStatus : function () {
			return Quasar.config.get("coordinator", false);
		},
		setStatus : function (status) {
			Quasar.config.set("coordinator", status);
		}
	},
	main : {
		niveis : {},
		init : function () {
			Quasar.interface.ed_principal.start();
			var get = Quasar.game.builds;
			this.load();

			//Not working
			var update_all = BuildingMain.update_all;
			BuildingMain.update_all = function (data) {
				update_all(data);
				console.log("Building Update event");
				Quasar.interface.ed_principal.start();
			};

			if (this.getStatus()) {
				this.build();
			}
			Quasar.utils.setReload("&screen=main");
		},
		build : function () {
			var queue = Quasar.config.get("queue_" + game_data.village.id, []);

			if (queue.length > 0) {
				var building = queue[0];
				if ($("#main_buildlink_" + building).is(':visible') && BuildingMain.order_count < this.getMax()) {
					queue.shift();
					Quasar.config.set("queue_" + game_data.village.id, queue);
					this.load();
					BuildingMain.build(building);

					setTimeout(Quasar.main.build, 1000);
				}
				/*
				var secs = Quasar.utils.stringToSec($("#countDown").text());
				if (secs <= 0) {
				Quasar.utils.setReload("&screen=main");
				}
				 */
			}
		},
		getMax : function () {
			if (typeof premium === "undefined" || premium === false) {
				return 2;
			} else {
				return Number(Quasar.config.get("max_build_queue", 5));
			}
		},
		getCurrentNivel : function (name) {
			//Pega o ultimo nivel desse edificio que esta na lista de constução
			var $bq = $("#buildqueue .buildorder_" + name);
			if ($bq.length > 0) {
				return Number($bq.last().find("td:eq(0)").text().match(/\d+/g)[0]);
			}

			//Pega o nivel do edificio direto da pagina
			var $row = $("#main_buildrow_" + name);
			var text = $row.find("span:eq(0)").text().match(/\d+/g);
			var _new = Number($row.find("#newNivel").text().match(/\d+/g));
			if (text !== null) {
				var the_number = Number(text[0]);

				return the_number == _new ? 0 : the_number;
			} else {
				return 0;
			}
		},
		getStatus : function () {
			return Quasar.config.get("auto_build", false);
		},
		setStatus : function (status) {
			Quasar.config.set("auto_build", status);
		},
		load : function () {
			var queue_temp = Quasar.config.get("queue_" + game_data.village.id, []);

			//Limpa a array, deixa somente elementos validos
			var queue = [],
			that;
			for (var i = 0; i < queue_temp.length; i++) {
				that = queue_temp[i];
				if (that !== "" && that !== null && typeof that !== "undefined" && typeof Quasar.game.builds[that] !== "undefined") {
					queue.push(that);
				}
			}

			//Limpa as variaveis e os elementos
			this.niveis = {};
			Quasar.interface.ed_principal.cleanTables();
			$("#main_order").html("");
			$("#number").text(queue.length);

			var nivel,
			build;

			for (var i = 0; i < queue.length; i++) {
				build = queue[i];

				//Se ja tiver definido um nivel para esse edificil
				if (typeof this.niveis[build] !== "undefined") {
					nivel = Number(this.niveis[build]) + 1;
				}
				//Se nao estiver nada definido, pega em tempo real
				else {
					nivel = this.getCurrentNivel(build) + 1;
				}
				//Atualiza a lista de niveis
				this.niveis[build] = nivel;
				//Adiciona a interface
				Quasar.interface.ed_principal.addToList(build, nivel, i);
			}
			Quasar.interface.ed_principal.makeSortable();
		},
		order : function () {
			var queue = Quasar.config.get("queue_" + game_data.village.id, []);

			//Limpa a variavel temporaria
			this.niveis = {};
			var queue_temp = [],
			build,
			that;

			for (var i = 0; i < queue.length; i++) {
				that = queue[i];
				if (that == "" && that == null && typeof that == "undefined" && typeof Quasar.game.builds[that] == "undefined") {
					continue;
				}

				build = queue[i];

				//Se ja tiver definido um nivel para esse edificil
				if (typeof this.niveis[build] !== "undefined") {
					nivel = Number(this.niveis[build]) + 1;
				}
				//Se nao estiver nada definido, pega em tempo real
				else {
					nivel = this.getCurrentNivel(build) + 1;
				}
				//Atualiza a lista de niveis
				this.niveis[build] = nivel;

				var g = Quasar.game.builds[build];
				var wood = parseInt(g.wood * Math.pow(g.fwood, (nivel - 1))),
				stone = parseInt(g.stone * Math.pow(g.fstone, (nivel - 1))),
				iron = parseInt(g.iron * Math.pow(g.firon, (nivel - 1)));

				var total = wood + stone + iron;
				queue_temp.push([build, total]);
			}

			queue = [];
			for (var i = 0; i < queue_temp.length; i++) {
				for (var a = i; a < queue_temp.length; a++) {
					if (queue_temp[a][1] < queue_temp[i][1]) {
						var t = queue_temp[i];
						queue_temp[i] = queue_temp[a];
						queue_temp[a] = t;
					}
				}
				queue.push(queue_temp[i][0]);
			}
			Quasar.config.set("queue_" + game_data.village.id, queue);
			Quasar.main.load();
		}
	},
	map : {
		size : 0,
		_handleClick : null,
		coords : [],
		init : function () {
			this._handleClick = TWMap.map._handleClick;
			var onResizeEnd = TWMap.mapHandler.onResizeEnd;
			TWMap.mapHandler.onResizeEnd = function () {
				onResizeEnd();
				this.doAr();
			};
			Quasar.map.UI.init();
			Quasar.map.doAR();
		},
		updateAR : function () {
			if (premium)
				return;
			var element;
			var re = [];
			var at = [];
			var first = true;
			var coord;
			if (game_data.screen !== "overview")
				element = $("table.vis").last().find("tbody tr");
			else
				element = $("table.vis").first().find("tbody tr");
			$(element).each(function () {
				if (first) {
					first = false;
					return;
				}
				var $this = $(this);
				var img = $this.find("img").attr("src");
				var col0 = $this.find("td:eq(0) span span").text();
				var col1 = $this.find("td:eq(1)").text();
				if (!col0.contains("("))
					return;
				coord = col0.split("(")[1].split(")")[0].replaces("|", "");
				if (img.indexOf("return") > -1) {
					if (re.indexOf(coord) == -1) {
						re.push(coord);
					}
				} else if (img.indexOf("attack") > -1) {
					if (at.indexOf(coord) == -1) {
						at.push(coord);
					}
				}
			});
			Quasar.config.set("map_attacks", at);
			Quasar.config.set("map_returns", re);
		},
		doSC : function () {
			var coords = Quasar.config.get("coords_" + game_data.village.id, []);
			for (var i = 0; i < coords.length; i++) {
				coords[i] = Quasar.utils.coordToId(coords[i].replaces("|", ""));
			}
			$('[id*="map_village_"]').each(function () {
				var id = $(this).attr('id').replace('map_village_', '');
				if (coords.indexOf(id) > -1) {
					var m = $('#map_village_' + id);
					m.before('<img class="map_icon_showcoord" style="top: ' + m.css('top') + '; left: ' + m.css('left') + '; " id="map_icons_' + id + '" src="/graphic/dots/blue.png">');
				}
			});
		},
		doAR : function () {
			if (premium)
				return;
			var attacks = Quasar.config.get("map_attacks", []);
			var returns = Quasar.config.get("map_returns", []);
			var i = 0;
			for (i = 0; i < attacks.length; i++) {
				attacks[i] = Quasar.utils.coordToId(attacks[i]);
			}
			for (i = 0; i < returns.length; i++) {
				returns[i] = Quasar.utils.coordToId(returns[i]);
			}
			$('[id*="map_village_"]').each(function () {
				var id = $(this).attr('id').replace('map_village_', '');
				if ($('#map_icons_' + id + ".map_icon_3_1").length === 0) {
					var m;
					if (returns.indexOf(id) > -1) {
						m = $('#map_village_' + id);
						m.before('<img class="map_icon_return"style="top: ' + m.css('top') + '; left: ' + m.css('left') + ';" id="map_icons_' + id + '" src="/graphic/map/return.png">');
					}
					if (attacks.indexOf(id) > -1) {
						m = $('#map_village_' + id);
						m.before('<img class="map_icon_attack" style="position: absolute; top: ' + m.css('top') + '; left: ' + m.css('left') + '" id="map_icons_' + id + '" src="/graphic/map/attack.png">');
					}
				}
			});
		},
		handleClick : function (event) {
			var input = $('#quasar-colector textarea');
			var coord = this.coordByEvent(event);
			var village = TWMap.villages[coord.join('')];
			if (typeof village != "undefined") {
				coord = coord.join('|');
				if (Quasar.map.coords.indexOf(coord) < 0) {
					Quasar.map.coords.push(coord);
					input.val(Quasar.map.coords.join(' '));
					$("#qtdCoords").text(Quasar.map.coords.length);
					var m = $('#map_village_' + village.id);
					m.before('<img class="map_icon_collect" style="top: ' + m.css('top') + '; left: ' + m.css('left') + '; " id="map_icons_' + village.id + '" src="/graphic/dots/red.png">');
				} else {
					Quasar.map.coords.splice(coord, 1);
					input.val(Quasar.map.coords.join(' '));
					$("#qtdCoords").text(Quasar.map.coords.length);
					$('#map_icons_' + village.id + ".map_icon_collect").remove();
				}
			}
			return false;
		},
		resize : function (val) {
			if (premium)
				return;
			Quasar.config.set("map_size", val);
			TWMap.resize(val);
			this.size = val;
		},
		UI : {
			ele_quasar : null,
			init : function () {
				$("#map_config").after('<br><table class="vis" width="100%" style="border-spacing:0px;border-collapse:collapse;"><tbody id="quasarMap"><tr><th colspan="3">Quasar Options</th></tr></tbody></table><br/><table class="vis" width="100%" id="quasar-colector" style="display:none;"><tr><th>Coords(<span id="qtdCoords">0</span>)</th></tr><tr><td style="text-align:center"><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px;"></textarea></td></tr></table>');
				$('#fullscreen').attr('style', 'display: block;').attr('onclick', 'TWMap.premium = true; TWMap.goFullscreen();').attr('title', 'FullScreen - Quasar Bot');
				this.ele_quasar = $("#quasarMap");
				this.appendMenu('<a id="btn_colect" class="btn">' + Quasar.lang.get('colect_coords') + '</a>');
				this.appendMenu('<a id="btn_showcoords" class="btn">' + Quasar.lang.get('show_coords') + '</a>');
				$("#btn_colect").on('click', function () {
					var cl = $(this).attr("class");
					if (cl === "btn") {
						$("#quasar-colector").show(500);
						TWMap.map._handleClick = Quasar.map.handleClick;
						$(this).attr("class", "btn btn-confirm-yes");
					} else {
						$("#quasar-colector").hide(500);
						$(".map_icon_collect").remove();
						Quasar.map.coords = [];
						$("#quasar-colector textarea").val("");
						$("#qtdCoords").text(Quasar.map.coords.length);
						TWMap.map._handleClick = Quasar.map._handleClick;
						$(this).attr("class", "btn");
					}
				});
				$("#btn_showcoords").on('click', function () {
					var cl = $(this).attr("class");
					if (cl === "btn") {
						Quasar.map.doSC();
						$(this).attr("class", "btn btn-confirm-yes");
					} else {
						$(".map_icon_showcoord").remove();
						$(this).attr("class", "btn");
					}
				});
				Quasar.map.UI.premiumChanges();
			},
			appendMenu : function (html) {
				this.ele_quasar.append("<tr><td align='center'>" + html + "</td></tr>");
			},
			premiumChanges : function () {
				if (premium) {
					return;
				}
				this.appendMenu(Quasar.lang.get("map_size") + ': <select id="size-change" style="width: 65px"><option value="4">4x4</option><option value="5">5x5</option><option value="7">7x7</option><option value="9">9x9</option><option value="11">11x11</option><option value="13">13x13</option><option value="15">15x15</option><option value="20">20x20</option><option value="30">30x30</option></select>');
				var size = Quasar.config.get("map_size", 13);
				var size_change = $("#size-change");
				size_change.val(size);
				Quasar.map.resize(size);
				size_change.on('change', function () {
					var val = Number($(this).val());
					Quasar.map.resize(val);
				});
			}
		}
	},
	overview : {
		init : function () {
			Quasar.map.updateAR();
			Quasar.overview.UI.init();
		},
		UI : {
			init : function () {
				if (!premium) {
					this.premiumChanges();
				}
			},
			premiumChanges : function () {
				var html = '<div id="show_notes" class="vis moveable widget" style="display:none;"><h4 class="head"><img style="float: right; cursor: pointer;" src="graphic/minus.png">' + Quasar.lang.get("village_notes") + '</h4><div class="widget_content" style="display: block;"><table width="100%"><tbody><tr><td id="village_note"></td></tr><tr><td><a id="edit_notes_link" href="javascript:void(0);">» Editar</a></td></tr></tbody></table></div></div>';
				$("#show_summary").after(html);
				Quasar.overview.UI.load_notes();
				$("#show_notes").show(1000);
				$("#edit_notes_link").on("click", function () {
					Quasar.overview.UI.edit_notes($("#village_note"), Quasar.lang.get("village_notes"));
				});
			},
			load_notes : function () {
				var notes = new QJSON("notes", true);
				var vid = game_data.village.id;
				var content = (notes.get(vid) !== null ? notes.get(vid) : "");
				$("#village_note").html(content);
			},
			edit_notes : function (element, title) {
				var notes = new QJSON("notes", true);
				var vid = game_data.village.id;
				var content = (notes.get(vid) !== null ? notes.get(vid).replace(/<br>/g, '\n') : "");
				title = Quasar.lang.get("village_notes");
				var html = '<div><textarea id="message" name="note" rows="10" cols="40">' + content + '</textarea></div><div><input type="button" id="ok_note" value="OK" class="btn"></div>';
				var onDraw = function () {
					$('#ok_note').on('click', function () {
						var note = $('#message').val().replace(/\n/g, '<br>');
						var notes = new QJSON("notes", true);
						notes.set(game_data.village.id, note);
						Quasar.config.set("notes", notes);
						Quasar.overview.UI.load_notes();
					});
				};
				Quasar.interface.menu.popupBox(title, html, 400, null, onDraw);
			}
		}
	},
	overview_villages : {
		init : function () {
			this.UI.init();
			this.saveVillages();
		},
		saveVillages : function () {
			var villages = new QJSON("villages", true);
			$("#production_table .row_a, #production_table .row_b").each(function () {
				var $this = $(this);
				var regex = "[0-9]{1,3}\\|[0-9]{1,3}";
				var coord = $this.find(".quickedit-label").text();
				coord = coord.match(regex)[0];
				var id = $this.find(".quickedit-vn").attr("data-id");
				villages.set(coord, id);
			});
			Quasar.config.set("villages", villages.toJSON());
		},
		changeName : function (village, newName) {
			$.post("?village=" + village + "&action=change_name&h=ddbf&screen=main", {
				name : newName
			}, function (data) {
				console.log("FUN");
			});
		},
		UI : {
			init : function () {}

		}
	},
	farm_post : {
		can : true,
		init : function () {
			if (!Quasar.farm_post.getStatus()) {
				return false;
			}
			$(".troop_template_selector").each(function () {
				$(this).click();
				if (Quasar.farm_post.canAttack()) {
					return Quasar.farm_post.doAttack();
				}
			});
			Quasar.utils.setReload("&screen=place");
			return false;
		},
		canAttack : function () {
			var coords = Quasar.config.get("coords_" + game_data.village.id, []);
			if (coords.length < 1)
				return false;

			$("input[class='unitsInput']").each(function () {
				var value = $(this).val();
				var qtd = $(this).parent().find("a").text();
				qtd = qtd.replaces("(", "");
				qtd = qtd.replaces(")", "");
				qtd = Number(qtd);
				if (value === null || value === "") {
					return;
				}
				if (qtd < value) {
					Quasar.farm_post.can = false;
				}
			});
			return Quasar.farm_post.can;
		},
		cleanInputs : function () {
			$("input[class='unitsInput']").each(function () {
				var value = Number($(this).val());
				var qtd = $(this).parent().find("a:eq(1)").text();
				qtd = qtd.replaces("(", "");
				qtd = qtd.replaces(")", "");
				qtd = Number(qtd);
				if (value === null || value === "" || value === 0)
					return;
				if (qtd < value) {
					return;
				}
				$(this).parent().find("a:eq(1)").text("(" + (qtd - value) + ")");
			});
		},
		doAttack : function () {
			var index = Quasar.config.get("index_" + game_data.village.id, 0) + 1;
			var coords = Quasar.config.get("coords_" + game_data.village.id, []);
			if (coords.length < 1)
				return false;
			if (index > coords.length - 1) {
				var stop = Quasar.config.get("stop_end_farm", false);
				if (stop) {
					return;
				} else {
					index = 0;
				}
			}
			Quasar.config.set("index_" + game_data.village.id, index);
			Quasar.farm.addAttack();
			$("#current").text(index);
			var id = game_data.village.id;
			var current = coords[index];
			var data = {
				x : current.split("|")[0],
				y : current.split("|")[1],
				attack : true
			};
			for (var unit in Quasar.game.units) {
				var inputed = Number($("#unit_input_" + unit).val());
				data[unit] = inputed;
			}
			Quasar.farm_post.cleanInputs();
			$.ajax({
				url : "?village=" + id + "&try=confirm&screen=place",
				type : "post",
				data : data,
				success : function (html) {
					if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
						Quasar.farm_post.can = false;
						return false;
					}
					var $form = $('form', html);
					$.post($form[0].action, $form.serialize(), function (html2) {
						if ($('img[src="?captcha"]', html2).length || $('#error', html2).length) {
							Quasar.farm_post.can = false;
							return false;
						}
					});
				}
			});
			return true;
		},
		getStatus : function () {
			return Quasar.config.get("auto_farm_post", false);
		},
		setStatus : function (status) {
			Quasar.config.set("auto_farm_post", status);
			if (status) {
				Quasar.farm.setStatus(false);
				$("#auto_farm").removeClass("active");
			}
		}
	},
	farm : {
		init : function () {
			if (!Quasar.farm.getStatus()) {
				return false;
			}
			var waiting_attack = false;
			$(".troop_template_selector").each(function () {
				if (waiting_attack) {
					return true;
				}
				$(this).click();
				if (Quasar.farm.canAttack()) {
					waiting_attack = Quasar.farm.doAttack();
				}
			});
			Quasar.utils.setReload("&screen=place");
			return false;
		},
		canAttack : function () {
			var can = true;
			var coords = Quasar.config.get("coords_" + game_data.village.id, []);
			if (coords.length < 1)
				return false;
			$("input[class='unitsInput']").each(function () {
				var value = $(this).val();
				var qtd = $(this).parent().find("a").text();
				qtd = qtd.replaces("(", "");
				qtd = qtd.replaces(")", "");
				if (value === null || value === "")
					return;
				if (Number(qtd) < value) {
					can = false;
				}
			});
			return can;
		},
		doAttack : function () {
			var index = Quasar.config.get("index_" + game_data.village.id, 0) + 1;
			var coords = Quasar.config.get("coords_" + game_data.village.id, []);
			if (coords.length < 1) {
				return false;
			}
			if (index > coords.length - 1) {
				var stop = Quasar.config.get("stop_end_farm", false);
				if (stop) {
					return;
				} else {
					index = 0;
				}
			}
			var current = coords[index];
			$("input[name='input']").val(current);
			Quasar.config.set("index_" + game_data.village.id, index);
			Quasar.farm.addAttack();
			//Wait a random time to prevent ban
			setTimeout(function () {
				$("#target_attack").click();
			}, Quasar.utils.random(500, 2500));
			return true;
		},
		doConfirm : function () {
			//Wait a random time to prevent ban and wait for JQuery load :)
			setTimeout(function () {
				$('#troop_confirm_go').click();
			}, Quasar.utils.random(500, 2500));
		},
		addAttack : function () {
			var qjson = new QJSON("attacks", true);
			var date = $("#serverDate").text();
			if (qjson.contains(date)) {
				var n = qjson.get(date) + 1;
				qjson.set(date, n);
			} else {
				qjson.add(date, 0);
			}
			Quasar.config.set("attacks", qjson.toJSON());
		},
		getStatus : function () {
			return Quasar.config.get("auto_farm", false);
		},
		setStatus : function (status) {
			Quasar.config.set("auto_farm", status);
			if (status) {
				Quasar.farm_post.setStatus(false);
				$("#auto_farm_post").removeClass("active");
			}
		}
	},
	report : {
		init : function () {
			Quasar.report.UI.init();
		},
		UI : {
			init : function () {
				$("#content_value").prepend('<div id="menu_script" style="display:none;"><table class="vis nowrap tall" style="width: 100%"><tr><th style="width: 66%">Menu</th></tr><tr><td><input id="clean" class="btn" type="button" value="Clean Villages"></td></tr></table></div>');
				var coord = "";
				$("btn_wall_drop").on("click", function () {
					Quasar.wall.attack(coord[0], coord[1]);
				});
				$("#menu_script").show(1000);
			}
		},
		view : function () {
			var coord_name = $("#attack_info_def .village_anchor a");
			if (coord_name.length < 1) {
				return;
			}
			var coord = coord_name.text().split("(")[1].split(")")[0];

			var wall = $('<td><img src="/graphic/buildings/wall.png" title="Add to drop list"/></td>').on("click", function () {
					Quasar.wall.save(coord, $(this));
				});
			var add = $('<td><img src="/graphic/map/attack.png" title="Add to farm list"/></td>').on("click", function () {
					var coords = Quasar.config.get("coords_" + game_data.village.id, []);
					if (!coords.indexOf(coord) > -1) {
						coords.push(coord);
						Quasar.config.set("coords_" + game_data.village.id, coords);
						$(this).addClass("success");
					} else {
						$(this).addClass("fail");
					}
				});

			var remove = $('<td><img src="/graphic/map/return.png" title="Remove from farm list"/></td>').on("click", function () {
					var coords = Quasar.config.get("coords_" + game_data.village.id, []);
					if (coords.indexOf(coord) > -1) {
						coords.splice(coord, 1);
						Quasar.config.set("coords_" + game_data.village.id, coords);
						$(this).addClass("success");
					} else {
						$(this).addClass("fail");
					}
				});

			var label = $("tr:first", "#attack_results ");
			label.append(wall);
			label.append(add);
			label.append(remove);
		}
	},
	wall : {
		init : function () {
			if (!Quasar.wall.getStatus())
				return false;
			var units = this.getUnits();
			var coordsStorage = Quasar.config.get("wall_coords", []);
			if (coordsStorage.length <= 0 || !Quasar.wall.hasUnits()) {
				return false;
			}
			Quasar.wall.cleanInputs();
			for (var i = 0; i < units.length; i++) {
				$("#unit_input_" + units[i][0]).val(units[i][1]);
			}
			var coords = Quasar.utils.orderByDis(game_data.village.coord, coordsStorage);
			var current = coords[0];
			$("input[name='input']").val(current);
			coords.shift();
			Quasar.config.set("wall_coords", coords);
			$("#target_attack").click();
			return true;
		},
		cleanInputs : function () {
			$('.unitsInput').each(function () {
				$(this).val(0);
			});
		},
		getUnits : function () {
			var units = [];
			units.push(["spy", Quasar.config.get("wall_drop_spy", 1)]);
			units.push(["ram", Quasar.config.get("wall_drop_ram", 15)]);
			units.push(["axe", Quasar.config.get("wall_drop_axe", 30)]);
			return units;
		},
		hasUnits : function () {
			var units = this.getUnits();
			for (var i = 0; i < units.length; i++) {
				var t = $("#unit_input_" + units[i][0]).next("a").text().match(/\d+/g)[0];
				if (Number(t) < Number(units[i][1])) {
					return false;
				}
			}
			return true;
		},
		canAttack : true,
		attack : function (x, y, report_id) {
			if (!Quasar.wall.canAttack) {
				$("#" + report_id).parent().addClass("fail");
				return;
			}
			var id = game_data.village.id;
			var data = {
				x : x,
				y : y,
				attack : true
			};
			for (var unit in Quasar.game.units) {
				data[unit] = 0;
			}
			data.spy = Quasar.config.get("wall_drop_spy", 1);
			data.ram = Quasar.config.get("wall_drop_ram", 15);
			data.axe = Quasar.config.get("wall_drop_axe", 45);
			$.ajax({
				url : "?village=" + id + "&try=confirm&screen=place",
				type : "post",
				data : data,
				success : function (html) {
					if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
						$("#" + report_id).parent().addClass("fail");
						Quasar.wall.canAttack = false;
						return false;
					}
					var form = $('form', html);
					$.post(form[0].action, form.serialize(), function (html2) {
						if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
							$("#" + report_id).parent().addClass("fail");
							Quasar.wall.canAttack = false;
							return false;
						}
						$("#" + report_id).parent().addClass("success");
					});
				}
			});
		},
		save : function (coord, $element) {
			var coords = Quasar.config.get("wall_coords", []);
			if (coords.indexOf(coord) === -1) {
				coords.push(coord);
				Quasar.config.set("wall_coords", coords);
				$element.addClass("success");
			} else {
				$element.addClass("fail");
			}
		},
		getStatus : function () {
			return Quasar.config.get("break_wall");
		},
		setStatus : function (status) {
			if (Quasar.coordinator.getStatus() && status) {
				Quasar.coordinator.setStatus(false);
				UI.SuccessMessage("O coordenador foi desativado para não gerar conflito com o derrubador de muralhas.");
				Quasar.coordinator.$element.removeClass("active");
			}
			Quasar.config.set("break_wall", status);
		}
	},
	am_farm : {
		jump : false,
		cicle : 0,
		rows : 0,
		init : function () {
			Quasar.am_farm.UI.init();
			if (!Quasar.am_farm.getStatus())
				return;
			Quasar.am_farm.doAttacks();
			Quasar.utils.setReload("&order=distance&dir=asc&screen=am_farm");
		},
		doAttacks : function () {
			var time = 0;
			var IS_BY_RATIO = Quasar.config.get("am_is_by_ratio", false);
			var MAXATTACK = Number(Quasar.config.get("max_am_attacks", 2));
			var RATIO = Number(Quasar.config.get("am_dis_ratio", 1));
			var ATTACK_CONTROL = Quasar.config.get("attack_control", false);
			var MAXDIS = Number(Quasar.config.get("max_am_dis", 20));
			var BLUE_SET = Quasar.config.get("blue_reports", false);
			var YELLOW_SET = Quasar.config.get("yellow_reports", true);
			var USE_C = Quasar.config.get("use_c_am", true);
			var MAXWALL = Number(Quasar.config.get("max_am_wall", 3));
			var RES_A = Quasar.am_farm.getTemplateRes("0");
			var DELETE_MOST_ATTACKED = Quasar.config.get("delete_most_attacked", false);

			var $rows = $(".row_a:visible, .row_b:visible", "#am_widget_Farm");

			$rows.each(function (index) {
				var $this = $(this);
				//Adiciona uma quantidade de ms ao toal de time
				time += Quasar.utils.random(300, 500);

				//Agenda as checagens de envio
				setTimeout(function () {
					if ($(".error").length > 0) {
						if ($(".error").length) {
							Quasar.am_farm.jump = true;
						}
					}

					if (Quasar.am_farm.jump) {
						return;
					}

					Quasar.am_farm.rows++;

					var cicle = Quasar.am_farm.cicle;

					if (index == $rows.length - 1 && (!(!IS_BY_RATIO && cicle > MAXATTACK) || !(IS_BY_RATIO && cicle > RATIO * MAXDIS))) {
						Quasar.am_farm.cicle++;
						setTimeout(Quasar.am_farm.doAttacks, 500);
					}

					var deleted = false,
					isHidden = true;
					var classText = $this.attr("class").split(" ")[0];
					var rep_id = "drop_" + classText;
					var deletelink = $this.find("td:eq(0) a");

					/* Get links of templates */
					var linkA = $this.find(".farm_icon_a");
					var linkB = $this.find(".farm_icon_b");
					var linkC = $this.find(".farm_icon_c");

					var regex = "[0-9]{1,3}\\|[0-9]{1,3}";
					var coord = $this.find("td:eq(3) a").text().match(regex)[0];
					var sumRes = 0; //Default sum of resources

					/* For each resource td...*/
					$this.find("td:eq(5) .res").each(function () {
						sumRes += Number($(this).text().replace(".", ""));
					});

					var wall = Number($this.find("td:eq(6)").text() == "?" ? -1 : $this.find("td:eq(6)").text());

					var full = false; // Default value of is full
					var img = $this.find("td:eq(2) img");

					if (img.length > 0) {
						full = img.attr("src").match(/1.png/g) !== null ? true : false;
					}

					/* Get last report color */
					var green = $this.find("td:eq(1) img").attr("src").match(/green.png/g) !== null ? true : false;
					var blue = $this.find("td:eq(1) img").attr("src").match(/blue.png/g) !== null ? true : false;
					var yellow = $this.find("td:eq(1) img").attr("src").match(/yellow.png/g) !== null ? true : false;
					var red = $this.find("td:eq(1) img").attr("src").match(/red.png/g) !== null ? true : false;

					/* Get how many attacks were sent */
					var atqs = Number($this.find("#attacks").text());

					/* Get distance */
					var dis = Number($this.find("td:eq(7)").text());

					//Se estiver ativo para controlar ataques, e a quantidade de ataques for maior que o dessa rotação
					if (ATTACK_CONTROL && atqs > Quasar.am_farm.cicle) {
						return false;
					}
					//Se a distancia é maior que o maximo configurado, não ataca
					else if (dis > MAXDIS) {
						return false;
					}
					//Calcula a quantidade de ataques maximos baseados na razao de distacia
					else if (IS_BY_RATIO && atqs >= (RATIO * dis) && atqs !== 0) {
						if (DELETE_MOST_ATTACKED) {
							deletelink.click();
						}
						return false;
					}
					//Calcula ataques maximos baseado no padão consigurado
					else if (!IS_BY_RATIO && atqs >= MAXATTACK) {
						if (DELETE_MOST_ATTACKED) {
							deletelink.click();
						}
						return false;
					}
					//Se o ultimo relatorio foi vermelho, deleta esse relatorio
					else if (red) {
						deletelink.click();
						return true;
					}
					//Se o ultimo relatorio foi azul e não esta configurado para atacar azuis, não ataca
					else if (blue && !BLUE_SET) {
						return false;
					}
					//Se o ultimo relatorio for amarelho e está configurado para nao atacar relatorios amarelhos
					//e a muralha desse relatorio for maior que o maximo
					//ou se a muralha for maior que o maximo aceito nas configurações
					//não ataca
					else if ((yellow && YELLOW_SET && wall == -1) || wall > MAXWALL) {
						//Se a quantidade de ataques for igual a 0, envia a coordenada para o wall droper
						if (atqs === 0) {
							Quasar.wall.save(coord, $this.find("#wall").parent());
						}
						return false;
					}
					/* Checagens de envio com prioridade*/

					//Se o botão C está visivel
					//e esta configurado para atacar
					//com o templace C e não existem mensagens de erro na tela
					else if (linkC.length > 0 && USE_C) {
						//Só ataca com templace C, se não existirem ataques aquela aldeias
						// e se a soma dos recursos existentes for maior ou igual ao minimo configurado
						if (atqs === 0 && sumRes >= RES_A) {
							linkC.click();
							Quasar.farm.addAttack();
						}
					}
					//Se o botão A esta visivel e existem tropas suficientes para atacar
					else if (linkA.length > 0 && Quasar.am_farm.hasTroop("0")) {
						linkA.click();
						Quasar.farm.addAttack();
					}
					//Se o botão B esta visivel e existem tropas suficientes para atacar
					else if (linkB.length > 0 && Quasar.am_farm.hasTroop("1")) {
						linkB.click();
						Quasar.farm.addAttack();
					}
					//Se não atacar por que nao possui tropas, esconde
					else {
						return true;
					}
					$this.hide();
				}, time);
			});
		},
		//Templace represents the number of the templace, A = 0, B = 1
		hasTroop : function (template) {
			var has = true;
			$("form:eq(" + template + ") tr:eq(1) input").each(function () {
				var unit = $(this).attr("name");
				var temp = Number($(this).val());
				var current = Number($("#units_home #" + unit).text());
				if (current < temp) {
					has = false;
				}
			});
			return has;
		},
		getTemplateRes : function (template) {
			return Number($("form:eq(" + template + ") tr:eq(1) td:eq(6)").text());
		},
		UI : {
			init : function () {
				$("#plunder_list tbody tr:eq(0) ").append('<th><img src="/graphic/buildings/wall.png?"/></th><th><img src="/graphic/command/attack.png"/></th>');
				var time = 0;

				$(".row_a, .row_b").each(function () {
					time += 100;
					var $this = $(this);
					setTimeout(function () {
						var classText = $this.attr("class").split(" ")[0];

						var id = "drop_" + classText;
						var regex = "[0-9]{1,3}\\|[0-9]{1,3}";
						var coord = $this.find("td:eq(3) a").text().match(regex)[0];
						var img = $this.find("td:eq(3) img");

						var ataques = 0;

						if (img.length > 0) {
							img.mouseover();
							ataques = $('#tooltip h3').text().replace(/\D/g, '');
							img.mouseout();
						}

						var $image = $('<td><img id="wall" src="/graphic/buildings/wall.png?"/></td>').on("click", function () {
								Quasar.wall.save(coord, $(this));
							});
						$this.append($image);
						$this.append('<td id="attacks">' + ataques + '</td>');

					}, time);
				});
			}
		},
		getStatus : function () {
			return Quasar.config.get('am_farm', false);
		},
		setStatus : function (status) {
			Quasar.config.set('am_farm', status);
		}
	},
	dodge : {
		init : function () {

			if (Quasar.dodge.getStatus() && game_data.player.incomings > 0 && Quasar.dodge.getDodgeVillage() !== null) {
				this.UI.showAlert();
				this.attack();
			}

			this.cancel();
			Quasar.utils.setReload("&screen=overview");
		},
		//Rename comming attacks
		renameAttacks : function () {
			//I think that it is not part of Dodge!
			if (!game_data.player.premium) {
				return;
			}

			//Conta qts ataques estão vindo, se for maior do que o que tinha na ultima vez que renomeou,
			//renomeia e altera, se for menor, apenas atualiza a lista
			var atqs = Quasar.config.get("incoming_attacks", 0);

			if (atqs < game_data.player.incomings) {
				Quasar.interface.menu.popupBox("Incoming attacks", "Loading page...", 1200, null, function () {
					$("#quasar_popup").load("?village=" + game_data.village.id + "&mode=incomings&subtype=attacks&screen=overview_villages", function (html) {
						var $html = $(html);
						Quasar.config.set("before_identify_page", location.href);
						$html.find("#select_all").click();
						$html.find("#incomings_form input[name='label']").click();
					});
				});
			}

			if (atqs != game_data.player.incomings) {
				Quasar.config.set("incoming_attacks", game_data.player.incomings);
			}

		},
		//Cancel dodge attacks, if exists
		cancel : function () {},
		//Schedule a attack
		attack : function () {
			var time = Quasar.dodge.getAttackTime();
			if (time === null) {
				return;
			}
			//Send trops now!
			if (time <= 60) {
				Quasar.dodge.sendAttack();
			}
			//Schedule an attack
			else {
				setTimeout(function () {
					Quasar.dodge.sendAttack();
				}, (time - 60) * 1000);
			}
		},
		sendAttack : function () {
			Quasar.interface.menu.popupBox("Dodging", "Loading page...", 1200, null, function () {

				Quasar.config.set("before_dodge_page", location.href);
				$("#quasar_popup").load("?village=" + game_data.village.id + "&screen=place", function (html) {
					var $html = $(html);
					var target = Quasar.dodge.getAttackVillage();
					if (target === null) {
						return;
					}
					$html.find("input[name='input']").val(target);
					$html.find('.unitsInput').each(function () {
						var $this = $(this);
						var $maxUnits = $this.next('a').html();
						var maxUnits = $maxUnits.substr(1).substr(0, $maxUnits.length - 2);
						$this.val(maxUnits);
					});
					$html.find("#target_attack").click();
				});
			});
		},
		hasTroop : function () {
			var has = false;
			$('.unitsInput').each(function () {
				var $this = $(this);
				if ($this.val() !== "" && Number($this.val()) > 0) {
					has = true;
					return false;
				}
			});
			return has;
		},
		UI : {
			showAlert : function () {
				if (Quasar.dodge.getStatus() && game_data.player.incomings > 0) {
					var s = $("#dodge");
					if (!s.hasClass("alert"))
						s.addClass("alert");
					else
						s.removeClass("alert");
					setTimeout(Quasar.dodge.UI.showAlert, 1000);
				}
			}
		},
		getDodgeVillage : function () {
			return Quasar.config.get("dodge_target", null);
		},
		getAttackTime : function () {
			var $ele = $(".no_ignored_command:first");
			if ($ele.length > 0) {
				var timer = $ele.find("td:eq(2) span").text();
				return Quasar.utils.stringToSec(timer);
			}
			return null;
		},
		getStatus : function () {
			return Quasar.config.get('dodge', false);
		},
		setStatus : function (status) {
			Quasar.config.set('dodge', status);
		}
	},
	lang : {
		init : function () {
			this.cache = Quasar.config.get("language", "br");
		},
		cache : "br",
		get : function (string) {
			var lang = Quasar.lang[this.cache];
			if (typeof lang == "undefined" || lang == null) {
				return string;
			}

			var result = lang[string];

			if (typeof result == "undefined") {
				return string;
			}
			return result;
		},
		br : {
			save : "Salvar",
			count : "Contador",
			language : "Portugues",
			yes : "sim",
			no : "nao",
			auto_farm : "Farmador",
			auto_farm_post : "Farmador Silencioso",
			auto_recruit : "Recrutador",
			anti_afk : "Anti-Captcha",
			auto_build : "Construtor",
			coordinator : "Coordenador",
			dodge : "Dodge",
			planner : "Planejador (Preview)",
			update_notes : "Sobre",
			wall_drop : "Derrubar muralha",
			am_farm : "Auto AS",
			attacks_today : "Ataques hoje",
			order_recruit : "Ordem",
			option : "Opções",
			units : "Unidades",
			opt_title : "Opções de recrutamento",
			build_queue : "Fila de construção",
			build_level : "Nivel",
			price : "Custo",
			hide_link : "Esconder",
			show_link : "Mostrar",
			builds : "Contruções",
			add_icon_title : "Adicionar a fila",
			remove_icon_title : "Remover da fila",
			villages : "Aldeias",
			order : "Ordenar",
			clean : "Limpar",
			anti_afk_msg : "Para o anti-captcha funcionar corretamente é necessario desbloquear os\npopups do site no seu navegador.",
			village_notes : "Notas da aldeia",
			colect_coords : "Coletar coordenadas",
			show_coords : "Mostrar coordenadas",
			map_size : "Tamanho do mapa",
			configuration : "Configuracoes",
			welcome_window : "Boas vindas",
			import_export : "Importar/Exportar"
		}
	},
	train : {
		_temp_storage : {},
		init : function () {
			Quasar.train.UI.init();
			if (!Quasar.train.getStatus())
				return;

			this.fillUnitTimes();

			if (this.isSequential()) {
				Quasar.train.sequentialRecruitment();
				Quasar.train.UI.updateType();
			} else {
				Quasar.train.numericalRecruitment(0);
				Quasar.train.UI.updateType();
				var recruitBtn = $("input[type='submit']");
				if (!recruitBtn.hasClass("btn-recruit-disabled")) {
					recruitBtn.click();
				}
			}
			Quasar.utils.setReload("&screen=train");
		},
		/*
		Armazena informações das unidades
		Fix problemas trazidos na versão 8.25
		 */
		fillUnitTimes : function () {
			var that = this;
			$("div.recruit_req").each(function () {
				var $this = $(this);
				var $span = $this.find("span:last");
				var unit = $span.attr("id").split("_" + unit_build_block.village_id + "_cost_time")[0];
				var time = Quasar.utils.stringToSec($span.text());

				var $many = $this.parent().parent().find("td:eq(2)");
				var many = $many.text().split("/")[1];

				var json = {
					many : many,
					time : time
				};
				that._temp_storage[unit] = json;
			});
		},
		isSequential : function () {
			return Quasar.config.get("sequential_recruitment", true);
		},
		queueLimite : function () {
			return Number(Quasar.config.get("max_recruit_time", 8)) * 60 * 60;
		},
		numericalRecruitment : function (index) {
			var tropas = Quasar.config.get("recruitment_numerical_" + game_data.village.id, []);

			if (tropas.length < 1 || index > tropas.length - 1) {
				return;
			}

			var unitType = tropas[index][0];
			var unitAmmount = Number(tropas[index][1]);
			var build = Quasar.game.units[unitType].ed;

			var unit_temp_storage = this._temp_storage[unitType];

			var timeUnit = typeof unit_temp_storage != "undefined" ? unit_temp_storage.time : 0;
			var many = typeof unit_temp_storage != "undefined" ? unit_temp_storage.many : 0;

			var units;

			var ele_unit = $("#" + unitType + "_" + unit_build_block.village_id);

			if (ele_unit.length > 0) {
				//Quantidade de unidadades disponeis pra recrutamento
				var unitCount = Number($("#" + unitType + "_" + unit_build_block.village_id + "_a").text().replaces(")", "").replaces("(", ""));

				//Se existem unidades disponiveis e o tempo limite para a fila for maior que 0
				if (unitCount > 0 && this.queueLimite() > 0 && many <= unitAmmount) {
					if (unitCount >= unitAmmount) {
						units = unitAmmount;
					} else {
						units = unitCount;
					}

					var plusTime = timeUnit * units;
					console.log(unitType, units, "time: ", timeUnit, "queue", this.getQueueTime(build));

					//Enquanto o tempo de build for maior que o limite, tira uma unidade,
					//Sai do loop quando o numero de unidades for o suficiente pra manter a fila dentro do limite
					while (this.getQueueTime(build) + plusTime > this.queueLimite() && units > 0) {
						plusTime = timeUnit * (--units);
					}

					if (units > 0) {
						ele_unit.val(units);
						unit_build_block._onchange();
					}

				}
			}
			//Tenta a proxima unidade independente do que acontecer
			this.numericalRecruitment(++index);
		},
		sequentialRecruitment : function () {
			var tropas = Quasar.config.get("recruitment_sequential_" + game_data.village.id, []);
			var index = Quasar.config.get("train_index_" + game_data.village.id, 0);
			if (tropas.length < 1)
				return;
			if (index > (tropas.length - 1))
				index = 0;
			var unitType = tropas[index];
			var build = Quasar.game.units[unitType].ed;
			var ele_unit = $("#" + unitType + "_" + unit_build_block.village_id);
			if (ele_unit.length > 0) {
				var unitCount = Number($("#" + unitType + "_" + unit_build_block.village_id + "_a").text().replaces(")", "").replaces("(", ""));
				//Se existem unidades disponiveis
				if (unitCount >= 1) {
					var troops = Number(ele_unit.val()) + 1;
					var timeUnit = this._temp_times[unitType];
					var plusTime = timeUnit * troops;
					if (this.getQueueTime(build) + plusTime < this.queueLimite()) {
						ele_unit.val(troops);
						Quasar.config.set("train_index_" + game_data.village.id, ++index);
						unit_build_block._onchange();
						this.sequentialRecruitment();
						var recruitBtn = $("input[type='submit']");
						if (!recruitBtn.hasClass("btn-recruit-disabled")) {
							recruitBtn.click();
							setTimeout(Loader.goTo, 2 * 1000);
						}
						return;
					}
				}
			}
		},
		getQueueTime : function (build) {
			if ($("#trainqueue_" + build).length < 1)
				return 0;
			var time = 0;
			$("#trainqueue_" + build + " .sortable_row").each(function () {
				var stime = $(this).find("td:eq(1)").text();
				time += Quasar.utils.stringToSec(stime);
			});

			var $that = this;

			$(".recruit_unit").each(function () {
				var $this = $(this);
				//se o input nao estiver vazio ou com 0
				if ($this.val() != "" && $this.val() != 0) {
					var unit = $this.attr("name");

					if (Quasar.game.units[unit].ed == build) {
						time += $that._temp_storage[unit].time;
					}
				}
			});

			time += Quasar.utils.stringToSec($("#trainqueue_wrap_" + build + " td:eq(1)").text());
			return time;
		},
		getStatus : function () {
			return Quasar.config.get("auto_train", false);
		},
		setStatus : function (status) {
			Quasar.config.set("auto_train", status);
		},
		updateRecruiment : function () {
			if (!Quasar.train.isSequential()) {
				var temp = [];
				$("#sortable1").find("span").each(function () {
					var $this = $(this);
					temp.push([$this.attr("id"), $this.attr("data-badge")]);
				});
				Quasar.config.set("recruitment_numerical_" + game_data.village.id, temp);
			}
			//Se é sequencial
			else {
				var sorted = $("#sortable1").sortable("toArray");
				sorted.shift();
				Quasar.config.set("recruitment_sequential_" + game_data.village.id, sorted);
			}
			this.UI.updateType();
		},
		UI : {
			init : function () {

				var $main_table = $('<table width="100%" class="content-border vis nowrap tall" style="opacity:0;"><tr><th style="width: 40%">' + Quasar.lang.get("order_recruit") + '( Limitado em ' + Quasar.config.get("max_recruit_time", 8) + ' horas) [ <a href="#" id="import">Importar</a> | <a href="#" id="export">Exportar</a> ]</th><th style="width: 40%" >' + Quasar.lang.get("units") + '</th><th style="width: 20%"></th></tr><tr><td><div id="sortable1" style="width: 100%"><img src="graphic/buildings/barracks.png"></div></td><td><div id="sortable2"></div></td><td id="recruitmentType"></td></tr></table></br>');

				$("#contentContainer").before($main_table);

				var status = Quasar.train.isSequential();

				$sequencial = $('<label><input type="radio" name="type" ' + (status ? 'checked' : '') + '>Sequêncial</label>').on('click', function () {
						Quasar.config.set("sequential_recruitment", true);
						Quasar.train.UI.updateType();
					});

				$quantitativo = $('<label><input type="radio" name="type" ' + (status ? '' : 'checked') + '>Quantitativo</label>').on('click', function () {
						Quasar.config.set("sequential_recruitment", false);
						Quasar.train.UI.updateType();
					});

				$recruitType = $("#recruitmentType");
				$recruitType.append($sequencial);
				$recruitType.append("</br>");
				$recruitType.append($quantitativo);

				Quasar.train.UI.updateType();
				$main_table.fadeTo(1000, 1);
			},
			updateType : function () {
				var $sortable1 = $("#sortable1");
				var $sortable2 = $("#sortable2");
				var unit = null;
				var tropas = null;
				var i;

				//Limpa o os dois campos
				$sortable1.html("");
				$sortable2.html("");

				//Adiciona itens a lista
				for (i in Quasar.game.units) {
					unit = Quasar.game.units[i].name;
					$sortable2.append('<span id="' + unit + '"><img src="/graphic/unit/recruit/' + unit + '.png"></span>');
				}

				$sortable1.append('<img src="graphic/buildings/barracks.png">');

				if (Quasar.train.isSequential()) {
					tropas = Quasar.config.get("recruitment_sequential_" + game_data.village.id, []);
					for (i in tropas) {
						unit = tropas[i];
						$sortable1.append('<span id="' + unit + '"><img src="/graphic/unit/recruit/' + unit + '.png"></span>');
					}
					$("#sequential").attr("checked", "checked");
				} else {
					tropas = Quasar.config.get("recruitment_numerical_" + game_data.village.id, []);
					for (i in tropas) {
						unit = tropas[i][0];
						var qtd = tropas[i][1];
						$sortable1.append('<span id="' + unit + '" class="badge1" data-badge="' + qtd + '"><img src="/graphic/unit/recruit/' + unit + '.png"></span>');
					}
					$("#numerical").attr("checked", "checked");
				}

				$sortable1.sortable({
					placeholder : "ui_active",
					forcePlaceholderSize : true,
					cursor : "move",
					revert : true,
					tolerance : "pointer",
					connectWith : "#sortable2",
					stop : function (event, ui) {
						$item = ui.item;
						if ($item.parent().attr("id") == "sortable2") {
							$item.remove();
						}
						Quasar.train.updateRecruiment();
					}
				}).disableSelection();

				$sortable2.sortable({
					placeholder : "ui_active",
					forcePlaceholderSize : true,
					cursor : "move",
					revert : true,
					tolerance : "pointer",
					connectWith : "#sortable1",
					stop : function (event, ui) {
						$item = ui.item;
						if ($item.parent().attr("id") != "sortable2") {
							$item.clone().appendTo($sortable2);
							if (!Quasar.train.isSequential() && $item.attr("data-badge") == null) {
								var qtd = Number(prompt("Quantas unidades deseja recrutar?", 1));
								if (qtd < 1)
									qtd = 1;
								$item.attr("data-badge", qtd);
								$item.addClass("badge1");
							}
						}
						Quasar.train.updateRecruiment();
					}
				}).disableSelection();

			}
		}
	},
	utils : {
		IsNumeric : function (input) {
			return (input - 0) == input && ('' + input).replace(/^\s+|\s+$/g, "").length > 0;
		},
		stringToSec : function (string) {
			if (typeof string === "undefined")
				return null;
			var str = string.split(":");
			if (str.length < 3)
				return null;
			var sec = 0;
			sec += Number(str[0]) * 60 * 60;
			sec += Number(str[1]) * 60;
			sec += Number(str[2]);
			return Number(sec);
		},
		secToString : function (secs) {
			var hours = Math.floor(secs / (60 * 60));
			var divisor_for_minutes = secs % (60 * 60);
			var minutes = Math.floor(divisor_for_minutes / 60);
			var divisor_for_seconds = divisor_for_minutes % 60;
			var seconds = Math.ceil(divisor_for_seconds);
			return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
		},
		getVillageByID : function (id) {
			for (var item = 0; item < TWMap.villages.length; item++) {
				if (typeof TWMap.villages[item] !== "undefined")
					if (TWMap.villages[item].id == id) {
						return TWMap.villages[item];
					}
			}
			return null;
		},
		random : function (a, b) {
			return Math.floor(Math.random() * (b - a + 1)) + a;
		},
		coordToId : function (coord) {
			if (TWMap === "undefined")
				return null;
			var v = TWMap.villages[coord];
			if (typeof v == "undefined")
				return null;
			return v.id;
		},
		getNextVillage : function () {
			var v = new QJSON("villages", true);
			var coord = game_data.village.coord;
			var ai = v.getIndexOf(coord) + 1;
			if (ai > v.length() - 1) {
				ai = 0;
			}
			return v.get(ai);
		},
		setReload : function (url) {
			var time = Quasar.utils.random(Number(Quasar.config.get("min_rand", 300)), Number(Quasar.config.get("max_rand", 900)));
			console.log("Reloading in " + time + " seconds");
			Quasar.interface.menu.countDown(time, function () {
				if (game_data.player.premium && game_data.player.villages > 1) {
					location.href = $("#village_switch_right").attr("href");
				} else if (game_data.player.villages > 1 && Quasar.utils.getNextVillage() != null) {
					var vid = Quasar.utils.getNextVillage();
					location.href = "?village=" + vid + url;
				} else {
					location.href = "";
				}
			});
		},
		getPrevVillage : function () {
			var v = new QJSON("villages", true);
			var coord = game_data.village.coord;
			var ai = v.getIndexOf(coord) - 1;
			if (ai < 0) {
				ai = v.length() - 1;
			}
			return v.get(ai);
		},
		getDataOld : function (name, defaultValue) {
			var value = localStorage.getItem(name);
			if (!value)
				if (defaultValue == undefined) {
					return '';
				} else {
					this.setData(name, defaultValue);
					return defaultValue;
				}
			var type = value[0];
			value = value.substring(1);
			switch (type) {
			case 'b':
				return value == 'true';
			case 'n':
				return Number(value);
			default:
				return value;
			}
		},
		setDataOld : function (name, value) {
			value = (typeof value)[0] + value;
			localStorage.setItem(name, value);
		},
		getData : function (chave, def) {
			var data = new QJSON(game_data.player.name);
			return data.get(chave) === null ? def : data.get(chave);
		},
		setData : function (chave, value) {
			var data = new QJSON(game_data.player.name);
			data.set(chave, value);
			data.save();
		},
		_GET : function (name, link) {
			if (link === null)
				link = location.href;
			url = link.replace(/.*?\?/, '');
			var itens = url.split("&");
			for (var n = 0; n < itens.length; n++) {
				if (n.match(name) !== null) {
					return decodeURIComponent(itens[n].replace(name + "=", ""));
				}
			}
			return null;
		},
		orderByDis : function (mycoord, coords) {
			var dis = [],
			xa = mycoord.split("|")[0],
			ya = mycoord.split("|")[1],
			xb,
			yb;
			var i;
			if (!(coords instanceof Array)) {
				coords = coords.split(" ");
			}
			for (i = 0; i < coords.length; i++) {
				xb = coords[i].split("|")[0];
				yb = coords[i].split("|")[1];
				dis[i] = Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2));
			}
			for (i = 0; i < coords.length; i++) {
				for (var a = i + 1; a < coords.length; a++) {
					if (dis[a] < dis[i]) {
						var temp = dis[a];
						dis[a] = dis[i];
						dis[i] = temp;
						var temp2 = coords[a];
						coords[a] = coords[i];
						coords[i] = temp2;
					}
				}
			}
			return coords;
		},
		clean : function (coords) {
			var temp = [];
			if (!(coords instanceof Array)) {
				coords = coords.split(" ");
			}
			for (var i = 0; i < coords.length; i++) {
				if (!temp.indexOf(coords[i]) > -1 && coords[i] !== "")
					temp.push(coords[i]);
			}
			return temp;
		},
		tickTimer : function (timer) {
			var time = timer.endTime - (getLocalTime() + timeDiff);
			if (time <= 0) {
				var parent = timer.element.parent().parent();
				var ele = parent.parent().parent().find("tr.sortable_row");
				parent.remove();
				if (game_data.screen == 'train' || game_data.screen == 'main') {
					Loader.goTo();
				}
				return true;
			}
			formatTime(timer.element, time, false);
			return false;
		}
	},
	game : {
		builds : {
			"main" : {
				"max" : 30,
				"name" : "Edifício principal",
				"wood" : 90,
				"stone" : 80,
				"iron" : 70,
				"pop" : 5,
				"fwood" : 1.26,
				"fstone" : 1.275,
				"firon" : 1.26,
				"fpop" : 1.17
			},
			"barracks" : {
				"max" : 25,
				"name" : "Quartel",
				"wood" : 200,
				"stone" : 170,
				"iron" : 90,
				"pop" : 7,
				"fwood" : 1.26,
				"fstone" : 1.28,
				"firon" : 1.26,
				"fpop" : 1.17
			},
			"stable" : {
				"max" : 20,
				"name" : "Estabulo",
				"wood" : 270,
				"stone" : 240,
				"iron" : 260,
				"pop" : 8,
				"fwood" : 1.26,
				"fstone" : 1.28,
				"firon" : 1.26,
				"fpop" : 1.17
			},
			"garage" : {
				"max" : 15,
				"name" : "Oficina",
				"wood" : 300,
				"stone" : 240,
				"iron" : 260,
				"pop" : 8,
				"fwood" : 1.26,
				"fstone" : 1.28,
				"firon" : 1.26,
				"fpop" : 1.17
			},
			"church" : {
				"max" : 3,
				"name" : "Igreja",
				"wood" : 16000,
				"stone" : 20000,
				"iron" : 5000,
				"pop" : 5000,
				"fwood" : 1.26,
				"fstone" : 1.28,
				"firon" : 1.26,
				"fpop" : 1.55
			},
			"church_f" : {
				"max" : 1,
				"name" : "Primeira Igreja",
				"wood" : 160,
				"stone" : 200,
				"iron" : 50,
				"pop" : 5,
				"fwood" : 1.26,
				"fstone" : 1.28,
				"firon" : 1.26,
				"fpop" : 1.55
			},
			"snob" : {
				"max" : 1,
				"name" : "Academia",
				"wood" : 15000,
				"stone" : 25000,
				"iron" : 10000,
				"pop" : 80,
				"fwood" : 2,
				"fstone" : 2,
				"firon" : 2,
				"fpop" : 1.17
			},
			"smith" : {
				"max" : 20,
				"name" : "Ferreiro",
				"wood" : 220,
				"stone" : 180,
				"iron" : 240,
				"pop" : 20,
				"fwood" : 1.26,
				"fstone" : 1.275,
				"firon" : 1.26,
				"fpop" : 1.17
			},
			"place" : {
				"max" : 1,
				"name" : "Praça",
				"wood" : 10,
				"stone" : 40,
				"iron" : 30,
				"pop" : 0,
				"fwood" : 1.26,
				"fstone" : 1.275,
				"firon" : 1.26,
				"fpop" : 1.17
			},
			"statue" : {
				"max" : 1,
				"name" : "Estabulo",
				"wood" : 220,
				"stone" : 220,
				"iron" : 220,
				"pop" : 10,
				"fwood" : 1.26,
				"fstone" : 1.275,
				"firon" : 1.26,
				"fpop" : 1.17
			},
			"market" : {
				"max" : 25,
				"name" : "Mercado",
				"wood" : 100,
				"stone" : 100,
				"iron" : 100,
				"pop" : 20,
				"fwood" : 1.26,
				"fstone" : 1.275,
				"firon" : 1.26,
				"fpop" : 1.17
			},
			"wood" : {
				"max" : 30,
				"name" : "Bosque",
				"wood" : 50,
				"stone" : 60,
				"iron" : 40,
				"pop" : 5,
				"fwood" : 1.25,
				"fstone" : 1.275,
				"firon" : 1.245,
				"fpop" : 1.155
			},
			"stone" : {
				"max" : 30,
				"name" : "Poço de argila",
				"wood" : 65,
				"stone" : 50,
				"iron" : 40,
				"pop" : 5,
				"fwood" : 1.27,
				"fstone" : 1.265,
				"firon" : 1.24,
				"fpop" : 1.14
			},
			"iron" : {
				"max" : 30,
				"name" : "Mina de ferro",
				"wood" : 75,
				"stone" : 65,
				"iron" : 70,
				"pop" : 10,
				"fwood" : 1.252,
				"fstone" : 1.275,
				"firon" : 1.24,
				"fpop" : 1.17
			},
			"farm" : {
				"max" : 30,
				"name" : "Fazenda",
				"wood" : 45,
				"stone" : 40,
				"iron" : 30,
				"pop" : 0,
				"fwood" : 1.3,
				"fstone" : 1.32,
				"firon" : 1.29,
				"fpop" : 1
			},
			"storage" : {
				"max" : 30,
				"name" : "Armazem",
				"wood" : 60,
				"stone" : 50,
				"iron" : 40,
				"pop" : 0,
				"fwood" : 1.265,
				"fstone" : 1.27,
				"firon" : 1.245,
				"fpop" : 1.15
			},
			"hide" : {
				"max" : 10,
				"name" : "Esconderijo",
				"wood" : 50,
				"stone" : 60,
				"iron" : 50,
				"pop" : 2,
				"fwood" : 1.25,
				"fstone" : 1.25,
				"firon" : 1.25,
				"fpop" : 1.17
			},
			"wall" : {
				"max" : 20,
				"name" : "Muralha",
				"wood" : 50,
				"stone" : 100,
				"iron" : 20,
				"pop" : 5,
				"fwood" : 1.26,
				"fstone" : 1.275,
				"firon" : 1.26,
				"fpop" : 1.17
			},
		},
		units : {
			"spear" : {
				"wood" : 50,
				"stone" : 30,
				"iron" : 10,
				"pop" : 1,
				"time" : 1020,
				"ed" : "barracks",
				"name" : "spear"
			},
			"sword" : {
				"wood" : 30,
				"stone" : 30,
				"iron" : 70,
				"pop" : 1,
				"time" : 1500,
				"ed" : "barracks",
				"name" : "sword"
			},
			"axe" : {
				"wood" : 60,
				"stone" : 30,
				"iron" : 40,
				"pop" : 1,
				"time" : 1320,
				"ed" : "barracks",
				"name" : "axe"
			},
			"archer" : {
				"wood" : 100,
				"stone" : 30,
				"iron" : 60,
				"pop" : 1,
				"time" : 1800,
				"ed" : "barracks",
				"name" : "archer"
			},
			"spy" : {
				"wood" : 50,
				"stone" : 50,
				"iron" : 20,
				"pop" : 2,
				"time" : 900,
				"ed" : "stable",
				"name" : "spy"
			},
			"light" : {
				"wood" : 100,
				"stone" : 125,
				"iron" : 250,
				"pop" : 4,
				"time" : 1800,
				"ed" : "stable",
				"name" : "light"
			},
			"marcher" : {
				"wood" : 250,
				"stone" : 100,
				"iron" : 150,
				"pop" : 5,
				"time" : 2700,
				"ed" : "stable",
				"name" : "marcher"
			},
			"heavy" : {
				"wood" : 200,
				"stone" : 150,
				"iron" : 600,
				"pop" : 6,
				"time" : 3600,
				"ed" : "stable",
				"name" : "heavy"
			},
			"ram" : {
				"wood" : 300,
				"stone" : 200,
				"iron" : 200,
				"pop" : 5,
				"time" : 4800,
				"ed" : "garage",
				"name" : "ram"
			},
			"catapult" : {
				"wood" : 320,
				"stone" : 400,
				"iron" : 100,
				"pop" : 8,
				"time" : 7200,
				"ed" : "garage",
				"name" : "catapult"
			}
		}
	}
};
