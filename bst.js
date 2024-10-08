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
            if (!root) {
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
        let node = findNode(value, this.root)[0];
        let parent = findNode(value, this.root)[1];
        //case 1: node is a leaf
        if (node.left === null && node.right === null) {
            node.data = null;
        }
        //case 2: node has one child
        else if (node.left === null || node.right === null) {
            if(node.data < parent.data) {
                if (node.left === null) {
                    parent.left = node.right;
                }
                else {
                    parent.left = node.left;
                }
            }
            else if(node.data > parent.data) {
                if (node.left === null) {
                    parent.right = node.right;
                }
                else {
                    parent.right = node.left;
                }
            }
        }
        //case 3: node has two children
       else {
        //find new node
        let newNode = node.right;
        let newParent = node;
        while (!(newNode.left === null)) {
            newParent = newNode;
            newNode = newNode.left;
        }
        //case 3 - 1: new node is a leaf
        if (newNode.left === null && newNode.right === null) {
            //replace node with new node
            node.data = newNode.data;
            //delete new node
            if (newNode.data < newParent.data) {
                newParent.left = null;
            }
            else if (newNode.data > newParent.data) {
                newParent.right = null;
            }
        }
        //case 3 - 2: new node has children to its right
        else if (!(newNode.right === null)) {
            //point new parent to its right child
            newParent.left = newNode.right;
            //replace node with new node
            node.data = newNode.data;
        }
       }
    }

    find(value) {
        return findNode(value, this.root);
    }

    levelOrder(callback) {
        if (callback === undefined) {
            throw new Error("callback required");
        }
        //traverse in breadth first, call callback on each node
        let queue = [];
        let node = this.root;

        do {
            callback(node);
            //pop node from queue
            queue.splice(0,1);
        //add node children (if any) to queue
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        //go to first item on queue
            node = queue[0];
        }
        while(queue[0]);
    }

    inOrder(callback) {
        if (callback === undefined) {
            throw new Error("callback required");
        }
        //traverse depth first, in order
        recInOrder(this.root, callback);
    }

    preOrder(callback) {
        if (callback === undefined) {
            throw new Error("callback required");
        }

        //traverse depth first, pre order
        recPreOrder(this.root, callback);
    }

    postOrder(callback) {
        if (callback === undefined) {
            throw new Error("callback required");
        }

        //traverse depth first, pre order
        recPostOrder(this.root, callback);
    }

    height(node) {
        return recHeight(node) - 1;
    }

    depth(node) {
        let currentnode = this.root;
        let depth = 0;
        while (!(currentnode === node)) {
            if (node.data < currentnode.data) {
                currentnode = currentnode.left;
                depth++;
            }
            else if (node.data > currentnode.data) {
                currentnode = currentnode.right;
                depth++;
            }
        }
        return depth;
    }

    isBalanced() {
        //for every node, check the height of its children
        let isBalanced = true;
        this.levelOrder((node) => {
            if (Math.abs(this.height(node.left) - this.height(node.right)) > 1) isBalanced = false;
        })
        return isBalanced;
    }

    reBalance() {
        //traverse and collect data
        let newArray = [];
        this.levelOrder((node) => {
            newArray.push(node.data);
        })
        //change this.array to collected array
        this.array = newArray;
        //build from collected array
        this.buildTree();
    }
}

//recursive find Node function
function findNode(value, root, parent = root) {
    //search for node
    if (root === null || root.data === null) {
        return null;
    }
    else if (root.data === value) {
        return [root, parent];
    }
    else {
        if (value < root.data) {
            parent = root;
            return findNode(value, root.left, parent);
        }
        else if (value > root.data) {
            parent = root;
            return findNode(value, root.right, parent);
        }
    }
}

//recursive height function
function recHeight(node) {
    //if null, height = 0
    if (node === null) {
        return 0
    }
    else {
        const left = recHeight(node.left) + 1;
        const right = recHeight(node.right) + 1;

        return Math.max(left, right);
    }
}

//recursive in order traversal
function recInOrder(root, callback) {
    //if root is null, return
    if (!root) return

    recInOrder(root.left, callback);
    callback(root);
    recInOrder(root.right,callback);
}

//recursive pre order traversal
function recPreOrder(root, callback) {
    //if root is null, return
    if (!root) return

    callback(root);
    recPreOrder(root.left, callback);
    recPreOrder(root.right,callback);
}

//recursive post order traversal
function recPostOrder(root, callback) {
    //if root is null, return
    if (!root) return

    recPostOrder(root.left, callback);
    recPostOrder(root.right,callback);
    callback(root);
}

//recursive bst arrange function
function arrange(array) {
    //find middle element(root)
    let index = Math.floor(array.length / 2);
    root = array[index];
    let node = new Node(root);

    if(node.data === null) {
        node = null;
    }

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

//driver script
function driver(length) {
    //create bst from array of random numbers < 100
    let randomArray = [];
    for (let i = 0; i < length; i++) {
        randomArray.push(Math.floor(Math.random() * 101));
    }
    const bsTree = new Tree(randomArray);
    bsTree.buildTree();
    //confirm tree is balanced;
    console.log(bsTree.isBalanced());

    //Print out all elements in level, pre, post, and in order.
    let levelOrderArray = [];
    bsTree.levelOrder((node) => {
        levelOrderArray.push(node.data);
    });
    console.log(levelOrderArray);
    levelOrderArray = [];

    let inOrderArray = [];
    bsTree.inOrder((node) => {
        inOrderArray.push(node.data);
    });
    console.log(inOrderArray);
    inOrderArray = [];

    let postOrderArray = [];
    bsTree.postOrder((node) => {
        postOrderArray.push(node.data);
    });
    console.log(postOrderArray);
    postOrderArray = [];

    //Unbalance the tree by adding 15 random numbers > 100, and confirm it is unbalanced
    let unBalance = [];
    for (let i = 0; i < 15; i++) {
        bsTree.insert(Math.floor((Math.random() + 1) * 101));
    }
    console.log(bsTree.isBalanced());

    //balance with rebalance and confirm
    bsTree.reBalance();
    console.log(bsTree.isBalanced());

    //Print out all elements in level, pre, post, and in order.
    bsTree.levelOrder((node) => {
        levelOrderArray.push(node.data);
    });
    console.log(levelOrderArray);

    bsTree.inOrder((node) => {
        inOrderArray.push(node.data);
    });
    console.log(inOrderArray);

    bsTree.postOrder((node) => {
        postOrderArray.push(node.data);
    });
    console.log(postOrderArray);
}