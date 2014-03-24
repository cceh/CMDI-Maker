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


function GetValidityOfFile(filename){
// returns 0=valid media file, 1=valid written resource, 2=invalid media file, 3=invalid written resource, -1=unknown file

	var file_type = GetFileTypeFromFilename(filename);
	
	for (var j=0;j<valid_lamus_media_file_types.length; j++){
		if (file_type == valid_lamus_media_file_types[j][0]) {
			return 0;
		}
	}
	
	for (var j=0;j<valid_lamus_written_resource_file_types.length; j++){
		if (file_type == valid_lamus_written_resource_file_types[j][0]){
			return 1;
		}
	}

	for (var j=0;j<invalid_lamus_media_file_types.length; j++){
		if (file_type == invalid_lamus_media_file_types[j][0]){
			return 2;
		}
	}	

	for (var j=0;j<invalid_lamus_written_resource_file_types.length; j++){
		if (file_type == invalid_lamus_written_resource_file_types[j][0]){
			return 3;
		}
	}		

	return -1;

}

function refreshFileListDisplay() {

    // files is a FileList of File objects. List some properties.
    var output = [];
    
	for (var i = 0; i < available_resources.length; i++) {
	
		switch (GetValidityOfFile(available_resources[i][0])){
		
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
	  
		
		var file_size = available_resources[i][2];
	
		output.push('<div class="file_entry ' + file_entry_class + '"><h2 class="file_entry_title">', available_resources[i][0], '</h2>',
		'<p>', available_resources[i][1],
		'<br><span class="size_span">Size: ',file_size, '</span><br><span name="date_span" class="date_span">Last modified: ',
		available_resources[i][3], '</span></p>');
		
		output.push(compatibility_warning);

		output.push('</div>');

    }
	
	if (available_resources.length == 0){
		output.push("<h2>No media files imported.</h2>");
	}

    document.getElementById('list').innerHTML = output.join('');
	
	refresh_resources_of_sessions();
	
}
  
  
  
function pushFileMetadata(FileList) {

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = FileList[i]; i++) {
		available_resources.push([/*escape(*/f.name/*)*/, f.type || 'n/a',bytesToSize(f.size,1), f.lastModifiedDate.toLocaleDateString()  ]);  //push an array with 4 values
    }
	
    refreshFileListDisplay();
}
  

function handleDragOver(evt) {

    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	
}


function sort_alphabetically(){


	available_resources = sortByKey(available_resources,0);


    refreshFileListDisplay();
}
  
  
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];

        if (typeof x == "string")
        {
            x = x.toLowerCase(); 
            y = y.toLowerCase();
        }

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
  
function create_session_per_resource(){

	//erase_all_sessions();
	//really? or only add sessions?

	var radio_buttons = document.getElementsByName("radio_file_type");
	
	//get file type
	for (var i = 0; i < radio_buttons.length; i++) {
		if (radio_buttons[i].checked) {
			var chosen_file_type = radio_buttons[i].value;
			break;
		}
	}

	console.log("Searching for files of chosen file type" + chosen_file_type);
	
	//for all media files of filetype
	
	for (var f=0; f<available_resources.length; f++){
	
		if (GetFileTypeFromFilename(available_resources[f][0]) == chosen_file_type){
			console.log("Found a file of file type " + chosen_file_type);
			var session = new_session({
				name: RemoveEndingFromFilename(available_resources[f][0]),
				expanded: false			//collapse automatically generated session
			});
			
			add_resource_to_session(session, f);
			
			alertify.log("A new session has been created.<br>Name: " + sessions[GetSessionIndexFromID(session)].name, "", "5000");
			
			//if another file's name of available_resources starts with the same name as this file, add it to the session, too!
			for (var f2=0; f2<available_resources.length; f2++){
			
				if (f == f2){
					continue;
				}
			
				if (isSubstringAStartOfAWordInString(RemoveEndingFromFilename(available_resources[f2][0]), RemoveEndingFromFilename(available_resources[f][0]))) {
				
					add_resource_to_session(session, f2);
				
				}
			
			}
		
		}
		
	}


}


function clear_file_list(){

	available_resources = [];

	refreshFileListDisplay();

}

function handleFileDrop(evt){

	evt.stopPropagation();
	evt.preventDefault();
 
	pushFileMetadata(evt.dataTransfer.files);
	
}

 
function handleFileInputChange(evt){
 
	pushFileMetadata(evt.target.files);
 
}


  
