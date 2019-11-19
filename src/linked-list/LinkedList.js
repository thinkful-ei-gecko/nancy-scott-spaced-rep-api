const Node = require('./Node');
const listHelpers = require('./linkedListHelpers');

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

  insertAt(item, pos) {
    if (!this.head) {
      this.insertFirst(item);
    }
    if (pos <= 1) {
      this.head = new Node(item, this.head)
    }
    let prevNode = this.head;
    let currNode = this.head;
    let currPos = 1;

    while (currPos < pos && currNode !== null) {
      prevNode = currNode;
      currNode = currNode.next;
      currPos += 1;
    }
    prevNode.next = new Node(item, currNode);
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
    if (!this.head) {
      return null;
    }
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let prevNode = this.head;
    while (currNode !== null && currNode.value !== item) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log('Item not found');
      return;
    }
    prevNode.next = currNode.next;
  }
}

module.exports = LinkedList;
