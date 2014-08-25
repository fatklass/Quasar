Quasar.utils = {
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
		var time = Quasar.utils.random(Number(Quasar.core.get("min_rand", 300)), Number(Quasar.core.get("max_rand", 900)));
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
};
