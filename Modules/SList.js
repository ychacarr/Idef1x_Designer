function Node(data) {
    this.data = data;
    this.next = null;
}
function SinglyList() {
    this._length = 0;
    this.head = null;
}
SinglyList.prototype.add = function (value) {
        var node = new Node(value),
            currentNode = this.head;

        // 1-ый случай: пустой список
        if (!currentNode) {
            this.head = node;
            this._length++;

            return node;
        }

        // 2-ой случай: непустой список
        while (currentNode.next) {
            currentNode = currentNode.next;
        }

        currentNode.next = node;

        this._length++;

        return node;
    };
SinglyList.prototype.searchNodeAt = function (position) {
        var currentNode = this.head,
            length = this._length,
            count = 1,
            message = { failure: 'Failure: non-existent node in this list.' };

        // 1-ый случай: неверная позиция
        /*if (length === 0 || position < 1 || position > length) {
            throw new Error(message.failure);
        }*/

        // 2-ой случай: верная позиция
        while (count < position) {
            currentNode = currentNode.next;
            count++;
        }
        return currentNode.data;
       
            };
SinglyList.prototype.searchById = function (ent_id) {
        var currentNode = this.head,
            length = this._length,
            count = 1,
            message = { failure: 'Failure: non-existent node in this list.' };
     
        if (length === 0) {
            throw new Error(message.failure);
        }
        while (count <= length) {
            if (currentNode.data.getId()==ent_id)
                break;
        else
            if(count == length){
                return null;
            }
            currentNode = currentNode.next;
            count++;
        }

        return currentNode.data;
            };
SinglyList.prototype.remove = function (id) {
        var currentNode = this.head,
            length = this._length,
            count = 0,
            message = { failure: 'Failure: non-existent node in this list.' },
            beforeNodeToDelete = null,
            nodeToDelete = null,
            deletedNode = null;

        while (count < length) {
            if(currentNode.data.getId()==id)
            {
                if (count+1 == 1) {
                    this.head = currentNode.next;
                    deletedNode = currentNode;
                    currentNode = null;
                    this._length--;
                    return deletedNode;
                } else {
                    break;
                }

            } else {

                beforeNodeToDelete = currentNode;
                nodeToDelete = currentNode.next;
                count++;
            }
        }

        beforeNodeToDelete.next = nodeToDelete.next;
        deletedNode = nodeToDelete;
        nodeToDelete = null;
        this._length--;

        return deletedNode;
    };
