﻿/*
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


eldp_environment.workflow[0] = (function(){

	var my = {};
	var bundle;
	
	my.parent = eldp_environment;
	
	my.fileSelection = undefined;
	
	my.available_resources = [];
	// this array only contains file metadata retrieved by file upload form / drag and drop

	my.identity = {
		id: "resources",
		title: "Resources",
		icon: "blocks",
	};

	my.view_id = "VIEW_resources";
	
	
	
	
	my.init = function(view){
	
		bundle = eldp_environment.workflow[2];
	
		var div = dom.make("div","files","",view);
		
		dom.h3(div, "Import Files");
		var drop_zone = APP.GUI.FORMS.fileDropZone(div, "drop_zone", my.pushFileMetadata);
		
		dom.h3(div, "Import File List");
		dom.input(div, "file_list_import_input", "", "", "file");

		var usage_table = dom.make(
			"div","","workspace-usageTable",div,
			'<h3>Usage</h3><h4>Click</h4><p>Select resource, click again to deselect a single resource</p>'+
			'<h4>Shift</h4><p>Hold shift to select multiple resources</p>'+
			'<h4>Escape</h4><p>Press escape to deselect all resources</p>'+
			'<h4>Fade</h4><p>Resources are faded down when they will be added to a bundle.</p>'
		
		);
		
		var file_list_div = dom.make("div","file_list_div","",view);
		var list = dom.make("div","list","",file_list_div);
		
		my.fileSelection = new APP.GUI.selectionMechanism(
			"file_entry_", 
			"selected_file",
			function(event){
				my.available_resources[event.index].selected = event.selected;
				
				my.fadeFilesThatStartWithSameNameAsSelectedOnes();
				
			}
		);
		
		my.refreshFileListDisplay(true);
		
	};
	
	
	my.view = function(){
	
		APP.GUI.scrollTop();
	
	};
	
	
	my.compatibility_warnings = {
	
		general: 'This file does not seem to be a valid resource file for LAMUS. Please consider recoding it.',
		invalid_media_file: 'This media file does not seem to be a valid file for LAMUS. Please consider recoding it to WAV (audio) or MP4 (video).',
		invalid_written_resource: 'This file does not seem to be a valid written resource for LAMUS. Please consider recoding it to PDF or TXT.'
	
	};
	
	
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
			type: "Unknown",
			mimetype: "Unknown"
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
	
	
	my.functions = [
		{
			label: "Create one bundle per file",
			icon: "plus",
			id: "crps_icon",
			wrapper_id: "crps_div",
			type: "function_wrap",
			sub_div: "crps_filetype_select",
			onclick: function() { my.createBundlePerResource();  APP.view(bundle); },
			sub_div_innerHTML: '<h3 class="inner_function_h3">Files</h3>'+
						'<input type="radio" name="radio_file_type" value="selected" checked> Selected Files<br>'+
						'<input type="radio" name="radio_file_type" value="eaf"> EAF<br>'+
						'<input type="radio" name="radio_file_type" value="wav"> WAV<br>'+
						'<input type="radio" name="radio_file_type" value="mpg"> MPG<br>'+
						'<input type="radio" name="radio_file_type" value="mp4"> MP4<br>',
			after_that: function(){	
				forEach(g("radio_file_type"), function(elem){
					elem.addEventListener("click", my.handleFileTypeChange, false);
				});
			}
		},
		{
			id: "link_sort_alphabetically",
			icon: "az",
			label: "Sort Files alphabetically",
			onclick: function() { my.sortAlphabetically(); }
		},
		{
			id: "link_remove_files",
			icon: "reset",
			label: "Remove",
			onclick: function() { my.removeSelectedFiles(); }
		},
		{
			id: "link_clear_file_list",
			icon: "reset",
			label: "Clear File List",
			onclick: function() { my.clearFileList(); }
		},
	
	
	
	];
	
	
	my.handleFileTypeChange = function(event){
	
		console.log("ftc");
		console.log(event.target.value);
		
		//my.fadeFilesThatWouldBeAddedToBundle();
	
	}
	
	
	my.getValidityOfFile = function(filename){
	// returns 0=valid media file, 1=valid written resource, 2=invalid media file, 3=invalid written resource, -1=unknown file
		var j;
		var file_type = getFileTypeFromFilename(filename);
		
		for (j=0;j<my.file_types.valid_lamus_media_file_types.length; j++){
			if (file_type == my.file_types.valid_lamus_media_file_types[j][0]) {
				return 0;
			}
		}
		
		for (j=0;j<my.file_types.valid_lamus_written_resource_file_types.length; j++){
			if (file_type == my.file_types.valid_lamus_written_resource_file_types[j][0]){
				return 1;
			}
		}

		for (j=0;j<my.file_types.invalid_lamus_media_file_types.length; j++){
			if (file_type == my.file_types.invalid_lamus_media_file_types[j][0]){
				return 2;
			}
		}	

		for (j=0;j<my.file_types.invalid_lamus_written_resource_file_types.length; j++){
			if (file_type == my.file_types.invalid_lamus_written_resource_file_types[j][0]){
				return 3;
			}
		}		

		return -1;

	};

	
	my.refreshFileListDisplay = function(not_in_bundles) {
		var file_entry_class;
		//var compatibility_warning;

		// files is a FileList of File objects. List some properties.
		var output = [];
		
		var list = g('list');
		
		list.innerHTML = "";

		forEach(my.available_resources, function(res, i) {
		
			my.renderResource({
				number: i,
				title: res.name,
				mime_type: res.mime_type,
				file_size: res.size,
				last_change: res.last_change,
				id: "file_entry_"+i,
				className: "file_entry media_file_entry",
				parent: list,
				//compatibility_warning: compatibility_warning,
				stable: res.stable,
				inProgress: res.inProgress,
				path: res.path
				//opacity: 1
			});

		});
		
		if (my.available_resources.length === 0){
			list.innerHTML = "<h2>No resource files imported.</h2>";
		}

		if ((bundle) && (!not_in_bundles)){
			bundle.refreshResourcesOfAllBundles();
		}
		
		my.fileSelection.selected_files = [];
		
	};
	
	
	my.refreshFileStateValues = function(file_index){
	
		my.available_resources[file_index].stable = g("f_stable_"+file_index).checked;
		my.available_resources[file_index].inProgress = g("f_inProgress_"+file_index).checked;
	
	};
	
	
	my.renderResource = function(options){
		//possible options:
		//number, title, mimeType, file_size, last_change, id, className, parent, compatibility_warning, stable, inProgress, path
	
		var div = dom.make("div", options.id, options.className, options.parent);
		var title = dom.make("h2", "", "file_entry_title", div, options.title);
		var p = dom.make("p", "", "", div, options.mimeType +
		'<br><span class="size_span">Size: ' + options.file_size + '</span><br>'+
		'<span name="date_span" class="date_span">Last modified: ' + options.last_change + '</span><br>' +
		'<span name="path_span" class="date_span">Path: ' + options.path + '</span>'
		);
		
		var cb1 = dom.make("input","f_stable_"+options.number,"",div);
		cb1.type = "checkbox";
		cb1.addEventListener("click",function(event){ 
			event.stopPropagation();
			
			my.refreshFileStateValues(options.number);
			
			return;
		});
		var span1 = dom.make("span","","",div, " Stable");
		
		if (options.stable == true){
			cb1.checked = true;
		}
		
		
		dom.br(div);
		
		var cb2 = dom.make("input","f_inProgress_"+options.number,"",div);
		cb2.type = "checkbox";
		cb2.addEventListener("click",function(event){
			event.stopPropagation();
			my.refreshFileStateValues(options.number);
			
			return;
		});
		var span2 = dom.make("span","","",div, " In Progress");	
		
		if (options.inProgress == true){
			cb2.checked = true;
		}

		div.addEventListener("click", function(num){
			
			return function(){
				
				my.fileSelection.clickedOnFile(num);
			
			};
			
		}(options.number), false);
	
	
	};
  
  
	my.pushFileMetadata = function(FileList) {

		// files is a FileList of File objects. List some properties.
		var output = [];
		for (var i = 0, f; !!(f = FileList[i]); i++) {
			my.available_resources.push({
				name: f.name,
				type: f.type || 'n/a',
				size: bytesToSize(f.size,1),
				lastModified: f.lastModifiedDate.toLocaleDateString()
			});
		}
		
		my.refreshFileListDisplay();
		
	};
  

	my.sortAlphabetically = function(){

		my.available_resources = sortByKey(my.available_resources, "name");

		my.refreshFileListDisplay();
	};
  

	my.createBundlePerResource = function(){
		var chosen_file_type;
		var f;

		var radio_buttons = document.getElementsByName("radio_file_type");
		
		//get file type
		for (var i = 0; i < radio_buttons.length; i++) {
			if (radio_buttons[i].checked) {
				chosen_file_type = radio_buttons[i].value;
				break;
			}
		}

		console.log("Searching for files of chosen file type" + chosen_file_type);
		
		if (chosen_file_type == "selected"){
		
			console.log("Searching for selected files");
			
			for (f=0; f<my.fileSelection.selected_files.length; f++){
		
				my.createBundleWithResourceAndCheckForAdditionalResourcesToAdd(my.fileSelection.selected_files[f]);
			
			}
			
			return;
		
		}
		
		else {    //for all media files of filetype
		
			for (f=0; f<my.available_resources.length; f++){
			
				if (GetFileTypeFromFilename(my.available_resources[f].name) == chosen_file_type){
				
					console.log("Found a file of file type " + chosen_file_type);
					
					my.createBundleWithResourceAndCheckForAdditionalResourcesToAdd(f);
				
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


	my.createBundleWithResourceAndCheckForAdditionalResourcesToAdd = function(resource_index){

		var session_name = replaceAccentBearingLettersWithASCISubstitute(removeEndingFromFilename(my.available_resources[resource_index].name));
		session_name = replaceCharactersInStringWithSubstitute(session_name, my.parent.not_allowed_chars, my.substitute_for_bad_chars);
		
		var expanded = false; //collapse automatically generated bundle
		
		var resources = [];
		
		//of course, we add the resource that has been selected to the bundle 
		resources.push(resource_index);
		
		//if another file's name of available_resources starts with the same name as this file, add it to the bundle, too!
		var additional_resources = my.getIndexesOfResourcesThatStartWithTheSameNameAsThis(resource_index);
		
		//The .push method can take multiple arguments, so by using .apply to pass all the elements of the second array as arguments to .push,
		resources.push.apply(resources, additional_resources);
		
		bundle.createNewBundleWithResources(session_name, expanded, resources);

	};
	
	
	my.getIndexesOfResourcesThatStartWithTheSameNameAsThis = function (resource_index){
	
		var resources = [];
		
		for (var i=0; i<my.available_resources.length; i++){
			
			//do not include the resource itself
			if (resource_index == i){
				continue;
			}
		
			if (isSubstringAStartOfAWordInString(removeEndingFromFilename(my.available_resources[i].name),
			removeEndingFromFilename(my.available_resources[resource_index].name))) {
			
				resources.push(i);
			
			}
		
		}	
	
		return resources;
	
	};
	
	
	my.fadeFilesThatStartWithSameNameAsSelectedOnes = function(){
	
		var element_prefix = "file_entry_";
		
		var resources_to_fade = [];
		var resources_to_fade_this_time;
	
		//First, check for all resources that have to be faded
		for (var i = 0; i<my.available_resources.length; i++){
		
			g(element_prefix + i.toString()).style.opacity = "1";
			console.log("OP 1: " + element_prefix + i.toString());
			
			if (my.available_resources[i].selected == true){
				
				resources_to_fade.push(i);
				
				resources_to_fade_this_time = my.getIndexesOfResourcesThatStartWithTheSameNameAsThis(i);
			
				resources_to_fade.push.apply(resources_to_fade, resources_to_fade_this_time);
			

			}
		
		};
		
		
		//Then, fade them!
		for (i=0; i<resources_to_fade.length; i++){
			console.log("OP 0.5: " + element_prefix + i.toString());		
			g(element_prefix+resources_to_fade[i].toString()).style.opacity = "0.5";

		
		}
	
	
	};


	my.handleFileListInputChange = function(evt){
	 
		var file = evt.target.files[0]; // File object
		
		var file_list;  //this is where the file strings will be stored
		
		console.log(file);
		
		readFileAsText(file, function(result){
		
			try {
				file_list = linesToArray(result);
				
				forEach(file_list, function(file_string){
					my.available_resources.push({
						name: getFilenameFromUNIXFilePath(file_string),
						path: getDirectoryFromUNIXFilePath(file_string)
					});
				});
				
				my.refreshFileListDisplay();
			}
			
			catch (e) {
			//if file list parsing is not possible
				console.info("No files found! Maybe this file list is not valid!");
				return;
			}
			
			console.log(file_list);
			
		
		});
		
	};


	my.clearFileList = function(){

		my.available_resources = [];

		my.refreshFileListDisplay();

	};
	
	return my;

})();
  