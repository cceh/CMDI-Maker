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


function load_preset(preset){


document.getElementById('file_content').innerHTML="<h3>Loading Preset...</h3>";


// create AJAX request
var request=new XMLHttpRequest();
url="request_preset?"+"preset="+preset;
request.open("GET",url,true);
request.responseType="text";

request.onload=function(){

//daten auslesen und in entsprechende input fields übertragen

preset_data = request.response;

document.getElementById('file_content').innerHTML=preset_data;

return;
}


request.onerror=function(){alert('XMLHttpRequest does not work! Could not load presets!');}
request.send();

}


function get_media_files_from_server(){
  
document.getElementById('list').innerHTML="<h3>Loading Media Files From Server</h3>";


// create AJAX request
var request=new XMLHttpRequest();
url="request_media_files";
request.open("GET",url,true);
//request.responseType="text";
request.responseType="json";
//geht responsetype = json? oder nur in chrome? ansonsten responsetype=text und jquery-einsatz als json-parser!

request.onload=function(){



//daten auslesen und entsprechenden daten zuordnen?
	//document.write(request.response)
	//var file_data = jQuery.parseJSON(request.response);
	var file_data = request.response;

	for (var j=0;j<file_data.length;j++)
		{
		available_media_files.push();
		available_media_files.push([   file_data[j][0], file_data[j][1], file_data[j][2], file_data[j][3]  ]);  //push an array with 4 values
		}



	refreshFileListDisplay();
	
return;
}


request.onerror=function(){alert('XMLHttpRequest does not work! Could not load presets!');}
request.send(); 
}