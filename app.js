//Storage Controller
const StorageCTRL = (function(){

    return {
        storeItem: function(item){
            let items;
            //Check if items
            if(localStorage.getItem('items') === null){
                items = [];
                //push new item
                items.push(item);
                //Set local storage
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                //Get local storage
                items = JSON.parse(localStorage.getItem('items'));
                //Push new item
                items.push(item);
                //Set local storage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage:function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            //Set local storage
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            //Set local storage
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }

})();

//Item Controller
const ItemCtrl = (function(){

    //Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        items: StorageCTRL.getItemsFromStorage(),
        // items: [
        //     // {id: 0, name: 'Steak Dinner', calories: 1200},
        //     // {id: 1, name: 'Cookie', calories: 400},
        //     // {id: 2, name: 'Eggs', calories: 300}
        // ],
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            //Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            //calories to number
            calories = parseInt(calories);

            //create item
            newItem = new Item(ID, name, calories);

            //Add to items arr
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found = null;
            //Loop through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },
        updateItem: function(name, calories){
            calories = parseInt(calories);
            let found = null;
            //loop through items
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            //Get IDS
            ids = data.items.map(function(item){
                return item.id;
            });

            //Get index
            index = ids.indexOf(id);
            //Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            //loop through items & add calories
            data.items.forEach(function(item){
                total += item.calories;
            });

            //set total calories
            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }

})();

//UI Controller
const UICtrl = (function(){

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
                html += `
                    <li id="item-${item.id}" class="collection-item">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    </li>
                `;
            });

            //Insert li's
            document.querySelector(UISelectors.itemList).innerHTML = html;

        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            //Show list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            
            //Create LI element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;

            li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
            `;

            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemId = listItem.getAttribute('id');

                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                    `;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            document.querySelector(itemID).remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }

})();

//App Constroller
const App = (function(ItemCtrl, StorageCTRL, UICtrl){
    //Load event listeners
    const loadEventListeners = function(){
        //Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keycode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        //Edit icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Update Item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Delete Item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Clear All Item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

        //Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
    }

    const itemAddSubmit = function(e){

        //Get form input from UICtrl
        const input = UICtrl.getItemInput();

        //Check for input values
        if(input.name !== '' && input.calories !== ''){
            //Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add item to UI list
            UICtrl.addListItem(newItem);
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to ui
            UICtrl.showTotalCalories(totalCalories);
            //Store in local storage
            StorageCTRL.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    //Edit item click
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //Get list item id
            const listId = e.target.parentNode.parentNode.id;
            //break into array
            const listIdArr = listId.split('-');
            //Get ID
            const id = parseInt(listIdArr[1]);

            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //Set CurrentItem
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    //Update Item
    const itemUpdateSubmit = function(e){

        //get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        //Update local storage
        StorageCTRL.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //Delete Item
    const itemDeleteSubmit = function(e){
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        //Delete from local storage
        StorageCTRL.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //Clear all items event
    const clearAllItemsClick = function(e){
        //Delete all items from data
        ItemCtrl.clearAllItems();

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        //Remove from UI
        UICtrl.removeItems();

        //Clear local storage
        StorageCTRL.clearItemsFromStorage();

        UICtrl.hideList();

        e.preventDefault();
    }

    //Init the app
    return {
        init: function(){

            //Set initial state
            UICtrl.clearEditState();

            //Fetch Items from data structure
            const items = ItemCtrl.getItems();

            //Check if any items
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                //Populate List
                UICtrl.populateItemList(items);
            }

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to ui
            UICtrl.showTotalCalories(totalCalories);
        
            //load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCTRL, UICtrl);

//Initialise App
App.init();