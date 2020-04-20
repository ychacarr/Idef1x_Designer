var ConnectionCounter = 0;

function Refresh_Atr(entityId){
	var EntityKeys = $("#keys" + entityId);
  var EntityAttr = $("#attributes" + entityId);
        EntityKeys.empty();
        EntityAttr.empty();
	$('#keys' + entityId).empty();
	var x =_Repository.listEnt.filter(p =>p.getId() == entityId)[0].atr_lynks;
    if(x!=null){
    for (var i = 0; i < x.length;  i++)
    {
      if(x[i]!=null){
      	  var attr_name;
      	  //if (x[i].getOwnerId() != entityId)
      	  if (x[i].getMigrationId() != null)
          	attr_name = x[i].name + " (FK)";
      	  else
      	  	attr_name = x[i].name;
          var element = $("<div></div>", {class: "attribute"}).attr('data-repositoryId', x[i].getId()).text(attr_name);
          if (x[i].type == "PK" && x[i].getMigrationId() == null)
          {
            element.appendTo(EntityKeys);
          }
          else
          {
            if(x[i].getMigrationType() == IDEN_REL)
              element.appendTo(EntityKeys);
            else
            element.appendTo(EntityAttr);
          }
    	}
    }
    }
    instance.revalidate($(".block"));
} 

function createConnection(source_n, target_n, verb_phrase, type, description){
    var jsPlumbConn;

    if ($("input[name='lavel']").val() == "ER")
    	_Repository.Add_Relationship(description, source_n, target_n, type, verb_phrase, null);
    	if ($("input[name='lavel']").val() == "KB" || $("input[name='lavel']").val() == "FA")
    	{
    		if(source_n.indexOf("cluster") != -1){
          _Repository.Add_RelationshipKB(description, source_n, target_n, IDEN_REL, verb_phrase, null);
        }
        else
        _Repository.Add_RelationshipKB(description, source_n, target_n, type, verb_phrase, null);
        
        if (type == IDEN_REL || source_n.indexOf("cluster") != -1)
        {
          $("#keys" + target_n).css("border-top-left-radius", "10px");
          $("#keys" + target_n).css("border-top-right-radius", "10px");
          $("#attributes" + target_n).css("border-bottom-right-radius", "10px");
          $("#attributes" + target_n).css("border-bottom-left-radius", "10px");
        }
        if(target_n.indexOf("cluster")==-1)
    		  Refresh_Atr(target_n);
    	}

    ConnectionCounter++;

    switch (type) {
		/*Создание соединения один-ко-многм*/
		case IDEN_REL:
			var s = instance.addEndpoint(source_n, {
				endpoint: "Blank",/*["Rectangle", {width: 7, height: 2}],*/
				anchor: "Continuous",
				endpointStyle : { fill: "#797D7F" },
        
			});
			var t = instance.addEndpoint(target_n, {
				endpoint: ["Dot", {radius: 5}],
				anchor: "Continuous",
				endpointStyle : { fill: "black" },

			});
			jsPlumbConn = instance.connect({
				source: s,
				target: t,
				detachable:false,
				connector: [ "Flowchart", { stub: 100 } ],
				paintStyle: { stroke: "black", strokeWidth:1 },
				overlays:[
    				[ "Label", {
    					label: verb_phrase, 
    					id: "label" + _Repository.listRel[_Repository.listRel.length-1].getId(), 
    					padding: "5px", 
    					cssClass: "aLabel",
              events:{
                click:function(labelOverlay, originalEvent) { 
                console.log("click on label overlay for :" + labelOverlay.component); 
              }
            } 
    				} ]
  				],
          hoverClass : "myHoverClass"
			});
     jsPlumbConn.bind("click", function(conn) {
    console.log("you clicked on ", conn);
});
		break;
		/*Соединение многие-ко-многим*/
		case MANY_TO_MANY:
			var s = instance.addEndpoint(source_n, {
				endpoint: ["Dot", {radius: 5}],
				anchor: "Continuous",
				endpointStyle : { fill: "black" },
			});

			var t = instance.addEndpoint(target_n, {
				endpoint: ["Dot", {radius: 5}],
				anchor: "Continuous",
				endpointStyle : { fill: "black" },
			});

			jsPlumbConn = instance.connect({
				source: s,
				target: t,
				detachable:false,
				connector: [ "Flowchart", { stub: 100 } ],
				paintStyle: { stroke: "black", strokeWidth:1 },
				overlays:[
    				[ "Label", {
    					label: verb_phrase, 
    					id: "label" + _Repository.listRel[_Repository.listRel.length-1].getId(), 
    					padding: "5px", 
    					cssClass: "aLabel" ,
              events:{
                click:function(labelOverlay, originalEvent) { 
                console.log("click on label overlay for :" + labelOverlay.component); 
              }
            } 
    				} ]
  				]
			});

		break;

    /*Создание неидентифицирующей связи на диаграмме*/
    case NON_IDEN_REL:

      var s = instance.addEndpoint(source_n, {
        endpoint: /*"Blank",*/["Rectangle", {cssClass: "no-ident-endpoint" , width: 8, height: 8}],
        anchor: "Continuous",
        /*endpointStyle : { fill: "black" },*/
        /*paintStyle:{ outlineStroke: "black" }*/
        endpointStyle:{ fill:"white", outlineStroke:"black" },
      });

      var t = instance.addEndpoint(target_n, {
        endpoint: ["Dot", {radius: 5}],
        anchor: "Continuous",
        endpointStyle : { fill: "black" },
      });

      jsPlumbConn = instance.connect({
        source: s,
        target: t,
        detachable:false,
        connector: [ "Flowchart", { stub: 100 } ],
        paintStyle: { stroke: "black", strokeWidth: 1, dashstyle: "7 4" },
        overlays:[
            [ "Label", {
              label: verb_phrase, 
              id: "label" + _Repository.listRel[_Repository.listRel.length-1].getId(), 
              padding: "5px", 
              cssClass: "aLabel" ,
              events:{
                click:function(labelOverlay, originalEvent) { 
                console.log("click on label overlay for :" + labelOverlay.component); 
              }
            } 
            } ]
          ]
      });
    break;
    case CLUSTER_REL:
      var s = instance.addEndpoint(source_n, {
        endpoint: "Blank"/*["Rectangle", {cssClass: "no-ident-endpoint" , width: 8, height: 8}]*/,
        anchor: "Bottom",
        /*endpointStyle : { fill: "black" },*/
        /*paintStyle:{ outlineStroke: "black" }*/
        endpointStyle:{ fill:"white", outlineStroke:"black" },
      });

      var t = instance.addEndpoint(target_n, {
        endpoint: "Blank"/*["Dot", {radius: 0.1}]*/,
        anchor: "Top",
        endpointStyle : { fill: "black" },
      });

      jsPlumbConn = instance.connect({
        source: s,
        target: t,
        detachable:false,
        connector: [ "Flowchart", { stub: 100 } ],
        paintStyle: { stroke: "black", strokeWidth: 1},
        overlays:[
            [ "Label", {
              label: verb_phrase, 
              id: "label" + _Repository.listRel[_Repository.listRel.length-1].getId(), 
              padding: "5px", 
              cssClass: "aLabel" ,
              events:{
                click:function(labelOverlay, originalEvent) { 
                console.log("click on label overlay for :" + labelOverlay.component); 
              }
            } 
            } ]
          ]
      });
	}

	_Repository.listRel[_Repository.listRel.length-1].jsPlumbConn = jsPlumbConn;
}