lido_environment.lido_generator = function(data){
	"use strict";

	var xml = new XMLString();

	xml.reset();
	xml.setElementPrefix("lido");
	
	var parent = lido_environment;

	var digitalisat = lido_environment.workflow[0];	

	var create_lido_digitalisat = function (data) {
		create_lido_entry(data);
	}

	var create_lido_term = function (term,entity,etype) {
		if (etype=="search") {
			xml.element("term", term , [["lido:addedSearchTerm",entity]]);
		}
		else if (etype=="lang") {
			xml.element("term", term , [["xml:lang",entity]]);
		}
		else if (etype=="encoding") {
			xml.element("term", term , [["lido:encodinganalog",entity]]);
		}
		else if (etype=="encoding_search") {
			xml.element("term", term , [["lido:addedSearchTerm",entity[0]],["lido:encodinganalog",entity[1]]]);
		}
		else {
			xml.element("term", term);
		};
	}

	var create_lido_entry = function (data) {
    
		xml.header();	
		xml.open("lido",[
			["xmlns:lido", "http://www.lido-schema.org"],
			["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
			["xsi:schemaLocation","http://www.lido-schema.org http://www.lido-schema.org/schema/v1.0/lido-v1.0.xsd"]
		]);

		xml.element("lidoRecID", data.start.object_id, [["lido:source","Theaterwissenschaftliche Sammlung, Universität zu Köln"],["lido:type","local"]]);
		xml.open("category");
			xml.element("conceptID",data.start.concept_id,[["lido:type","AAT"]]);
			create_lido_term(data.start.type,"de","lang");
		xml.close("category");
		xml.open("descriptiveMetadata", [["xml:lang","de"]]);
			xml.open("objectClassificationWrap");
				xml.open("objectWorkTypeWrap");
					xml.open("objectWorkType");
						xml.element("conceptID", "300264387" , [["lido:type","AAT"]]);
						var entity = new Array("yes","300264387");
						create_lido_term(data.start.type, entity ,"encoding_search");
					xml.close("objectWorkType");
				xml.close("objectWorkTypeWrap");
				xml.open("classificationWrap");
					xml.open("classification", [["lido:type","AAT:type"]]);
						xml.element("conceptID", "300264387" , [["lido:type","AAT:type"]]);
						xml.element("term", data.start.type, [["lido:addedSearchTerm","yes"]]);
					xml.close("classification");
				xml.close("classificationWrap");
			xml.close("objectClassificationWrap");
			xml.open("objectIdentificationWrap");
				xml.open("titleWrap");
					xml.open("titleSet");
						xml.element("appellationValue", data.object_identification.title,[["lido:pref","preferred"],["xml:lang","de"]]);
					xml.close("titleSet");
				xml.close("titleWrap");
				xml.open("repositoryWrap");
					xml.open("repositorySet", [["lido:type","current"]]);
						xml.open("repositoryName");
							xml.open("legalBodyName");
							xml.element("appellationValue", data.object_identification.legal_body);
							xml.close("legalBodyName");
						xml.close("repositoryName");
						xml.element("workID",data.object_identification.inventory_number,[["lido:type","inventory number"]]);
					xml.close("repositorySet");
				xml.close("repositoryWrap");
				xml.open("objectDescriptionWrap");
					xml.open("objectDescriptionSet");
						xml.element("descriptiveNoteValue",data.object_identification.descriptive_note);
					xml.close("objectDescriptionSet");
				xml.close("objectDescriptionWrap");
				xml.open("objectMeasurementsWrap");
					xml.open("objectMeasurementsSet");
						xml.open("objectMeasurements");
							xml.open("measurementsSet");						
								xml.element("measurementType",data.object_identification.measurements_type);
								xml.element("measurementUnit",data.object_identification.measurements_unit);
								xml.element("measurementValue",data.object_identification.display_object_measurements);								
							xml.close("measurementsSet");
						xml.close("objectMeasurements");						
					xml.close("objectMeasurementsSet");
				xml.close("objectMeasurementsWrap");
			xml.close("objectIdentificationWrap");
			xml.open("eventWrap");
				xml.open("eventSet");
					xml.element("displayEvent",data.event.title);
					xml.open("event");
						xml.open("eventType");
							create_lido_term(data.event.type,"de","lang");
						xml.close("eventType");
						xml.open("eventActor");
							xml.open("actorInRole");
								xml.open("actor", [["lido:type","person"]]);
									xml.element("actorID", data.event.actor.actor_id,[["lido:type","d-nb.info"],["lido:source","http://d-nb.info/gnd/" + data.event.actor.actor_id]]);
									xml.open("nameActorSet");
										xml.element("appellationValue",data.event.actor.name,[["lido:pref","preferred"]]);
										//xml.element("sourceAppellation","http://d-nb.info/gnd/118713248");
									xml.close("nameActorSet");
									xml.open("vitalDatesActor");
										xml.element("earliestDate",data.event.actor.earliest_date);
										xml.element("latestDate",data.event.actor.latest_date);
									xml.close("vitalDatesActor");
									xml.element("genderActor", data.event.actor.gender);
								xml.close("actor");
								xml.open("roleActor");
									create_lido_term(data.event.actor.role);
								xml.close("roleActor");
							xml.close("actorInRole");
						xml.close("eventActor");
						xml.open("culture");
							create_lido_term(data.event.culture);
						xml.close("culture");
						xml.open("eventDate");
							xml.open("date");
								xml.element("earliestDate",data.event.earliest_date);
								xml.element("latestDate",data.event.latest_date);
							xml.close("date");
						xml.close("eventDate");
						/*
						xml.open("eventPlace");
							xml.element("displayPlace", "");
							xml.open("place");
								xml.open("namePlaceSet");
									xml.element("appellationValue","");
								xml.close("namePlaceSet");
								xml.open("gml");
								xml.close("gml");
							xml.close("place");
						xml.close("eventPlace");
						*/
					xml.close("event");
				xml.close("eventSet");
			xml.close("eventWrap");
			xml.open("objectRelationWrap");
				xml.open("subjectWrap");
					xml.open("subjectSet");
						xml.element("displaySubject",data.object_relation.display_subject);
						xml.open("subject");
							/*
							xml.open("subjectActor");
								xml.element("displayActor","");
								xml.open("actor");
									
									xml.open("nameActorSet");
										xml.element("appellationValue","");
										xml.element("sourceAppellation","http://d-nb.info/gnd/118713248");
									xml.close("nameActorSet");
								xml.close("actor");
							xml.close("subjectActor");
							*/
							xml.open("subjectDate");
								xml.element("displayDate",data.object_relation.subject_date);
							xml.close("subjectDate");
							xml.open("subjectEvent");
								xml.element("displayEvent",data.object_relation.event.title);
								xml.open("event");
									xml.open("eventType");
										create_lido_term(data.object_relation.event.type);
									xml.close("eventType");
									xml.open("eventName");
										xml.element("appellationValue",data.object_relation.event.title);
									xml.close("eventName");
									// Das muss noch in eine Funktion
									xml.open("eventActor"); 
										xml.element("displayActorInRole",data.object_relation.event.actor.role + ": " + data.object_relation.event.actor.name);
										xml.open("actorInRole");
											xml.open("actor");
												xml.open("nameActorSet");
													xml.element("appellationValue",data.object_relation.event.actor.name);
												xml.close("nameActorSet");
											xml.close("actor");
											xml.open("roleActor");
												create_lido_term(data.object_relation.event.actor.role);
											xml.close("roleActor");
										xml.close("actorInRole");
									xml.close("eventActor");
									// bis hier
									xml.open("culture");
										create_lido_term(data.object_relation.event.culture);
									xml.close("culture");
									xml.open("eventDate");
										xml.open("date");
											xml.element("earliestDate", data.object_relation.event.earliest_date);
											xml.element("latestDate", data.object_relation.event.latest_date);
										xml.close("date");									
									xml.close("eventDate");
									/*
									xml.open("eventPlace");
										xml.element("displayPlace", data.object_relation.event.place);
									xml.close("eventPlace");
									*/
								xml.close("event");
							xml.close("subjectEvent");
						xml.close("subject");
						//Funktion!!
						/*
						xml.open("subject", [["lido:type","description"]]);
							xml.open("subjectConcept");
								xml.element("conceptID","23 D 42",[["lido:source","Iconclass"],["lido:type","local"]]);
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
							xml.close("subjectConcept");
						xml.close("subject");
						xml.open("subject", [["lido:type","description"]]);
							xml.open("subjectConcept");
								xml.element("conceptID","57 A 9 :",[["lido:source","Iconclass"],["lido:type","local"]]);
								create_lido_term("57 A 9 :");
								create_lido_term("Humanity, Politeness; 'Cortesia', 'Humanità' (Ripa)","yes","search");
								create_lido_term("humanity &amp; humanità &amp; politeness &amp; cortesia &amp; courtesy","yes","search");
								create_lido_term("abstract ideas and concepts","yes","search");
								create_lido_term("abstract ideas and concepts &amp; allegory &amp; personification","yes","search");
								create_lido_term("morality","yes","search");
								create_lido_term("good and bad behaviour, moral qualities","yes","search");
								create_lido_term("morality &amp; behaviour","yes","search");
								create_lido_term("humanity; politeness; Ripa: Cortesia, Humanità","yes","search");
							xml.close("subjectConcept");
						xml.close("subject");
						xml.open("subject", [["lido:type","description"]]);
							xml.open("subjectConcept");
								xml.element("conceptID","92 C 47",[["lido:source","Iconclass"],["lido:type","local"]]);
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
							xml.close("subjectConcept");
						xml.close("subject");
						xml.open("subject", [["lido:type","description"]]);
							xml.open("subjectConcept");
								xml.element("conceptID","92 D 3",[["lido:source","Iconclass"],["lido:type","local"]]);
								create_lido_term("92 D 3");
								create_lido_term("Graces (Charites), generally three in number; 'Gratie' (Ripa)","yes","search");
								create_lido_term("Graces &amp; three &amp; Gratie","yes","search");
								create_lido_term("classical mythology und ancient history","yes","search");
								create_lido_term("mythology &amp; ancient history &amp; history &amp; classical antiquity &amp; religion &amp; Greek &amp; Roman","yes","search");
								create_lido_term("gods in classical mythology","yes","search");
								create_lido_term("god (non-christian)","yes","search");
								create_lido_term("lesser divinities of Heaven ~ serving and attendant environment","yes","search");
								create_lido_term("serving &amp; god (non-christian) &amp; Cupid &amp; hours &amp; graces &amp; muses &amp; Nike &amp; Iris &amp; Hebe &amp; Ganymede","yes","search");
							xml.close("subjectConcept");
						xml.close("subject");
						xml.open("subject", [["lido:type","description"]]);
							xml.open("subjectConcept");
								xml.element("conceptID","92 E 54 21",[["lido:source","Iconclass"],["lido:type","local"]]);
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
							xml.close("subjectConcept");
						xml.close("subject");
						xml.open("subject", [["lido:type","description"]]);
							xml.open("subjectConcept");
								xml.element("conceptID","96 A 23 51",[["lido:source","Iconclass"],["lido:type","local"]]);
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
							xml.close("subjectConcept");
						xml.close("subject");
						xml.open("subject", [["lido:type","description"]]);
							xml.open("subjectConcept");
								xml.element("conceptID","92 D 15 21",[["lido:source","Iconclass"],["lido:type","local"]]);
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
							xml.close("subjectConcept");
						xml.close("subject");
						*/
					xml.close("subjectSet");
				xml.close("subjectWrap");
			xml.close("objectRelationWrap");
		xml.close("descriptiveMetadata");
		
		add_administrative_metadata(data);
		
	xml.close("lido");

	};
	
	
	var add_administrative_metadata = function(data){
	
		xml.open("administrativeMetadata", [["xml:lang", "de"]]);
			xml.open("rightsWorkWrap");
				xml.open("rightsWorkSet");
					xml.open("rightsType");
						xml.element("term", data.start.rights.type);
					xml.close("rightsType");
					xml.open("rightsDate");
						xml.element("earliestDate", data.start.rights.earliest_date);
						xml.element("latestDate", data.start.rights.latest_date);
					xml.close("rightsDate");
					xml.open("rightsHolder");
						xml.open("legalBodyName");
							xml.element("appellationValue", data.start.rights.legal_body);
						xml.close("legalBodyName");
					xml.close("rightsHolder");
				xml.close("rightsWorkSet");
			xml.close("rightsWorkWrap");				
			
			xml.open("recordWrap");
				xml.element("recordID", data.start.record.id, [["lido:type", "local"]]);
				xml.open("recordType");
					xml.element("term", data.start.record.type);
				xml.close("recordType");
				xml.open("recordSource");
					xml.open("legalBodyName");
						xml.element("appellationValue", data.start.record.source);
					xml.close("legalBodyName");
				xml.close("recordSource");
			xml.close("recordWrap");
	
			xml.open("resourceWrap");
				xml.open("resourceSet");
					xml.element("resourceID", data.start.resource.id, [["lido:type", "local"]]);
					xml.open("resourceRepresentation", [["lido:type", data.start.resource.representation_type]]);
						xml.element("linkResource", data.start.resource.link);
					xml.close("resourceRepresentation");
					xml.open("resourceType");
						xml.element("term", data.start.resource.type);
					xml.close("resourceType");
					xml.open("resourceSource");
						xml.open("legalBodyName");
							xml.element("appellationValue", data.start.resource.source);
						xml.close("legalBodyName");
					xml.close("resourceSource");					
				xml.close("resourceSet");
			xml.close("resourceWrap");
	
		xml.close("administrativeMetadata");	
	
	};

	console.log(data);
	create_lido_digitalisat(data);
	
	
	return xml.getString();

};