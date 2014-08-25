Quasar.train = {
	init : function () {
		Quasar.train.UI.init();
		if (!Quasar.train.getStatus())
			return;
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
	isSequential : function () {
		return Quasar.core.get("sequential_recruitment", true);
	},
	queueLimite : function () {
		return Number(Quasar.core.get("max_recruit_time", 8)) * 60 * 60;
	},
	numericalRecruitment : function (index) {
		var tropas = Quasar.core.get("recruitment_numerical_" + game_data.village.id, []);

		if (tropas.length < 1 || index > tropas.length - 1) {
			return;
		}

		var unitType = tropas[index][0];
		var unitAmmount = Number(tropas[index][1]);
		var build = Quasar.game.units[unitType].ed;
		var units;

		var ele_unit = $("#" + unitType + "_" + unit_build_block.village_id);
		if (ele_unit.length > 0) {
			var unitCount = Number($("#" + unitType + "_" + unit_build_block.village_id + "_a").text().replaces(")", "").replaces("(", ""));
			//Se existem unidades disponiveise o tempo limite para a fila for maior que 0
			if (unitCount > 0 && this.queueLimite() > 0) {
				if (unitCount >= unitAmmount) {
					units = unitAmmount;
				} else {
					units = unitCount;
				}
				var timeUnit = Quasar.utils.stringToSec(ele_unit.parent().parent().find("span.time").parent().text());
				var plusTime = timeUnit * units;

				//Enquanto o tempo de build for maior que o limite, tira uma unidade,
				//Sai do loop quando o numero de unidades for o suficiente pra manter a fila dentro do limite
				while (this.getQueueTime(build) + plusTime > this.queueLimite() && units > 0) {
					plusTime = timeUnit * (--units);
				}

				if (units > 0) {
					ele_unit.val(units);
					unit_build_block._onchange();

					if (units == unitAmmount) {
						var bkp_tropas = [];

						//Atualiza a array retirando este elemento dela :(
						for (var i = 0; i < tropas.length; i++) {
							if (i != index) {
								bkp_tropas.push(tropas[i]);
							}
						}
						//Decrementa um da var index pra corrigir o tamanho.
						--index;
						tropas = bkp_tropas;
					} else {
						tropas[index][1] = unitAmmount - units;
					}

					Quasar.core.set("recruitment_numerical_" + game_data.village.id, tropas);
				}

				//Tenta a proxima unidade independente do que acontecer
				this.numericalRecruitment(++index);
			}
		}
	},
	sequentialRecruitment : function () {
		var tropas = Quasar.core.get("recruitment_sequential_" + game_data.village.id, []);
		var index = Quasar.core.get("train_index_" + game_data.village.id, 0);
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
				var timeUnit = Quasar.utils.stringToSec(ele_unit.parent().parent().find("span.time").parent().text());
				var plusTime = timeUnit * troops;
				console.log(build, " ", this.getQueueTime(build));
				if (this.getQueueTime(build) + plusTime < this.queueLimite()) {
					ele_unit.val(troops);
					Quasar.core.set("train_index_" + game_data.village.id, ++index);
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
		time += Quasar.utils.stringToSec($("#trainqueue_wrap_" + build + " td:eq(1)").text());
		return time;
	},
	getStatus : function () {
		return Quasar.core.get("auto_train", false);
	},
	setStatus : function (status) {
		Quasar.core.set("auto_train", status);
	},
	updateRecruiment : function () {
		if (!Quasar.train.isSequential()) {
			var temp = [];
			$("#sortable1").find("span").each(function () {
				var $this = $(this);
				temp.push([$this.attr("id"), $this.attr("data-badge")]);
			});
			Quasar.core.set("recruitment_numerical_" + game_data.village.id, temp);
		}
		//Se é sequencial
		else {
			var sorted = $("#sortable1").sortable("toArray");
			sorted.shift();
			Quasar.core.set("recruitment_sequential_" + game_data.village.id, sorted);
		}
		this.UI.updateType();
	},
	UI : {
		init : function () {
			tickTimer = Quasar.utils.tickTimer;

			var $main_table = $('<table width="100%" class="content-border vis nowrap tall" style="opacity:0;"><tr><th style="width: 40%">' + Quasar.lang.get("order_recruit") + '( Limitado em ' + Quasar.core.get("max_recruit_time", 8) + ' horas)</th><th style="width: 40%" >' + Quasar.lang.get("units") + '</th><th style="width: 20%"></th></tr><tr><td><div id="sortable1" style="width: 100%"><img src="graphic/buildings/barracks.png"></div></td><td><div id="sortable2"></div></td><td id="recruitmentType"></td></tr></table></br>');

			$("#contentContainer").before($main_table);

			var status = Quasar.train.isSequential();

			$sequencial = $('<label><input type="radio" name="type" ' + (status ? 'checked' : '') + '>Sequêncial</label>').on('click', function () {
					Quasar.core.set("sequential_recruitment", true);
					Quasar.train.UI.updateType();
				});

			$quantitativo = $('<label><input type="radio" name="type" ' + (status ? '' : 'checked') + '>Quantitativo</label>').on('click', function () {
					Quasar.core.set("sequential_recruitment", false);
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
				tropas = Quasar.core.get("recruitment_sequential_" + game_data.village.id, []);
				for (i in tropas) {
					unit = tropas[i];
					$sortable1.append('<span id="' + unit + '"><img src="/graphic/unit/recruit/' + unit + '.png"></span>');
				}
				$("#sequential").attr("checked", "checked");
			} else {
				tropas = Quasar.core.get("recruitment_numerical_" + game_data.village.id, []);
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
};
