var ConnectionCounter = 0;

function Refresh_Atr(entityId){
	var EntityKeys = $("#keys" + entityId); // Запись id в ключи и атрибуты
  var EntityAttr = $("#attributes" + entityId);
        EntityKeys.empty(); // Очищает текст и удаляет дочерние элементы в DOM
        EntityAttr.empty(); // Очищает текст и удаляет дочерние элементы в DOM
	$('#keys' + entityId).empty(); // странный момент в повтором предыдущего действия 
	var x =_Repository.listEnt.filter(p =>p.getId() == entityId)[0].atr_lynks; // Сохранение в переменню списка атрибутов нужной сущности
    if(x!=null){
    for (var i = 0; i < x.length;  i++) // Для каждого атрибутов 
    {
      if(x[i]!=null){ 
      	  var attr_name;
      	  //if (x[i].getOwnerId() != entityId)
      	  if (x[i].getMigrationId() != null) 
          	attr_name = x[i].name + " (FK)"; // Если существует связь с каким-либо элементом, добавить (FK) и сохранить переменную
      	  else
      	  	attr_name = x[i].name; // Если связи не существует, просто сохранить переменную
          var element = $("<div></div>", {class: "attribute"}).attr('data-repositoryId', x[i].getId()).text(attr_name); // устанавливает у загтовленного блока атрибут data-repositoryId со значением id и добавляет текст с именем атрибута
          if (x[i].type == "PK" && x[i].getMigrationId() == null)  
          {
            element.appendTo(EntityKeys); // добавить в список отображающихся ключей созданный элемент, если тип миграции PK
          }
          else
          {
            if(x[i].getMigrationType() == IDEN_REL) // Если миграция идентифицирована(см. переменную в RepositoryTest), то добавить в список отображающихся ключей
              element.appendTo(EntityKeys);
            else
            element.appendTo(EntityAttr); // Если условия невыполнены, то добавить элемент в атрибуты сущности
          }
    	}
    }
    }
    instance.revalidate($(".block")); // перерисовывает связи на странице
} 

function createConnection(source_n, target_n, verb_phrase, type, description){ // Создать связь
    var jsPlumbConn;

    if ($("input[name='lavel']").val() == "ER") // Если выше ER уровня 
    	_Repository.Add_Relationship(description, source_n, target_n, type, verb_phrase, null); // вызов функции из RepositoryTest
    	if ($("input[name='lavel']").val() == "KB" || $("input[name='lavel']").val() == "FA") // Если выше KB уровня
    	{
    		if(source_n.indexOf("cluster") != -1){ // Если в id нет строки "cluster", то
          _Repository.Add_RelationshipKB(description, source_n, target_n, IDEN_REL, verb_phrase, null); // Вызов функции из RepositoryTest c типом "Identificate"
        }
        else
        _Repository.Add_RelationshipKB(description, source_n, target_n, type, verb_phrase, null); //Вызов функции из RepositoryTest c переданным типом 
        
        if (type == IDEN_REL || source_n.indexOf("cluster") != -1) // Добавление нужных css стилей для некластеризованных или неидентицифированных связей
        {
          $("#keys" + target_n).css("border-top-left-radius", "10px");
          $("#keys" + target_n).css("border-top-right-radius", "10px");
          $("#attributes" + target_n).css("border-bottom-right-radius", "10px");
          $("#attributes" + target_n).css("border-bottom-left-radius", "10px");
        }
        if(target_n.indexOf("cluster")==-1) // Обновить атрибуты, если цель не является кластером
    		  Refresh_Atr(target_n);
    	}

    ConnectionCounter++; // Количество связей 

    switch (type) { // В зависимости от типа связи
		/*Создание соединения один-ко-многм*/
		case IDEN_REL: // Если идентифицрована
			var s = instance.addEndpoint(source_n, { // Рисует невидимую для пользователя конечную точку(в связи) для источника
				endpoint: "Blank",/*["Rectangle", {width: 7, height: 2}],*/
				anchor: "Continuous",
				endpointStyle : { fill: "#797D7F" },
        
			});
			var t = instance.addEndpoint(target_n, { // Рисует видимую конечную точку для цели
				endpoint: ["Dot", {radius: 5}],
				anchor: "Continuous",
				endpointStyle : { fill: "black" },

			});
			jsPlumbConn = instance.connect({ // создание связи на странице
				source: s, 
				target: t,
				detachable:false,
				connector: [ "Flowchart", { stub: 100 } ], // создание видимой связи
				paintStyle: { stroke: "black", strokeWidth:1 }, 
				overlays:[ // Отрисовка оверлея(ярлык на связи)
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
     jsPlumbConn.bind("click", function(conn) { // Логика для клика
    console.log("you clicked on ", conn);
});
		break;
		/*Соединение многие-ко-многим*/
		case MANY_TO_MANY:
			var s = instance.addEndpoint(source_n, { //Рисует видимую конечную точку для источника
				endpoint: ["Dot", {radius: 5}],
				anchor: "Continuous",
				endpointStyle : { fill: "black" },
			});

			var t = instance.addEndpoint(target_n, { //Рисует видимую конечную точку для цели
				endpoint: ["Dot", {radius: 5}],
				anchor: "Continuous",
				endpointStyle : { fill: "black" },
			});

			jsPlumbConn = instance.connect({ // Создание связи на странице
				source: s,
				target: t,
				detachable:false,
				connector: [ "Flowchart", { stub: 100 } ], // Отрисовка видимой связи
				paintStyle: { stroke: "black", strokeWidth:1 },
				overlays:[  // Отрисовка оверлея(ярлык на связи)
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
    case NON_IDEN_REL: // Если неидентифицрована

      var s = instance.addEndpoint(source_n, { // Рисует видимую конечную точку(прямоугольник) для источника 
        endpoint: /*"Blank",*/["Rectangle", {cssClass: "no-ident-endpoint" , width: 8, height: 8}],
        anchor: "Continuous",
        /*endpointStyle : { fill: "black" },*/
        /*paintStyle:{ outlineStroke: "black" }*/
        endpointStyle:{ fill:"white", outlineStroke:"black" },
      });

      var t = instance.addEndpoint(target_n, { //Рисует видимую конечную точку для цели
        endpoint: ["Dot", {radius: 5}],
        anchor: "Continuous",
        endpointStyle : { fill: "black" },
      });

      jsPlumbConn = instance.connect({ //Создание связи на странице
        source: s,
        target: t,
        detachable:false,
        connector: [ "Flowchart", { stub: 100 } ],
        paintStyle: { stroke: "black", strokeWidth: 1, dashstyle: "7 4" },
        overlays:[ // Отрисовка оверлея(ярлык связи)
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
    case CLUSTER_REL: // Для кластера
      var s = instance.addEndpoint(source_n, { //  //Рисует невидимую конечную точку для источника
        endpoint: "Blank"/*["Rectangle", {cssClass: "no-ident-endpoint" , width: 8, height: 8}]*/, 
        anchor: "Bottom",
        /*endpointStyle : { fill: "black" },*/
        /*paintStyle:{ outlineStroke: "black" }*/
        endpointStyle:{ fill:"white", outlineStroke:"black" },
      });

      var t = instance.addEndpoint(target_n, { // Рисует невидимую конечную точку для цели
        endpoint: "Blank"/*["Dot", {radius: 0.1}]*/,
        anchor: "Top",
        endpointStyle : { fill: "black" },
      });

      jsPlumbConn = instance.connect({  // Создание связи на странице
        source: s,
        target: t,
        detachable:false,
        connector: [ "Flowchart", { stub: 100 } ],
        paintStyle: { stroke: "black", strokeWidth: 1},
        overlays:[ // Отрисовка оверлея(ярлык связи)
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

	_Repository.listRel[_Repository.listRel.length-1].jsPlumbConn = jsPlumbConn; // Обновление связей
}