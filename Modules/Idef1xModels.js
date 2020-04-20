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

//Функция-класс Сущность
function Entity(name, type, description, atr_lynks){
    //Id сущности
    var id = Entity.counter++;
    //Имя сущности
    this.name = name;
    //Id для граф. объекта
    var _picture_id = "Entity" + id;
    //Массив ссылок id для атрибутов
    if(atr_lynks!=null)
        this.atr_lynks = atr_lynks;
    else
        this.atr_lynks = [];
    //Возвращаем id граф обьекта
    this.getId = function() {
        return _picture_id;
    };
    this.getSysId = function(){
        return id;
    }
    this.description = description;
}
//Счетчик сущностей
Entity.counter = 0;
//Функция-класс Атрибут
function Attributes(name, entId, type, domain, descp, mig_id, mig_type) {
    //**private**
    //Id атрибута
    var _id = Attributes.counter++;
    //Id владельца атрибута
    var _owner_id = entId;
    //Идентификатор миграции: Являестя ли атрибут собственностью сущности?
    var _mig_id = mig_id;
    //Тип миграции
    var _mig_type = mig_type;
    //Тип атрибкта
    this.type = type;   
    //Имя атрибута
    this.name = name;
    //Имя домена атрибута
    this.domainName = domain;
    //Описание атрибута
    this.description = descp;
    //Получить id владельца
    this.getOwnerId = function() {
        return _owner_id;
    };
    this.setOwnerId = function(id) {
        _owner_id = id;
    };
    //Получить миграционный Id 
    this.getMigrationId = function() {
        return _mig_id ;
    };
    this.setMigrationId = function(migId) {
        _mig_id =  migId;
    };
    this.setMigrationType = function(migType) {
        _mig_type = migType ;
    };
    //Получить тип миграции
    this.getMigrationType = function() {
        return _mig_type;
    };
    //Получить Id атрибута
    this.getId = function() {
        return _id;
    };
}
//Счетчик Атрибутов
Attributes.counter = 0;
//Счетчик обьектов Отношение
Relationship.counter = 0;
function Relationship(description, parentId, childId, type, phrase, conn) {
    //**private**
    //Id Отношения
    var _id = "R" + Relationship.counter++;
    //Id родительской сущности
    var _parent_id = parentId;
    //Id дочерней сущности
    var _child_id = childId;
    //Описание отношения
    this.description = description;   
    //Тип отношения
    this.type = type;
    //Глагольный оборот отношения
    this.phrase = phrase;
    //Обьект jsPlumbConnection для графики
    this.jsPlumbConn = conn;
    //Получить Id отношения
    this.getId = function () {
        return _id;
    }
    this.Get_Parent_ID = function () {
        return _parent_id;
    }
    this.Get_Child_ID = function () {
        return _child_id;
    }
    this.Get_Phrase = function () {
        return phrase;
    }
    this.Get_Description = function () {
        return description;
    }
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
function CategoryCluster(parent, child){
    var _id = "cluster" + CategoryCluster.counter++;
    this.getId = function(){
        return _id;
    }
    this.parent = parent;
    this.child = child;
}
CategoryCluster.counter = 0;