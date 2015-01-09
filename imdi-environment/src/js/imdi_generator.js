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


imdi_environment.imdi_generator = function(data){
	"use strict";

	var corpus = data.corpus;
	var resources = data.resources;
	var actors = data.actors;
	var sessions = data.sessions;
	var parent = imdi_environment;
	
	var already_warned_for_invalid_dates = false;
	var already_warned_for_invalid_birth_dates = false;

	var imdi_version = "IMDI 3.04";
	
	var getMetadataLanguage = function(){

		var rs = APP.CONF.LanguageCodePrefix;	
		rs += g("metadata_language_select").options[g("metadata_language_select").options.selectedIndex].value;
		return rs;
		
	}
	
	var create_imdi_corpus = function (corpus, sessions) {
    
		xml.header();
		create_imdi_header("CORPUS", APP.CONF.originator, "1.0", today());
		xml.open("Corpus");
        xml.element("Name", corpus.name);
		xml.element("Title", corpus.title);   
		xml.element("Description", corpus.description, [["LanguageId",getMetadataLanguage()]]);       
    
        for (var i = 0; i < sessions.length; i++){
			xml.element("CorpusLink", sessions[i].session.name + ".imdi",
			[["Name", sessions[i].session.name]]);
		}
    
		xml.close("Corpus");
		xml.close("METATRANSCRIPT");
    
	};
	
	
	var createIMDISession = function (session, content_languages) {
	
		xml.header();
		create_imdi_header("SESSION",APP.CONF.originator,"1.0",today());
		xml.open("Session");
		xml.element("Name", session.session.name);
		xml.element("Title", session.session.title);


		xml.element("Date", APP.forms.getDateStringByDateObject(session.session.date) || "Unspecified");
		
		// if a valid session date cannot be parsed from the form BUT there has been some input by the user
		// AND the user has not been warned before about that, warn him or her
		if (
			APP.forms.isUserDefinedDateInvalid(session.session.date)
			&& (already_warned_for_invalid_dates == false)
		){
		
			APP.alert(
				parent.l("warning") +
				parent.l("output", "invalid_date_entered_in_session") + "<br>" +
				parent.l("output", "correct_or_ignore_warning")
			);
			
			already_warned_for_invalid_dates = true;
		}
		
		
		xml.element("Description", session.session.description,[["LanguageId",getMetadataLanguage()],["Link",""]]);

		xml.open("MDGroup");
		xml.open("Location");
		xml.element("Continent", session.session.location.continent, [["Link","http://www.mpi.nl/IMDI/Schema/Continents.xml"],["Type","ClosedVocabulary"]]);
		xml.element("Country", session.session.location.country, [["Link","http://www.mpi.nl/IMDI/Schema/Countries.xml"],["Type","OpenVocabulary"]]);
		xml.element("Region", session.session.location.region);
		xml.element("Address", session.session.location.address);
		xml.close("Location");

		xml.open("Project");
		xml.element("Name", session.project.name);
		xml.element("Title", session.project.title);
		xml.element("Id", session.project.id);
		xml.open("Contact");
		xml.element("Name", session.project.contact.name);
		xml.element("Address", session.project.contact.address);
		xml.element("Email", session.project.contact.email);
		xml.element("Organisation", session.project.contact.organisation);
		xml.close("Contact");
		xml.element("Description", session.project.description, [["LanguageId",getMetadataLanguage()],["Link",""]]);
		xml.close("Project");
		
		xml.open("Keys");
		xml.close("Keys");
		
		insertSessionContent(session.content, content_languages);

		//Actors
		xml.open("Actors");
		
		//Actors Description
		xml.element("Description", session.actors.description, [["LanguageId", getMetadataLanguage()], ["Link", ""]]);
    
		forEach(session.actors.actors, function(actor){
			insertActor(actor);
		});

		xml.close("Actors");
		xml.close("MDGroup");
		xml.open("Resources");

		forEach(session.resources.resources.mediaFiles, function(mf){
			insertMediafile(mf.name, mf.size);
		});
	
		forEach(session.resources.resources.writtenResources, function(wr){
			insertWrittenResource(wr.name, wr.size);
		});
    
		xml.close("Resources");
		xml.element("References", "");
		xml.close("Session");
		xml.close("METATRANSCRIPT");
   
		
    
	};
	
	
	var insertSessionContent = function (content, content_languages) {

		xml.open("Content");
		xml.element("Genre", content.genre, [["Link","http://www.mpi.nl/IMDI/Schema/Content-Genre.xml"],["Type","OpenVocabulary"]]);
		xml.element("SubGenre", content.subgenre, [["Link","http://www.mpi.nl/IMDI/Schema/Content-SubGenre.xml"],["Type","OpenVocabularyList"]]);
		xml.element("Task", content.task, [["Link","http://www.mpi.nl/IMDI/Schema/Content-Task.xml"],["Type","OpenVocabulary"]]);
	
		xml.element("Modalities", "", [["Link","http://www.mpi.nl/IMDI/Schema/Content-Modalities.xml"],["Type","OpenVocabulary"]]);
		//no input
		xml.element("Subject","",[["Link","http://www.mpi.nl/IMDI/Schema/Content-Subject.xml"],["Type","OpenVocabularyList"]]);
		//no input

		xml.open("CommunicationContext");
		xml.element(
			"Interactivity",
			content.communication_context.interactivity,
			[
				["Link","http://www.mpi.nl/IMDI/Schema/Content-Interactivity.xml"],
				["Type","ClosedVocabulary"]
			]
		);
		xml.element("PlanningType", content.communication_context.planningtype, [["Link","http://www.mpi.nl/IMDI/Schema/Content-PlanningType.xml"],["Type","ClosedVocabulary"]]);
		xml.element("Involvement", content.communication_context.involvement, [["Link","http://www.mpi.nl/IMDI/Schema/Content-Involvement.xml"],["Type","ClosedVocabulary"]]);	
		xml.element("SocialContext", content.communication_context.socialcontext, [["Link","http://www.mpi.nl/IMDI/Schema/Content-SocialContext.xml"],["Type","ClosedVocabulary"]]);
		xml.element("EventStructure", content.communication_context.eventstructure, [["Link","http://www.mpi.nl/IMDI/Schema/Content-EventStructure.xml"],["Type","ClosedVocabulary"]]);

		xml.element("Channel", "", [["Link","http://www.mpi.nl/IMDI/Schema/Content-Channel.xml"],["Type","ClosedVocabulary"]]);
		//no input

		xml.close("CommunicationContext");
		xml.open("Languages");
	
		xml.element("Description", "", [["LanguageId", getMetadataLanguage()], ["Link",""]]);
		//no input

		insertContentLanguages(content_languages);
		
		xml.close("Languages");
		xml.element("Keys", "");
		xml.element(
			"Description",
			content.description,
			[
				["LanguageId", getMetadataLanguage()],
				["Link",""]
			]
		);
		xml.close("Content");

	}
	

	var insertContentLanguages = function (CLs) {

		forEach(CLs, function(CL){  //for all content languages // no session separate languages yet
	
			xml.open("Language");
			xml.element("Id", APP.CONF.LanguageCodePrefix + CL[0]);
			xml.element("Name", CL[3], [["Link","http://www.mpi.nl/IMDI/Schema/MPI-Languages.xml"],["Type","OpenVocabulary"]]);
			//xml.element("Dominant","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			//xml.element("SourceLanguage","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			//xml.element("TargetLanguage","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			xml.element("Description","",[["LanguageId", getMetadataLanguage()], ["Link",""]]);
			//no input yet
			xml.close("Language");
	
		});

	};
	
	
	var create_imdi_header = function (imdi_type, originator, version, date) {
    
		return xml.open("METATRANSCRIPT", [
			["xmlns", "http://www.mpi.nl/IMDI/Schema/IMDI"],
			["xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance"],
			["Date", date],
			["FormatId", imdi_version],
			["Originator", originator],
			["Type", imdi_type],
			["Version", version],
			["xsi:schemaLocation","http://www.mpi.nl/IMDI/Schema/IMDI ./IMDI_3.0.xsd"]
		]);

	};
	
	
	var insertWrittenResource = function (link, size) {

		xml.open("WrittenResource");
		xml.element("ResourceLink", link);
		xml.element("MediaResourceLink","");
		xml.element("Date","Unspecified"); //no input yet
	    xml.element("Type", resources.getFileType(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Type.xml"],["Type","OpenVocabulary"]]);
		xml.element("SubType", resources.getFileType(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-SubType.xml"],["Type","OpenVocabularyList"]]);
		xml.element("Format", resources.getFileType(link).mimetype,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Format.xml"],["Type","OpenVocabulary"]]);
		xml.element("Size", size);
		xml.open("Validation");
		xml.element("Type", "", [["Link","http://www.mpi.nl/IMDI/Schema/Validation-Type.xml"],["Type","ClosedVocabulary"]]);
		xml.element("Methodology", "",[["Link","http://www.mpi.nl/IMDI/Schema/Validation-Methodology.xml"],["Type","ClosedVocabulary"]]);
		xml.element("Level","Unspecified");
		xml.element("Description", "", [["LanguageId", getMetadataLanguage()],["Link",""]]);
		xml.close("Validation");
		xml.element("Derivation", "", [["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Derivation.xml"],["Type","ClosedVocabulary"]]);
		xml.element("CharacterEncoding", "");
		xml.element("ContentEncoding", "");
		xml.element("LanguageId", "");
		xml.element("Anonymized", "Unspecified", [["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
		
		xml.open("Access");
		xml.element("Availability", "");
		xml.element("Date", "");
		xml.element("Owner", "");
		xml.element("Publisher", "");
		
		xml.open("Contact");
		xml.element("Name", "");
		xml.element("Address", "");
		xml.element("Email", "");
		xml.element("Organisation", "");
		xml.close("Contact");
		
		xml.element("Description","",[["LanguageId", getMetadataLanguage()],["Link",""]]);
		xml.close("Access");
		
		xml.element("Description","",[["LanguageId", getMetadataLanguage()],["Link",""]]);
		xml.element("Keys","");
		xml.close("WrittenResource");
		
	
	}
	
	
	var insertMediafile = function (link, size) {

		xml.open("MediaFile");
		xml.element("ResourceLink", link);
		xml.element("Type", resources.getFileType(link).type, [["Link","http://www.mpi.nl/IMDI/Schema/MediaFile-Type.xml"],["Type","ClosedVocabulary"]]);
		xml.element("Format", resources.getFileType(link).mimetype, [["Link","http://www.mpi.nl/IMDI/Schema/MediaFile-Format.xml"],["Type","OpenVocabulary"]]);
		xml.element("Size", size);
		xml.element("Quality","Unspecified",[["Link","http://www.mpi.nl/IMDI/Schema/Quality.xml"],["Type","ClosedVocabulary"]]); // no input
		xml.element("RecordingConditions", "");
		xml.open("TimePosition");
		xml.element("Start","Unspecified");
		xml.element("End","Unspecified"); //no input
		xml.close("TimePosition");
		xml.open("Access");
		xml.element("Availability", "");
		xml.element("Date", "");
		xml.element("Owner", "");
		xml.element("Publisher", "");
		xml.open("Contact");
		xml.element("Name", "");
		xml.element("Address", "");
		xml.element("Email", "");
		xml.element("Organisation", ""); 
		xml.close("Contact");
		xml.element("Description","",[["LanguageId", getMetadataLanguage()],["Link",""]]);
		xml.close("Access");
		xml.element("Description","",[["LanguageId", getMetadataLanguage()],["Link",""]]);
		xml.element("Keys","");
		xml.close("MediaFile");
		
		
	}


	var insertActor = function (actor, session_id) {

		xml.open("Actor");
		xml.element("Role", actor.role, [["Link","http://www.mpi.nl/IMDI/Schema/Actor-Role.xml"],["Type","OpenVocabularyList"]]);
		xml.element("Name", actor.name);
		xml.element("FullName", actor.full_name);
		xml.element("Code", actor.code);
		xml.element("FamilySocialRole", actor.family_social_role, [["Link","http://www.mpi.nl/IMDI/Schema/Actor-FamilySocialRole.xml"], ["Type","OpenVocabularyList"]]);
		xml.open("Languages");
		xml.element("Description", "", [["LanguageId", getMetadataLanguage()], ["Link",""]]);
	
		forEach(actor.languages.actor_languages, function(lang){
	
			xml.open("Language");
			xml.element("Id", APP.CONF.LanguageCodePrefix + lang.LanguageObject[0]);
			xml.element("Name", lang.LanguageObject[3],[["Link","http://www.mpi.nl/IMDI/Schema/MPI-Languages.xml"],["Type","OpenVocabulary"]]);
			xml.element("MotherTongue",(lang.MotherTongue) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			xml.element("PrimaryLanguage",(lang.PrimaryLanguage) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);		
			xml.element("Description","",[["LanguageId", getMetadataLanguage()],["Link",""]]);
			xml.close("Language");
	
		});
	
		xml.close("Languages");
		xml.element("EthnicGroup", actor.ethnic_group);   
	
		//Age field
		xml.element("Age", actor.getAge(session_id, actor_id));
	
		xml.element("BirthDate", APP.forms.getDateStringByDateObject(actor.birth_date) || "Unspecified");
		
		if (
			APP.forms.isUserDefinedDateInvalid(actor.birth_date)
			&& (already_warned_for_invalid_birth_dates == false)
		){
		
			APP.alert(
				parent.l("warning") +
				parent.l("output", "invalid_birth_date_entered") + "<br>" +
				parent.l("output", "correct_or_ignore_warning")
			);
			
			already_warned_for_invalid_birth_dates = true;
		}
		
		xml.element("Sex", actor.sex,[["Link","http://www.mpi.nl/IMDI/Schema/Actor-Sex.xml"],["Type","ClosedVocabulary"]]);
		xml.element("Education",(actor.education != "") ? actor.education : "Unspecified" );
		xml.element("Anonymized",(actor.anonymized) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]); 
		xml.open("Contact");
		xml.element("Name", actor.contact.name);   
		xml.element("Address", actor.contact.address);   
		xml.element("Email", actor.contact.email);   
		xml.element("Organisation", actor.contact.organisation);   
		xml.close("Contact");
		xml.element("Keys", "");
		xml.element("Description", actor.description, [["LanguageId",getMetadataLanguage()],["Link",""]]);
		xml.close("Actor");
		
    
	}
	
	var my = {};
	my.sessions = [];

	var xml = new XMLString();
	create_imdi_corpus(data.corpus, data.sessions);
	my.corpus = xml.getString();
	
	forEach(data.sessions, function(session){   
		xml = new XMLString();
		createIMDISession(session, data.actors, data.resources, data.content_languages);
		my.sessions.push(xml.getString());
	});

	return my;
	
}