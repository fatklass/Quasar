/*
 * Classe responsavel por enviar ataques usando o metodo post da praça de reunião
 */
Quasar.farm_post = {
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
		var coords = Quasar.core.get("coords_" + game_data.village.id, []);
		if (coords.length < 1)
			return false;
		if (template === 0) {
			return false;
		}
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
		var index = Quasar.core.get("index_" + game_data.village.id, 0) + 1;
		var coords = Quasar.core.get("coords_" + game_data.village.id, []);
		if (coords.length < 1)
			return false;
		if (index > coords.length - 1) {
			var stop = Quasar.core.get("stop_end_farm", false);
			if (stop) {
				return;
			} else {
				index = 0;
			}
		}
		Quasar.core.set("index_" + game_data.village.id, index);
		Quasar.farm.addAttack();
		$("#current").text(index);
		var id = game_data.village.id;
		var data = {
			x : x,
			y : y,
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
				var form = $('form', html);
				$.post(form[0].action, form.serialize(), function (html2) {
					if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
						Quasar.farm_post.can = false;
						return false;
					}
				});
			}
		});
		return true;
	},
	getStatus : function () {
		return Quasar.core.get("auto_farm_post", false);
	},
	setStatus : function (status) {
		Quasar.core.set("auto_farm_post", status);
		if (status) {
			Quasar.farm.setStatus(false);
			$("#auto_farm").removeClass("active");
		}
	}
};
