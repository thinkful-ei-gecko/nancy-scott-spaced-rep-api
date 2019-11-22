const Node = require('./Node');
const listHelpers = require('./linkedListHelpers');
const LanguageService = require('../language/language-service')

class LinkedList {
  constructor() {
    this.head = null;
  }
  insertFirst(item) {
    this.head = new Node(item, this.head);
  }
  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
      return;
    }
    let tempNode = this.head;
    while (tempNode.next !== null) {
      tempNode = tempNode.next;
    }
    tempNode.next = new Node(item, null)
  }

  insertBefore(item, itemBefore) {
    if (!this.head) {
      this.insertLast(item);
    }
    let currNode = this.head;
    let prevNode = this.head;

    while (currNode !== null && currNode.value !== itemBefore) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      this.insertLast(item);
      return;
    }
    prevNode.next = new Node(item, currNode)
  }

  insertAfter(item, itemAfter) {
    if (!this.head) {
      this.insertLast(item);
    }
    let currNode = this.head;
    let currPlusOne = this.head;

    while (currNode !== null && currNode.value !== itemAfter) {
      currNode = currNode.next;
      currPlusOne = currNode.next;
    }
    if (currNode === null) {
      this.insertLast(item);
      return;
    }
    currNode.next = new Node(item, currPlusOne)
  }

  size() {
    if (!this.head) {
      return 0
    }
    let currNode = this.head.next;
    let currPos = 1;
    while(currNode) {
      currNode = currNode.next;
      currPos += 1;
    }

    return currPos;
  }

  insertAt(item, pos) {

    if(pos > this.size()) {
        return this.insertLast(item)
      }
    if (!this.head) {
      this.insertFirst(item);
    }

    let prevNode = this.head;
    let currNode = this.head;
    let currPos = 1;

    while (currPos <= pos + 1 && currNode !== null) {

      console.log('in while loop')
      prevNode = currNode;
      currNode = currNode.next;
      currPos += 1;
    }
    // console.log('prevNode.next before moving',prevNode.next)
    // console.log('currNode is',currNode)
    prevNode.next = new Node(item, currNode);
    console.log('new node inserted')
    //id1's next (2) = prevNode.next.next.value.id (4)
    // console.log(prevNode.next.value.next, prevNode.next.next.value.id)

    ////// updating the node before the newly inserted node
    ////// updating the databases' 'next' 
    // console.log( 'is the prev.node', prevNode.value.id)


    prevNode.value.next = prevNode.next.value.id

    ///// updating the newly inserted, databases' 'next' 
    prevNode.next.value.next = prevNode.next.next.value.id
    // console.log('prevNode.next AFTER moving',prevNode.next)

  }

  createCycle(data) {
    let cyclePoint = this.head.next;
    let tempNode = this.head;
    while (tempNode.next !== null) {
      tempNode = tempNode.next;
    }
    tempNode.next = new Node(data, cyclePoint);
  }


  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }
  remove(item) {
    // console.log('in remove--------------')
    // console.log(item)

    let removedNode
    if (!this.head) {
      return null;
    }
    if (this.head.value === item) {
      // console.log('in remove',this.head)
      removedNode = this.head.value.id
      this.head = this.head.next;
      return removedNode;
    }
    let currNode = this.head;
    let prevNode = this.head;
    while (currNode !== null && currNode.value !== item) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      // console.log('Item not found');
      return;
    }

    prevNode.next = currNode.next;
  }
}

module.exports = LinkedList;
