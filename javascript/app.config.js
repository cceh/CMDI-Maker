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
var originator = "CMDI Maker by CLASS - Cologne Language Archive Services";    
var version = "v1.0.9";
var LanguageCodePrefix = "ISO639-3:";
var path_to_images = "img/";
var path_to_icons = path_to_images + "icons/";
var file_download_header = "text/xml;charset=utf-8";
var highlight_color = "skyblue";
var local_storage_key = "CMDI-Maker";
var project_file_name = "CMDI-Maker-Project.cmp";

var session_dom_element_prefix = "session_";
var copy_checkbox_element_prefix = "copy_check_";
var viewlink_id_prefix = "VIEWLINK_";
var view_id_prefix = "VIEW_";
var xml_textarea_class_name = "xml_textarea";

var output_textarea_rows = 40;
var output_textarea_columns = 130;
var form_textarea_rows = 18;
var form_textarea_columns = 5;

var MetadataLanguageIDs = [
	["eng","English"],
	["ger", "German"],
	["spa","Spanish"],
	["fra","French"],
	["rus","Russian"],
	["ind","Indonesian"],
	["por","Portuguese"],
	["arb","Standard Arabic"]
];

var not_allowed_chars = " !\"§$%&/\\()=?^°`´'#*+~<>[]{}|²³,.;:";

var hellos = [
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
];

  
document.addEventListener('DOMContentLoaded', function() {
	APP.init();
}, false);