Quasar.wall = {
	init : function () {
		if (!Quasar.wall.getStatus())
			return false;
		var units = this.getUnits();
		var coordsStorage = Quasar.core.get("wall_coords", []);
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
		Quasar.core.set("wall_coords", coords);
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
		units.push(["spy", Quasar.core.get("wall_drop_spy", 1)]);
		units.push(["ram", Quasar.core.get("wall_drop_ram", 15)]);
		units.push(["axe", Quasar.core.get("wall_drop_axe", 30)]);
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
		data.spy = Quasar.core.get("wall_drop_spy", 1);
		data.ram = Quasar.core.get("wall_drop_ram", 15);
		data.axe = Quasar.core.get("wall_drop_axe", 45);
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
		var coords = Quasar.core.get("wall_coords", []);
		if (coords.indexOf(coord) === -1) {
			coords.push(coord);
			Quasar.core.set("wall_coords", coords);
			$element.addClass("success");
		} else {
			$element.addClass("fail");
		}
	},
	getStatus : function () {
		return Quasar.core.get("break_wall");
	},
	setStatus : function (status) {
		Quasar.core.set("break_wall", status);
	}
};
