/*
Copyright 2014 Sebastian Zimmer

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


imdi_environment.languages[0] = {

	id: "english",
	name: "English",
	
	workflow: {
		corpus: "Corpus",
		resources: "Resources",
		actors: "Actors",
		session: "Sessions",
		xml_output: "XML Output"
	},
	
	settings: {
	
		calculate_actors_age: "Calculate Actor's Age",
		calculate_actors_age_description: "When this feature is activated, CMDI Maker checks if the age of an actor (if it has not been specified already) "+
			"can be calculated from the actor's birth date and the session date.<br>"+
			"When an age can be calculated, it will appear in the output file.<br>"+
			"(Age = Session Date - Actor's Birth Date)",
		output_format: "Output Format",
		imdi: "IMDI",
		cmdi_with_imdi_profile: "CMDI with IMDI profile",
		export_actors_as_json: "Export Actors as JSON",
		import_actors_from_json_or_imdi: "Import Actors from JSON or IMDI",
		import_actors_description: "Please import UTF-8 encoded files only!",
		delete_actors_database: "Delete Actors Database",
		delete_actors_database_description: "CMDI Maker saves all your actors in a Web Storage browser database, so that they are kept, even if you close the browser window."
		
	},
	
	reset_form: "Reset Form",
	yes_delete_form: "Yes, delete form",
	no: "No",
	really_reset_form: "Really?<br>You want to reset the form and delete corpus and all sessions?",
	form_reset: "Form reset",
	search: "Search",
	ok: "OK",
	
	languages: {
		set_global_languages_of_content: "Set Global Languages of Content",
		or_type_in_iso_code: "or type in ISO code",
		language_search: "Language Search",
		result: "result",
		results: "results",
		language_name: "Language Name",
		is_new_global: "is a new Global Content Language",
		iso_code: "ISO code",
		not_found_in_db: "not found in database",
		specify_search_request_at_least_3_chars: "Please specify your search request.\nType in at least 3 characters.",
	},
	
	resources: {
		compatibility_warnings: {
			general: 'This file does not seem to be a valid resource file for LAMUS. Please consider recoding it.',
			invalid_media_file: 'This media file does not seem to be a valid file for LAMUS. Please consider recoding it to WAV (audio) or MP4 (video).',
			invalid_written_resource: 'This file does not seem to be a valid written resource for LAMUS. Please consider recoding it to PDF or TXT.'
		},
		unkown: "Unknown",
		create_one_session_per_file: "Create one session per file",
		files: "Files",
		selected_files: "Selected Files",
		sort_alphabetically: "Sort Files alphabetically",
		remove: "Remove",
		clear_file_list: "Clear File List",
		drag_and_drop_files_here: "Drag and drop files here",
		usage: "Usage",
		click: "Click",
		click_to_select: "Select resource, click again to deselect a single resource",
		shift: "Shift",
		shift_to_select_multiple: "Hold shift to select multiple resources",
		escape: "Escape",
		escape_to_deselect: "Press escape to deselect all resources",
		size: "Size",
		last_modified: "Last modified",
		no_resource_files_imported: "No resource files imported."
	},
	
	actors: {
		new_actor: "New Actor",
		delete_this_actor: "Delete this actor",
		sort_actors_alphabetically: "Sort Actors alphabetically",
		actors_alphabetically_sorted: "Actors sorted.",
		save_and_duplicate_this_actor: "Save and duplicate this actor",
		yes_delete_all_actors: "Yes, delete all actors",
		no: "No",
		ok: "OK",
		confirm_erasing_actors_db: "Really?<br>You want to erase the whole actors database?",
		all_actors_deleted: "All actors deleted",
		save_actor: "Save actor",
		save_changes_to_this_actor: "Save changes to this actor",
		there_are_no_actors: "There are no actors!",
		actors_imported: "actors imported",
		actor_saved_and_duplicated: "Actor saved and duplicated.",
		give_your_actor_a_name_first: "Please give your actor a name first.",
		yes_delete_actor: "Yes, delete actor",
		really_erase_before_name: "Really?<br>You want to erase ",
		really_erase_after_name: "?",
		actor_deleted_before_name: "Actor ",
		actor_deleted_after_name: " deleted",

	
	
	}
	
};


imdi_environment.languages[1] = {

	id: "german",
	name: "Deutsch",
	
	workflow: {
		corpus: "Corpus",
		resources: "Resources",
		actors: "Actors",
		session: "Sessions",
		xml_output: "XML"
	},
	
	settings: {
		calculate_actors_age: "Automatische Altersberechnung von Actors",
		calculate_actors_age_description: "Wenn diese Funktion aktiviert ist, prüft CMDI Maker, ob das Alter eines Actors (wenn es noch nicht angegeben worden ist) "+
			"aus dem Geburtsdatum des Actors und dem Datum der Session berechnet werden kann.<br>"+
			"Wenn ein Alter berechnet werden kann, erscheint dieses in der generierten XML-Datei.<br>"+
			"(Alter = Datum der Session - Geburtsdatum des Actors)",
		output_format: "Ausgabeformat",
		imdi: "IMDI",
		cmdi_with_imdi_profile: "CMDI mit IMDI-Profil",
		export_actors_as_json: "Actors als JSON exportieren",
		import_actors_from_json_or_imdi: "Actors von JSON oder IMDI importieren",
		import_actors_description: "Bitte importiere nur Dateien mit der Zeichenkodierung UTF-8!",
		delete_actors_database: "Actors-Datenbank löschen",
		delete_actors_database_description: "CMDI Maker speichert all deine Actors in einer Browserdatenbank. Sie bleiben also erhalten, auch nachdem du den Browser geschlossen hast.",
		current_content_languages: "Current Content Languages"
	},
	
	reset_form: "Formular zurücksetzen",
	yes_delete_form: "Ja, Daten löschen",
	no: "Nein",
	really_reset_form: "Willst Du das wirklich?<br>Das Corpus und alle Sessions werden dabei gelöscht.",
	form_reset: "Formular zurückgesetzt",
	search: "Suchen",
	ok: "OK",
	
	languages: {
		set_global_languages_of_content: "Globale Content Language hinzufügen",
		or_type_in_iso_code: "oder gib den ISO-Code ein",
		language_search: "Sprachsuche",
		result: "Ergebnis",
		results: "Ergebnisse",
		language_name: "Sprachname",
		is_new_global: "ist neue globale Content Language",
		iso_code: "ISO-Code",
		not_found_in_db: "wurde nicht gefunden",
		specify_search_request_at_least_3_chars: "Bitte sei etwas genauer.\nGib mindestens 3 Zeichen ins Suchfeld ein.",
		current_content_languages: "Derzeitige Content Languages"
	},
	
	resources: {
		compatibility_warnings: {
			general: 'Diese Datei scheint keine valide Datei für LAMUS zu sein. Vielleicht sollte sie transkodiert werden.',
			invalid_media_file: 'Diese Datei scheint keine valide Datei für LAMUS zu sein. Vielleicht sollte sie in WAV (audio) oder MP4 (video) umgewandelt werden.',
			invalid_written_resource: 'Diese Datei scheint keine valide Datei für LAMUS zu sein. Vielleicht sollte sie in PDF oder TXT umgewandelt werden.'
		},
		unkown: "Unbekannt",
		create_one_session_per_file: "Eine Session pro Datei erstellen",
		files: "Dateien",
		selected_files: "Ausgewählte Dateien",
		sort_alphabetically: "Alphabetisch sortieren",
		remove: "Entfernen",
		clear_file_list: "Dateiliste löschen",
		drag_and_drop_files_here: "Ziehe Dateien in dieses Feld",
		usage: "Benutzung",
		click: "Klick",
		click_to_select: "Datei wird ausgewählt, noch ein Klick macht die Auswahl rückgängig",
		shift: "Shift",
		shift_to_select_multiple: "Halte Shift, um mehrere Dateien auf einmal auszuwählen",
		escape: "Escape",
		escape_to_deselect: "Alle Dateien werden deselektiert",
		size: "Größe",
		last_modified: "Letzte Änderung",
		no_resource_files_imported: "Keine Dateien importiert."
	},
	
	actors: {
		new_actor: "Neuer Actor",
		delete_this_actor: "Diesen Actor löschen",
		sort_actors_alphabetically: "Alphabetisch sortieren",
		actors_alphabetically_sorted: "Actors sortiert.",
		save_and_duplicate_this_actor: "Actor speichern und duplizieren",
		yes_delete_all_actors: "Ja, alle Actors löschen",
		no: "Nein",
		ok: "OK",
		confirm_erasing_actors_db: "Willst du das wirklich?<br>Die komplette Actors-Datenbank wird gelöscht.",
		all_actors_deleted: "Alle Actors wurden gelöscht.",
		save_actor: "Actor speichern",
		save_changes_to_this_actor: "Änderungen am Actor speichern",
		there_are_no_actors: "Es gibt keine Actors!",
		actors_imported: "Actors importiert",
		actor_saved_and_duplicated: "Actor gespeichert und dupliziert.",
		give_your_actor_a_name_first: "Bitte gib deinem Actor zuerst einen Namen!",
		yes_delete_actor: "Ja, Actor löschen",
		really_erase_before_name: "Willst Du wirklich ",
		really_erase_after_name: " löschen?",
		actor_deleted_before_name: "Actor ",
		actor_deleted_after_name: " gelöscht",
	
	}
	
	
};