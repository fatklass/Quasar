Quasar.report = {
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
				var coords = Quasar.core.get("coords_" + game_data.village.id, []);
				if (!coords.indexOf(coord) > -1) {
					coords.push(coord);
					Quasar.core.set("coords_" + game_data.village.id, coords);
					$(this).addClass("success");
				} else {
					$(this).addClass("fail");
				}
			});

		var remove = $('<td><img src="/graphic/map/return.png" title="Remove from farm list"/></td>').on("click", function () {
				var coords = Quasar.core.get("coords_" + game_data.village.id, []);
				if (coords.indexOf(coord) > -1) {
					coords.splice(coord, 1);
					Quasar.core.set("coords_" + game_data.village.id, coords);
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
};
