
function modelToJSON(){ // Сохранение в формате Json
            var nodes = []
            var clusters = []
            $(".block").each(function (idx, elem) {
                var $elem = $(elem);
                var endpoints = jsPlumb.getEndpoints($elem.attr('id'));
                if($elem.attr('id').indexOf("cluster")!=-1){ // если кластер
                    clusters.push({ // сохранение кластеров
                        blockId:   $elem.attr('id'),
                        blocktype: $elem.attr('blocktype'),
                        parent: _Repository.listCategoryCluster.filter(function(item){return item.getId()==$elem.attr('id')})[0].parent,
                        child: _Repository.listCategoryCluster.filter(function(item){return item.getId()==$elem.attr('id')})[0].child, 
                        positionX: parseInt($elem.css("left"), 10),
                        positionY: parseInt($elem.css("top"), 10)
                    });
                }
                else
                    nodes.push({ // сохранение сущности
                        blockId:   $elem.attr('id'),
                        blocktype: $elem.attr('blocktype'),
                        entityname: _Repository.listEnt.filter(function(item){return item.getId()==$elem.attr('id')})[0].name,
                        description: _Repository.listEnt.filter(function(item){return item.getId()==$elem.attr('id')})[0].description, 
                        positionX: parseInt($elem.css("left"), 10),
                        positionY: parseInt($elem.css("top"), 10)
                    });
            });
            
            var connections = [];
            for(var i = 0; i < _Repository.listRel.length; i++) // сохранение связей сущности
            {
                connections.push({
                    source: _Repository.listRel[i].Get_Parent_ID(),
                    target: _Repository.listRel[i].Get_Child_ID(),
                    verb_phrase: _Repository.listRel[i].phrase,
                    type: _Repository.listRel[i].type,
                    description: _Repository.listRel[i].description
                });
            }

            var attributes = [];
            if (_Repository.listAtr.length != 0) // Сохранение атрибутов сущности
                for (var i = 0; i < _Repository.listAtr.length; i++)
                {
                    attributes.push({
                        id:             _Repository.listAtr[i].getId(),  
                        _owner_id:      _Repository.listAtr[i].getOwnerId(),
                        type:           _Repository.listAtr[i].type,
                        name:           _Repository.listAtr[i].name,
                        domainName:     _Repository.listAtr[i].domainName,
                        description:    _Repository.listAtr[i].description,
                        mig_id:         _Repository.listAtr[i].getMigrationId()!=undefined ? _Repository.listAtr[i].getMigrationId() : null,
                        mig_type:       _Repository.listAtr[i].getMigrationType()!=undefined ? _Repository.listAtr[i].getMigrationType() : null,
                    });
                }            
            
            var flowChart = {}; // создание объекта блоксхемы (совмещает все уже сохранённые данные)
            flowChart.project = "idef1x_project";
            flowChart.nodes = nodes;
            flowChart.connects = connections;
            flowChart.clusters = clusters;
            /*if ($("input[name='lavel']").val() == "KB")
            {*/
                flowChart.attributes = attributes;
            //}

            var flowChartJson = JSON.stringify(flowChart, "", 4); // конвертация блоксхемы в формат Json
    return flowChartJson;
}

function saveInBrowser(modelInJson){  // сохраняет объект в браузере на долгое время
    //Save project to localStorage
    localStorage.setItem($('#ProjectName').val(), modelInJson); 
}

function saveInSession(modelInJson){ // сохраняет объект в браузере на продолжительность сессии(останется после перезагрузки, но исчезнет после перезапуска браузера)
    //Save project to localStorage
    if ($('.block').length != 0)
        sessionStorage.setItem('CurrentProject', modelInJson); 
}

function saveInFile(modelInJson){ // сохраняет модель в формате текстового файла
    //Save project in file
    var blob = new Blob([modelInJson], {type: "text/plain;charset=utf-8"});
    saveAs(blob, $('#ProjectName').val() + ".txt");
}

function loadFromSession(){ // загружает модель из "коротковременного" хранилища
    var load_pr = sessionStorage.getItem('CurrentProject');
    if (load_pr != null)

        createModel(load_pr);
}

function loadFromFile(){ // загружает модель из файла
    document.getElementById('files').click();

    $('#files').change(function(){
        var files = document.getElementById('files').files;
        var file = files[0];
        var reader = new FileReader();

        reader.onload = function(event) {
            var flowChartJson = event.target.result;
            createModel(flowChartJson);
        };

        reader.readAsText(file);
    }); 
}

function loadFromLocalStorage(ProjectName){ // загружает модель из долговременного хранилища
    if (ProjectName == undefined){
        $("#ProjectsList").focus();
    }else{
        var load_pr = localStorage.getItem(ProjectName);
        createModel(load_pr);
    }
}

function deleteFromLocalStorage(ProjectName){ // удалить из долговременного хранилища
    if (ProjectName != undefined){
        localStorage.removeItem(ProjectName);
        makeProjectsList();
    }
}

function makeProjectsList(){ // создаёт список проектов
    var pr = null;
    var list = $('#ProjectsList');
    list.empty();
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        try
        {
            pr = JSON.parse(localStorage.getItem(key)); // парсит долговременное хранилище, преобразовывая в json формат
        }
        catch(e)
        {
            pr = null;
        }
        if (pr != null && pr.project == 'idef1x_project'){
            $('<option></option>', { value: key, text: key }).appendTo(list); // создаёт окно выбора
        } 
    }

    $('#ProjectsList').change(function(){
        if ($(this).children().size() != 0) // если есть объекты в списке , то
        {
            $('#OpenProjectButton').prop("disabled", false); // активировать кнопки создания и удаления прокта
            $('#DeleteProjectButton').prop("disabled", false);
        }
    });
}

function createModel(flowChartJson){ // воспроизведение модели
    try
    {
        var flowChart = JSON.parse(flowChartJson); // парсинг переданного объекта
        var nodes = flowChart.nodes; // сохранение сущностей
      
        $.each(nodes, function( index, elem ) { // Добавление сущностей
            AddEntity(elem.entityname, elem.description, $("input[name='lavel']").val() ,elem.positionX, elem.positionY);
        });
        
        var clusters = flowChart.clusters;
        $.each(clusters, function( index, elem ) { // добавление кластеров
            AddCategoryCluster(elem.parent, elem.child, elem.positionX, elem.positionY);
        });
        
           
        var connections = flowChart.connects;
        $.each(connections, function( index, elem ) { // добавление соединений
            createConnection(elem.source, elem.target, elem.verb_phrase, elem.type, elem.description);
        });
        console.log(flowChart.attributes);
        if (/*$("input[name='lavel']").val() == "KB" &&*/ flowChart.attributes.length != null)
        {
            var attributes = flowChart.attributes; // добавления атрибутов через функция из RepositoryTest
            $.each(attributes, function( index, elem ) {

                //if(elem.mig_id == null){
                _Repository.Add_Attribute_AfterLoad(elem.name, elem._owner_id, elem.type, elem.domainName, 
                            elem.description, elem.mig_id, elem.mig_type);
                //}
                for (var i = 0; i < _Repository.listEnt.length; i++)  // обновить атрибуты на сущностях
                {
                    Refresh_Atr(_Repository.listEnt[i].getId());
                }
            });
        }

    }
    catch(e) // ошбика открытия
    {
        console.log(e);
        console.log("Open project file error!");
    }
}
$(function() {
$(".submenu__item").click(function(){ // спрятать всплывающее меню по нажатию
    $(".submenu").hide();
});
$("#tpdf").click(function(){ // создание таблицы сущностей для сохранения в pdf формате
    var content = "<table border='1'>"
    if(_Repository.listEnt.length!=null)
    {
    for(i=1; i<_Repository.listEnt.length+1; i++){
    content += '<tr><td>' +  _Repository.listEnt[i].name + '</td></tr>';
    }
    content += "Сущности</table>"
    }
    $(".pdf-pre").append(content);
});

$(".savePDFs").click(function(){ // Создание pdf документа из элементов соотвествующего класса (упоминание этого класса я нигде больше не нашёл)
var doc = new jsPDF();          
var source = window.document.getElementById("SavePDFModal");
doc.fromHTML(
    source,
    15,
    15);
doc.output("dataurlnewwindow");
});
});