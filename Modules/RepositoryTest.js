var IND_ENT = 'Independent';
var DEP_ENT = 'Dependent';
var KEY_ATR = 'Key';
var NON_KEY_ATR = 'Non-key';
var PRIMARY_KEY = 'PK';
var FOREING_KEY = 'FK';
var ALT_KEY = 'AK';
var IDEN_REL = 'Identificate';
var NON_IDEN_REL = 'Non-identificate';
var MANY_TO_MANY = 'Many-to-many';
var CLUSTER_REL = 'Cluster';
var ENTITY_MENU = 'entity_menu';
var CLUSTER_MENU = 'cluster_menu';
var _Repository = (function() {

    list_ent = [];
    list_atr = [];
    list_rel = [];
    list_comp = [];
    list_keygroup = [];
    list_categoryCluster = [];
    var validate = function(name,collectionObjs)
    {
        for(var i = 0;i < collectionObjs.length + 1;i++){

            if(collectionObjs[i].name == name)
                return true;
        }
        return false;
    }
  return {
    listEnt: list_ent,
    listAtr: list_atr,
    listRel: list_rel,
    listComp: list_comp,
    listKeyGroup: list_keygroup,
    listCategoryCluster: list_categoryCluster,
    // публичные методы
    //Add_Entity name, type, description
    Add_Entity: function(name, type, description) {   
      list_ent.push(new Entity(name,type,description,null));
      return list_ent[list_ent.length-1];
    },
    getEntityAt: function(number) {   
      return list_ent.searchNodeAt(number);
    },
    getEntitybyId: function(number) {   
      return list_ent.searchById(number);
    },

    // name - имя атрибута
    // idEnt - Ид сущности - владельца
    // type - тип атрибута
    // domainName - 
    // description - описание атрибута
    // Ид миграции. Определяет "настоящего" владельца атрибута
    // Тип миграции
    Add_Attribute: function(name, idEnt, type, domainName,description, mig_id, mig_type) {   
    
    // Находим сущность в которую нужно добавить атрибут
    
    var curEntity = list_ent.filter(function(item){
            return item.getId() == idEnt;
    });

    // Создаем атрибут
    
    list_atr.push(new Attributes(name, idEnt, type, domainName,description,mig_id,mig_type));
    
    var linkAtr = list_atr[list_atr.length-1];
    
    curEntity[0].atr_lynks.push(linkAtr);

    // Если в диаграмме существуют отношения
    // то создаем атрибуты для всех отношений где сущность-владелец яввляется родителем
    
    if(list_rel != null || list_rel !=[])
    { 
    if (linkAtr.type == PRIMARY_KEY) {
        
        var relIds = list_rel.filter(p =>p.Get_Parent_ID() == idEnt);

        for(var i=0;i<relIds.length;i++){
            var tmpChildEnt = list_ent.filter(p => p.getId() == relIds[i].Get_Child_ID())[0];
            if(relIds[i].type != CLUSTER_REL) {
                list_atr.push(new Attributes(name, idEnt, type, domainName,description,curEntity[0].getId(),IDEN_REL));
                var migAtr = list_atr[list_atr.length-1];
                tmpChildEnt.atr_lynks.push(migAtr);
            }

            // Если отношение является отношением категоризации

            else {
                var tmpChildEnt = list_categoryCluster.filter(p => p.getId() == relIds[i].Get_Child_ID())[0];
                    var clusterRel = list_rel.filter(p =>p.Get_Parent_ID() == tmpChildEnt.getId());
                    for(var j=0;j<clusterRel.length;j++){
                        var tmpChildCluster = list_ent.filter(p => p.getId() == clusterRel[j].Get_Child_ID())[0];
                        list_atr.push(new Attributes(name, tmpChildEnt.parent, type, domainName,description,curEntity[0].getId(),IDEN_REL));
                        var migAtr = list_atr[list_atr.length-1];
                        tmpChildCluster.atr_lynks.push(migAtr);
                    }
                }
        }
    }
    }   
    return linkAtr.getId();
    },
    //добавление атрибута после загрузки
    Add_Attribute_AfterLoad: function(name, idEnt, type, domainName,description, mig_id, mig_type){
        list_atr.push(new Attributes(name, idEnt, type, domainName,description,mig_id,mig_type));
        list_ent.filter(function(item){
            return item.getId() == idEnt;
        })[0].atr_lynks.push(list_atr[list_atr.length-1]);
        return list_atr[list_atr.length-1].getId();
    },
    //редактирование атрибута
    Edit_Attribute: function (idAtr,name,type,domainName,description) {
    var atrToEdit = list_atr.filter(p => p.getId() == idAtr)[0];
    var ownerEnt = list_ent.filter(p => p.getId() == atrToEdit.getOwnerId())[0];
 
    atrToEdit.name = name;
    atrToEdit.type = type;
    atrToEdit.domainName = domainName; 
    atrToEdit.description = description;

    for(var i = 0;i < list_atr.length;i++){
        var temp = list_atr[i];
        if(temp.getMigrationType() != null && temp.getMigrationId() == idAtr){
            temp.name = name;
            temp.type = type;
            temp.domainName = domainName;
            temp.description = description;
        }
    }
    },
    // удаление атрибутов
    Delete_Attribute: function (idAtr,mode) {

    //ищем что надо удалить
    
    var atrToDelete = list_atr.filter(p => p.getId() == idAtr)[0];
    
    var ownerEnt = list_ent.filter(p => p.getId() == atrToDelete.getOwnerId())[0];
    var i;
    var j;

    if(mode == 0 || mode == null){
        for(var i = 0;i < list_ent.length;i++){
            // удаляем все связи элемента
            list_ent[i].atr_lynks = list_ent[i].atr_lynks.filter(p => p.getMigrationId() != ownerEnt.getId());
            
        }
    }
    ownerEnt.atr_lynks = ownerEnt.atr_lynks.filter(p => p.getId() != idAtr);
    list_atr = list_atr.filter(p => p.getMigrationId() != ownerEnt.getId());
    list_atr = list_atr.filter(p => p.getId() != idAtr);
    //сохраняем изменения
    this.reloadAtrTable(list_atr);

    },
    //добавление отношений
    Add_Relationship: function (desription, parentId, childId, type, phrase, conn) {
    list_rel.push(new Relationship(desription, parentId, childId, type, phrase, conn));
    },
    Add_RelationshipKB: function (name, parentId, childId, type, phrase, conn) {
    var entParent = list_ent.filter(p => p.getId() == parentId)[0];
    if(entParent == null && parentId.indexOf("cluster")!=-1){
        var cluster = list_categoryCluster.filter(p => p.getId() == parentId)[0];
        if(cluster == null)
            return;
        entParent = list_ent.filter(p => p.getId() == cluster.parent)[0];
    } 

    var objChild = list_ent.filter(p => p.getId() == childId)[0];
    console.log(entParent);
    if(entParent.atr_lynks!=null){
    switch(type){
     case IDEN_REL :
        for (var i = 0; i < entParent.atr_lynks.length; i++) {
            
            if(entParent.atr_lynks[i]!=null)
                if (entParent.atr_lynks[i].type == PRIMARY_KEY) {  
            
            var temp = entParent.atr_lynks[i];
            var newAtrId = this.Add_Attribute(temp.name, 
                objChild.getId(), 
                temp.type, 
                temp.domainName, 
                temp.description,
                temp.getMigrationId()!=undefined ? temp.getMigrationId() : temp.getOwnerId(),
                IDEN_REL);
            
            // Так как атрибут не свой то выставляем владельца
            var linkAtr = list_atr.filter(p =>p.getId() == newAtrId)[0];
            //linkAtr.setOwnerId(entParent.getId());

         }
     }
     break;
     case NON_IDEN_REL :
     for (var i = 0; i < entParent.atr_lynks.length; i++) {
        if(entParent.atr_lynks[i]!=null)
        if (entParent.atr_lynks[i].type == PRIMARY_KEY && entParent.atr_lynks[i].getOwnerId() == parentId) {           
            var temp = list_atr.filter(p => p.getId() == entParent.atr_lynks[i].getId())[0];
            var linkAtr = list_atr.push(new Attributes(temp.name, temp.getOwnerId(), "FK", temp.domainName, temp.description,temp.getMigrationId(),NON_IDEN_REL)).data;
            /*linkAtr.setMigrationId();
            linkAtr.setMigrationType();*/
            //Add_Group('G' + temp.type+childId, childId, temp.type,temp.getId());
            //objChild.atr_lynks.push(linkAtr);
            }
        }
        break;
        }
    }
    list_rel.push(new Relationship(name, parentId, childId, type, phrase, conn));
    },
    //удаление отношений
    Delete_Relationship: function (idRel, mode) {
    var relationToDelete = list_rel.filter(p =>p.getId() == idRel)[0];
    var objChildEnt = list_ent.filter(p =>p.getId() == relationToDelete.Get_Child_ID())[0];

    //Óäàëåíèå âíåøíèõ êëþ÷åé
    if (objChildEnt.atr_lynks.length !== 0) {
        for (var i = 0; i < objChildEnt.atr_lynks.length; i++) {
            if(objChildEnt.atr_lynks[i]!=null){
                if (objChildEnt.atr_lynks[i].getOwnerId() == relationToDelete.Get_Parent_ID()){
                    this.Delete_Attribute(objChildEnt.atr_lynks[i].getId(),mode);
                    objChildEnt.atr_lynks[i] = null;
                }
        }
        }
    }
    list_rel.remove(idRel);
    },
    Edit_Relationship: function (idRel, newDescription, newPhrase, newType=null) {
    
    /*if(type!=null && type != this.list_rel.searchById(idRel).type)
    {
        var pId = this.list_rel.searchById(idRel)._parent_id;
        var cldId = this.list_rel.searchById(idRel)._child_id;       
        this.Delete_Relationship(idRel);
        //this.push_RelationshipKB(pId,cldId,newPhrase,newType,newDescription);
        return;
    }*/
    list_rel.filter(p => p.getId() == idRel)[0].description = newDescription;
    list_rel.filter(p => p.getId() == idRel)[0].phrase = newPhrase;
    },
/*Ðåäàêòèðîâàíèå ñóùíîñòè*/
    Edit_Entity: function (idEnt, newName, newDescription) {
    list_ent.filter(p => p.getId() == idEnt)[0].name = newName;
    list_ent.filter(p => p.getId() == idEnt)[0].description = newDescription;
    },
    Delete_Entity: function (idEnt) {

    var idRelToDelete = [];
    var tmpEnt = list_ent.filter(p => p.getId() == idEnt)[0];
    var i;
    if (list_rel.length === 1) {
        if (list_rel.searchNodeAt(list_rel.length).Get_Parent_ID() === idEnt || list_rel.searchNodeAt(list_rel.length).Get_Child_ID() === idEnt) {
            list_rel.remove(list_rel.searchNodeAt(list_rel.length)._id);
        }
    }
    else {
        for (i = 1; i < list_rel.length; i++) {
            if (list_rel[i].Get_Parent_ID() === idEnt || list_rel[i].Get_Child_ID() === idEnt) {

                idRelToDelete.push(list_rel[i].getId());
            }
        }
    }
    //Óäàëåíèå âñåõ ãðóïï è êîìïîíåíòîâ ñóùíîñòè
    for (i = 1; i < list_keygroup.length; i++) {
        var groupToDeleteId = list_keygroup[i].ent_id;
        if (groupToDeleteId == idEnt)
            Delete_Group(list_keygroup[i].getId());
    }
    //Óäàëåíèå âñåõ ññûëîê íà àòðèáóòû
    for (i = 0; i < tmpEnt.atr_lynks.length; i++) {
        if (tmpEnt.atr_lynks[i] != null)
            Delete_Attribute(tmpEnt.atr_lynks[i].getId());
    }
    //Óäàëåíèå âñåõ ñâÿçåé èìåþùèõñÿ ó óäàëÿåìîé ñóùíîñòè
    for (var j = 0; j < idRelToDelete.length; j++) {
        Delete_Relationship(idRelToDelete[j]);
    }
    //Óäàëåíèå ñóùíîñòè
    list_ent.remove(idEnt);

},
// добавить группу
    Add_Group: function (nameKg, entId, typeKg,atrId) {
    
    var isOldGroup = false;

    for (var i = 0; i < list_keygroup.length + 1; i++) {
        if (list_keygroup[i].ent_id === entId) {

            if (list_keygroup[i].type_kg === typeKg) {
                isOldGroup = true;
                Add_Component(list_keygroup[i].name_kg, atrId);
            }
        }
    }
    if (!isOldGroup) {
        var newGroupItem=list_keygroup.push(new KeyGroup(nameKg, entId, typeKg)).data;
        Add_Component(newGroupItem.name_kg, newGroupItem.id);
    }
    },
    Add_Component: function (nameKg, attributeId) {
    return list_comp.push(new Component(nameKg, attributeId)).data;
    },
    Delete_Group: function (idGroup) {
    var groupToDelete = list_keygroup.searchById(idGroup);
    for (var i = 0; i < list_comp.length; i++) {
        if (list_comp[i].name_kg === groupToDelete.name_kg)
            list_comp.remove(list_comp[i].id);
    }
    list_keygroup.remove(idGroup);

    },

    Clear: function(){
        list_ent = null;
        list_atr = null;
        list_rel = null;
        list_comp = null;
        list_keygroup = null; 
        list_ent = new SinglyList();
        list_atr = new SinglyList();
        list_rel = new SinglyList();
        list_comp = new SinglyList();
        slist_keygroup = new SinglyList();
    },
    //выбираем имя
    ValidateName: function(name, objType){
        var check = false;
        switch(objType)
        {
            case "Entity":
            check = validate(name, list_ent);
            break;
            case "Attribute": 
            check = validate(name, list_atr);
        }
        return check;
    },
    //добавляем категорию
    Add_CategoryCluster: function(parent,child){
        list_categoryCluster.push(new CategoryCluster(parent,child));
        return list_categoryCluster[list_categoryCluster.length-1];
    },
    //перезагрузка lfyys[] 
    reloadAtrTable(attr){
        _Repository.listAtr = attr;
    }
  }
})();