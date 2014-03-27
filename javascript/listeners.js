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


function add_event_listeners() {

	// Views
	g('start_window_icon').addEventListener('click', function() {        show_window(6);      });
	g('sessions_window_icon').addEventListener('click', function() {        show_window(0);      });
	g('manage_actors_icon').addEventListener('click', function() {        show_window(1);      });
	g('manage_media_files_icon').addEventListener('click', function() {        show_window(3);      });
	g('xml_output_icon').addEventListener('click', function() {        show_window(2);      });
	
	// Functions
    g('link_reset_form').addEventListener('click', function() {        
	
		alertify.set({ labels: {
			ok     : "No",
			cancel : "Yes, delete form"
		} });

		alertify.confirm("Really?<br>You want to reset the form and delete corpus and all sessions?", function (e) {

			if (e) {
				// user clicked "ok"
			}
	
			else {
				// user clicked "cancel" (as cancel is always the red button, the red button is chosen to be the executive button=
				reset_form();
				alertify.log("Form reset","",5000);
				
			}
		});
	});
	
	g('link_new_session').addEventListener('click', function() {        new_session({});      });
	g('link_save_form').addEventListener('click', function() {
		save_form();
		alertify.log("Form saved","",5000);
	});	
	g('link_export_corpus').addEventListener('click', function() {        export_corpus();      });
	g('link_settings').addEventListener('click', function() {        show_window(4);      });
	g('link_about').addEventListener('click', function() {        show_window(5);      });
	g('link_clear_file_list').addEventListener('click', function() {        clear_file_list();      });
	g('link_sort_alphabetically').addEventListener('click', function() {        sort_alphabetically();      });
	g('link_save_active_actor').addEventListener('click', function() {        save_active_actor();      });
	g('link_delete_active_actor').addEventListener('click', function() {        delete_active_actor();      });
	g("link_sort_actors_alphabetically").addEventListener('click', function() {        sort_actors_alphabetically();      });
	g('link_duplicate_active_actor').addEventListener('click', function() {        duplicate_active_actor();      });
	g('link_copy_sessions').addEventListener('click', function() {        assign_session1_metadata();      });
	
	//this cannot be done with css
	g('link_copy_sessions').addEventListener('mousedown', function() {        g('link_copy_sessions').style.backgroundColor = "black";      });
	g('link_copy_sessions').addEventListener('mouseup', function() {        g('link_copy_sessions').style.backgroundColor = "";      });
	
	g('crps_icon').addEventListener('click', function() {        create_session_per_resource();  show_window(0);     });
	
	//this cannot be done with css
	g('crps_icon').addEventListener('mousedown', function() {        g('crps_icon').style.backgroundColor = "black";      });
	g('crps_icon').addEventListener('mouseup', function() {        g('crps_icon').style.backgroundColor = "";      });

	g('content_language_search_button').addEventListener('click', function() {  searchContentLanguage();     });
	g('content_language_iso_ok').addEventListener('click', function() {  addISOLanguage();     });
	
	document.getElementsByName("radio_auto_save").selectedIndex = 3;
	
	document.getElementsByName("radio_auto_save")[0].addEventListener( "click", function() {    setAutosaveInterval(-1);     });
	document.getElementsByName("radio_auto_save")[1].addEventListener( "click", function() {    setAutosaveInterval(30);     });
	document.getElementsByName("radio_auto_save")[2].addEventListener( "click", function() {    setAutosaveInterval(60);     });	
	document.getElementsByName("radio_auto_save")[3].addEventListener( "click", function() {    setAutosaveInterval(300);     });
	document.getElementsByName("radio_auto_save")[4].addEventListener( "click", function() {    setAutosaveInterval(600);     });	
	
	g('link_erase_actors_database').addEventListener('click', function() {        erase_actor_database();      });
	g('link_delete_recall_data').addEventListener('click', function() {        delete_recall_data();      });
	g('link_export_actors').addEventListener('click', function() {        export_actors();      });	
	g('actors_file_input').addEventListener('change',import_actors, false);	
	g('actor_role_cv_img').addEventListener('click', function() {        change_ov_input("actor_role",vocabularies.actor.role);   /*open vocabulary*/   });
	g('actor_fs_role_cv_img').addEventListener('click', function() {        change_ov_input("actor_family_social_role",vocabularies.actor.family_social_role);  /*open vocabulary*/    });
	
	g("content_language_select").onkeydown = function(event) {

		if (event.keyCode == 13) {  //if enter is pressed
			searchContentLanguage();
		}
	};
	
	g("content_language_iso_input").onkeydown = function(event) {

		if (event.keyCode == 13) {  //if enter is pressed
			addISOLanguage();
		}
	};
	
	g("corpus_name").onkeypress = function(e) {
		var chr = String.fromCharCode(e.which);
		if (not_allowed_chars.indexOf(chr) >= 0){
			alertify.log("This character is not allowed here.","error",5000);
			return false;
		}
	};
	
	g('actor_language_search_button').addEventListener('click', function() {  search_actor_language();   });
	g('actor_language_iso_ok').addEventListener('click', function() {  addactorISOLanguage();     });

	g("actor_language_select").onkeydown = function(event) {

		if (event.keyCode == 13) {  //if enter is pressed
			search_actor_language();
		}
	};
	
	g("actor_language_iso_input").onkeydown = function(event) {

		if (event.keyCode == 13) {  //if enter is pressed
			addactorISOLanguage();
		}
	};
	
	// Setup the drag and drop listeners
	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', handleFileDrop, false);
  
	document.getElementById('files_input').addEventListener('change', handleFileInputChange, false);
	

	
	
};



