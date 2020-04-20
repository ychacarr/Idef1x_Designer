var entityCounter = 0; 

function DeleteEntity(EntityId){  // Удаление сущности
    if (EntityId.length > 0){
      instance.remove(EntityId); // Удаление связей сущности из "объекта страницы браузера", созданного в core.js
      _Repository.Delete_Entity(EntityId); // Вызов функции из RepositoryTest.js
  }else{
      $('#EditEntityName').focus(); // Фокусирование на форме редактирования сущности
  }
}

function AddEntity(EntityName, Description, Lavel, positionX, positionY){ // Добвление сущности

    Lavel = $("input[name=lavel]").val(); 
    var RBlock = _Repository.Add_Entity(EntityName, IND_ENT, Description); // Вызов фукнции из RepositoryTest.js и сохраняение объекта типа Entity
    var entityID = RBlock.getId();
    var entitySysId = RBlock.getSysId();
    var Entity = $('<div></div>', { // Сохранение кода, устанавливающего позицию данной сущности, в переменную
        id: entityID,
        blocktype: "entity",
        class: "block"
    }).css({
        "top": positionY,
        "left": positionX,
    });

    var Keys, Attributes;

    if (Lavel == "ER"){ // На ER уровне:

        var Content = $('<div></div>').attr('data', 'name').text(EntityName).css({ 
            "min-height": "10px",
            "flex-grow": 1,
            "outline": "2px solid black",
            "padding": "2px",
        }).appendTo(Entity);  // Добавление кода, отображающего имя сущности, в заранее сохранённый код, отвечающий за её позицию 
    }
    else if(Lavel == "KB" || Lavel == "FA"){ // На KB или FA уровне:
        var Name = $('<div><input type="text" style="width: 90%;display: inline-block"></input></div>').appendTo(Entity); // Модификация базиса внешнего вида сущности под ER и FA уровень
        $(Entity).find("input").css({"padding": "1px"}).attr('data', 'name').val(EntityName).addClass("entity-block-name").after("<span style='display: inline-block'>/" + entitySysId++ +"</span>"); // Установка отображения ID сущности
            Keys = $('<div></div>', {id: "keys" + entityID}).css({
                "flex-grow": 1,
                "display": "flex",
                "flex-direction": "column",
                "justify-content": "flex-start",
                "align-items": "stretch",
                "border": "2px solid black"
            }).appendTo(Entity); // Установка верхней части объекта сущности, отображающей ключ

            Attributes = $('<div></div>', {id: "attributes" + entityID}).css({
                "flex-grow": 2,
                "border": "2px solid black",
                "border-top": "none",
                "min-height": "10px"
            }).appendTo(Entity); // Установка нижней верхней части объекта сущности, отображающей атрибуты
        }
        $(Entity).appendTo('body'); // Перемещение готовой сущности на страницу браузера

        instance.draggable(jsPlumb.getSelector(".block"), { // Добавление возможности перемещать по сетке объект класса "block", в частности сущностей
            filter:".ui-resizable-handle", // Перерисовка связей
            grid:[10,10]     
        });  
        $(Entity).dblclick(function() { // Нереализованная логика для "даблклика" на сущность
            alert( "Handler for .dblclick() called." );
        });

        $(Entity).find(".entity-block-name").on("click", function() { // Снятие свойств типичного класса блока имени по нажатию 
          
            $(this).removeClass("entity-block-name");
        
        }); 
        $(Entity).find(".entity-block-name").on("change", function() { // Возврат свойств класса после изменения поля имени
          
            $(this).addClass("entity-block-name");
        
        });

        $(Entity).resizable({  // Позволяет изменять размер 
            resize : function(event, ui) {    
                instance.repaint(ui.helper); // Перерисоввка связей
                instance.revalidate(Entity);
            },
            handles: "all"
        });
        $(Entity).contextmenu(function(e) { // Вызов контекстного меню(правый клик на сущность)
            e.preventDefault(); // Блок дефолтного меню
            ///createDymanicContextMenu(ENTITY_MENU);
            $(".submenu").show(); // Вывод меню и настройка его внешнего вида
            $(".submenu").css('left',(e.pageX+10)+'px').css('top',(e.pageY+10)+'px'); 
            $(".submenu").attr("data-id",$(Entity).attr("id"));
            return false;
        });


    }
    function AddCategoryCluster($parentBlockId,$childBlocksId,positionX, positionY){ // Добавление кластера категоризации

        var cluster = _Repository.Add_CategoryCluster(); 
        var entity = _Repository.listEnt.filter(p=>p.getId() == $parentBlockId); // Поиск id родительской сущности
        cluster.parent = $parentBlockId;
        var Entity = $('<div></div>', { // Сохранение параметров выбора сущности в переменную
            id: cluster.getId(),
            blocktype: "cluster",
            class: "block blocky"
        });
        if(positionX!=undefined && positionY != undefined){ // Установка позиции сущности
            $(Entity).css({
                "top": positionY,
                "left": positionX,
            })
        }
        var Content = $('<div></div>').css({ 
            "min-height": "30px",
            "width": "70px",
            "padding": "2px",
            "background": "url(images/category.png) no-repeat ",
            "background-size": "contain"
        }).appendTo(Entity); // Добавление облика дискриминатора
        $(Entity).appendTo('body');  // Добавление готового дискриминатора на страницу 

        instance.draggable(jsPlumb.getSelector(".block"), {  // Добавление возможности перемещать дискриминатор по сетке
            filter:".ui-resizable-handle", // Перерисовка 
            grid:[10,10]         
        });  

        $(Entity).contextmenu(function(e) {  // Вызов контекстного меню для дискриминатора(нереализовано)
            e.preventDefault();
            //createDymanicContextMenu(CLUSTER_MENU);
            $(".submenu").show();
            $(".submenu").css('left',(e.pageX+10)+'px').css('top',(e.pageY+10)+'px'); 
            $(".submenu").attr("data-id",$(Entity).attr("id"));
            return false;
        });
        return cluster;
    }  
