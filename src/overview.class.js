Quasar.overview = {
	init : function () {
		Quasar.map.updateAR();
		Quasar.overview.UI.init();
	},
	UI : {
		init : function () {
			tickTimer = Quasar.utils.tickTimer;
			if (!premium) {
				this.premiumChanges();
			}
		},
		premiumChanges : function () {
			var html = '<div id="show_notes" class="vis moveable widget" style="display:none;"><h4 class="head"><img style="float: right; cursor: pointer;" src="graphic/minus.png">' + Quasar.lang.get("village_notes") + '</h4><div class="widget_content" style="display: block;"><table width="100%"><tbody><tr><td id="village_note"></td></tr><tr><td><a id="edit_notes_link" href="javascript:void(0);">» Editar</a></td></tr></tbody></table></div></div>';
			$("#show_summary").after(html);
			Quasar.overview.UI.load_notes();
			$("#show_notes").show(1000);
			$("#edit_notes_link").on("click", function () {
				Quasar.overview.UI.edit_notes($("#village_note"), Quasar.lang.get("village_notes"));
			});
		},
		load_notes : function () {
			var notes = new QJSON("notes", true);
			var vid = game_data.village.id;
			var content = (notes.get(vid) !== null ? notes.get(vid) : "");
			$("#village_note").html(content);
		},
		edit_notes : function (element, title) {
			var notes = new QJSON("notes", true);
			var vid = game_data.village.id;
			var content = (notes.get(vid) !== null ? notes.get(vid).replace(/<br>/g, '\n') : "");
			title = Quasar.lang.get("village_notes");
			var html = '<div><textarea id="message" name="note" rows="10" cols="40">' + content + '</textarea></div><div><input type="button" id="ok_note" value="OK" class="btn"></div>';
			var onDraw = function () {
				$('#ok_note').on('click', function () {
					var note = $('#message').val().replace(/\n/g, '<br>');
					var notes = new QJSON("notes", true);
					notes.set(game_data.village.id, note);
					Quasar.core.set("notes", notes);
					Quasar.overview.UI.load_notes();
				});
			};
			Quasar.interface.menu.popupBox(title, html, 400, null, onDraw);
		}
	}
};

Quasar.overview_villages = {
	init : function () {
		this.saveVillages();
	},
	saveVillages : function () {
		var villages = new QJSON("villages", true);
		$("#production_table .row_a, #production_table .row_b").each(function () {
			var span = $(this).find("td:eq(0) span a span");
			var coord = span.text().split("(")[1].split(")")[0];
			var id = span.attr("id").replace("label_text_", "");
			villages.set(coord, id);
		});
		Quasar.core.set("villages", villages.toJSON());
	},
	changeName : function (village, newName) {
		$.post("?village=" + village + "&action=change_name&h=ddbf&screen=main", {
			name : newName
		}, function (data) {
			console.log("FUN");
		});
	}
};
