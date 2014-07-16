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
	
	
};