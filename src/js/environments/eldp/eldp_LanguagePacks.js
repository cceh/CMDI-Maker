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
		persons: "Persons",
		bundles: "Bundles",
		xml_output: "XML Output"
	},
	
	settings: {
		
		calculate_persons_age: "Calculate Person's Age",
		calculate_persons_age_description: "When this feature is activated, CMDI Maker checks if the age of an person (if it has not been specified already) "+
			"can be calculated from the person's birth date and the bundle date.<br>"+
			"When an age can be calculated, it will appear in the output file.<br>"+
			"(Age = Bundle Date - person's Birth Date)",
		output_format: "Output Format",
		export_persons_as_json: "Export persons as JSON",
		import_persons_from_json_or_imdi: "Import persons from JSON or IMDI",
		import_persons_description: "Please import UTF-8 encoded files only!",
		delete_persons_database: "Delete persons Database",
		delete_persons_database_description: "CMDI Maker saves all your persons in a Web Storage browser database, so that they are kept, even if you close the browser window.",
		global_language_of_metadata: "Global Language of Metadata",
		cmdi_metadata_creator: "CMDI Metadata Creator",
		cmdi_metadata_creator_description: "The CMDI metadata format requires the name of a metadata creator. This is probably you. If so, please type in your name."
		
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
		content_language_removed__after_lang: "\" removed",
		additional_information: "Additional Information"
		
	},
	
	resources: {
		unknown: "Unknown",
		create_one_bundle_per_file: "Create one bundle per file",
		files: "Files",
		selected_files: "Selected Files",
		sort_alphabetically: "Sort Files alphabetically",
		remove: "Remove",
		clear_file_list: "Clear File List",
		usage: "Usage",
		click: "Click",
		click_to_select: "Select resource, click again to deselect a single resource",
		shift: "Shift",
		shift_to_select_multiple: "Hold shift to select multiple resources",
		escape: "Escape",
		escape_to_deselect: "Press escape to deselect all resources",
		size: "Size",
		path: "Path",
		last_modified: "Last modified",
		no_resource_files_imported: "No resource files imported.",
		fade: "Fade",
		fade_explanation: "Resources are faded down when they will be included in bundles.<br>"+
			"This is to prevent selecting them mistakenly.",
		set_for_all: "Set for all"
		
	},
	
	persons: {
		new_person: "New Person",
		delete_this_person: "Delete this person",
		sort_persons_alphabetically: "Sort persons alphabetically",
		persons_alphabetically_sorted: "persons sorted",
		save_and_duplicate_this_person: "Save and duplicate this person",
		duplicate_this_person: "Duplicate this person",
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
		there_are_no_persons_yet: "There are no persons yet.",
		why_not_create_one__before_link: "Why not ",
		why_not_create_one__link: "create one",
		why_not_create_one__after_link: "?",
		please_give_all_persons_a_name_before_creating_new_one: "Please give all your persons a name first, before creating a new one!",
		really_erase_this_person: "Really?<br>You want to erase this person?",
		unnamed_person: "Unnamed person"

	},
	
	
	bundle: {
		new_bundle: "New Bundle",
		copy_bundle_1_metadata: "Copy Bundle 1 metadata to all bundles",
		reset_form: "Reset Form",
		sort_by_name: "Sort by name",
		add_to_bundle: "Add to bundle",
		no_files_have_been_added: "No files have been added.",
		add_some_files: "Add some files.",
		new_bundle_has_been_created: "A new bundle has been created.",
		name: "Name",
		unnamed_bundle: "Unnamed Bundle",
		bundle: "Bundle",
		delete_bundle: "Delete Bundle",
		expand_bundle: "Expand Bundle",
		collapse_bundle: "Collapse Bundle",
		expand_collapse_bundle: "Expand/collapse bundle",
		no_persons_created_yet: "No persons have been created yet.",
		create_some_persons: "Create some persons.",
		really_erase_bundle: "Really?<br>You want to erase a whole bundle? Are you sure about that?",
		yes_delete_bundle: "Yes, delete bundle",
		bundle_deleted: "Bundle deleted",
		no_bundles_have_been_created_yet: "No bundles have been created yet.",
		why_not_create_one__before_link: "Why not ",
		why_not_create_one__link: "create one",
		why_not_create_one__after_link: "?",
		this_person_is_already_in_the_bundle: "This person is already in the bundle.",
		unknown_file_problem__before_filename: "We have a problem.<br>I don't know if this file is a Media File or a Written Resource:",
		unknown_file_problem__after_filename: "As for now, I will handle it as a written resource. But you really shouldn't do that.",
		bundle_name_taken_from_eaf: "Bundle name has been taken from EAF file name, since bundle has not been manually named yet.",
		bundle_date_extracted_from_eaf_file_name: "Bundle date has been extracted from EAF file name",
		at_least_2_bundles_to_assign_metadata: "There have to be at least 2 bundles to assign metadata from one to another.",
		bundle_1_metadata_assigned_to_all_bundles: "Bundle 1 metadata assigned to all bundles.",
		this_function_is_currently_unavailable: "This function is currently unavailable!",
		no: "No",
		yes_delete_form: "Yes, delete form",
		really_reset_form: "Really?<br>You want to reset the form and delete all bundles?",
		form_reset: "Form reset",
		specify_local_used_language_name: "Specify local used language name",
		subject_language: "Subject Language",
		content_language: "Content Language",
		working_language: "Working Language",
		really_erase_bundle: "Really?<br>You want to erase a whole bundle? Are you sure about that?",
		object: "Object",
		file_name: "File Name",
		size: "Size",
		copy_metadata: "Copy Metadata",
		from_bundle_1_to_all_others: "From Bundle 1 to all others",
		from_2nd_last_to_last_bundle: "From second last to last bundle",
		elements_to_copy: "Elements to copy",
		from_where_to_where: "From where to where",
		metadata_copied: "Metadata copied",
		bundle_title_taken_from_eaf: "Bundle title has been taken from EAF file name, since bundle has not been manually named yet.",

	},
	
	output: {
		bundles_must_have_proper_name: "All bundles must have proper names! Not allowed chars are: <br>",
		you_must_create_some_bundles_first: "You must create some bundles first!",
		every_bundle_must_have_a_project_name: "Every bundle must have a project name!",
		corpus_must_have_proper_name: "The corpus must have a proper name or no name at all.",
		bundles_must_have_proper_name: "Every bundle must have a proper name.<br>Unnamed bundles are not allowed.",
		download_corpus_including_all_bundles: "Download Corpus including all Bundles",
		download_zip_archive: "Download ZIP archive",
		not_allowed_chars_are: "Not allowed chars are: ",
		spaces_are_not_allowed_either: "Space characters are not allowed either.",
		persons_must_have_valid_birth_year: "Every person must have a valid birth year!",
		bundles_must_have_one_language: "Every bundle must have at least one language.",
		download_zip_archive: "Download ZIP archive"
	},
	
	really_overwrite_data: "Do you really want to overwrite data?",
	yes_overwrite_data: "Yes, overwrite data"
};



eldp_environment.languages[1] = {

	id: "german",
	name: "Deutsch",
	
	workflow: {
		resources: "Resources",
		persons: "Persons",
		bundles: "Bundles",
		xml_output: "XML Output"
	},
	
	settings: {
		
		calculate_persons_age: "Automatische Altersberechnung von Personen",
		calculate_persons_age_description: "Wenn diese Funktion aktiviert ist, prüft CMDI Maker, ob das Alter einer Person (wenn es noch nicht angegeben worden ist) "+
			"aus dem Geburtsdatum der Person und dem Datum des Bundles berechnet werden kann.<br>"+
			"Wenn ein Alter berechnet werden kann, erscheint dieses in der generierten XML-Datei.<br>"+
			"(Alter = Datum der Session - Geburtsdatum der Person)",
		output_format: "Ausgabeformat",
		export_persons_as_json: "Personen als JSON exportieren",
		import_persons_from_json: "Personen aus JSON importieren",
		import_persons_description: "Bitte importiere nur Dateien mit der Zeichenkodierung UTF-8!",
		delete_persons_database: "Alle Personen löschen",
		global_language_of_metadata: "Globale Metadaten-Sprache",
		cmdi_metadata_creator: "CMDI: Urheber der Metadaten",
		cmdi_metadata_creator_description: "Das CMDI-Metadatenformat setzt die Angabe eines Urhebers voraus. Das bist wahrscheinlich du! Gib in diesem Fall deinen Namen ein."
		
	},
	
	languages: {
		language_search: "Sprachsuche",
		language_name: "Language Name",
		iso_code: "ISO code",
		not_found_in_db: "wurde nicht gefunden",
		specify_search_request_at_least_3_chars: "Bitte sei etwas genauer.\nGib mindestens 3 Zeichen ins Suchfeld ein.",
		primary_language: "Primärsprache",
		mother_tongue: "Muttersprache",
		additional_information: "Additional Information"
		
	},
	
	resources: {
		unknown: "Unbekannt",
		create_one_bundle_per_file: "Ein Bundle pro Datei erstellen",
		files: "Dateien",
		selected_files: "Ausgewählte Dateien",
		sort_alphabetically: "Alphabetisch sortieren",
		remove: "Entfernen",
		clear_file_list: "Dateiliste löschen",
		usage: "Benutzung",
		click: "Klick",
		click_to_select: "Datei wird ausgewählt, noch ein Klick macht die Auswahl rückgängig",
		shift: "Shift",
		shift_to_select_multiple: "Halte Shift, um mehrere Dateien auf einmal auszuwählen",
		escape: "Escape",
		escape_to_deselect: "Alle Dateien werden deselektiert",
		size: "Größe",
		path: "Pfad",
		last_modified: "Letzte Änderung",
		no_resource_files_imported: "Keine Dateien importiert.",
		fade: "Ausgeblendete Dateien",
		fade_explanation: "Dateien werden ausgeblendet, wenn sie in einem Bundle enthalten sein werden.<br>"+
			"Dies soll das versehentliche Auswählen dieser verhindern.",
		set_for_all: "Für alle festlegen"
		
	},
	
	persons: {
		new_person: "Neue Person",
		delete_this_person: "Diese Person löschen",
		sort_persons_alphabetically: "Alphabetisch sortieren",
		persons_alphabetically_sorted: "Personen sortiert",
		duplicate_this_person: "Diese Person duplizieren",
		yes_delete_all_persons: "Ja, alle Personen löschen",
		no: "Nein",
		ok: "OK",
		confirm_erasing_persons_db: "Willst du wirklich alle Personen löschen?",
		all_persons_deleted: "Alle Personen gelöscht",
		there_are_no_persons: "Es existieren keine Personen!",
		persons_imported: "Personen importiert",
		give_your_person_a_name_first: "Bitte gib der Person zuerst einen Namen.",
		yes_delete_person: "Ja, Person löschen",
		really_erase_before_name: "Willst du wirklich ",
		really_erase_after_name: " löschen?",
		person_deleted_before_name: "",
		person_deleted_after_name: " gelöscht",
		there_are_no_persons_yet: "Es existieren noch keine Personen.",
		why_not_create_one__before_link: "Warum ",
		why_not_create_one__link: "erstellst",
		why_not_create_one__after_link: " du nicht eine?",
		please_give_all_persons_a_name_before_creating_new_one: "Bitte gib allen Personen einen Namen, bevor du eine neue erstellst!",
		really_erase_this_person: "Willst du diese Person wirklich löschen?",
		unnamed_person: "Unbenannte Person"

	},
	
	
	bundle: {
		new_bundle: "Neues Bundle",
		copy_bundle_1_metadata: "Dupliziere Bundle-1-Metadaten in allen Bundles",
		reset_form: "Formular zurücksetzen",
		sort_by_name: "Nach Namen sortieren",
		add_to_bundle: "Hinzufügen",
		no_files_have_been_added: "Es wurden noch keine Dateien importiert.",
		add_some_files: "Importiere welche.",
		new_bundle_has_been_created: "Ein neues Bundle wurde erstellt.",
		name: "Name",
		unnamed_bundle: "Unbenanntes Bundle",
		bundle: "Bundle",
		delete_bundle: "Bundle löschen",
		expand_bundle: "Bundle ausklappen",
		collapse_bundle: "Bundle minimieren",
		expand_collapse_bundle: "Bundle ausklappen/minimieren",
		no_persons_created_yet: "Es wurden noch keine Personen erstellt.",
		create_some_persons: "Erstelle welche.",
		really_erase_bundle: "Willst du wirklich ein komplettes Bundle löschen?",
		yes_delete_bundle: "Ja, Bundle löschen",
		bundle_deleted: "Bundle gelöscht",
		no_bundles_have_been_created_yet: "Es wurden noch keine Bundles erstellt.",
		why_not_create_one__before_link: "Warum ",
		why_not_create_one__link: "erstellst",
		why_not_create_one__after_link: " du nicht eins?",
		this_person_is_already_in_the_bundle: "Diese Person wurde bereits zum Bundle hinzugefügt.",
		bundle_name_taken_from_eaf: "Der Bundle-Name wurde vom Dateinamen der EAF-Datei übernommen, da die Session noch keinen Namen hatte.",
		bundle_date_extracted_from_eaf_file_name: "Das Datum des Bundles wurde aus dem Dateinamen der EAF-Datei extrahiert.",
		at_least_2_bundles_to_assign_metadata: "Es muss mindestens 2 Bundles geben, damit von einer Session in die andere kopiert werden können.",
		bundle_1_metadata_assigned_to_all_bundles: "Die Metadaten von Bundle 1 wurden in allen Sessions dupliziert.",
		this_function_is_currently_unavailable: "Diese Funktion ist zur Zeit nicht verfügbar!",
		no: "Nein",
		yes_delete_form: "Ja, Formular zurücksetzen",
		really_reset_form: "Willst du das Formular wirklich zurücksetzen und alle Bundles löschen?",
		form_reset: "Formular zurückgesetzt",
		specify_local_used_language_name: "Gib den lokal benutzten Sprachnamen ein",
		subject_language: "Subject Language",
		content_language: "Content Language",
		working_language: "Working Language",
		object: "Object",
		file_name: "Dateiname",
		copy_metadata: "Metadaten kopieren",
		from_bundle_1_to_all_others: "Von Bundle 1 in alle anderen Bundles",
		from_2nd_last_to_last_bundle: "Vom vorletzten Bundle ins letzte Bundle",
		elements_to_copy: "Zu kopierende Elemente",
		from_where_to_where: "Von wo nach wo",
		metadata_copied: "Metadaten kopiert"
	},
	
	output: {
		bundles_must_have_proper_name: "Jedes Bundle muss einen validen Namen haben!",
		you_must_create_some_bundles_first: "Du musst zuerst Bundles erstellen!",
		download_corpus_including_all_bundles: "Corpus mit allen Bundles herunterladen",
		download_zip_archive: "ZIP-Archiv herunterladen",
		not_allowed_chars_are: "Nicht erlaubte Zeichen sind: ",
		spaces_are_not_allowed_either: "Leerzeichen sind auch nicht erlaubt.",
		bundles_must_have_one_language: "Jedes Bundle muss mindestens eine Language haben.",
		persons_must_have_valid_birth_year: "Jede Person muss ein valides Birth Year haben!",
		download_zip_archive: "ZIP-Archiv herunterladen"
	},
	
	really_overwrite_data: "Möchtest Du wirklich Daten überschreiben?",
	yes_overwrite_data: "Ja, Daten überschreiben"
	
};