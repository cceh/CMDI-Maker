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


imdi_environment.workflow[1] = (function(){
	'use strict';

	var my = {};
	var session;
	
	my.available_resources = [];
	// 0=file name, 1=mime type, 2=size, 3=(exif_)(last modified)date
	// this array only contains file metadata retrieved by file upload form / drag and drop

	my.identity = {
		id: "resources",
		title: "Resources",
		icon: "blocks",
	};
	
	my.view_id = "VIEW_resources";
	
	my.view = function(){
	
		APP.GUI.scrollTop();
	
	};
	
	my.parent = imdi_environment;
	var l = my.parent.l;
	
	my.addCompatibilityWarning = function(parent, string){
	
		var warning_div = dom.div(parent,"","warning_div");
		var warning_img_div = dom.div(warning_div,"","warning_img_div");
		APP.GUI.icon(warning_img_div,"","warning_icon", "warning");
		
		dom.div(warning_div,"","compatibility_warning", string);
	
	};
	
	
	my.getFileType = function(filename){
	
		var file_types = my.file_types;

		var index_of_dot = filename.lastIndexOf(".");

		var fileending = filename.slice(index_of_dot+1);
		
		var fileinfo = {
			type: l("resources", "unknown"),
			mimetype: l("resources", "unknown")
		};
		
		var list = a(file_types.valid_lamus_written_resource_file_types,0);
		var pos = list.indexOf(fileending);
		
		if (list.indexOf(fileending) != -1){
		
			fileinfo.type = file_types.valid_lamus_written_resource_file_types[pos][2];
			fileinfo.mimetype = file_types.valid_lamus_written_resource_file_types[pos][1];
			return fileinfo;
		
		}
		
		list = a(file_types.valid_lamus_media_file_types,0);
		pos = list.indexOf(fileending);
		
		if (list.indexOf(fileending) != -1){
		
			fileinfo.type = file_types.valid_lamus_media_file_types[pos][2];
			fileinfo.mimetype = file_types.valid_lamus_media_file_types[pos][1];
			return fileinfo;
		
		}
		
		list = a(file_types.invalid_lamus_media_file_types,0);
		pos = list.indexOf(fileending);
		
		if (pos != -1){
		
			fileinfo.type = file_types.invalid_lamus_media_file_types[pos][2];
			fileinfo.mimetype = file_types.invalid_lamus_media_file_types[pos][1];
			return fileinfo;
		
		}
		
		list = a(file_types.invalid_lamus_written_resource_file_types,0);
		pos = list.indexOf(fileending);
		
		if (pos != -1){
		
			fileinfo.type = file_types.invalid_lamus_written_resource_file_types[pos][2];
			fileinfo.mimetype = file_types.invalid_lamus_written_resource_file_types[pos][1];
			return fileinfo;
		
		}

		return fileinfo;
	};
	
	
	my.file_types = {

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
			["wave","audio/x-wav","audio"],
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
	
	
	my.recall = function(data){
	
		my.available_resources = data;
		my.refreshFileListDisplay();
	
	};
	
	
	my.getSaveData = function(){
	
		return my.available_resources;
	
	};
	
	
	my.functions = function(){
		return [
			{
				label: l("resources", "create_one_session_per_file"),
				icon: "plus",
				id: "crps_icon",
				wrapper_id: "crps_div",
				type: "function_wrap",
				sub_div: "crps_filetype_select",
				onclick: function() { my.createSessionPerResource();  APP.view(session); },
				sub_div_innerHTML: '<h3 class="inner_function_h3">' + l("resources", "files") + '</h3>'+
							'<input type="radio" name="radio_file_type" value="selected" checked> ' + l("resources", "selected_files") + '<br>'+
							'<input type="radio" name="radio_file_type" value="eaf"> EAF<br>'+
							'<input type="radio" name="radio_file_type" value="wav"> WAV<br>'+
							'<input type="radio" name="radio_file_type" value="mpg"> MPG<br>'+
							'<input type="radio" name="radio_file_type" value="mp4"> MP4<br>'
			},
			{
				id: "link_sort_alphabetically",
				icon: "az",
				label: l("resources", "sort_alphabetically"),
				onclick: function() { my.sortAlphabetically(); }
			},
			{
				id: "link_remove_files",
				icon: "reset",
				label: l("resources", "remove"),
				onclick: function() { my.removeSelectedFiles(); }
			},
			{
				id: "link_clear_file_list",
				icon: "reset",
				label: l("resources", "clear_file_list"),
				onclick: function() { my.clearFileList(); }
			}
		];
	};
	
	
	my.init = function(view){
	
		session = imdi_environment.workflow[3];
	
		var div = dom.make("div","files","",view);
		
		var drop_zone = APP.GUI.FORMS.fileDropZone(div, "drop_zone", my.pushFileMetadata);

		var usage_table = dom.make("div","","workspace-usageTable",div,
		'<h3>' + l("resources", "usage") + '</h3>' +
		'<h4>' + l("resources", "click") + '</h4>'+
		'<p>' + l("resources", "escape_to_deselect") + '</p>'+
		'<h4>' + l("resources", "shift") + '</h4>'+
		'<p>' + l("resources", "shift_to_select_multiple") + '</p>'+
		'<h4>' + l("resources", "escape") + '</h4>'+
		'<p>' + l("resources", "escape_to_deselect") + '</p>');
		
		var file_list_div = dom.make("div","file_list_div","",view);
		var list = dom.make("div","list","",file_list_div);
		
		
		my.fileSelection = new APP.GUI.selectionMechanism(
			"file_entry_", 
			"selected_file",
			function(event){
				my.available_resources[event.index].selected = event.selected;
			}
		);
		
		my.refreshFileListDisplay(true);
		
	};

	
	my.getValidityOfFile = function(filename){
	// returns 0=valid media file, 1=valid written resource, 2=invalid media file, 3=invalid written resource, -1=unknown file
		var j;
		
		var file_type = getFileTypeFromFilename(filename);
		
		for (j=0; j<my.file_types.valid_lamus_media_file_types.length; j++){
			if (file_type == my.file_types.valid_lamus_media_file_types[j][0]) {
				return {
					type: "Media File",
					comptaibility_warning: undefined,
					file_entry_class: "media_file_entry",
				};
			}
		}
		
		for (j=0; j<my.file_types.valid_lamus_written_resource_file_types.length; j++){
			if (file_type == my.file_types.valid_lamus_written_resource_file_types[j][0]){
				return {
					type: "Written Resource",
					comptaibility_warning: undefined,
					file_entry_class: "written_resource_file_entry",
				};
			}
		}

		for (j=0; j<my.file_types.invalid_lamus_media_file_types.length; j++){
			if (file_type == my.file_types.invalid_lamus_media_file_types[j][0]){
				return {
					type: "Media File",
					compatibility_warning: l("resources", "compatibility_warnings", "invalid_media_file"),
					file_entry_class: "media_file_entry"
				};
			}
		}	

		for (j=0; j<my.file_types.invalid_lamus_written_resource_file_types.length; j++){
			if (file_type == my.file_types.invalid_lamus_written_resource_file_types[j][0]){
				return {
					type: "Written Resource",
					compatibility_warning: l("resources", "compatibility_warnings", "invalid_written_resource"),
					file_entry_class: "written_resource_file_entry"
				};
			}
		}

		return {
			type: "Unknown",
			compatibility_warning: l("resources", "compatibility_warnings", "general"),
			file_entry_class: "invalid_file_entry"
		};

	};

	
	my.refreshFileListDisplay = function(not_in_sessions) {
		var file_vailidity;

		// files is a FileList of File objects. List some properties.
		var output = [];
		
		var list = g('list');
		
		list.innerHTML = "";

		for (var i = 0; i < my.available_resources.length; i++) {
		
			file_vailidity = my.getValidityOfFile(my.available_resources[i].name);
		
			my.renderResource(
				i,
				my.available_resources[i].name,
				my.available_resources[i].mime_type,
				my.available_resources[i].size,
				my.available_resources[i].last_change,
				"file_entry_"+i,
				"file_entry " + file_vailidity.file_entry_class,
				list,
				file_vailidity.compatibility_warning
			);
			
		}
		
		if (my.available_resources.length === 0){
			dom.h2(list, l("resources", "no_resource_files_imported"));
		}

		if ((session) && (!not_in_sessions)){
			session.refreshResourcesOfAllSessions();
		}
		
		my.fileSelection.selected_files = [];
		
	};
	
	
	my.renderResource = function(number, title, mime_type, file_size, last_change, id, className, parent, compatibility_warning){
	
		var div = dom.make("div", id, className, parent);
		var title = dom.make("h2", "", "file_entry_title", div, title);
		var p = dom.make("p", "", "", div, mime_type +
		'<br><span class="size_span">' + l("resources", "size") + ': ' + file_size + '</span><br>'+
		'<span name="date_span" class="date_span">' + l("resources", "last_modified") + ': ' +
		last_change + '</span>');
		
		if (typeof compatibility_warning != "undefined"){
			my.addCompatibilityWarning(div, compatibility_warning);
		}

		div.addEventListener("click", function(num){
		
			return function(){
				
				my.fileSelection.clickedOnFile(num);
			
			};
			
		}(number), false);
	
	};
  
  
	my.pushFileMetadata = function(FileList) {

		// files is a FileList of File objects. List some properties.
		var output = [];
		for (var i = 0, f; !!(f = FileList[i]); i++) {
			my.available_resources.push({
				name: f.name,
				mime_type: f.type || 'n/a',
				size: bytesToSize(f.size,1),
				last_change: f.lastModifiedDate.toLocaleDateString()
			});
		}
		
		my.refreshFileListDisplay();
	};
  

	my.sortAlphabetically = function(){

		my.available_resources = sortByKey(my.available_resources, "name");
		my.refreshFileListDisplay();
		
	};
  

	my.createSessionPerResource = function(){
	
		var chosen_file_type;
		var f;

		var radio_buttons = document.getElementsByName("radio_file_type");
		
		chosen_file_type = dom.getSelectedRadioValue(radio_buttons);

		console.log("Searching for files of chosen file type " + chosen_file_type);
		
		if (chosen_file_type == "selected"){
		
			forEach(my.fileSelection.selected_files, my.createSessionForResource);
			return;
		
		}
		
		else {    //for all media files of filetype
		
			for (f=0; f<my.available_resources.length; f++){
			
				if (getFileTypeFromFilename(my.available_resources[f].name) == chosen_file_type){
				
					my.createSessionForResource(f);
				
				}
				
			}
			
		}


	};
	
	
	my.removeSelectedFiles = function(){
		var f;
		
		for (f = 0; f<my.fileSelection.selected_files.length; f++){
		
			my.available_resources[my.fileSelection.selected_files[f]] = null;
		
		
		}
		
		f = 0;
		
		while (f < my.available_resources.length){
		
			if (my.available_resources[f] === null){
				my.available_resources.splice(f,1);
			}
			
			else {
				f++;
			}
	
		}
		
		my.refreshFileListDisplay();
	};
	
	
	my.removeFile = function(index){
	
		my.available_resources.splice(index,1);
		my.refreshFileListDisplay();
	
	};


	my.createSessionForResource = function(resource_index){

		var name = remove_invalid_chars(removeEndingFromFilename(my.available_resources[resource_index].name));
		var expanded = false; //collapse automatically generated session
		
		var resources = [];
		resources.push(resource_index);
		
		//if another file's name of available_resources starts with the same name as this file, add it to the session, too!
		for (var f2=0; f2<my.available_resources.length; f2++){
		
			if (resource_index == f2){
				continue;
			}
		
			if (isSubstringAStartOfAWordInString(removeEndingFromFilename(my.available_resources[f2].name), removeEndingFromFilename(my.available_resources[resource_index].name))) {
			
				resources.push(f2);
			
			}
		
		}
		
		session.createNewSessionWithResources(name, expanded, resources);

	};


	my.clearFileList = function(){

		my.available_resources = [];

		my.refreshFileListDisplay();

	};


	return my;

})();
  
