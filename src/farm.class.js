/*
 * Ataca as coordenadas predefinidas com os templates adicionados!
*/
Quasar.farm = {
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
		var coords = Quasar.core.get("coords_" + game_data.village.id, []);
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
		var index = Quasar.core.get("index_" + game_data.village.id, 0) + 1;
		var coords = Quasar.core.get("coords_" + game_data.village.id, []);
		if (coords.length < 1) {
			return false;
		}
		if (index > coords.length - 1) {
			var stop = Quasar.core.get("stop_end_farm", false);
			if (stop) {
				return;
			} else {
				index = 0;
			}
		}
		var current = coords[index];
		$("input[name='input']").val(current);
		Quasar.core.set("index_" + game_data.village.id, index);
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
		Quasar.core.set("attacks", qjson.toJSON());
	},
	getStatus : function () {
		return Quasar.core.get("auto_farm", false);
	},
	setStatus : function (status) {
		Quasar.core.set("auto_farm", status);
		if (status) {
			Quasar.farm_post.setStatus(false);
			$("#auto_farm_post").removeClass("active");
		}
	}
};
