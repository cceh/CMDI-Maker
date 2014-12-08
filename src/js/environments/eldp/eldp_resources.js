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


eldp_environment.workflow[0] = (function(){
	'use strict';

	var my = {};
	var bundle;
	
	my.parent = eldp_environment;
	my.l = my.parent.l;
	
	my.fileSelection = undefined;
	
	my.resources = new ObjectList();
	// this array only contains file metadata retrieved by file upload form / drag and drop

	my.identity = {
		id: "resources",
		title: "Resources", //my.l("workflow", "resources"),
		icon: "blocks",
	};

	my.view_id = "VIEW_resources";
	
	my.substitute_for_bad_chars = "_";
	
	my.init = function(view){
	
		bundle = eldp_environment.workflow[2];
	
		var div = dom.make("div","files","",view);
		
		dom.h3(div, "Import Files");
		var drop_zone = APP.GUI.FORMS.fileDropZone(div, "drop_zone", my.pushFileMetadata);
		
		dom.h3(div, "Import File List");
		var listInput = dom.input(div, "file_list_import_input", "", "", "file");
		
		listInput.addEventListener("change", my.handleFileListInputChange, false);

		var usage_table = dom.make(
			"div","","workspace-usageTable",div,
			'<h3>' + my.l("resources", "usage") + '</h3>' +
			'<h4>' + my.l("resources", "click") + '</h4>'+
			'<p>' + my.l("resources", "click_to_select") + '</p>'+
			'<h4>' + my.l("resources", "shift") + '</h4>'+
			'<p>' + my.l("resources", "shift_to_select_multiple") + '</p>'+
			'<h4>' + my.l("resources", "escape") + '</h4>'+
			'<p>' + my.l("resources", "escape_to_deselect") + '</p>'+
			'<h4>' + my.l("resources", "fade") + '</h4>'+
			'<p>' + my.l("resources", "fade_explanation") + '</p>'
		);
		
		var file_list_div = dom.make("div","file_list_div","",view);
		var list = dom.make("div","list","",file_list_div);
		
		my.fileSelection = new APP.GUI.selectionMechanism(
			"file_entry_", 
			"selected_file",
			function(event){
				my.resources.get(event.index).selected = event.selected;
				
				my.fadeFilesThatStartWithSameNameAsSelectedOnes();
				
			}
		);
		
		my.refreshFileListDisplay(true);
		
	};
	
	
	my.view = function(){
	
		APP.GUI.scrollTop();
	
	};
	
	
	my.getFileType = function(filename){
	
		var file_types = my.file_types;

		var index_of_dot = filename.lastIndexOf(".");

		var fileending = filename.slice(index_of_dot+1);
		
		var fileinfo = {
			type: my.l("resources", "unknown"),
			mimetype: my.l("resources", "unknown")
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
	
		my.resources.setState(data);
		my.refreshFileListDisplay();
	
	};
	
	
	my.getSaveData = function(){
	
		return my.resources.getState();
	
	};
	
	
	my.functions = function(){
		return [
			{
				label: my.l("resources", "create_one_bundle_per_file"),
				icon: "plus",
				id: "crps_icon",
				wrapper_id: "crps_div",
				type: "function_wrap",
				sub_div: "crps_filetype_select",
				onclick: function() { my.createBundlePerResource();  APP.view(bundle); },
				sub_div_innerHTML: '<h3 class="inner_function_h3">' + my.l("resources", "files") + '</h3>'+
							'<input type="radio" name="radio_file_type" value="selected" checked> ' + my.l("resources", "selected_files") + '<br>'+
							'<input type="radio" name="radio_file_type" value="eaf"> EAF<br>'+
							'<input type="radio" name="radio_file_type" value="wav"> WAV<br>'+
							'<input type="radio" name="radio_file_type" value="mpg"> MPG<br>'+
							'<input type="radio" name="radio_file_type" value="mp4"> MP4<br>'
			},
			{
				id: "link_sort_alphabetically",
				icon: "az",
				label: my.l("resources", "sort_alphabetically"),
				onclick: function() { my.sortAlphabetically(); }
			},
			{
				id: "link_remove_files",
				icon: "reset",
				label: my.l("resources", "remove"),
				onclick: function() { my.removeSelectedFiles(); }
			},
			{
				id: "link_clear_file_list",
				icon: "reset",
				label: my.l("resources", "clear_file_list"),
				onclick: function() { my.reset(); }
			},
			{
				id: "link_set_for_all",
				icon: "submit",
				label: my.l("resources", "set_for_all"),
				wrapper_id: "sfa_div",
				type: "function_wrap",
				sub_div: "sfa_select",
				onclick: function() { my.setForAll(); },
				sub_div_innerHTML: '<input type="radio" name="status_for_all" id="stable_for_all" value="stable" checked> Stable<br>'+
							'<input type="radio" name="status_for_all" id="inProgress_for_all" value="in-progress"> In Progress<br>',
			},
		];
	};
	
	
	my.setForAll = function(){
		console.log(dom.getSelectedRadioValue("status_for_all"));
		my.resources.setForAll("status", dom.getSelectedRadioValue("status_for_all"));
		my.refreshFileListDisplay();
	
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

		my.resources.forEach(function(res, i) {
		
			my.renderResource({
				number: i,
				title: res.name,
				mime_type: res.mime_type,
				file_size: res.size,
				lastModified: res.lastModified,
				id: "file_entry_"+i,
				className: "file_entry media_file_entry",
				parent: list,
				status: res.status,
				path: res.path
				//opacity: 1
			});

		});
		
		if (my.resources.length === 0){
			list.innerHTML = "<h2>" + my.l("resources", "no_resource_files_imported") + "</h2>";
		}

		if ((bundle) && (!not_in_bundles)){
			bundle.refreshResourcesOfAllBundles(my.resources.getAll());
		}
		
		my.fileSelection.selected_files = [];
		
	};
	
	
	my.refreshFileStateValues = function(file_index){
	
		my.resources.get(file_index).status = dom.getSelectedRadioValue("f_" + file_index + "_status");
	
	};
	
	
	my.renderResource = function(options){
		//possible options:
		//number, title, mimeType, file_size, lastModified, id, className, parent, compatibility_warning, status, path
	
		var div = dom.make("div", options.id, options.className, options.parent);
		var title = dom.make("h2", "", "file_entry_title", div, options.title);
		var p = dom.make("p", "", "", div, options.mimeType +
		'<br><span class="size_span">' + my.l("resources", "size") + ': ' + options.file_size + '</span><br>'+
		'<span name="date_span" class="date_span">' + my.l("resources", "last_modified") + ': ' + options.lastModified + '</span><br>' +
		'<span name="path_span" class="date_span">' + my.l("resources", "path") + ': ' + options.path + '</span>'
		);
		
		var cb1 = dom.make("input","f_stable_"+options.number,"",div);
		cb1.type = "radio";
		cb1.value = "stable";
		cb1.name = "f_" + options.number + "_status";
		cb1.addEventListener("click",function(event){ 
			event.stopPropagation();
			
			my.refreshFileStateValues(options.number);
			
			return;
		});
		var span1 = dom.make("span","","",div, " Stable");
		
		if (options.status == "stable"){
			cb1.checked = true;
		}
		
		
		dom.br(div);
		
		var cb2 = dom.make("input","f_inProgress_"+options.number,"",div);
		cb2.type = "radio";
		cb2.value = "in-progress";
		cb2.name = "f_" + options.number + "_status";
		cb2.addEventListener("click",function(event){
			event.stopPropagation();
			my.refreshFileStateValues(options.number);
			
			return;
		});
		var span2 = dom.make("span","","",div, " In Progress");	
		
		if (options.status == "in-progress"){
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
			my.resources.add({
				name: f.name,
				type: f.type || 'n/a',
				size: bytesToSize(f.size,1),
				lastModified: f.lastModifiedDate.toLocaleDateString(),
				status: "stable"
			});
		}
		
		my.refreshFileListDisplay();
		
	};
  

	my.sortAlphabetically = function(){
	
		my.resources.sortByKey("name");
		my.refreshFileListDisplay();
		
	};
  

	my.createBundlePerResource = function(){

		var f;

		var radio_buttons = dom.getByName("radio_file_type");
		var chosen_file_type = dom.getSelectedRadioValue(radio_buttons);	

		console.log("Searching for files of chosen file type " + chosen_file_type);
		
		if (chosen_file_type == "selected"){
		
			console.log("Searching for selected files");
			
			for (f=0; f<my.fileSelection.selected_files.length; f++){
			
				var id = my.resources.idOf(my.fileSelection.selected_files[f]);
		
				my.createBundleWithResourceAndCheckForAdditionalResourcesToAdd(id);
			
			}
			
			return;
		
		}
		
		else {    //for all media files of filetype
		
			for (f = 0; f < my.resources.length; f++){
			
				var file_type = getFileTypeFromFilename(my.resources.get(f).name);
			
				if (file_type == chosen_file_type){
				
					console.log("Found a file of file type " + chosen_file_type);
					
					my.createBundleWithResourceAndCheckForAdditionalResourcesToAdd(my.resources.idOf(f));
				
				}
				
			}
			
		}


	};
	
	
	my.removeSelectedFiles = function(){
		
		var selected_files = my.fileSelection.selected_files;
		var IDs = my.resources.mapIndexesToIDs(selected_files);
		my.resources.removeByID(IDs);
		my.refreshFileListDisplay();
		
	};
	
	
	my.createBundleWithResourceAndCheckForAdditionalResourcesToAdd = function(id){

		var session_name = replaceAccentBearingLettersWithASCISubstitute(removeEndingFromFilename(my.resources.getByID(id).name));
		session_name = replaceCharactersInStringWithSubstitute(session_name, my.parent.not_allowed_chars, my.substitute_for_bad_chars);
		
		var expanded = false; //collapse automatically generated bundle
		
		var resource_ids = [];
		
		//of course, we add the resource that has been selected to the bundle 
		resource_ids.push(id);
		
		//if another file's name of resources starts with the same name as this file, add it to the bundle, too!
		var additional_resources = my.getIDsOfResourcesThatStartWithTheSameNameAsThis(id);
		
		//The .push method can take multiple arguments, so by using .apply to pass all the elements of the second array as arguments to .push,
		resource_ids.push.apply(resource_ids, additional_resources);
		
		bundle.createNewBundleWithResources(session_name, expanded, resource_ids);

	};
	
	
	my.getIDsOfResourcesThatStartWithTheSameNameAsThis = function (id){
	
		var this_resource = my.resources.getByID(id);
	
		var resources = my.resources.filter(function(res){
			
			//do not include the resource itself
			if (id == res.id){
				return false;
			}
		
			if (
				isSubstringAStartOfAWordInString(
					removeEndingFromFilename(res.name),
					removeEndingFromFilename(this_resource.name)
				)
			){
			
				return true;
			
			}
			
			return false;
		
		});
		
		var IDs = getArrayWithIDs(resources);
	
		return IDs;
	
	};
	
	
	my.fadeFilesThatStartWithSameNameAsSelectedOnes = function(){
	
		var element_prefix = "file_entry_";
		
		var resources_to_fade = [];
		var resources_to_fade_for_file;
	
		//First, unfade all files
		for (var i = 0; i < my.resources.length; i++){
		
			g(element_prefix + i.toString()).style.opacity = "1";
			
		}

		//Then check for all resources that have to be faded
		for (var k = 0; k < my.fileSelection.selected_files.length; k++){
		
			var file_index = my.fileSelection.selected_files[k];
			var file_id = my.resources.idOf(file_index);
			
			
			resources_to_fade.push(file_id);   //fade the resource that is selected
			
			var id_of_res = my.resources.idOf(file_index);
			
			//get resource ids of resources that start with the same name as this
			resources_to_fade_for_file = my.getIDsOfResourcesThatStartWithTheSameNameAsThis(id_of_res);
			
			//fade them too
			for (var j = 0; j < resources_to_fade_for_file.length; j++){
				resources_to_fade.push(resources_to_fade_for_file[j]);
			}
			
			//console.log(resources_to_fade);
		
			
		};
		
		
		//Then fade them!
		for (i=0; i<resources_to_fade.length; i++){
		
			var index = my.resources.indexOf(resources_to_fade[i]);
		
			g(element_prefix+index.toString()).style.opacity = "0.5";
		}
	
	
	};


	my.handleFileListInputChange = function(evt){
	 
		var file = evt.target.files[0]; // File object
		
		var file_list;  //this is where the file strings will be stored
		
		readFileAsText(file, function(result){
		
			try {
			
				file_list = linesToArray(result);
				
				forEach(file_list, function(file_string){
				
					if (file_string.length > 0 && file_string != " "){
					
						my.resources.add({
							name: getFilenameFromFilePath(file_string),
							path: getDirectoryFromFilePath(file_string),
							status: "stable"
						});
					
					}
					
				});
				
				my.refreshFileListDisplay();
				
			}
			
			catch (e) {
			//if file list parsing is not possible
				console.info("No files found! Maybe this file list is not valid!");
				return;
			}
		
		});
		
	};


	my.reset = function(){

		my.resources.reset();
		my.refreshFileListDisplay();

	};
	
	return my;

})();
  
