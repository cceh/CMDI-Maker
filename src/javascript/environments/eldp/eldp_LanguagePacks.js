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


eldp_environment.languages[0] = {

	id: "english",
	name: "English",
	
	workflow: {
		resources: "Resources",
		persons: "persons",
		bundles: "Bundles",
		xml_output: "XML Output"
	},
	
	settings: {
	
		calculate_persons_age: "Calculate person's Age",
		calculate_persons_age_description: "When this feature is activated, CMDI Maker checks if the age of an person (if it has not been specified already) "+
			"can be calculated from the person's birth date and the session date.<br>"+
			"When an age can be calculated, it will appear in the output file.<br>"+
			"(Age = Session Date - person's Birth Date)",
		output_format: "Output Format",
		export_persons_as_json: "Export persons as JSON",
		import_persons_from_json_or_imdi: "Import persons from JSON or IMDI",
		import_persons_description: "Please import UTF-8 encoded files only!",
		delete_persons_database: "Delete persons Database",
		delete_persons_database_description: "CMDI Maker saves all your persons in a Web Storage browser database, so that they are kept, even if you close the browser window.",
		
	},
	
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
		primary_language: "Primary Language",
		mother_tongue: "Mother Tongue",
		current_content_languages: "Current Content Languages",
		content_language_removed__before_lang: "Content Language \"",
		content_language_removed__after_lang: "\" removed"
		
	},
	
	persons: {
		new_person: "New Person",
		delete_this_person: "Delete this person",
		sort_persons_alphabetically: "Sort persons alphabetically",
		persons_alphabetically_sorted: "persons sorted",
		save_and_duplicate_this_person: "Save and duplicate this person",
		yes_delete_all_persons: "Yes, delete all persons",
		no: "No",
		ok: "OK",
		confirm_erasing_persons_db: "Really?<br>You want to erase the whole persons database?",
		all_persons_deleted: "All persons deleted",
		save_person: "Save person",
		save_changes_to_this_person: "Save changes to this person",
		there_are_no_persons: "There are no persons!",
		persons_imported: "persons imported",
		person_saved_and_duplicated: "Person saved and duplicated.",
		give_your_person_a_name_first: "Please give your person a name first.",
		yes_delete_person: "Yes, delete person",
		really_erase_before_name: "Really?<br>You want to erase ",
		really_erase_after_name: "?",
		person_deleted_before_name: "",
		person_deleted_after_name: " deleted",

	},
	
	output: {
		bundles_must_have_proper_name: "All bundles must have proper names! Not allowed chars are: <br>"
	}
};


eldp_environment.languages[1] = {

	id: "german",
	name: "Deutsch",
	
	workflow: {
		corpus: "Corpus",
		resources: "Resources",
		persons: "persons",
		session: "Sessions",
		xml_output: "XML"
	},
	
	settings: {
		calculate_persons_age: "Automatische Altersberechnung von persons",
		calculate_persons_age_description: "Wenn diese Funktion aktiviert ist, prüft CMDI Maker, ob das Alter eines persons (wenn es noch nicht angegeben worden ist) "+
			"aus dem Geburtsdatum des persons und dem Datum der Session berechnet werden kann.<br>"+
			"Wenn ein Alter berechnet werden kann, erscheint dieses in der generierten XML-Datei.<br>"+
			"(Alter = Datum der Session - Geburtsdatum des persons)",
		output_format: "Ausgabeformat",
		export_persons_as_json: "persons als JSON exportieren",
		import_persons_from_json_or_imdi: "persons von JSON oder IMDI importieren",
		import_persons_description: "Bitte importiere nur Dateien mit der Zeichenkodierung UTF-8!",
		delete_persons_database: "persons-Datenbank löschen",
		delete_persons_database_description: "CMDI Maker speichert all deine persons in einer Browserdatenbank. Sie bleiben also erhalten, auch nachdem du den Browser geschlossen hast.",
	}
	
};