Quasar.dodge = {
	init : function () {
		//I think that it is not part of Dodge!
		if (game_data.player.premium) {
			this.renameAttacks();
		}

		if (Quasar.dodge.getStatus() && game_data.player.incomings > 0 && Quasar.dodge.getDodgeVillage() !== null) {
			this.UI.showAlert();
			this.attack();
		}

		this.cancel();
		Quasar.utils.setReload("&screen=overview");
	},
	//Rename comming attacks
	renameAttacks : function () {
		//Conta qts ataques estão vindo, se for maior do que o que tinha na ultima vez que renomeou,
		//renomeia e altera, se for menor, apenas atualiza a lista
		var atqs = Quasar.core.get("incoming_attacks", 0);

		if (atqs < game_data.player.incomings) {
			Quasar.interface.menu.popupBox("Incoming attacks", "Loading page...", 1200, null, function () {
				$("#quasar_popup").load("?village=" + game_data.village.id + "&mode=incomings&subtype=attacks&screen=overview_villages", function (html) {
					var $html = $(html);
					Quasar.core.set("before_identify_page", location.href);
					$html.find("#select_all").click();
					$html.find("#incomings_form input[name='label']").click();
				});
			});
		}

		if (atqs != game_data.player.incomings) {
			Quasar.core.set("incoming_attacks", game_data.player.incomings);
		}

	},
	//Cancel dodge attacks, if exists
	cancel : function () {},
	//Schedule a attack
	attack : function () {
		var time = Quasar.dodge.getAttackTime();
		if (time === null) {
			return;
		}
		//Send trops now!
		if (time <= 60) {
			Quasar.dodge.sendAttack();
		}
		//Schedule an attack
		else {
			setTimeout(function () {
				Quasar.dodge.sendAttack();
			}, (time - 60) * 1000);
		}
	},
	sendAttack : function () {
		Quasar.interface.menu.popupBox("Dodging", "Loading page...", 1200, null, function () {

			Quasar.core.set("before_dodge_page", location.href);
			$("#quasar_popup").load("?village=" + game_data.village.id + "&screen=place", function (html) {
				var $html = $(html);
				var target = Quasar.dodge.getAttackVillage();
				if (target === null) {
					return;
				}
				$html.find("input[name='input']").val(target);
				$html.find('.unitsInput').each(function () {
					var $this = $(this);
					var $maxUnits = $this.next('a').html();
					var maxUnits = $maxUnits.substr(1).substr(0, $maxUnits.length - 2);
					$this.val(maxUnits);
				});
				$html.find("#target_attack").click();
			});
		});
	},
	hasTroop : function () {
		var has = false;
		$('.unitsInput').each(function () {
			var $this = $(this);
			if ($this.val() !== "" && Number($this.val()) > 0) {
				has = true;
				return false;
			}
		});
		return has;
	},
	UI : {
		showAlert : function () {
			if (Quasar.dodge.getStatus() && game_data.player.incomings > 0) {
				var s = $("#dodge");
				if (!s.hasClass("alert"))
					s.addClass("alert");
				else
					s.removeClass("alert");
				setTimeout(Quasar.dodge.UI.showAlert, 1000);
			}
		}
	},
	getDodgeVillage : function () {
		return Quasar.core.get("dodge_target", null);
	},
	getAttackTime : function () {
		var $ele = $(".no_ignored_command:first");
		if ($ele.length > 0) {
			var timer = $ele.find("td:eq(2) span").text();
			return Quasar.utils.stringToSec(timer);
		}
		return null;
	},
	getStatus : function () {
		return Quasar.core.get('dodge', false);
	},
	setStatus : function (status) {
		Quasar.core.set('dodge', status);
	}
};
