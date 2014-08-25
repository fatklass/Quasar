Quasar.am_farm = {
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
		var IS_BY_RATIO = Quasar.core.get("am_is_by_ratio", false);
		var MAXATTACK = Number(Quasar.core.get("max_am_attacks", 2));
		var RATIO = Number(Quasar.core.get("am_dis_ratio", 1));
		var ATTACK_CONTROL = Quasar.core.get("attack_control", true);
		var MAXDIS = Number(Quasar.core.get("max_am_dis", 20));
		var BLUE_SET = Quasar.core.get("blue_reports", false);
		var YELLOW_SET = Quasar.core.get("yellow_reports", true);
		var USE_C = Quasar.core.get("use_c_am", true);
		var MAXWALL = Number(Quasar.core.get("max_am_wall", 3));
		var RES_A = Quasar.am_farm.getTemplateRes("0");

		var $rows = $(".row_a:visible, .row_b:visible", "#am_widget_Farm");
		console.log("Ciclo : " + Quasar.am_farm.cicle);
		$rows.each(function (index) {
			var $this = $(this);
			//Adiciona uma quantidade de ms ao toal de time
			time += Quasar.utils.random(300, 500);

			//Agenda as checagens de envio
			setTimeout(function () {
				if ($(".error").length > 0) {
					Quasar.am_farm.jump = true;
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
				var linkA = $this.find("a.farm_icon_a");
				var linkB = $this.find("a.farm_icon_b");
				var linkC = $this.find("a.farm_icon_c");

				var coord = $this.find("td:eq(3) a").text().split(")")[0].split("(")[1];
				var sumRes = 0; //Default sum of resources

				/* For each resource td...*/
				$this.find("td:eq(5) .res").each(function () {
					sumRes += Number($(this).text().replace(".", ""));
				});

				var wall = Number($this.find("td:eq(6)").text() == "?" ? 0 : $this.find("td:eq(6)").text());

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
					return false;
				}
				//Calcula ataques maximos baseado no padão consigurado
				else if (!IS_BY_RATIO && atqs >= MAXATTACK) {
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
				//ou se a muralha for maior que o maximo aceito nas configurações
				//não ataca.
				else if ((yellow && YELLOW_SET) || wall > MAXWALL) {
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
						console.log("Attack C");
						Quasar.farm.addAttack();
					}
				}
				//Se o botão A esta visivel e existem tropas suficientes para atacar
				else if (linkA.length > 0 && Quasar.am_farm.hasTroop("0")) {
					linkA.click();
					console.log("Attack A");
					Quasar.farm.addAttack();
				}
				//Se o botão B esta visivel e existem tropas suficientes para atacar
				else if (linkB.length > 0 && Quasar.am_farm.hasTroop("1")) {
					linkB.click();
					console.log("Attack B");
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
			$("#am_widget_Farm div table tbody tr:eq(1) ").append('<th><img src="/graphic/buildings/wall.png?"/></th><th><img src="/graphic/command/attack.png"/></th>');
			var time = 0;

			$(".row_a, .row_b").each(function () {
				time += 100;
				var $this = $(this);
				setTimeout(function () {
					var classText = $this.attr("class").split(" ")[0];

					var id = "drop_" + classText;

					var coord = $this.find("td:eq(3) a").text().split(")")[0].split("(")[1];
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
		return Quasar.core.get('am_farm', false);
	},
	setStatus : function (status) {
		Quasar.core.set('am_farm', status);
	}
};
