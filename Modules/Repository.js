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

function Entity(name, type, description, atr_lynks = []) {
    //Ид объекта
    this.id = Entity.counter++;
    //Имя сущности
    this.name = name;
    //Ид графич. объекта
    this.picture_id = "Entity" + this.id;
    //Тип сущности
    this.type = type;
    //Описание сущности
    this.description = description;
    //Массив ссылок на атрибуты сущности
    this.atr_lynks = atr_lynks;
}
Entity.counter = 0;
Entity.prototype.getId = function () {
    return this.picture_id;
}

function Attributes(name, entId, type, domain, descp, mig_id = null, mig_type = null) {
    //Ид атрибута
    this.id = Attributes.counter++;
    //Ид владельца атрибута
    this._owner_id = entId;
    // Тип атрибута(PK,FK,AK)
    this.type = type;
    //Имя атрибута
    this.name = name;
    //Домен атр
    this.domainName = domain;

    this.description = descp;
    this.mig_id = mig_id;
    this.mig_type = mig_type;
}
Attributes.counter = 0;
Attributes.prototype.getId = function () {
    return this.id;
}
Relationship.counter = 0;
function Relationship(description, parentId, childId, type, phrase, conn) {
    //Id связи
    this._id = "R" + Relationship.counter++;
    //Описание связи
    this.description = description;
    //Èä ðîä. ñóùíîñòè
    this._parent_id = parentId;
    //ID доч. сущности
    this._child_id = childId;
    //Тип связи
    this.type = type;
    //Глагольная фраза
    this.phrase = phrase;
    //Объект Jsplumb
    this.jsPlumbConn = conn;
}


Relationship.prototype.getId = function () {
    return this._id;
}
Relationship.prototype.Get_Parent_ID = function () {
    return this._parent_id;
}
Relationship.prototype.Get_Child_ID = function () {
    return this._child_id;
}
Relationship.prototype.Get_Phrase = function () {
    return this.phrase;
}
Relationship.prototype.Get_Description = function () {
    return this.description;
}

function KeyGroup(nameKg, entId, typeKg) {
    //Èä ãðóïïû
    this.id = KeyGroup.counter++;
    //Èìÿ ãðóïïû
    this.name_kg = nameKg;
    //Èä âëàäåëüöà ãðóïïû
    this.ent_id = entId;
    //Òèï ãðóïïû
    this.type_kg = typeKg;
}
KeyGroup.prototype.getId = function () {
    return this.id;
}
KeyGroup.counter = 0;
function Component(nameKg, attributeId) {
    //Èä êîìïîíåíòà
    this.id = Component.counter++;
    //Èìÿ ãðóïïû â êîòîðóþ âõîäèò àòðèáóò
    this.name_kg = nameKg;
    //Èä àòðèáóòà
    this.atr_id = attributeId;
}
Component.prototype.getId = function () {
    return this.id;
}
Component.counter = 0;

function Domain(datatype,limit){
    this.id = Domain.counter++;
    this.name="D"+id;
    this.dataType=datatype;
    this.limit=limit;
}
Domain.counter = 0;

function Repository() {
    //Ñïèñîê ñóùíîñòåé
    this.list_ent = new SinglyList();
    //Ñïèñîê àòðèáóòîâ
    this.list_atr = new SinglyList();
    //Ñïèñîê ñâçÿåé
    this.list_rel = new SinglyList();
    //Ñïèñîê êîìïîíåíòîâ
    this.list_comp = new SinglyList();
    //Ñïèñîê ãðóïï
    this.list_keygroup = new SinglyList();
};
/*
Ôóíêöèÿ äîáàâëåíèÿ Ñóùíîñòè
*/
Repository.prototype.Add_Entity = function (name, type, description, pictureId) {
   return this.list_ent.add(new Entity(name, type, description, pictureId)).data.id;
};
/*
Ôóíêöèÿ äîáàâëåíèÿ Àòðèáóòà
*/
Repository.prototype.Add_Attribute = function (name, idEnt, type, domainName,description, mig_id = null, mig_type = null) {


    //Ñóùíîñòü ê êîòîðîé äîáàâëÿåòñÿ Àòðèáóò
    var curEntity = this.list_ent.searchById(idEnt);

    //Ññûëêà íà ñîçäàííûé îáúåêò Àòðèáóò
    var linkAtr = this.list_atr.add(new Attributes(name, idEnt, type, domainName,description,mig_id,mig_type)).data;

    curEntity.atr_lynks.push(linkAtr);

    this.Add_Group('G' + type + idEnt, idEnt, type,linkAtr.id);
    //Äîáàâèòü â íîâóþ ãðóïïó?
    
    if (linkAtr.type == PRIMARY_KEY) {
        for (var i = 1; i <= this.list_rel._length; i++) {
            if (this.list_rel.searchNodeAt(i)._parent_id === idEnt) {
                var tmpChildEnt = this.list_ent.searchById(this.list_rel.searchNodeAt(i)._child_id);
                tmpChildEnt.atr_lynks.push(linkAtr);
            }
        }
    }
    return linkAtr.id;

};

Repository.prototype.Edit_Attribute= function (idAtr,name,type,domainName,description) {
    var atrToEdit = this.list_atr.searchById(idAtr);
    var ownerEnt = this.list_ent.searchById(atrToEdit._owner_id);
 
    atrToEdit.name=name;
    atrToEdit.type=type;
    atrToEdit.domainName=domainName; 
    atrToEdit.description=description;

    for(var i=1;i<=this.list_atr._length;i++){
        var temp = this.list_atr.searchNodeAt(i);
        if(temp.mig_id!=null && temp.mig_id == idAtr){
            temp.name=name;
            temp.type=type;
            temp.domainName=domainName;
            temp.description=description;
        }
    }
}

/*Óäàëåíèå Àòðèáóòà*/
Repository.prototype.Delete_Attribute = function (idAtr) {

    //Àòðèáóò äëÿ óäàëåíèÿ
    var atrToDelete = this.list_atr.searchById(idAtr);

    // Ñóùíîñòü-âëàäåëåö àòðèáóòà
    var ownerEnt = this.list_ent.searchById(atrToDelete._owner_id);

    var i;
    //Óäàëåíèå àòðèáóòà èç ñóùíîñòåé ó êîòîðûõ åñòü ñâÿçè ñ òåêóùåé
    /*for (i = 0; i < ownerEnt.atr_lynks.length; i++) {
        for (var j = 1; j < this.list_ent._length; j++) {
            if (ownerEnt.atr_lynks[i] != null) {
                for (var k = 0; k < this.list_ent.searchNodeAt(j + 1).atr_lynks.length; k++) {
                    if (this.list_ent.searchNodeAt(j + 1).atr_lynks[k] != null) {
                        if (ownerEnt.atr_lynks[i].id == this.list_ent.searchNodeAt(j + 1).atr_lynks[k].id && ownerEnt.atr_lynks[i].mig_id == idAtr)
                            this.list_ent.searchNodeAt(j + 1).atr_lynks[k] = null;
                    }
                }

            }
        }
    }*/
    for (i = 0; i < ownerEnt.atr_lynks.length; i++) {

        if (ownerEnt.atr_lynks[i] != null) {
            if (ownerEnt.atr_lynks[i].id == idAtr || ownerEnt.atr_lynks[i].mig_id ==idAtr)
                ownerEnt.atr_lynks[i] = null;
        }
    }
    for (i = 1; i <= this.list_comp._length; i++) {
        if (this.list_comp.searchNodeAt(i).atr_id == idAtr)
            this.list_comp.remove(this.list_comp.searchNodeAt(i).id);
    }
    this.list_atr.remove(idAtr);


};
/*Добавление отношения*/
Repository.prototype.Add_Relationship = function (desription, parentId, childId, type, phrase, conn) {
    this.list_rel.add(new Relationship(desription, parentId, childId, type, phrase, conn));
};
/*Äîáàâëåíèå îòíîøåíèÿ óðîâíÿ KB*/
/*
Repository.prototype.Add_RelationshipKB = function (name, parentId, childId, type, phrase, conn) {

    //Ñóùíîñòü-ðîäèòåëü
    var entParent = this.list_ent.searchById(parentId);

    //Ñóùíîñòü-ïîòîìîê
    var objChild = this.list_ent.searchById(childId);


    for (var i = 0; i < entParent.atr_lynks.length; i++) {
        if (entParent.atr_lynks[i].type == PRIMARY_KEY || entParent.atr_lynks[i].type == ALT_KEY) {           
            var temp = this.list_atr.searchById(entParent.atr_lynks[i].id);
            //temp.type="FK";
            this.Add_Group('G' + temp.type+childId, childId, temp.type,temp.id);
            objChild.atr_lynks.push(temp);
        }

    }
    this.list_rel.add(new Relationship(name, parentId, childId, type, phrase, conn));
};
*/
Repository.prototype.Add_RelationshipKB = function (name, parentId, childId, type, phrase, conn) {

    //Ñóùíîñòü-ðîäèòåëü
    var entParent = this.list_ent.searchById(parentId);
    //Ñóùíîñòü-ïîòîìîê
    var objChild = this.list_ent.searchById(childId);
    switch(type){
     case IDEN_REL :
        for (var i = 0; i < entParent.atr_lynks.length; i++) {
        if (entParent.atr_lynks[i].type == PRIMARY_KEY) {           
            var temp = this.list_atr.searchById(entParent.atr_lynks[i].id);
            var linkAtr = this.list_atr.add(new Attributes(temp.name, temp._owner_id, temp.type, temp.domainName, temp.description)).data;
            linkAtr.mig_id = temp.id;
            linkAtr.mig_type = IDEN_REL;
            this.Add_Group('G' + temp.type+childId, childId, temp.type,temp.id);
            objChild.atr_lynks.push(linkAtr);
         }
     }
     break;
     case NON_IDEN_REL :
     for (var i = 0; i < entParent.atr_lynks.length; i++) {
        if (entParent.atr_lynks[i].type == PRIMARY_KEY && entParent.atr_lynks[i]._owner_id == parentId) {           
            var temp = this.list_atr.searchById(entParent.atr_lynks[i].id);
            var linkAtr = this.list_atr.add(new Attributes(temp.name, temp._owner_id, "FK", temp.domainName, temp.description)).data;
            linkAtr.mig_id = temp.id;
            linkAtr.mig_type = NON_IDEN_REL;
            this.Add_Group('G' + temp.type+childId, childId, temp.type,temp.id);
            objChild.atr_lynks.push(linkAtr);
         }
     }
     break;
    }
    this.list_rel.add(new Relationship(name, parentId, childId, type, phrase, conn));
};
/*Óäàëåíèå îòíîøåíèÿ*/
Repository.prototype.Delete_Relationship = function (idRel) {
    var relationToDelete = this.list_rel.searchById(idRel);
    var objChildEnt = this.list_ent.searchById(relationToDelete._child_id);

    //Óäàëåíèå âíåøíèõ êëþ÷åé
    if (objChildEnt.atr_lynks.length !== 0) {
        for (var i = 0; i < objChildEnt.atr_lynks.length; i++) {
            if(objChildEnt.atr_lynks[i]!=null){
                if (objChildEnt.atr_lynks[i]._owner_id == relationToDelete._parent_id){
                    this.Delete_Attribute(objChildEnt.atr_lynks[i].id);
                    objChildEnt.atr_lynks[i] = null;
                }
        }
        }
    }
    this.list_rel.remove(idRel);
};
/*Ðåäàêòèðîâàíèå îòíîøåíèÿ*/
Repository.prototype.Edit_Relationship = function (idRel, newDescription, newPhrase, newType=null) {
    
    /*if(type!=null && type != this.list_rel.searchById(idRel).type)
    {
        var pId = this.list_rel.searchById(idRel)._parent_id;
        var cldId = this.list_rel.searchById(idRel)._child_id;       
        this.Delete_Relationship(idRel);
        //this.Add_RelationshipKB(pId,cldId,newPhrase,newType,newDescription);
        return;
    }*/
    this.list_rel.searchById(idRel).description = newDescription;
    this.list_rel.searchById(idRel).phrase = newPhrase;
};
/*Ðåäàêòèðîâàíèå ñóùíîñòè*/
Repository.prototype.Edit_Entity = function (idEnt, newName, newDescription) {
    this.list_ent.searchById(idEnt).name = newName;
    this.list_ent.searchById(idEnt).description = newDescription;
};
/*Óäàëåíèå ñóùíîñòè*/
Repository.prototype.Delete_Entity = function (idEnt) {

    //Ìàññèâ id-øíèêîâ ñâÿçåé
    var idRelToDelete = [];
    var tmpEnt = this.list_ent.searchById(idEnt);
    var i;
    //Ïðîâåðêà íà íàëè÷èå ñâÿçåé ó óäàëÿåìîé ñóùíîñòè
    if (this.list_rel._length === 1) {
        if (this.list_rel.searchNodeAt(this.list_rel._length)._parent_id === idEnt || this.list_rel.searchNodeAt(this.list_rel._length)._child_id === idEnt) {
            this.list_rel.remove(this.list_rel.searchNodeAt(this.list_rel._length)._id);
        }
    }
    else {
        for (i = 1; i <= this.list_rel._length; i++) {
            if (this.list_rel.searchNodeAt(i)._parent_id === idEnt || this.list_rel.searchNodeAt(i)._child_id === idEnt) {

                idRelToDelete.push(this.list_rel.searchNodeAt(i)._id);
            }
        }
    }
    //Óäàëåíèå âñåõ ãðóïï è êîìïîíåíòîâ ñóùíîñòè
    for (i = 1; i <= this.list_keygroup._length; i++) {
        var groupToDeleteId = this.list_keygroup.searchNodeAt(i).ent_id;
        if (groupToDeleteId == idEnt)
            this.Delete_Group(this.list_keygroup.searchNodeAt(i).getId());
    }
    //Óäàëåíèå âñåõ ññûëîê íà àòðèáóòû
    for (i = 0; i < tmpEnt.atr_lynks.length; i++) {
        if (tmpEnt.atr_lynks[i] != null)
            this.Delete_Attribute(tmpEnt.atr_lynks[i].id);
    }
    //Óäàëåíèå âñåõ ñâÿçåé èìåþùèõñÿ ó óäàëÿåìîé ñóùíîñòè
    for (var j = 0; j < idRelToDelete.length; j++) {
        this.Delete_Relationship(idRelToDelete[j]);
    }
    //Óäàëåíèå ñóùíîñòè
    this.list_ent.remove(idEnt);

};
/*Äîáàâëåíèå ãðóïïû*/
Repository.prototype.Add_Group = function (nameKg, entId, typeKg,atrId) {
    
    var isOldGroup = false;

    for (var i = 1; i < this.list_keygroup._length + 1; i++) {
        if (this.list_keygroup.searchNodeAt(i).ent_id === entId) {

            if (this.list_keygroup.searchNodeAt(i).type_kg === typeKg) {
                isOldGroup = true;
                this.Add_Component(this.list_keygroup.searchNodeAt(i).name_kg, atrId);
            }
        }
    }
    if (!isOldGroup) {
        var newGroupItem=this.list_keygroup.add(new KeyGroup(nameKg, entId, typeKg)).data;
        this.Add_Component(newGroupItem.name_kg, newGroupItem.id);
    }
}
/*Добавление компонента*/
Repository.prototype.Add_Component = function (nameKg, attributeId) {
    return this.list_comp.add(new Component(nameKg, attributeId)).data;
}
/*
Удаление группы*/
Repository.prototype.Delete_Group = function (idGroup) {
    var groupToDelete = this.list_keygroup.searchById(idGroup);
    for (var i = 1; i <= this.list_comp._length; i++) {
        if (this.list_comp.searchNodeAt(i).name_kg === groupToDelete.name_kg)
            this.list_comp.remove(this.list_comp.searchNodeAt(i).id);
    }
    this.list_keygroup.remove(idGroup);

}