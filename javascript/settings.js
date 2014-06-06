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

// Settings
var originator = "CMDI Maker by CLASS - Cologne Language Archive Services";    
var version = "v1.0.2";
var LanguageCodePrefix = "ISO639-3:";
var path_to_images = "img/";

var output_formats = [
	{
		title: "IMDI",
		name: "imdi",
		file_ending: "imdi",
		output_name: "IMDI",
		generator_object: imdi_generator,
		form: session_form,
		actor_form: actor_form_imdi
	},
	{
		title: "CMDI with IMDI Profile",
		name: "cmdi-imdi",
		file_ending: "cmdi",
		output_name: "CMDI",
		generator_object: cmdi_generator,
		form: session_form,
		actor_form: actor_form_imdi
	}
];

var file_download_header = "text/xml;charset=utf-8";

var output_textarea_rows = 40;
var output_textarea_columns = 130;
var form_textarea_rows = 18;
var form_textarea_columns = 5;

var interval;
var interval_time = 60;

var highlight_color = "skyblue";

var session_dom_element_prefix = "session_";
var copy_checkbox_element_prefix = "copy_check_";

var compatibility_warnings = {
	general: '<div class="warning_div"><div class="warning_img_div"><img class="warning_icon" src="'+path_to_images+'icons/warning.png"></div><div class="compatibility_warning">'+
	' This file does not seem to be a valid resource file for LAMUS. Please consider recoding it.</div></div>',
	
	invalid_media_file: '<div class="warning_div"><div class="warning_img_div"><img class="warning_icon" src="'+path_to_images+'icons/warning.png"></div><div class="compatibility_warning">'+
	' This media file does not seem to be a valid file for LAMUS. Please consider recoding it to WAV (audio) or MP4 (video).</div></div>',
	
	invalid_written_resource: '<div class="warning_div"><div class="warning_img_div"><img class="warning_icon" src="'+path_to_images+'icons/warning.png"></div><div class="compatibility_warning">'+
	' This file does not seem to be a valid written resource for LAMUS. Please consider recoding it to PDF or TXT.</div></div>'
};

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

var file_types = {

	valid_lamus_written_resource_file_types: [
		["eaf","text/x-eaf+xml","Annotation"],
		["mdf","Unknown","Unspecified"],
		["pdf","application/pdf","Primary Text"],
		["xml","text/xml","Annotation"],
		["txt","text/plain","Unspecified"],
		["htm","text/html","Unspecified"],
		["html","text/html","Unspecified"]
	],

	valid_lamus_media_file_types: [
		["wav","audio/x-wav","audio"],
		["mpg","video/mpeg","video"],
		["mpeg","video/mpeg","video"],
		["mp4","video/mp4","video"],
		["aif","audio/x-aiff","audio"],
		["aiff","audio/x-aiff","audio"],
		["jpg","image/jpeg","image"],
		["jpeg","image/jpeg","image"],
		["png","image/png","image"],
		["tif","image/tiff","image"],
		["tiff","image/tiff","image"],
		["smil","application/smil+xml","video"]
	],

	invalid_lamus_written_resource_file_types: [
		["docx","application/vnd.openxmlformats-officedocument.wordprocessingml.document","Unspecified"],
		["doc","application/msword","Unspecified"],
		["odf","application/vnd.oasis.opendocument.formula","Unspecified"],
		["odt","application/vnd.oasis.opendocument.text","Unspecified"],
		["xls","application/vnd.ms-excel","Unspecified"],
		["xlsx","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Unspecified"],
		["ppt","application/vnd.ms-powerpoint","Unspecified"],
		["pptx","application/vnd.openxmlformats-officedocument.presentationml.presentation","Unspecified"]
	],

	invalid_lamus_media_file_types: [
		["mkv","Unknown","video"],
		["mov","video/quicktime","video"],
		["mp3","Unknown","audio"],
		["avi","video/x-msvideo","video"],
		["au","audio/basic","audio"]
	]

};

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

var new_page = true;
  
var content_languages = [];

var sessions = [];
var actors = [];

var selected_files = [];
var last_selected_file = -1;
var shift = false;

var active_view;
var counters = {
	resource_id: 0,
	cl_id: 0,
	al_id: 0
};

var preset_data;

var available_resources = [];
// 0=file name, 1=mime type, 2=size, 3=(exif_)(last modified)date
// this array only contains file metadata retrieved by file upload form / drag and drop
  
document.addEventListener('DOMContentLoaded', function() {

	view("wait");
	g("version_span").innerHTML = version;
	
	say_hello();
	create_output_format_select();
	display_metadata_languages();
	actor.create_form();
	actor.get_actors_from_web_storage();
	save_and_recall.get_recall_data();
	refreshFileListDisplay();
	check_if_first_start();
	create_copy_session_options();
	add_event_listeners();   //listeners.js  

}, false);