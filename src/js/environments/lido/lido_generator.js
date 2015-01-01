lido_environment.lido_generator = function(data){
"use strict";

	xml.reset();
	xml.setElementPrefix("lido");
	
	var parent = lido_environment;

	var digitalisat = lido_environment.workflow[0];	

	var rs = ""; //Return string

	var create_lido_digitalisat = function (data) {
		var rs = "";
		create_lido_entry(data);
	}

	var create_lido_term = function (term,entity,etype) {
		if (etype=="search") {
			rs += xml.element("term", term , [["lido:addedSearchTerm",entity]]);
		}
		else if (etype=="lang") {
			rs += xml.element("term", term , [["xml:lang",entity]]);
		}
		else if (etype=="encoding") {
			rs += xml.element("term", term , [["lido:encodinganalog",entity]]);
		}
		else if (etype=="encoding_search") {
			rs += xml.element("term", term , [["lido:addedSearchTerm",entity[0]],["lido:encodinganalog",entity[1]]]);
		}
		else {
			rs += xml.element("term", term);
		};
		return rs;
	}

	var create_lido_entry = function (data) {
    
		rs += xml.header;	
		rs += xml.open("lido",[
			["xmlns:lido", "http://www.lido-schema.org"],
			["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
			["xsi:schemaLocation","http://www.lido-schema.org http://www.lido-schema.org/schema/v1.0/lido-v1.0.xsd"]
		]);

		rs += xml.element("lidoRecID", data.start.object_id, [["lido:source","Theaterwissenschaftliche Sammlung, Universität zu Köln"],["lido:type","local"]]);
		rs += xml.open("category");
			rs += xml.element("conceptID",data.start.concept_id,[["lido:type","AAT"]]);
			create_lido_term(data.start.type,"de","lang");
		rs += xml.close("category");
		rs += xml.open("descriptiveMetadata", [["xml:lang","de"]]);
			rs += xml.open("objectClassificationWrap");
				rs += xml.open("objectWorkTypeWrap");
					rs += xml.open("objectWorkType");
						rs += xml.element("conceptID", "300264387" , [["lido:type","AAT"]]);
						var entity = new Array("yes","300264387");
						create_lido_term(data.start.type, entity ,"encoding_search");
					rs += xml.close("objectWorkType");
				rs += xml.close("objectWorkTypeWrap");
				rs += xml.open("classificationWrap");
					rs += xml.open("classification", [["lido:type","AAT:type"]]);
						rs += xml.element("conceptID", "300264387" , [["lido:type","AAT:type"]]);
						rs += xml.element("term", data.start.type, [["lido:addedSearchTerm","yes"]]);
					rs += xml.close("classification");
				rs += xml.close("classificationWrap");
			rs += xml.close("objectClassificationWrap");
			rs += xml.open("objectIdentificationWrap");
				rs += xml.open("titleWrap");
					rs += xml.open("titleSet");
						rs += xml.element("appellationValue", data.object_identification.title,[["lido:pref","preferred"],["xml:lang","de"]]);
					rs += xml.close("titleSet");
				rs += xml.close("titleWrap");
				rs += xml.open("repositoryWrap");
					rs += xml.open("repositorySet", [["lido:type","current"]]);
						rs += xml.open("repositoryName");
							rs += xml.open("legalBodyName");
							rs += xml.element("appellationValue", data.object_identification.legal_body);
							rs += xml.close("legalBodyName");
						rs += xml.close("repositoryName");
						rs += xml.element("workID",data.object_identification.inventory_number,[["lido:type","inventory number"]]);
					rs += xml.close("repositorySet");
				rs += xml.close("repositoryWrap");
				rs += xml.open("objectDescriptionWrap");
					rs += xml.open("objectDescriptionSet");
						rs += xml.element("descriptiveNoteValue",data.object_identification.descriptive_note);
					rs += xml.close("objectDescriptionSet");
				rs += xml.close("objectDescriptionWrap");
				rs += xml.open("objectMeasurementsWrap");
					rs += xml.open("objectMeasurementsSet");
						rs += xml.open("objectMeasurements");
							rs += xml.open("measurementsSet");						
								rs += xml.element("measurementType",data.object_identification.measurements_type);
								rs += xml.element("measurementUnit",data.object_identification.measurements_unit);
								rs += xml.element("measurementValue",data.object_identification.display_object_measurements);								
							rs += xml.close("measurementsSet");
						rs += xml.close("objectMeasurements");						
					rs += xml.close("objectMeasurementsSet");
				rs += xml.close("objectMeasurementsWrap");
			rs += xml.close("objectIdentificationWrap");
			rs += xml.open("eventWrap");
				rs += xml.open("eventSet");
					rs += xml.element("displayEvent",data.event.title);
					rs += xml.open("event");
						rs += xml.open("eventType");
							create_lido_term(data.event.type,"de","lang");
						rs += xml.close("eventType");
						rs += xml.open("eventActor");
							rs += xml.open("actorInRole");
								rs += xml.open("actor", [["lido:type","person"]]);
									rs += xml.element("actorID", data.event.actor.actor_id,[["lido:type","d-nb.info"],["lido:source","http://d-nb.info/gnd/" + data.event.actor.actor_id]]);
									rs += xml.open("nameActorSet");
										rs += xml.element("appellationValue",data.event.actor.name,[["lido:pref","preferred"]]);
										//rs += xml.element("sourceAppellation","http://d-nb.info/gnd/118713248");
									rs += xml.close("nameActorSet");
									rs += xml.open("vitalDatesActor");
										rs += xml.element("earliestDate",data.event.actor.earliest_date);
										rs += xml.element("latestDate",data.event.actor.latest_date);
									rs += xml.close("vitalDatesActor");
									rs += xml.element("genderActor", data.event.actor.gender);
								rs += xml.close("actor");
								rs += xml.open("roleActor");
									create_lido_term(data.event.actor.role);
								rs += xml.close("roleActor");
							rs += xml.close("actorInRole");
						rs += xml.close("eventActor");
						rs += xml.open("culture");
							create_lido_term(data.event.culture);
						rs += xml.close("culture");
						rs += xml.open("eventDate");
							rs += xml.open("date");
								rs += xml.element("earliestDate",data.event.earliest_date);
								rs += xml.element("latestDate",data.event.latest_date);
							rs += xml.close("date");
						rs += xml.close("eventDate");
						/*
						rs += xml.open("eventPlace");
							rs += xml.element("displayPlace", "");
							rs += xml.open("place");
								rs += xml.open("namePlaceSet");
									rs += xml.element("appellationValue","");
								rs += xml.close("namePlaceSet");
								rs += xml.open("gml");
								rs += xml.close("gml");
							rs += xml.close("place");
						rs += xml.close("eventPlace");
						*/
					rs += xml.close("event");
				rs += xml.close("eventSet");
			rs += xml.close("eventWrap");
			rs += xml.open("objectRelationWrap");
				rs += xml.open("subjectWrap");
					rs += xml.open("subjectSet");
						rs += xml.element("displaySubject",data.object_relation.display_subject);
						rs += xml.open("subject");
							/*
							rs += xml.open("subjectActor");
								rs += xml.element("displayActor","");
								rs += xml.open("actor");
									
									rs += xml.open("nameActorSet");
										rs += xml.element("appellationValue","");
										rs += xml.element("sourceAppellation","http://d-nb.info/gnd/118713248");
									rs += xml.close("nameActorSet");
								rs += xml.close("actor");
							rs += xml.close("subjectActor");
							*/
							rs += xml.open("subjectDate");
								rs += xml.element("displayDate",data.object_relation.subject_date);
							rs += xml.close("subjectDate");
							rs += xml.open("subjectEvent");
								rs += xml.element("displayEvent",data.object_relation.event.title);
								rs += xml.open("event");
									rs += xml.open("eventType");
										create_lido_term(data.object_relation.event.type);
									rs += xml.close("eventType");
									rs += xml.open("eventName");
										rs += xml.element("appellationValue",data.object_relation.event.title);
									rs += xml.close("eventName");
									// Das muss noch in eine Funktion
									rs += xml.open("eventActor"); 
										rs += xml.element("displayActorInRole",data.object_relation.event.actor.role + ": " + data.object_relation.event.actor.name);
										rs += xml.open("actorInRole");
											rs += xml.open("actor");
												rs += xml.open("nameActorSet");
													rs += xml.element("appellationValue",data.object_relation.event.actor.name);
												rs += xml.close("nameActorSet");
											rs += xml.close("actor");
											rs += xml.open("roleActor");
												create_lido_term(data.object_relation.event.actor.role);
											rs += xml.close("roleActor");
										rs += xml.close("actorInRole");
									rs += xml.close("eventActor");
									// bis hier
									rs += xml.open("culture");
										create_lido_term(data.object_relation.event.culture);
									rs += xml.close("culture");
									rs += xml.open("eventDate");
										rs += xml.open("date");
											rs += xml.element("earliestDate", data.object_relation.event.earliest_date);
											rs += xml.element("latestDate", data.object_relation.event.latest_date);
										rs += xml.close("date");									
									rs += xml.close("eventDate");
									/*
									rs += xml.open("eventPlace");
										rs += xml.element("displayPlace", data.object_relation.event.place);
									rs += xml.close("eventPlace");
									*/
								rs += xml.close("event");
							rs += xml.close("subjectEvent");
						rs += xml.close("subject");
						//Funktion!!
						/*
						rs += xml.open("subject", [["lido:type","description"]]);
							rs += xml.open("subjectConcept");
								rs += xml.element("conceptID","23 D 42",[["lido:source","Iconclass"],["lido:type","local"]]);
								create_lido_term("23 D 42");
								create_lido_term("spring, 'Ver'; 'Primavera' (Ripa)","yes","search");
								create_lido_term("Ver &amp; Primavera","yes","search");
								create_lido_term("nature","yes","search");
								create_lido_term("time","yes","search");
								create_lido_term("seasons of the year (esp. personifications); 'Stagione', 'Le quattro stagione dell'anno' (Ripa)","yes","search");
								create_lido_term("stagione &amp; quattro stagione dell'anno (le) &amp; season &amp; summer &amp; winter &amp; spring &amp; autumn","yes","search");
								create_lido_term("year divided into four seasons","yes","search");
								create_lido_term("four","yes","search");
								create_lido_term("spring; Ripa: Ver; Primavera","yes","search");
							rs += xml.close("subjectConcept");
						rs += xml.close("subject");
						rs += xml.open("subject", [["lido:type","description"]]);
							rs += xml.open("subjectConcept");
								rs += xml.element("conceptID","57 A 9 :",[["lido:source","Iconclass"],["lido:type","local"]]);
								create_lido_term("57 A 9 :");
								create_lido_term("Humanity, Politeness; 'Cortesia', 'Humanità' (Ripa)","yes","search");
								create_lido_term("humanity &amp; humanità &amp; politeness &amp; cortesia &amp; courtesy","yes","search");
								create_lido_term("abstract ideas and concepts","yes","search");
								create_lido_term("abstract ideas and concepts &amp; allegory &amp; personification","yes","search");
								create_lido_term("morality","yes","search");
								create_lido_term("good and bad behaviour, moral qualities","yes","search");
								create_lido_term("morality &amp; behaviour","yes","search");
								create_lido_term("humanity; politeness; Ripa: Cortesia, Humanità","yes","search");
							rs += xml.close("subjectConcept");
						rs += xml.close("subject");
						rs += xml.open("subject", [["lido:type","description"]]);
							rs += xml.open("subjectConcept");
								rs += xml.element("conceptID","92 C 47",[["lido:source","Iconclass"],["lido:type","local"]]);
								create_lido_term("92 C 47");
								create_lido_term("specific aspects, allegorical aspects of Venus; Venus as patroness","yes","search");
								create_lido_term("Aphrodite &amp; Venus","yes","search");
								create_lido_term("classical mythology und ancient history","yes","search");
								create_lido_term("mythology &amp; ancient history &amp; history &amp; classical antiquity &amp; religion &amp; Greek &amp; Roman","yes","search");
								create_lido_term("gods in classical mythology","yes","search");
								create_lido_term("god (non-christian)","yes","search");
								create_lido_term("the great godesses of heaven, and their train","yes","search");
								create_lido_term("the story of Venus (Aphrodite)","yes","search");
								create_lido_term("Venus","yes","search");
								create_lido_term("specific aspects, allegorical aspects; Venus as patroness","yes","search");
							rs += xml.close("subjectConcept");
						rs += xml.close("subject");
						rs += xml.open("subject", [["lido:type","description"]]);
							rs += xml.open("subjectConcept");
								rs += xml.element("conceptID","92 D 3",[["lido:source","Iconclass"],["lido:type","local"]]);
								create_lido_term("92 D 3");
								create_lido_term("Graces (Charites), generally three in number; 'Gratie' (Ripa)","yes","search");
								create_lido_term("Graces &amp; three &amp; Gratie","yes","search");
								create_lido_term("classical mythology und ancient history","yes","search");
								create_lido_term("mythology &amp; ancient history &amp; history &amp; classical antiquity &amp; religion &amp; Greek &amp; Roman","yes","search");
								create_lido_term("gods in classical mythology","yes","search");
								create_lido_term("god (non-christian)","yes","search");
								create_lido_term("lesser divinities of Heaven ~ serving and attendant environment","yes","search");
								create_lido_term("serving &amp; god (non-christian) &amp; Cupid &amp; hours &amp; graces &amp; muses &amp; Nike &amp; Iris &amp; Hebe &amp; Ganymede","yes","search");
							rs += xml.close("subjectConcept");
						rs += xml.close("subject");
						rs += xml.open("subject", [["lido:type","description"]]);
							rs += xml.open("subjectConcept");
								rs += xml.element("conceptID","92 E 54 21",[["lido:source","Iconclass"],["lido:type","local"]]);
								create_lido_term("92 E 54 21");
								create_lido_term("Zephyrus abducting Flora (or Chloris), who usually scatters flowers","yes","search");
								create_lido_term("abducting &amp; Flora &amp; Chloris &amp; flower &amp; scatter","yes","search");
								create_lido_term("classical mythology und ancient history","yes","search");
								create_lido_term("mythology &amp; ancient history &amp; history &amp; classical antiquity &amp; religion &amp; Greek &amp; Roman","yes","search");
								create_lido_term("gods in classical mythology","yes","search");
								create_lido_term("god (non-christian)","yes","search");
								create_lido_term("lesser divinities of Heaven ~ phenomena of air and sky","yes","search");
								create_lido_term("air &amp; sky &amp; heaven &amp; god (non-christian)","yes","search");
								create_lido_term("gods of the winds","yes","search");
								create_lido_term("wind","yes","search");
								create_lido_term("(story of) Zephyrus (Favonius), the west wind; 'Favonio o Zeffiro' (Ripa)","yes","search");
								create_lido_term("Zephyrus &amp; wind &amp; westwind &amp; Favonio o Zeffiro","yes","search");
								create_lido_term("love affairs of Zephyrus","yes","search");
								create_lido_term("Zephyrus &amp; love affair &amp; west wind","yes","search");
							rs += xml.close("subjectConcept");
						rs += xml.close("subject");
						rs += xml.open("subject", [["lido:type","description"]]);
							rs += xml.open("subjectConcept");
								rs += xml.element("conceptID","96 A 23 51",[["lido:source","Iconclass"],["lido:type","local"]]);
								create_lido_term("96 A 23 51");
								create_lido_term("Flora in her realm: a garden full of flowers, given to her by Zephyrus","yes","search");
								create_lido_term("garden &amp; flower &amp; Zephyrus","yes","search");
								create_lido_term("classical mythology und ancient history","yes","search");
								create_lido_term("mythology &amp; ancient history &amp; history &amp; classical antiquity &amp; religion &amp; Greek &amp; Roman","yes","search");
								create_lido_term("Roman gods and legends","yes","search");
								create_lido_term("Roman &amp; legend &amp; god (non-christian)","yes","search");
								create_lido_term("Roman deities, and foreign deities included in the classical Pantheon","yes","search");
								create_lido_term("Roman gods &amp; god (non-christian)","yes","search");
								create_lido_term("female roman deities","yes","search");
								create_lido_term("god (non-christian)","yes","search");
								create_lido_term("(story of) Flora","yes","search");
								create_lido_term("Flora &amp; Primavera","yes","search");
								create_lido_term("non-aggressive, friendly or neutral activities and relationships of Flora","yes","search");
								create_lido_term("Flora","yes","search");
								create_lido_term("Flora in her realm: a garden full of flowers, given to her by Zephyrus","yes","search");
							rs += xml.close("subjectConcept");
						rs += xml.close("subject");
						rs += xml.open("subject", [["lido:type","description"]]);
							rs += xml.open("subjectConcept");
								rs += xml.element("conceptID","92 D 15 21",[["lido:source","Iconclass"],["lido:type","local"]]);
								create_lido_term("92 D 15 21");
								create_lido_term("Cupid shooting a dart","yes","search");
								create_lido_term("love &amp; Cupid &amp; bow and arrow &amp; shooting","yes","search");
								create_lido_term("mythology &amp; ancient history &amp; history &amp; classical antiquity &amp; religion &amp; Greek &amp; Roman","yes","search");
								create_lido_term("gods in classical mythology","yes","search");
								create_lido_term("god (non-christian)","yes","search");
								create_lido_term("lesser divinities of Heaven ~ serving and attendant environment","yes","search");
								create_lido_term("serving &amp; god (non-christian) &amp; Cupid &amp; hours &amp; graces &amp; muses &amp; Nike &amp; Iris &amp; Hebe &amp; Ganymede","yes","search");
								create_lido_term("(story of) Cupid, Amor (Eros)","yes","search");
								create_lido_term("Cupid &amp; love","yes","search");
								create_lido_term("non-aggressive, friendly or neutral activities and relationships of Cupid","yes","search");
								create_lido_term("Eros &amp; Amor &amp; Cupid","yes","search");
								create_lido_term("Cupid handling his weapons","yes","search");
								create_lido_term("bow and arrow &amp; arrowl","yes","search");
							rs += xml.close("subjectConcept");
						rs += xml.close("subject");
						*/
					rs += xml.close("subjectSet");
				rs += xml.close("subjectWrap");
			rs += xml.close("objectRelationWrap");
		rs += xml.close("descriptiveMetadata");
		
		add_administrative_metadata(data);
		
	rs += xml.close("lido");

	};
	
	
	var add_administrative_metadata = function(data){
	
		rs += xml.open("administrativeMetadata", [["xml:lang", "de"]]);
			rs += xml.open("rightsWorkWrap");
				rs += xml.open("rightsWorkSet");
					rs += xml.open("rightsType");
						rs += xml.element("term", data.start.rights.type);
					rs += xml.close("rightsType");
					rs += xml.open("rightsDate");
						rs += xml.element("earliestDate", data.start.rights.earliest_date);
						rs += xml.element("latestDate", data.start.rights.latest_date);
					rs += xml.close("rightsDate");
					rs += xml.open("rightsHolder");
						rs += xml.open("legalBodyName");
							rs += xml.element("appellationValue", data.start.rights.legal_body);
						rs += xml.close("legalBodyName");
					rs += xml.close("rightsHolder");
				rs += xml.close("rightsWorkSet");
			rs += xml.close("rightsWorkWrap");				
			
			rs += xml.open("recordWrap");
				rs += xml.element("recordID", data.start.record.id, [["lido:type", "local"]]);
				rs += xml.open("recordType");
					rs += xml.element("term", data.start.record.type);
				rs += xml.close("recordType");
				rs += xml.open("recordSource");
					rs += xml.open("legalBodyName");
						rs += xml.element("appellationValue", data.start.record.source);
					rs += xml.close("legalBodyName");
				rs += xml.close("recordSource");
			rs += xml.close("recordWrap");
	
			rs += xml.open("resourceWrap");
				rs += xml.open("resourceSet");
					rs += xml.element("resourceID", data.start.resource.id, [["lido:type", "local"]]);
					rs += xml.open("resourceRepresentation", [["lido:type", data.start.resource.representation_type]]);
						rs += xml.element("linkResource", data.start.resource.link);
					rs += xml.close("resourceRepresentation");
					rs += xml.open("resourceType");
						rs += xml.element("term", data.start.resource.type);
					rs += xml.close("resourceType");
					rs += xml.open("resourceSource");
						rs += xml.open("legalBodyName");
							rs += xml.element("appellationValue", data.start.resource.source);
						rs += xml.close("legalBodyName");
					rs += xml.close("resourceSource");					
				rs += xml.close("resourceSet");
			rs += xml.close("resourceWrap");
	
		rs += xml.close("administrativeMetadata");	
	
	};

	console.log(data);
	create_lido_digitalisat(data);
	
	
	return rs;

};