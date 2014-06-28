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


var LP_english = {

	id: "english",
	name: "English",
	
	settings: {
		settings: "Settings",
		profile: "Profile",
		auto_save: "Auto Save",
		off: "Off",
		every_30_seconds: "Every 30 seconds",
		every_60_seconds: "Every 60 seconds",
		every_5_minutes: "Every 5 minutes",
		every_10_minutes: "Every 10 minutes",
		global_language_of_metadata: "Global Language of Metadata",
		cmdi_metadata_creator: "CMDI Metadata Creator",
		cmdi_metadata_creator_description: "The CMDI metadata format requires the name of a metadata creator. This is probably you. If so, please type in your name.",
		save_project: "Save Project",
		save_project_description: "This saves all your data into one file. This file can be imported by CMDI Maker again.",
		load_project: "Load Project",
		load_project_description: "Loads a CMP file with CMDI Maker project data.",
		delete_recall_data: "Delete Recall Data",
		delete_recall_data_description: "CMDI Maker saves the data you input in a browser database. Your data is kept, even when you close the browser window.<br>"+
			"However, if Auto Save is on, new data will be saved automatically.<br>"+
			"This function only deletes the data from the active profile!",
		hard_reset: "Hard Reset",
		hard_reset_description: "Deletes all data that CMDI Maker has ever stored on your PC.",
		program_language: "Program Language"
	},
	
	save_and_recall: {
		active_profile_data_deleted: "Recall data for active profile deleted",
		no_data_found: "No data for active profile found",
		form_saved: "Form saved"
	},
	
	confirm: {
		no: "No",
		yes_delete_everything: "Yes, delete everything",
		hard_reset: "Really?<br>You want to hard reset CMDI Maker? All your actors and stuff will be deleted!",
	},
	
	on: "On",
	off: "Off",
	ok: "OK",
	
	welcome_back: "Welcome back!",
	greeting_text: "Welcome to CMDI Maker!<br>Please note, that this is an offline web application. You can use it without an internet connection.<br>"+
	"When you load this page, you can pick up where you left off.",
	lets_go: "Let's go!",
	is_supported_by: "CMDI Maker is supported by",
	need_help: "Need help?",
	help_pages_description: "On the help pages you will find video tutorials in several languages, a mailing list, go-to persons and much more!",
	
	this_is: {
		before: "This is ",
		after: "!"
	},
	
	error: {
		no_workflow: "ERROR: <br>The active profile does not have a workflow!"
	}

};


var LP_german = {

	id: "german",
	name: "Deutsch",
	
	settings: {
		settings: "Einstellungen",
		profile: "Profil",
		auto_save: "Automatische Speicherung",
		off: "Aus",
		every_30_seconds: "Alle 30 Sekunden",
		every_60_seconds: "Alle 60 Sekunden",
		every_5_minutes: "Alle 5 Minuten",
		every_10_minutes: "Alle 10 Minuten",
		global_language_of_metadata: "Globale Metadaten-Sprache",
		cmdi_metadata_creator: "CMDI: Urheber der Metadaten",
		cmdi_metadata_creator_description: "Das CMDI-Metadatenformat setzt die Angabe eines Urhebers voraus. Das bist wahrscheinlich du!. Gib in diesem Fall deinen Namen ein.",
		save_project: "Projekt in Datei speichern",
		save_project_description: "Diese Funktion speichert alle deine Daten in einer Datei. Diese kann wieder in den CMDI Maker importiert werden.",
		load_project: "Projekt laden",
		load_project_description: "Lädt eine CMP-Datei und importiert dessen Projektdaten.",
		delete_recall_data: "Daten für den Rückruf löschen",
		delete_recall_data_description: "CMDI Maker speichert alle Daten, die du eingibst, in einer Browserdatenbank. Deine Daten bleiben also erhalten, auch wenn Du das Browserfenster schließt.<br>"+
			"Wenn die automatische Speicherung jedoch aktiviert ist, werden automatisch neue Daten gespeichert.<br>"+
			"Diese Funktion löscht nur die Daten des zur Zeit ausgewählten Profils!",
		hard_reset: "Hard Reset",
		hard_reset_description: "Diese Funktion löscht alle Daten, die der CMDI Maker jemals auf deinem PC gespeichert hat.",
		program_language: "Anzeigesprache"
	},
	
	save_and_recall: {
		active_profile_data_deleted: "Daten des aktiven Profils gelöscht",
		no_data_found: "Keine Daten für das aktive Profil gefunden!",
		form_saved: "Eingaben gespeichert"
	},
	
	confirm: {
		no: "Nein",
		yes_delete_everything: "Ja, alles löschen",
		hard_reset: "Willst du das wirklich?<br>Alle deine Daten werden gelöscht!",
	},
	
	on: "Ein",
	off: "Aus",
	ok: "OK",
	
	welcome_back: "Willkommen zurück!",
	greeting_text: "Willkommen!<br>Dies ist eine Offline-Webanwendung. Du kannst sie fortan auch ohne Internetverbindung nutzen.<br>"+
	"Wenn Du diese Seite lädst, kannst du genau dort weitermachen, wo du aufgehört hast.",
	lets_go: "Los geht's!",
	is_supported_by: "CMDI Maker wird unterstützt von",
	need_help: "Brauchst Du Hilfe?",
	help_pages_description: "Auf den Hilfe-Seiten findest Du Video-Tutorials in verschiedenen Sprachen, eine Mailing-Liste, Ansprechpartner und vieles mehr!",
	
	this_is: {
		before: "Das ist ",
		after: "!"
	},
	
	error: {
		no_workflow: "ERROR: <br>Das aktive Profil besitzt keinen Workflow!"
	}

};