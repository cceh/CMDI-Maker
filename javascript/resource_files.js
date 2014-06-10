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



var resources = (function(){

	var my = {};
	
	my.selected_files = [];
	
	my.available_resources = [];
	// 0=file name, 1=mime type, 2=size, 3=(exif_)(last modified)date
	// this array only contains file metadata retrieved by file upload form / drag and drop

	my.last_selected_file = -1;
	
	my.shift = false;

	my.getValidityOfFile = function(filename){
	// returns 0=valid media file, 1=valid written resource, 2=invalid media file, 3=invalid written resource, -1=unknown file

		var file_type = GetFileTypeFromFilename(filename);
		
		for (var j=0;j<file_types.valid_lamus_media_file_types.length; j++){
			if (file_type == file_types.valid_lamus_media_file_types[j][0]) {
				return 0;
			}
		}
		
		for (var j=0;j<file_types.valid_lamus_written_resource_file_types.length; j++){
			if (file_type == file_types.valid_lamus_written_resource_file_types[j][0]){
				return 1;
			}
		}

		for (var j=0;j<file_types.invalid_lamus_media_file_types.length; j++){
			if (file_type == file_types.invalid_lamus_media_file_types[j][0]){
				return 2;
			}
		}	

		for (var j=0;j<file_types.invalid_lamus_written_resource_file_types.length; j++){
			if (file_type == file_types.invalid_lamus_written_resource_file_types[j][0]){
				return 3;
			}
		}		

		return -1;

	}

	
	my.refreshFileListDisplay = function() {

		// files is a FileList of File objects. List some properties.
		var output = [];
		
		var list = g('list');
		
		list.innerHTML = "";

		for (var i = 0; i < my.available_resources.length; i++) {
		
			switch (my.getValidityOfFile(my.available_resources[i][0])){
			
				case 0: {
					var compatibility_warning = "";
					var file_entry_class = "media_file_entry";
					break;
				}
			
				case 1: {
					var compatibility_warning = "";
					var file_entry_class = "written_resource_file_entry";
					break;
				}
			
				case 2: {
					var compatibility_warning = compatibility_warnings.invalid_media_file;
					var file_entry_class = "media_file_entry";
					break;
				}
				
				case 3: {
					var compatibility_warning = compatibility_warnings.invalid_written_resource;
					var file_entry_class = "written_resource_file_entry";
					break;
				}
				
				default: {
					var compatibility_warning = compatibility_warnings.general;
					var file_entry_class = "invalid_file_entry";
					break;
				}
			
			}
		  
			
			var file_size = my.available_resources[i][2];
		
			var div = dom.newElement("div", "file_entry_"+i, "file_entry " + file_entry_class, list);
			var title = dom.newElement("h2", "", "file_entry_title", div, my.available_resources[i][0]);
			var p = dom.newElement("p", "", "", div, my.available_resources[i][1] +
			'<br><span class="size_span">Size: ' + file_size + '</span><br><span name="date_span" class="date_span">Last modified: ' +
			my.available_resources[i][3] + '</span>');
			
			div.innerHTML += compatibility_warning;

			div.addEventListener("click", function(i){
			
				return function(){
					
					my.clickedOnFile(i);
				
				};
				
			}(i), false);

		}
		
		if (my.available_resources.length == 0){
			list.innerHTML = "<h2>No media files imported.</h2>";
		}

		session.refreshResourcesOfAllSessions();
		
		my.selected_files = [];
		
	}
  
  
	my.pushFileMetadata = function(FileList) {

		// files is a FileList of File objects. List some properties.
		var output = [];
		for (var i = 0, f; f = FileList[i]; i++) {
			my.available_resources.push([/*escape(*/f.name/*)*/, f.type || 'n/a',bytesToSize(f.size,1), f.lastModifiedDate.toLocaleDateString()  ]);  //push an array with 4 values
		}
		
		my.refreshFileListDisplay();
	}
  

	my.handleDragOver = function(evt) {

		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		
	}


	my.sortAlphabetically = function(){

		my.available_resources = sortByKey(my.available_resources,0);

		my.refreshFileListDisplay();
	}
  

	my.createSessionPerResource = function(){

		var radio_buttons = document.getElementsByName("radio_file_type");
		
		//get file type
		for (var i = 0; i < radio_buttons.length; i++) {
			if (radio_buttons[i].checked) {
				var chosen_file_type = radio_buttons[i].value;
				break;
			}
		}

		console.log("Searching for files of chosen file type" + chosen_file_type);
		
		if (chosen_file_type == "selected"){
		
			console.log("Searching for selected files");
			
			for (var f=0; f<my.selected_files.length; f++){
		
				my.createSessionForResource(my.selected_files[f]);
			
			}
			
			return;
		
		}
		
		else {    //for all media files of filetype
		
			for (var f=0; f<my.available_resources.length; f++){
			
				if (GetFileTypeFromFilename(my.available_resources[f][0]) == chosen_file_type){
				
					console.log("Found a file of file type " + chosen_file_type);
					
					my.createSessionForResource(f);
				
				}
				
			}
			
		}


	}


	my.createSessionForResource = function(resource_index){

		var session_object = make_new_session_object();
		session_object.session.name = RemoveEndingFromFilename(my.available_resources[resource_index][0]);
		
		session_object.expanded = false; //collapse automatically generated session

		var session_id = session.newSession(session_object);
		
		session.addResource(session_id, resource_index);
		
		alertify.log("A new session has been created.<br>Name: " + session.sessions[session.getSessionIndexFromID(session_id)].name, "", "5000");
		
		//if another file's name of available_resources starts with the same name as this file, add it to the session, too!
		for (var f2=0; f2<my.available_resources.length; f2++){
		
			if (resource_index == f2){
				continue;
			}
		
			if (isSubstringAStartOfAWordInString(RemoveEndingFromFilename(my.available_resources[f2][0]), RemoveEndingFromFilename(my.available_resources[resource_index][0]))) {
			
				session.addResource(session_id, f2);
			
			}
		
		}


	}


	my.clearFileList = function(){

		my.available_resources = [];

		my.refreshFileListDisplay();

	}

	
	my.handleFileDrop = function(evt){

		evt.stopPropagation();
		evt.preventDefault();
	 
		my.pushFileMetadata(evt.dataTransfer.files);
		
	}


	my.handleFileInputChange = function(evt){
	 
		my.pushFileMetadata(evt.target.files);
	 
	}


	/* File selection */


	my.clickedOnFile = function(i){
		
		if (my.shift == true){
			
			if (i < my.last_selected_file){
			
				for (var f=my.last_selected_file-1; f>=i; f--){
			
					my.selectFile(f);
			
				}		
			
			}
			
			if (i > my.last_selected_file){
			
				for (var f=my.last_selected_file+1; f<=i; f++){
			
					my.selectFile(f);
			
				}
			}
			
		}
		
		else {
			my.selectFile(i);	
		}


		console.log(my.selected_files);


	}


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

	}
	

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

	}

	
	my.deselectAllFiles = function(){

		while (my.selected_files.length > 0){
		
			my.selectFile(my.selected_files[0]);
		
		}

	}


	my.clearFileList = function(){

		my.available_resources = [];

		my.refreshFileListDisplay();

	}
	
	return my;

})();
  
