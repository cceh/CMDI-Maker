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


APP.languages[0] = {

	id: "english",
	name: "English",
	code: "en",
	
	settings: {
		settings: "Settings",
		profile: "Profile",
		auto_save: "Auto Save",
		off: "Off",
		every_30_seconds: "Every 30 seconds",
		every_60_seconds: "Every 60 seconds",
		every_5_minutes: "Every 5 minutes",
		every_10_minutes: "Every 10 minutes",
		load_project: "Load Project",
		load_project_description: "Loads a CMP file with CMDI Maker project data.",
		delete_recall_data: "Delete Recall Data",
		delete_recall_data_description: "CMDI Maker saves the data you input in a browser database. Your data is kept, even when you close the browser window.<br>"+
			"However, if Auto Save is on, new data will be saved automatically.<br>"+
			"This function only deletes the data from the active profile!",
		hard_reset: "Hard Reset",
		hard_reset_description: "Deletes all data that CMDI Maker has ever stored on your PC.",
		program_language: "Program Language",
		no_project_data_found_in_file: "No CMDI Maker data found in file!"
	},
	
	save_and_recall: {
		active_profile_data_deleted: "Recall data for active profile deleted",
		no_data_found: "No data for active profile found",
		form_saved: "Form saved"
	},
	
	confirm: {
		no: "No",
		yes_delete_everything: "Yes, delete everything",
		yes_overwrite_data: "Yes, overwrite data",
		overwrite_data: "Really?<br>You want to overwrite all data?",
		hard_reset: "Really?<br>You want to hard reset CMDI Maker? All your actors and stuff will be deleted!",
	},
	
	on: "On",
	off: "Off",
	ok: "OK",

	welcome_back: "Welcome back!",
	about: "About",
	save: "Save",
	export_to_file: "Export to File",
	open_file: "Open File",
	abort: "Abort",
	
	start: {
		greeting_text: "Welcome to CMDI Maker!<br>Please note, that this is an offline web application. You can use it without an internet connection.<br>"+
		"When you load this page, you can pick up where you left off.",
		and_lets_go__before_link: "and ",
		and_lets_go__link: "get started",
		and_lets_go__after_link: "!",
		is_supported_by: "CMDI Maker is supported by",
		need_help: "Need help?",
		help_pages_description: "On the help pages you will find video tutorials in several languages, a mailing list, go-to persons and much more!",
		select_your_profile: "Select your profile",
		this_is: {
			before_language: "This is ",
			after_language: "!"
		}
	},
	
	language_search: {
		or_type_in_iso_code: "or type in ISO code",
		search: "Search"		
	},

};


APP.languages[1] = {

	id: "german",
	name: "Deutsch",
	code: "de",
	
	settings: {
		settings: "Einstellungen",
		profile: "Profil",
		auto_save: "Automatische Speicherung",
		off: "Aus",
		every_30_seconds: "Alle 30 Sekunden",
		every_60_seconds: "Alle 60 Sekunden",
		every_5_minutes: "Alle 5 Minuten",
		every_10_minutes: "Alle 10 Minuten",
		load_project: "Projekt laden",
		load_project_description: "Lädt eine CMP-Datei und importiert ihre Projektdaten.",
		delete_recall_data: "Daten für den Rückruf löschen",
		delete_recall_data_description: "CMDI Maker speichert alle Daten, die du eingibst, in einer Browserdatenbank. Deine Daten bleiben also erhalten, auch wenn Du das Browserfenster schließt.<br>"+
			"Wenn die automatische Speicherung jedoch aktiviert ist, werden automatisch neue Daten gespeichert.<br>"+
			"Diese Funktion löscht nur die Daten des zur Zeit ausgewählten Profils!",
		hard_reset: "Hard Reset",
		hard_reset_description: "Diese Funktion löscht alle Daten, die der CMDI Maker jemals auf deinem PC gespeichert hat.",
		program_language: "Programmsprache",
		no_project_data_found_in_file: "In der Datei wurden keine Daten für den CMDI Maker gefunden!"
	},
	
	save_and_recall: {
		active_profile_data_deleted: "Daten des aktiven Profils gelöscht",
		no_data_found: "Keine Daten für das aktive Profil gefunden!",
		form_saved: "Eingaben gespeichert"
	},
	
	confirm: {
		no: "Nein",
		yes_delete_everything: "Ja, alles löschen",
		yes_overwrite_data: "Ja, Daten überschreiben",
		overwrite_data: "Willst du das wirklich?<br>Alle deine Daten werden überschrieben!",
		hard_reset: "Willst du das wirklich?<br>Alle deine Daten werden gelöscht!",
	},
	
	on: "Ein",
	off: "Aus",
	ok: "OK",
	
	welcome_back: "Willkommen zurück!",
	about: "Über",
	save: "Speichern",
	export_to_file: "In Datei Exportieren",
	open_file: "Datei öffnen",
	abort: "Abbrechen",
	
	start: {
		greeting_text: "Willkommen!<br>Dies ist eine Offline-Webanwendung. Du kannst sie fortan auch ohne Internetverbindung nutzen.<br>"+
		"Wenn Du diese Seite lädst, kannst du genau dort weitermachen, wo du aufgehört hast.",
		and_lets_go__before_link: "und ",
		and_lets_go__link: "leg los",
		and_lets_go__after_link: "!",
		is_supported_by: "CMDI Maker wird unterstützt von",
		need_help: "Brauchst Du Hilfe?",
		help_pages_description: "Auf den Hilfe-Seiten findest Du Video-Tutorials in verschiedenen Sprachen, eine Mailing-Liste, Ansprechpartner und vieles mehr!",
		select_your_profile: "Wähle dein Profil",
		this_is: {
			before_language: "Das ist ",
			after_language: "!"
		}
	},
	
	language_search: {
		or_type_in_iso_code: "oder gib den ISO-Code ein",
		search: "Suchen"		
	}
	
};





APP.languages[2] = {

	id: "spanish",
	name: "Español",
	code: "es",
	
	settings: {
		settings: "Configuración",
		profile: "Perfíl",
		auto_save: "Guardar automáticamente",
		off: "Apagado",
		every_30_seconds: "Cada 30 segundos",
		every_60_seconds: "Cada 60 segundos",
		every_5_minutes: "Cada 5 minutos",
		every_10_minutes: "Cada 10 minutos",
		load_project: "Guardar proyecto",
		load_project_description: "Esta opción carga un archivo CMP (CMDI Maker Project) junto con los datos del proyecto.",
		delete_recall_data: "Eliminar datos guardados",
		delete_recall_data_description: "CMDI Maker guarda los datos que se introducen en la base de datos de un navegador, y los guardará aun cuando se cierre el navegador.<br>De todas formas, si la opción Guardar automáticamente está seleccionada, los nuevos datos serán guardados automáticamente.<br>¡Esta función elimina solamente los datos pertenecientes al perfil activo!",
		hard_reset: "Reseteo completo",
		hard_reset_description: "Esta opción elimina todos los datos que CMDI Maker ha almacenado en su ordenador.",
		program_language: "Lenguaje del programa",
		no_project_data_found_in_file: "¡No se encontró ningún dato para CMDI Maker en el archivo!"
	},
	
	save_and_recall: {
		active_profile_data_deleted: "Datos pertenecientes al perfíl activo eliminados",
		no_data_found: "No se encontró ningún dato para el perfíl activo",
		form_saved: "Formulario guardado"
	},
	
	confirm: {
		no: "No",
		yes_delete_everything: "Sí, eliminar todo",
		yes_overwrite_data: "Sí, sobrescribir los datos",
		overwrite_data: "¿Quiere realmente sobrescribir todos los datos?",
		hard_reset: "¿Quieres realmente resetear CMDI Maker por completo? ¡Todos los datos serán eliminados!",
	},
	
	on: "Encendido",
	off: "Apagado",
	ok: "OK",
	
	welcome_back: "¡Bienvenido de nuevo!",
	about: "Acerca de",
	save: "Guardar",
	export_to_file: "Exportar a archivo",
	
	start: {
		greeting_text: "Bienvenidos al CMDI Maker!<br>Fígese, ésta es una aplicación que se puede utilizar también sin conexión.<br>Cuando cargue esta página, podrá reanudar su trabajo en el punto donde lo interrumpió.",
		and_lets_go__before_link: "¡y ",
		and_lets_go__link: "vamos a empezar",
		and_lets_go__after_link: "!",
		is_supported_by: "CMDI Maker está financiado por",
		need_help: "¿Necesita ayuda?",
		help_pages_description: "En las páginas de ayuda encontrará videos tutoriales, una lista de correo electrónico y de personas para consultar en caso de necesidad, ¡y mucho más!",
		select_your_profile: "Seleccione su perfíl",
		this_is: {
			before_language: "Esto es ",
			after_language: "!"
		}
	},
	
	language_search: {
		or_type_in_iso_code: "o bien ingresar un código ISO",
		search: "Buscar"		
	}
	
};