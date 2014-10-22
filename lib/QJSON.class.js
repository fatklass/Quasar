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
