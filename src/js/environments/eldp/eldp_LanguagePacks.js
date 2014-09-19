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
		content_language_removed__after_lang: "\" removed"
		
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
		no_actors_in_db_yet: "There are no actors in the database yet.",
		create_some_actors: "Create some actors.",
		really_erase_bundle: "Really?<br>You want to erase a whole bundle? Are you sure about that?",
		yes_delete_bundle: "Yes, delete bundle",
		bundle_deleted: "Bundle deleted",
		this_corpus_contains_no_bundles_yet: "This corpus contains no bundles yet.",
		why_not_create_one__before_link: "Why not ",
		why_not_create_one__link: "create one",
		why_not_create_one__after_link: "?",
		this_actor_is_already_in_the_bundle: "This actor is already in the bundle.",
		unknown_file_problem__before_filename: "We have a problem.<br>I don't know if this file is a Media File or a Written Resource:",
		unknown_file_problem__after_filename: "As for now, I will handle it as a written resource. But you really shouldn't do that.",
		bundle_name_taken_from_eaf: "Bundle name has been taken from EAF file name, since bundle has not been manually named yet.",
		bundle_date_extracted_from_eaf_file_name: "Bundle date has been extracted from EAF file name",
		at_least_2_bundles_to_assign_metadata: "There have to be at least 2 bundles to assign metadata from one to another.",
		bundle_1_metadata_assigned_to_all_bundles: "Bundle 1 metadata assigned to all bundles.",
		
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
		spaces_are_not_allowed_either: "Space characters are not allowed either."
	}
};