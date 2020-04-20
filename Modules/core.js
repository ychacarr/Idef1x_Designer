// Блок с обучением.
var IDEF1XTutorial =[
     {  num: 0,
        tutorial_title: "Добро пожаловать в IDEF1X Designer!",
        tutorial_desc: "Вы желаете пройти обучение по использованию системы?",
        width: "0",
        height: "0",
        top: "0",
        right: "0", 
        transform: "translate3d(0,0,0)"

    },
    {   num: 1,
        tutorial_title: "Инструменты",
        tutorial_desc: "В правом верхнем углу располагаются инструменты для создания объектов IDEF1X",
        width: "415px",
        height: "75px",
        top: "0",
        right: "0", 
        transform: "translate3d(620px,-1000px,0)"
    },
    {   num: 2,
        tutorial_title: "Создание сущности",
        tutorial_desc: "Для создания сущности необходимо кликнуть на иконку сущности в верхнем правом меню. Затем кликнуть в любом месте рабочей области для создания объекта",
        width: "50px",
        height: "75px",
        top: "0",
        right: "0", 
        transform: "translate3d(742px,-1000px,0)"
    },
    {   num: 3,
        tutorial_title: "Создание связи",
        tutorial_desc: "Для создания связи необходимо кликнуть на одну из необходимых иконок в верхнем правом меню. Затем кликнуть в любом месте рабочей области для создания объекта",
        width: "150px",
        height: "75px",
        top: "0",
        right: "0", 
        transform: "translate3d(790px,-1000px,0)"
    },
    {   num: 4,
        tutorial_title: "Уровни проектирования",
        tutorial_desc: "В левом верхнем углу панели находятся уровни проектирования. Для переключения между ними достаточно нажать на соотствующий иконку уровня",
        width: "120px",
        height: "75px",
        top: "0",
        right: "0", 
        transform: "translate3d(-720px,-1000px,0)"
    },
        {   num: 5,
        tutorial_title: "Завершение",
        tutorial_desc: "Ознакомление с основными функциями IDEF1X Designer завершено!",
        width: "0",
        height: "0",
        top: "0",
        right: "0", 
        transform: "translate3d(0,0,0)"
    }

    ];



var instance;
$(function() {
    if(parseInt(getCookie("show_tutorial")) == 1 || getCookie("show_tutorial") == undefined)   {
        $(".tutorial").css("display","block");
        $(".circle-text").css("display","block");
    }

    instance = window.jsp = jsPlumb.getInstance({});
    var c = false;
    $("#cr-e").on("click", function()   {
        var self =  $(this);
        self.addClass("icons_block--click");
        c = true;
     $(".my-container").mousemove( 
        function (pos)  { 

            if(c)   {
                
                $("#floatingmes").show();
                $("#floatingmes").css('left',(pos.pageX+10)+'px').css('top',(pos.pageY+10)+'px'); 
            
            }

        });
        $(".my-container").bind('click', function(event) {
            self.removeClass("icons_block--click");
            $("#floatingmes").hide();
            c = false;
            AddEntity("Сущность", "", $(".current_lvl").val(), event.clientX, event.clientY);
            $(this).unbind( "click" );

        });
        
    }); 
   $(".create-categories").on("click", function()  {
        с = true;
        var self =  $(this);
        self.addClass("icons_block--click");
        var i = 0;
        var source_n;
        var source_t;
        $(".my-container").mousemove( 

            function (pos) { 
                if(c){
                    
                    $("#floatingmes").show();
                    $("#floatingmes").css('left',(pos.pageX+10)+'px').css('top',(pos.pageY+10)+'px'); 
              
                }   
        });

        $(".block").bind('click', function(event) {
            i++;
            if(i === 1){
               
               source_n = $(this).attr("id");
               //$this.find(".entity-block-name").addClass("selected-block");
            }
            else
            if( i === 2 ){
                self.removeClass("icons_block--click");
                source_t = $(this).attr("id");
                var cluster = AddCategoryCluster(source_n);
                createConnection(source_n ,cluster.getId(),"",CLUSTER_REL,'description');
                createConnection(cluster.getId(), source_t, 'фраза', CLUSTER_REL, 'description');
                $("#floatingmes").hide();
                c = false;
                $(".block").unbind( "click" );
            
            }
        });
        
    }); 

   $(".create-connections").on("click", function(){
        var self =  $(this);
        self.addClass("icons_block--click");
        var i = 0;
        var source_n;
        var source_t;
        с = true;
    $(".my-container").mousemove( 

        function (pos) { 
            
            if(c){
                
                $("#floatingmes").show();
                $("#floatingmes").css('left',(pos.pageX+10)+'px').css('top',(pos.pageY+10)+'px'); 
            
            }   
        });
        $(".block").bind('click', function(event) {
            
            var $this = $(this);
            i++;
            
            if(i === 1){
               
               source_n = $(this).attr("id");
               $this.find(".entity-block-name").addClass("selected-block");
            }
            else
            
            if( i === 2 ){
                self.removeClass("icons_block--click");
                source_t = $(this).attr("id");
                $(".entity-block-name").removeClass("selected-block")
                if(source_n.indexOf("cluster") != -1)
                    
                    createConnection(source_n, source_t, 'фраза', CLUSTER_REL, 'description');  

                else

                    createConnection(source_n, source_t, 'фраза', 'Identificate', 'description');
                    $("#floatingmes").hide();
                    c = false;
                    $(this).unbind( "click" );
            
            }
        });
        
    }); 

$(".confirm-btn").on("click", function(){
    
    var tutorialObjDiv = $(".circle-text");
    var tutorial_block =  $(".tutorial");
    var num = parseInt($(".circle-text").attr("data-tutorial-num"));
    num++;
    
    if(num == IDEF1XTutorial.length-1){
            $(".circle-text").attr("data-tutorial-num",IDEF1XTutorial.length-1);
            $(this).html("Закрыть");
           
        }
    else
        if(num == IDEF1XTutorial.length){
            tutorial_block.hide();
            tutorialObjDiv.hide();
        }
        else
        if(num >= 1 ){
            if(num == 1){
            $(this).html("Далее");
            $(".cancel-btn").html("Назад");
            $(".dont-show-tutorial").css("display","none");
        }
        $(".circle-text").attr("data-tutorial-num",num);
    }
   
    var tutor_title = tutorialObjDiv.find(".tutorial-text").find(".tutorial-title");
    var tutor_desc = tutorialObjDiv.find(".tutorial-text").find(".tutorial-desc");
   
    IDEF1XTutorial.forEach(function(item, i, arr) {
    
    if(parseInt(arr[i].num) === num){
        tutor_title.html(arr[i].tutorial_title);
        tutor_desc.html(arr[i].tutorial_desc);
        tutorial_block.css("width",arr[i].width);
        tutorial_block.css("height",arr[i].height);
        tutorial_block.css("top",arr[i].top);
        tutorial_block.css("right",arr[i].right);
        if(arr[i].transform != undefined){
            tutorial_block.css("transform",arr[i].transform);
        }
    }

});
});
$(".cancel-btn").on("click", function(){
    var tutorialObjDiv = $(".circle-text");
    var num = parseInt($(".circle-text").attr("data-tutorial-num"));
    num--;
    var tutorial_block = $(".tutorial");
    if(num >= 0){
        if(num == 0)
        {
            $(this).html("Нет");
            $(".confirm-btn").html("Да"); 
            $(".dont-show-tutorial").css("display","block");
        }
            $(".confirm-btn").html("Далее"); 
            $(".circle-text").attr("data-tutorial-num",num); 
    }
    else
        if(num < 0){
            tutorial_block.hide();
            tutorialObjDiv.hide();
            $(".circle-text").attr("data-tutorial-num",0);
            if($(".dont-show-tutorial").find("input:checked").length!=0)
                    document.cookie = "show_tutorial=0";
               else
                    document.cookie = "show_tutorial=1";
            return;
        }
    
    var tutor_title = tutorialObjDiv.find(".tutorial-text").find(".tutorial-title");
    var tutor_desc = tutorialObjDiv.find(".tutorial-text").find(".tutorial-desc");
    
    IDEF1XTutorial.forEach(function(item, i, arr) {
    
    if(parseInt(arr[i].num) === num) {
        tutor_title.html(arr[i].tutorial_title);
        tutor_desc.html(arr[i].tutorial_desc);
        tutorial_block.css("width",arr[i].width);
        tutorial_block.css("height",arr[i].height);
        tutorial_block.css("top",arr[i].top);
        tutorial_block.css("right",arr[i].right);
        if(arr[i].transform!= undefined){
            tutorial_block.css("transform",arr[i].transform);
        }
    }
});
});

    loadFromSession();
    $(".test").click(function(){
      saveInSession(modelToJSON());
    });
    $(".other").click(function(){
      saveInSession(modelToJSON());
    });

    $(".save_in_browser").click(function(){
      if ($('#ProjectName').val() != "")
        saveInBrowser(modelToJSON());
    });

    $(".save_in_file").click(function(){
      if ($('#ProjectName').val() != "")
        saveInFile(modelToJSON());
    });
    $(".entity-block-name").change(function(){
       
        var id = $(this).closest(".block").attr("id");
        console.log(id);
        var ent = _Repository.listEnt.filter(p=>p.getId() == id )[0];
        if(ent !=null || ent !=undefined){
            ent.name = $(this).val();
        }
    });
});


function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
/*function createDymanicContextMenu(type){
    $(".my-container .submenu").empty();
    switch (type) {
        //Создание соединения один-ко-многм
        case ENTITY_MENU:
            $(".my-container .submenu").append('<p class="submenu__item" data-toggle="modal" data-target="#EditModal">Редактировать</p>').attr('onclick','clearElements("EditModal")').append('<p class="submenu__item" data-target="#KeysModal">Атрибуты</p>').attr('onclick','clearElements("KeysModal")').append('<p class="submenu__item">Соединения</p>');
            break;
        case CLUSTER_MENU:
            $(".my-container .submenu").append('<p class="submenu__item">Статус</p>');
            break;
        }
}*/



