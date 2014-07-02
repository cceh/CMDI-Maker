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

// APP Config
var APP_CONF = {

	originator: "CMDI Maker by CLASS - Cologne Language Archive Services",    
	version: "v1.0.9",
	LanguageCodePrefix: "ISO639-3:",
	path_to_images: "img/",
	path_to_icons: "img/icons/",
	file_download_header: "text/xml;charset=utf-8",
	highlight_color: "skyblue",
	local_storage_key: "CMDI-Maker",
	project_file_name: "CMDI-Maker-Project.cmp",

	session_dom_element_prefix: "session_",
	copy_checkbox_element_prefix: "copy_check_",
	viewlink_id_prefix: "VIEWLINK_",
	view_id_prefix: "VIEW_",
	xml_textarea_class_name: "xml_textarea",

	output_textarea_rows: 40,
	output_textarea_columns: 130,
	form_textarea_rows: 18,
	form_textarea_columns: 5,

	MetadataLanguageIDs: [
		["eng","English"],
		["ger", "German"],
		["spa","Spanish"],
		["fra","French"],
		["rus","Russian"],
		["ind","Indonesian"],
		["por","Portuguese"],
		["arb","Standard Arabic"]
	],

	not_allowed_chars: " !\"§$%&/\\()=?^°`´'#*+~<>[]{}|²³,.;:",

	hellos: [
		["Hello!","English"],
		["Hallo!","German"],
		["Aloha!","Hawaiian"],
		["Hola!", "Spanish"],
		["Hej!", "Danish"],
		["Merhaba!", "Turkish"],
		["你好", "Chinese"],
		["こんにちは", "Japanese"],
		["Вiтаю!","Belarusian"],
		["Salut!","French"],
		["Grüezi!","Swiss German"],
		["Ciào!", "Italian"],
		["Hæ!", "Icelandic"],
		["Moïen!", "Luxembourgish"],
		["Olá!", "Portuguese"],
		["Privet!", "Russian"],
		["Hallå!", "Scanian"],
		["Salam!", "Urdu"]
	]
};

  
document.addEventListener('DOMContentLoaded', function() {
	APP.init();
}, false);