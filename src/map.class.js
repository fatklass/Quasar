Quasar.map = {
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
		Quasar.interface.map.init();
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
		Quasar.core.set("map_attacks", at);
		Quasar.core.set("map_returns", re);
	},
	doSC : function () {
		var coords = Quasar.core.get("coords_" + game_data.village.id, []);
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
		var attacks = Quasar.core.get("map_attacks", []);
		var returns = Quasar.core.get("map_returns", []);
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
		Quasar.core.set("map_size", val);
		TWMap.resize(val);
		this.size = val;
	}
};
