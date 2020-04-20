
function deleteAttribute(){
	var AttributeID = $('#keys').val();

	$('#KeyName').val('');
	$('#KeyDescription').val('');

	if (AttributeID == "New key")
	{
		$('#keys option:selected').remove();
		return;
	}
	//Удаление атрибута из диаграммы
	$('div[data-repositoryId=' + AttributeID + ']').remove();
  jsPlumb.revalidate($(".block"));

	//Удаление атрибута из репозитория
	_Repository.Delete_Attribute(AttributeID, 0);

  for (var i = 1; i < _Repository.listEnt.length; i++)
    {
        Refresh_Atr(_Repository.listEnt[i].getId());
    }
	//Удаление атрибута из формы
	$('#keys').empty();
	var x =_Repository.listEnt.filter(p => p.getId() == $('#EntityName').val())[0].atr_lynks;
	for (var i = 0; i < x.length;  i++)
	{
	   if(x[i]!=null)
	   $('#keys').append($('<option></option>').attr('value', x[i].getId()).text(
	        x[i].name + " (" + x[i].type + ")"));
	}
	if ($('#keys option').length == 0)
		$("#SaveAttribute").prop("disabled", false);
}

function deleteRelationship(){
  var relId = $('#connection_name').val();
  //var parentId = _Repository.listRel.searchById(relId).Get_Parent_ID();
  var childId = _Repository.listRel.filter(p => p.getId() == relId)[0].Get_Child_ID();
  //Удаление связи из диаграммы
  jsPlumb.detach(_Repository.listRel.filter(p => p.getId() == $('#connection_name').val())[0].jsPlumbConn);
  //Удаление связи из репозитория
  _Repository.Delete_Relationship($('#connection_name').val(),1);

  if ($("input[name='lavel']").val() == "KB" || $("input[name='lavel']").val() == "FA")
  {
    for (var i = 1; i < _Repository.listEnt.length; i++)
    {
        Refresh_Atr(_Repository.listEnt[i].getId());
    }

    for (var i = 1; i < _Repository.listRel.length; i++)
    {
      if(_Repository.listRel[i].Get_Child_ID() == childId || 
          _Repository.listRel[i].Get_Parent_ID() == childId)
        if (_Repository.listRel[i].type == IDEN_REL)
            return;
    }

    $("#keys" + childId).css("border-top-left-radius", "0");
    $("#keys" + childId).css("border-top-right-radius", "0");
    $("#attributes" + childId).css("border-bottom-right-radius", "0");
    $("#attributes" + childId).css("border-bottom-left-radius", "0");
  }
}

function saveRelationship(){

  if ($("input[name='oldRelType']").val() != $('input[name=edt]:checked').val())
  {
      deleteRelationship();
      createConnection(
                        $('#entity_name_connection5').val(),
                        $('#entity_name_connection6').val(),
                        $('#verb_phrase_con').val(),
                        $('input[name=edt]:checked').val(),
                        $('#ConDescription').val()
                      );
  }
  else
  {
    var label = _Repository.listRel.filter(p => p.getId() == $('#connection_name').val())[0]
                            .jsPlumbConn.getOverlay('label' + $('#connection_name').val()); 
    label.setLabel($('#verb_phrase_con').val());

    _Repository.Edit_Relationship($('#connection_name').val(),
                                $('#ConDescription').val(), 
                                $('#verb_phrase_con').val(),
                                );
  }
}

var showKeysHandler = function(id){
    $('#keys').empty();
    var x =_Repository.listEnt.filter(p => p.getId() == id)[0].atr_lynks;
        console.log(x);
      if(x!=null) {
          for (var i = 0; i < x.length;  i++)
          {
            if(x[i]!=null)
              $('#keys').append($('<option></option>').attr('value', x[i].getId()).text(
              x[i].name + " (" + x[i].type + ")"));
          }
        }
      $("#CreateAttribute").prop("disabled", false);
      $("#DeleteAttribute").prop("disabled", false);
}

    
function createEntityList(selected_Id){
    var str, name;

    for(var i = 0; i<_Repository.listEnt.length; i++)
    {
      str = _Repository.listEnt[i].getId();
      name = _Repository.listEnt[i].name;
      
      $('#EntityName').append($('<option></option>').attr('value', str).text(name));
    }

    if(selected_Id!=undefined){
        $('#EntityName option').each(function( index ){ 
            if($(this).attr('value') == selected_Id)
              $(this).attr("selected","selected");
        });
        showKeysHandler(selected_Id);
      }
    $('#EntityName').change(function(){
      $('#keys').empty();
        var x =_Repository.listEnt.filter(p => p.getId() == $(this).val())[0].atr_lynks;
          if(x!=null) {
              for (var i = 0; i < x.length;  i++)
              {
                if(x[i]!=null)
                  $('#keys').append($('<option></option>').attr('value', x[i].getId()).text(
                  x[i].name + " (" + x[i].type + ")"));
              }
          }
      $("#CreateAttribute").prop("disabled", false);
      $("#DeleteAttribute").prop("disabled", false);
    });
    $('#keys').change(function(){
        var AttributeID = $('#keys').val();
        var AttributeName = _Repository.listAtr.filter(p => p.getId() == AttributeID)[0].name;
        var AttributeDomain = _Repository.listAtr.filter(p => p.getId() == AttributeID)[0].domainName;
        var AttributeType = _Repository.listAtr.filter(p => p.getId()== AttributeID)[0].type;
        var AttributeDescription = _Repository.listAtr.filter(p => p.getId() == AttributeID)[0].description;

        $('#KeyName').val(AttributeName);
        $('#DataType option[value=' + AttributeDomain + ']').prop('selected', true);
        $('#KeyType option[value=' + AttributeType + ']').prop('selected', true);
        $('#KeyDescription').val(AttributeDescription);
        $("#SaveAttribute").prop("disabled", false);
    });

}





