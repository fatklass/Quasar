/*
 * Objeto de Edificil
 * Executado quando Quasar está na screen de Edificil principal
 */
Quasar.main = {
	niveis : {},
	init : function () {
		var get = Quasar.game.builds;
		this.load();

		var update_all = BuildingMain.update_all;
		BuildingMain.update_all = function (data) {
			update_all(data);
			Quasar.UI.init();
		};

		if (this.getStatus()) {
			this.build();
		}
		Quasar.utils.setReload("&screen=main");		
		Quasar.interface.main.init();
	},
	build : function () {
		var queue = Quasar.core.get("queue_" + game_data.village.id, []);

		if (queue.length > 0) {
			var building = queue[0];
			if ($("#main_buildlink_" + building).is(':visible') && BuildingMain.order_count < this.getMax()) {
				queue.shift();
				Quasar.core.set("queue_" + game_data.village.id, queue);
				this.load();
				BuildingMain.build(building);

				setTimeout(Quasar.build, 1000);
			}
		}
	},
	getMax : function () {
		if (typeof premium === "undefined" || premium === false) {
			return 2;
		} else {
			return Number(Quasar.core.get("max_build_queue", 5));
		}
	},
	getCurrentNivel : function (name) {
		var bq = $("#buildqueue .buildorder_" + name);
		if (bq.length > 0) {
			return Number(bq.last().find("td:eq(0)").text().match(/\d+/g)[0]);
		}
		var text = $("#main_buildrow_" + name).find("span:eq(0)").text().match(/\d+/g);
		if (text !== null) {
			return Number(text[0]);
		} else {
			return 0;
		}
	},
	getStatus : function () {
		return Quasar.core.get("auto_build", false);
	},
	setStatus : function (status) {
		Quasar.core.set("auto_build", status);
	}
};