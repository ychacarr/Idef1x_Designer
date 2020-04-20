function Validation(ModalWindow){ //Валидация вводимых имён

            switch (ModalWindow){
              
              case "myModal": //Для модального окнадля создания сущности(скрыто)

                  var Entity_namelength = $('#entity_name').val().length; //Сохранение длины имени
                  var DescriptionEntitylength = $('#DescriptionEntity').val().length; //Сохранение длины описания

                  if (Entity_namelength > 0 && DescriptionEntitylength > 0){ 
                    var chk = _Repository.ValidateName($('#entity_name').val(),'Entity'); //Вызов функции из RepositoryTest.js для проверки отсутствия дубликатов
                    if (chk==true){

                        var text = "<div class='alert alert-danger'>Сущности должны иметь уникальные имена!</div>" //Предостережение и фокусировка на форму
                        $('#myModal').find(".modal-body").append(text);
                        $('#entity_name').focus();
                    }
                    else{
                    AddEntity($('#entity_name').val(), //Вызов функции из CreateEntity.js. Непосредственное создание сущности с заданными текстовыми параметрами
                                $('#DescriptionEntity').val(),
                                $("input[name='lavel']").val(),
                                80, 80);
                    $('#myModal').modal("hide"); //Сокрытие модального окна создания сущности
                  }
                  }else
                  {
                    if (Entity_namelength == 0){ //Фокус на поле имени, если оно пусто
                      $('#entity_name').focus();
                    }
                    else{
                      $('#DescriptionEntity').focus(); //Фокус на поле описания, если оно пусто
                    } 
                  }
                  break;

              case "EditModal": //Для модального окна редактирования сущности(в KB уровне при при вызове контекстного меню)

                  var EditEntityNamelength = $('#EditEntityName').val().length; //Сохранение длины "основного" имени
                  var entity_name_2length = $('#entity_name_2').val().length; //Сохранение длины пользовательского имени
                  var EditDescriptionEntitylength = $('#EditDescriptionEntity').val().length; //Сохранение длины описания
                  if (EditEntityNamelength > 0 && entity_name_2length > 0 && EditDescriptionEntitylength > 0){
                      _Repository.Edit_Entity($('#EditEntityName').val(), //Вызов функции из RepositoryTest.js для редактирования сущности
                        $('#entity_name_2').val(), $('#EditDescriptionEntity').val()); //Undefined

                        $('#' + $('#EditEntityName').val()).find('.entity-block-name').val($('#entity_name_2').val()); //Undefined
                        ///console.log($('#' + $('#EditEntityName').val()).find('.entity-block-name'));
                        $('#EditModal').modal("hide"); //Сокрытие модального окна редактирования сущности


                  }else{ 
                      if (EditEntityNamelength == 0){ 
                        $('#EditEntityName').focus() //Фокус на поле "основного" имени, если оно пусто(сейчас нельзя изменить)
                      }else{
                        if (entity_name_2length == 0){
                          $('#entity_name_2').focus() //Фокус на поле пользовательского имени, если оно пусто 
                        }else{
                          $('#EditDescriptionEntity').focus(); //Фокус на поле описания, если оно пусто
                        }
                      }
                  }
                  break;

              case "KeysModal": //Для модального окна редактирования сущности
                  var EntityID = $('#EntityName').val(); // Сохранения id
                  var KeyName = $('#KeyName').val(); // Сохранение имени ключа
                  var DataType = $('#DataType').val(); // Сохранение типа данных
                  var KeyType = $('#KeyType').val(); // Сохранение типа ключа
                  var KeyDescription = $('#KeyDescription').val(); // Сохранение описания

                  if (
                      EntityID.length > 0 &&
                      KeyName.length    > 0 &&
                      DataType.length   > 0 &&
                      KeyType.length    > 0 &&
                      KeyDescription.length > 0
                      )
                  {
                    var AttributeID;

                    if ($('#keys').val() == "New key") 
                      AttributeID = _Repository.Add_Attribute(KeyName, EntityID, KeyType, DataType, KeyDescription); //Вызов функции из RepositoryTest.js для добавления атрибута

                    else
                      if (_Repository.listAtr.filter(p => p.getId() == $('#keys').val())[0] != null) //Проверка наличия элементов в списке атрибутов
                        _Repository.Edit_Attribute($('#keys').val(), KeyName, KeyType, DataType, KeyDescription); //Вызов функции из RepositoryTest.js для редактирования атрибута

                    var EntityKeys = $("#keys" + EntityID);
                    var EntityAttr = $("#attributes" + EntityID);
                    EntityKeys.empty(); //Очищение списка ключей сущности
                    EntityAttr.empty(); //Очищение списка атрибутов сущности

                    $('#keys').empty(); //Очищение списка ключей

                    var x =_Repository.listEnt.filter(p => p.getId() == EntityID)[0].atr_lynks; //Сохранение списка ключей
                    if(x!=null) {
                    for (var i = 0; i < x.length;  i++) //Для всех элементов списка
                    {
                      if(x[i]!=null){
                      $('#keys').append($('<option></option>').attr('value', x[i].getId()).text( //Добавление типа ключа в имя атрибута
                          x[i].name + " (" + x[i].type + ")"));
                      var element = $("<div></div>", {class: "attribute"}).attr('data-repositoryId', x[i].getId()).text(x[i].name);

                      if (x[i].type == "PK") //Для PK
                      {
                        element.appendTo(EntityKeys); //Отображение имени ключа в список ключей
                      }
                      else
                      {
                        element.appendTo(EntityAttr); //Отображение имени ключа в список атрибутов
                      }
                    }
                    }
                  }

                    for (var i = 0; i < _Repository.listEnt.length; i++) //Вызов функции из CreateConnection.js
                      Refresh_Atr(_Repository.listEnt[i].getId());

                    $('#KeyName').val(''); //Обнуление значения отображаемых элементов
                    $("#DataType :nth-child(1)").attr("selected", "selected");
                    $("#KeyType :nth-child(1)").attr("selected", "selected");
                    $("#KeyDescription").val('');
                  }
                  break;
              }
}

function AAAAcreateComment(TextComment){ //Создание комментария(нереализовано)
    CommentCounter++;
    var comment_container = $('<div></div>', {
      id : "CommentId" + CommentCounter,
      class: "text-center", 
      blocktype: "comment" 
    }).css({
      //"min-width": "120px",
      //"min-height": "50px",
      "position": "absolute",
      "padding": "5px",
      "left": "130px",
      "top": "200px",
      "color": "red",
      "cursor": "pointer",
      "border": /*"1px dotted red"*/ "none"
    });

    //var text_in_comment = $('<div contenteditable="true"></div>').text(TextComment).attr("contenteditable", "true").appendTo(comment_container);

    var text_in_comment = $('<textarea rows="2"></textarea>')
    .keydown(function(e) { 
        if (e.which == 46) { $(this).remove(); } //Удаление комментария по нажатию клавиши
    })
    .val(TextComment)
    .appendTo(comment_container);

    $(comment_container).appendTo('body'); //Отображение комментария на странице

    jsPlumb.draggable(comment_container); //Создание возможности перемещать комментарий
}

/* Выбор имени сущности. Для окна редактирования сущности.*/
function EditName(EntityName){ 
    document.getElementById('EditEntityName').value = EntityName;
}

function createEntityListForConnection(list){ //Создание html списка сущностей для соединения

      var str, name;

      for(var i=1; i<_Repository.listEnt.length; i++)
      {
        str=_Repository.listEnt[i].getId(); //Дбавление  ID
        name = _Repository.listEnt[i].name; //Добавление имени
        
        list.append($('<option></option>').attr('value', str).text(name + ' - ' + str)); //Компоновка
      }
}

function createEntityListER(selected_Id){ // Создание списка сущностей для ER
      var str, name;
      for(var i = 0; i<_Repository.listEnt.length; i++) //Для всех элементов списка
      {
        str=_Repository.listEnt[i].getId(); //Сохранение ID
        name = _Repository.listEnt[i].name; //Сохранение имени
        
        $('#EditEntityName').append($('<option></option>').attr('value', str).text(str)); // Добавление сохранённых данных в окно редактирования сущности
      }
      if(selected_Id!==undefined){ 
        $('#EditEntityName option').each(function( index ){
            if($(this).val() === selected_Id)
            $(this).attr("selected","selected"); //Установка html атрибута "selected" в выбранной сущности
          });
          $('#entity_name_2').val(_Repository.listEnt.filter(p => p.getId() == selected_Id)[0].name); //установка имени сущности с соотввествующим ID
          $('#EditDescriptionEntity').val(_Repository.listEnt.filter(p => p.getId() == selected_Id)[0].description); //установка описания сущности с соотввествующим ID

      }


      $('#EditEntityName').change(function(){ //Создание обработчика событий, изменяющего имя и описания, срабатывающего при изменении элементов
          $('#entity_name_2').val(_Repository.listEnt.filter(p => p.getId()== $(this).val())[0].name);
          $('#EditDescriptionEntity').val(_Repository.listEnt.filter(p => p.getId() == $(this).val())[0].description);
      });
}

function clearElements(ModalWindow){ // Очищение значений полей
          /*
            Параметр ModalWindow - имя модального окна, в котором будут отчищаться значения полей.
          */
        switch (ModalWindow){ 
            case "EditRelationship": //Редактирование отношений
                    $('#connection_name').empty();
                    $('#entity_name_connection5').val('');
                    $('#entity_name_connection6').val('');
                    $('#verb_phrase_con').val('');
                    $('ConDescription').val('');
                    getConnectionNames($('#connection_name'));
                    $('#connection_name').val('');
                    $('input[name="edt"]:checked').prop('checked', false);
                break;
            case "myModal": //Создние сущностей
                    $('#entity_name').val('');
                    $('#DescriptionEntity').val('');
                    $('#entity_name').focus();
                break;
            case "EditModal": //Редактирование сущностей
                    $('#EditEntityName').empty();
                    $('#EditEntityName').val('');
                    $('#entity_name_2').val('');
                    $('#EditDescriptionEntity').val('');
                    createEntityListER($(".submenu").attr("data-id")) ;
                    $('#EditEntityName').focus();
                break;
            case "Many-to-many": //Создание связ много-ко-многим
                    $('#Many-to-many_label').val('');
                    $('#Many-to-many_Description').val('');
                    $('#EntityName1').empty();ей
                    $('#EntityName2').empty();
                    $('#Many-to-many_Description').val('');
                    createEntityListForConnection($('#EntityName1'));
                    createEntityListForConnection($('#EntityName2'));
                    $('#EntityName1').val('');
                    $('#EntityName2').val('');
                break;
            case "One-to-many": //Создание связей один-ко-многим
                    $('#ParentEntityName').empty();
                    $('#ChildEntityName').empty();
                    $('#verb_phrase').val('');
                    $('#One-to-many_Description').val('');
                    createEntityListForConnection($('#ParentEntityName'));
                    createEntityListForConnection($('#ChildEntityName'));
                    $('#ParentEntityName').val('');
                    $('#ChildEntityName').val('');
                break;
            case "KeysModal": //Редактирование атрибутов
                    $("#EditEntityName").val('');
                    $('#KeyName').val('');
                    $("#DataType :nth-child(1)").attr("selected", "selected");
                    $("#KeyType :nth-child(1)").attr("selected", "selected");
                    $("#KeyDescription").val('');
                    $("#keys").empty();
                    $("#EntityName").empty();
                    createEntityList($(".submenu").attr("data-id"));
                    $("#EntityName").val('');
                    $("#CreateAttribute").prop("disabled", true);
                    $("#DeleteAttribute").prop("disabled", true);
                    $("#SaveAttribute").prop("disabled", true);
                break;
            case "OpenProject": //Открытие проекта
                    makeProjectsList();
                    $('#OpenProjectButton').prop("disabled", true);
                    $('#DeleteProjectButton').prop("disabled", true);
                break;
          }
          $('.badge').text(''); $('.badge').text(_Repository.listEnt.length); // undefined
}

function getConnectionNames(list){ //Получение имён соединений

        var str, name;

        for(var i=1; i<_Repository.listRel.length; i++)
        {
          str=_Repository.listRel[i].getId();
          list.append($('<option></option>').attr('value', str).text(str)); //Добавление ID отношений в список опций
        }

        list.change(function(){ //Создание обработчика событий, изменяющего хараткеристики связи
          var parent_name =_Repository.listEnt.filter(p => p.getId() ==
                        _Repository.listRel.filter(p => p.getId() == $(this).val())[0].Get_Parent_ID())[0].getId();

          var child_name = _Repository.listEnt.filter(p => p.getId() ==
            _Repository.listRel.filter(p => p.getId() == $(this).val())[0].Get_Child_ID())[0].getId();

          var phrase = _Repository.listRel.filter(p => p.getId() == $(this).val())[0].Get_Phrase();

          var rel_description = _Repository.listRel.filter(p => p.getId() == $(this).val())[0].description;

          var rel_type = _Repository.listRel.filter(p => p.getId() == $(this).val())[0].type;
          
          $('#entity_name_connection5').val(parent_name);
          $('#entity_name_connection6').val(child_name);
          $('#verb_phrase_con').val(phrase);
          $('#ConDescription').val(rel_description);
          $("input[name='optradio'][value='" + rel_type + "']").prop('checked', true);
          $("input[name='oldRelType']").val(rel_type);
        });
}

function disableOpenProjectButton(){ //Сокрытие кнопки открытия проекта
    if ($('#ProjectsList').children().size() == 0)
    {
      $('#OpenProjectButton').prop("disabled", true);
      $('#DeleteProjectButton').prop("disabled", true);
    }
}

