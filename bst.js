class Node {
    constructor(data = null, left = null, right = null) {
        this.data = data;
        this.left = left;
        this.right = right;
    }
}

class Tree {
    constructor(array) {
        this.array = array;
        this.root = null;
    }

    buildTree() {
        //sort
        let sortedArray = mergeSort(this.array);
        //remove duplicates
        for (let i = 0; i < sortedArray.length; i++) {
            if (sortedArray[i] === sortedArray[i + 1]) {
                sortedArray.splice(i, 1);
            }
        }
        //arrange
        this.root = arrange(sortedArray);
    }

    insert(data, root = this.root) {
            if (!root || !root.data) {
                // When the current root is null, place the new node here.
                return new Node(data);
            }
            if (data < root.data) {
                root.left = this.insert(data, root.left);
            } else if (data > root.data) {
                root.right = this.insert(data, root.right);
            }

            return root;
        }

    deleteItem(value) {
        //find the required node
        let node = findNode(value, this.root);
        //case 1: node is a leaf
        if (node.left === null && node.right === null) {
            node.data = null;
        }
        //case 2: node is a
    }
}

function findNode(value, root) {
    //search for node
    if (root === null || root.data === null) {
        return null;
    }
    else if (root.data === value) {
        return root;
    }
    else {
        if (value < root.data) {
            return findNode(value, root.left);
        }
        else if (value > root.data) {
            return findNode(value, root.right);
        }
    }
}


//recursive bst arrange function
function arrange(array) {
    //find middle element(root)
    let index = Math.floor(array.length / 2);
    root = array[index];
    let node = new Node(root);

    if (array.length > 1) {
        node.left = arrange(array.slice(0, index));
        node.right = arrange(array.slice(index + 1));
        return node;
    }
    else {
        return node;
    }
}

function mergeSort(array) {
    //if array length = 1, return
    if (array.length == 1) return array;
    //else
    else {
        let halfLength = Math.floor(array.length / 2);
        let left = mergeSort(array.splice(0, halfLength))
        let right = mergeSort(array);
        
        return merge(left, right);
    }
}

function merge(left, right) {
    const arraylength = left.length + right.length;
    let finalArray = [];
    while (finalArray.length < arraylength) {
        if (left.length == 0) {
            finalArray = finalArray.concat(right);
        }
        else if (right.length == 0) {
            finalArray = finalArray.concat(left);
        }
        else {
            if (left[0] < right[0]) {
                finalArray.push(left[0]);
                left.splice(0,1);
            }
            else {
                finalArray.push(right[0]);
                right.splice(0,1);
            }
        }
    }
    
    return finalArray;
}

//pretty print function
const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };


let testArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
let test =  new Tree(testArray);
test.buildTree();

prettyPrint(test.root);