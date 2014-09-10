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

	var my = {};
	var session;
	
	my.selected_files = [];
	
	my.available_resources = [];
	// 0=file name, 1=mime type, 2=size, 3=(exif_)(last modified)date
	// this array only contains file metadata retrieved by file upload form / drag and drop

	my.identity = {
		id: "resources",
		title: "Resources",
		icon: "blocks",
	};
	
	my.last_selected_file = -1;
	
	my.shift = false;
	
	my.view_id = "VIEW_resources";
	
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
			onclick: function() { my.createSessionPerResource();  APP.view(session); },
			sub_div_innerHTML: '<h3 class="inner_function_h3">Files</h3>'+
						'<input type="radio" name="radio_file_type" value="selected" checked> Selected Files<br>'+
						'<input type="radio" name="radio_file_type" value="eaf"> EAF<br>'+
						'<input type="radio" name="radio_file_type" value="wav"> WAV<br>'+
						'<input type="radio" name="radio_file_type" value="mpg"> MPG<br>'+
						'<input type="radio" name="radio_file_type" value="mp4"> MP4<br>'
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
	
	
	my.init = function(view){
	
		session = eldp_environment.workflow[2];
	
		var div = dom.make("div","files","",view);
		
		dom.h3(div, "Import Files");
		var drop_zone = dom.make("div","drop_zone","",div,"<h2>Drag and drop media files here</h2>");
		
		var input = dom.input(div,"files_input","","files_input","file");
		input.multiple = true;
		
		dom.h3(div, "Import File List");
		dom.input(div, "file_list_import_input", "", "", "file");

		var usage_table = dom.make("div","","workspace-usageTable",div,
		'<h3>Usage</h3><h4>Click</h4><p>Select resource, click again to deselect a single resource</p>'+
		'<h4>Shift</h4><p>Hold shift to select multiple resources</p>'+
		'<h4>Escape</h4><p>Press escape to deselect all resources</p>');
		
		var file_list_div = dom.make("div","file_list_div","",view);
		var list = dom.make("div","list","",file_list_div);
		
		// Setup the drag and drop listeners
		var dropZone = g('drop_zone');
		dropZone.addEventListener('dragover', my.handleDragOver, false);
		dropZone.addEventListener('drop', my.handleFileDrop, false);

		g('file_list_import_input').addEventListener('change', my.handleFileListInputChange, false);
		g('files_input').addEventListener('change', my.handleFileInputChange, false);
		
		
		my.refreshFileListDisplay(true);
		
		document.onkeydown = function(event) {
		
			if (event.keyCode == 16) {  //if shift is pressed
				if (my.shift === false){
					my.shift = true;
					console.log("shift on");
				}
			}
			
			if (event.keyCode == 27)  {   //escape pressed
			
				my.deselectAllFiles();
			
			}
		
		};
		
		document.onkeyup = function(event) {
		
			if (event.keyCode == 16) {  //if shift is let go
				my.shift = false;
				console.log("shift off");
			}
			
		};
		
	};

	
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

	
	my.refreshFileListDisplay = function(not_in_sessions) {
		var file_entry_class;
		var compatibility_warning;

		// files is a FileList of File objects. List some properties.
		var output = [];
		
		var list = g('list');
		
		list.innerHTML = "";

		for (var i = 0; i < my.available_resources.length; i++) {
		
			my.renderResource(
				i,
				my.available_resources[i].name,
				my.available_resources[i].mime_type,
				my.available_resources[i].size,
				my.available_resources[i].last_change,
				"file_entry_"+i,
				"file_entry media_file_entry",
				list,
				compatibility_warning,
				my.available_resources[i].stable,
				my.available_resources[i].inProgress
			);
		
			

		}
		
		if (my.available_resources.length === 0){
			list.innerHTML = "<h2>No resource files imported.</h2>";
		}

		if ((session) && (!not_in_sessions)){
			session.refreshResourcesOfAllBundles();
		}
		
		my.selected_files = [];
		
	};
	
	
	my.refreshFileStateValues = function(file_index){
	
		my.available_resources[file_index].stable = g("f_stable_"+file_index).checked;
		my.available_resources[file_index].inProgress = g("f_inProgress_"+file_index).checked;
	
	};
	
	
	my.renderResource = function(number, title, mimeType, file_size, last_change, id, className, parent, compatibility_warning, stable, inProgress){
	
		var div = dom.make("div", id, className, parent);
		var title = dom.make("h2", "", "file_entry_title", div, title);
		var p = dom.make("p", "", "", div, mimeType +
		'<br><span class="size_span">Size: ' + file_size + '</span><br><span name="date_span" class="date_span">Last modified: ' +
		last_change + '</span>');
		
		var cb1 = dom.make("input","f_stable_"+number,"",div);
		cb1.type = "checkbox";
		cb1.addEventListener("click",function(event){ 
			event.stopPropagation();
			
			my.refreshFileStateValues(number);
			
			return;
		});
		var span1 = dom.make("span","","",div, " Stable");
		
		if (stable == true){
			cb1.checked = true;
		}
		
		
		dom.br(div);
		
		var cb2 = dom.make("input","f_inProgress_"+number,"",div);
		cb2.type = "checkbox";
		cb2.addEventListener("click",function(event){
			event.stopPropagation();
			my.refreshFileStateValues(number);
			
			return;
		});
		var span2 = dom.make("span","","",div, " In Progress");	
		
		if (inProgress == true){
			cb2.checked = true;
		}

		div.addEventListener("click", function(num){
			
			return function(){
				
				my.clickedOnFile(num);
			
			};
			
		}(number), false);
	
	
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
  

	my.handleDragOver = function(evt) {

		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		
	};


	my.sortAlphabetically = function(){

		my.available_resources = sortByKey(my.available_resources,0);

		my.refreshFileListDisplay();
	};
  

	my.createSessionPerResource = function(){
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
			
			for (f=0; f<my.selected_files.length; f++){
		
				my.createSessionForResource(my.selected_files[f]);
			
			}
			
			return;
		
		}
		
		else {    //for all media files of filetype
		
			for (f=0; f<my.available_resources.length; f++){
			
				if (GetFileTypeFromFilename(my.available_resources[f][0]) == chosen_file_type){
				
					console.log("Found a file of file type " + chosen_file_type);
					
					my.createSessionForResource(f);
				
				}
				
			}
			
		}


	};
	
	
	my.removeSelectedFiles = function(){
		var f;
		
		for (f = 0; f<my.selected_files.length; f++){
		
			my.available_resources[my.selected_files[f]] = null;
		
		
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

		var name = remove_invalid_chars(RemoveEndingFromFilename(my.available_resources[resource_index][0]));
		var expanded = false; //collapse automatically generated session
		
		var resources = [];
		resources.push(resource_index);
		
		//if another file's name of available_resources starts with the same name as this file, add it to the session, too!
		for (var f2=0; f2<my.available_resources.length; f2++){
		
			if (resource_index == f2){
				continue;
			}
		
			if (isSubstringAStartOfAWordInString(RemoveEndingFromFilename(my.available_resources[f2][0]), RemoveEndingFromFilename(my.available_resources[resource_index][0]))) {
			
				resources.push(f2);
			
			}
		
		}
		
		session.createNewSessionWithResources(name, expanded, resources);

	};


	my.clearFileList = function(){

		my.available_resources = [];

		my.refreshFileListDisplay();

	};

	
	my.handleFileDrop = function(evt){

		evt.stopPropagation();
		evt.preventDefault();
	 
		my.pushFileMetadata(evt.dataTransfer.files);
		
	};


	my.handleFileInputChange = function(evt){
	 
		my.pushFileMetadata(evt.target.files);
	 
	};
	

	my.handleFileListInputChange = function(evt){
	 
		var file = evt.target.files[0]; // File object
		
		var file_list;  //this is where the file strings will be stored
		
		console.log(file);
		
		var reader = new FileReader();
		
		reader.onload = function(e){
			var result = e.target.result;
		
			//try {
				file_list = linesToArray(result);
				
				forEach(file_list, function(file_string){
					my.available_resources.push({
						name: file_string
					});
				});
				
				my.refreshFileListDisplay();
			/*}
			
			catch (e) {
			//if json parsing is not possible, try xml parsing

				console.info("No files found!");
				return;
			}*/
			
			console.log(file_list);
			
		
		};
		
		reader.readAsText(file);
	 
	};


	/* File selection */


	my.clickedOnFile = function(i){
		var f;
		
		if (my.shift === true){
			
			if (i < my.last_selected_file){
			
				for (f = my.last_selected_file-1; f>=i; f--){
			
					my.selectFile(f);
			
				}		
			
			}
			
			if (i > my.last_selected_file){
			
				for (f = my.last_selected_file+1; f<=i; f++){
			
					my.selectFile(f);
			
				}
			}
			
		}
		
		else {
			my.selectFile(i);	
		}


		console.log(my.selected_files);


	};


	my.selectFile = function(i){

		var pos = my.selected_files.indexOf(i);

		if (pos == -1){
			my.selected_files.push(i);
			my.last_selected_file = i;
			
		}
		
		else {
			my.selected_files.splice(pos,1);
			my.last_selected_file = i;
		}

		my.markFileEntry(i);

	};
	

	my.markFileEntry = function(i){

		var pos = g("file_entry_"+i).className.indexOf(" selected_file");
		
		if (pos == -1) {
			
			g("file_entry_"+i).className = g("file_entry_"+i).className + " selected_file";
			my.available_resources[i].selected = true;
		
		}
		
		else {
		
			g("file_entry_"+i).className = g("file_entry_"+i).className.slice(0,pos);
			my.available_resources[i].selected = false;
			
		}

	};

	
	my.deselectAllFiles = function(){

		while (my.selected_files.length > 0){
		
			my.selectFile(my.selected_files[0]);
		
		}

	};


	my.clearFileList = function(){

		my.available_resources = [];

		my.refreshFileListDisplay();

	};
	
	return my;

})();
  
