
// Storage Controller
const StorageCtrl = (function(){
    //Public methods
    return {
        storeItem: function(item){
             let items=[];
             // Check if any item in local storage
             if(localStorage.getItem('items') == null){
                 items=[];
                 //Push new item
                 items.push(item);
                 // Set ls
                 localStorage.setItem('items', JSON.stringify(items));

             }else{
                 
                 items = JSON.parse(localStorage.getItem('items'));
                 //Push new item
                 items.push(item);
                 // Re Set ls
                 localStorage.setItem('items', JSON.stringify(items));
             }
        },
        getItemsFromStorage: function(){
            let items =[];
            if(localStorage.getItem('items') !== null){
                 items=JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item){
                  if(updatedItem.id === item.id){
                    item.name = updatedItem.name;
                    item.calories = updatedItem.calories;
                  }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item,i){
                  if(id === item.id){
                    items.splice(i, 1);
                  }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        clearAll: function(){
            localStorage.clear();
        }
    }
})();

//Item Controller
const ItemCtrl = (function () {
    //Item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data structure /State
    const data = {
        // items: [
        //     // { id: 0, name: 'Steak Dinner', calories: 1200 },
        //     // { id: 1, name: 'Cookies', calories: 400 },
        //     // { id: 2, name: 'Eggs', calories: 300 }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function () {
            return data.items;
        },
        getItemById: function (id) {
            let foundItem = null;
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });

            return found;
        },
        updateItem: function (name, calories) {
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        addItem(item) {
            const IDList = data.items.map(item => item.id);

            let ID;
            if (data.items.length > 0) {
                ID = data.items[IDList.length - 1].id + 1;
            } else {
                ID = 0;
            }

            const newItem = {
                id: ID,
                name: item.name,
                calories: parseInt(item.calories)
            };
            data.items.push(newItem);

            return newItem;
        },
        deleteItem: function(id){
             data.items.forEach(function(item,index){
                 if(item.id === id){
                    data.items.splice(index,1);
                 }
             });
        },
        getCurrentItem: function(){
           return data.currentItem;
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getTotalCalories: function () {
            let total = 0;
            data.items.forEach(function (item) {
                total += item.calories;
            });

            data.totalCalories = total;

            return total;
        },
        clearAll: function(){
            
            data.items =[];
            data.currentItem=null;
            data.totalCalories =0;
        },
        testing: function () {
            return data;
        }
    }
})();

//UI Controller
const UICtrl = (function () {
    const UISelector = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    const nodeListForEach = function (nodeList, callback) {
        for (let i = 0; i < nodeList.length; i++) {
            callback(nodeList[i], i);
        }
    }

    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
                  <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                  <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                  </a>
                </li>`;
            });

            //Insert list item
            document.querySelector(UISelector.itemList).innerHTML = html;

        },
        addItem: function (item) {
            const markup = `
             <li class="collection-item" id="item-${item.id}">
           <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
           <a href="#" class="secondary-content">
           <i class="edit-item fa fa-pencil"></i>
           </a>
           </li>
             `;

            document.querySelector(UISelector.itemList).insertAdjacentHTML('beforeend', markup);
        },
        addItemToForm: function (item) {
            document.querySelector(UISelector.itemNameInput).value = item.name;
            document.querySelector(UISelector.itemCaloriesInput).value = item.calories;

            this.showEditState();
        },
        displayTotalCalories: function (total) {
            document.querySelector(UISelector.totalCalories).innerHTML = total;
        },
        updateItem: function (updatedItem) {
            let listItems = document.querySelectorAll('#item-list li');

            nodeListForEach(listItems, function (item, index) {
                const itemID = item.getAttribute('id').split('-')[1];
                
                if (parseInt(itemID) === updatedItem.id) {
                    
                    document.querySelector(`#item-${itemID}`).innerHTML = `
                    
           <strong>${updatedItem.name}: </strong> <em>${updatedItem.calories} Calories</em>
           <a href="#" class="secondary-content">
           <i class="edit-item fa fa-pencil"></i>
           </a>
         
                    `;
                }
            });
        },
        deleteItem: function(id){
            const item = document.querySelector(`#item-${id}`);
            item.parentNode.removeChild(item);
        },
        changeInputFocus: function () {
            document.querySelector(UISelector.itemNameInput).focus();

        },
        clearFields: function () {
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';

            this.changeInputFocus();
        },
        showEditState: function () {
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },
        clearEditState: function () {
            this.clearFields();

            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';

        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelector.itemNameInput).value,
                calories: document.querySelector(UISelector.itemCaloriesInput).value
            }
        },
        getSelectors: function () {
            return UISelector;
        }
    }
})();

//App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {

    const loadEventListener = function () {
        //Get UI Selector
        const UISelector = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })

        //Edit icon click event
        document.querySelector(UISelector.itemList).addEventListener('click', itemEditClick)

        //Update item event
        document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Delete item event
        document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Back button event
        document.querySelector(UISelector.backBtn).addEventListener('click', backBtnEvent);

        //Clear button event
        document.querySelector(UISelector.clearBtn).addEventListener('click', clearAll);

    }

    const itemAddSubmit = function (e) {
        //Get item input
        const item = UICtrl.getItemInput();
        if (item.name !== '' && item.calories !== '') {
            //Add item to data structure
            const newItem = ItemCtrl.addItem(item);
            //Add item to UI
            UICtrl.addItem(newItem);
            //Store in local storage
            StorageCtrl.storeItem(newItem);

            //Update total calories
            updateTotalCalories();

        }

        e.preventDefault();
    }

    const updateTotalCalories = function(){
         //Get total calories
         const totalCalories = ItemCtrl.getTotalCalories();
         //Display total calories
         UICtrl.displayTotalCalories(totalCalories);
         //Clear Fields
         UICtrl.clearFields();
    }

    //Click edit item
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            const listID = e.target.parentNode.parentNode.id;
            //Node list --> Array
            const listIDArr = listID.split('-');

            //Get the actual id
            const id = parseInt(listIDArr[1]);

            //Get item from data structure
            const itemToEdit = ItemCtrl.getItemById(id);

            //Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form 
            UICtrl.addItemToForm(itemToEdit);

        }
    }

    //Update submit item
    const itemUpdateSubmit = function (e) {
        //Get item input
        const input = UICtrl.getItemInput();

        //Update item in data structure
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI
        UICtrl.updateItem(updatedItem);

        //Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        //Clear edit state
        UICtrl.clearEditState();

        //Update total calories
        updateTotalCalories();

        e.preventDefault();
    }
    //Delete submit item
    const itemDeleteSubmit = function (e){
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete item from UI
        UICtrl.deleteItem(currentItem.id);

        //Delete item from LS
        StorageCtrl.deleteItemStorage(currentItem.id);

        //Clear edit state
        UICtrl.clearEditState();

        //Update total calories
        updateTotalCalories();


        e.preventDefault();
    }

    //Back button event
    const backBtnEvent = function() {
        UICtrl.clearEditState();
    }

    const clearAll = function(e){
        ItemCtrl.clearAll();
        //Clear all from localstorage
        StorageCtrl.clearAll();
        // Fetch items from data structure
        const items = ItemCtrl.getItems();
        //Display on the UI
        UICtrl.populateItemList(items);

        UICtrl.clearEditState();
        e.preventDefault();
    }

    return {
        init: function () {
            console.log('Initializing app.....');
            loadEventListener();

            //Clear edit state
            UICtrl.clearEditState();

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Display total calories
            UICtrl.displayTotalCalories(totalCalories);

            // Fetch items from data structure
            const items = ItemCtrl.getItems();
            //Display on the UI
            UICtrl.populateItemList(items);

        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init();



