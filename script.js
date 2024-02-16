const todoValue = document.getElementById("todoText");
const listItems = document.getElementById("list-items");
const addUpdateClick = document.getElementById("addUpdateClick");
const removeAllButton = document.getElementById("removeAll");
removeAllButton.addEventListener("click", removeAllItems);
let updateText;
const apiUrl = 'https://65c1ebcff7e6ea59682a0de4.mockapi.io/api/v1/todo/';
let taskIdCounter = 0;

document.addEventListener("DOMContentLoaded", function () {
    loadTasksFromApi();
    taskIdCounter = 0;
    
    const drake = dragula([listItems]);

    drake.on('drop', function () {
        saveTasksToApi();
    });
});

todoValue.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addUpdateClick.click();
    }
});



// function createToDoData() {
//     if (todoValue.value === "") {
//         alert("Please enter a task");
//         return;
//     }

//     const taskText = todoValue.value;
//     const li = createListItem(taskText, false);
//     listItems.appendChild(li);
//     todoValue.value = "";

//     saveTasksToApi();
// }

async function createToDoData() {
    if (todoValue.value === "") {
        alert("Please enter a task");
        return;
    }

    const taskText = todoValue.value;
    const li = createListItem(taskText, false);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskText: taskText,
                completed: false
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to add task to API. Status: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();
        li.dataset.id = responseData.id;
        listItems.appendChild(li);
        todoValue.value = "";

        alert("Task added successfully");
    } catch (error) {
        console.error('Error adding task to API:', error);
    }
}




async function completeToDoItems(element) {
    const listItem = findParentListItem(element);

    if (listItem && listItem.classList.contains("editing")) {
        return;
    }

    if (listItem) {
        const checkbox = listItem.querySelector("input");
        const divElement = listItem.querySelector("div");

        checkbox.checked = !checkbox.checked;
        divElement.style.textDecoration = checkbox.checked ? "line-through" : "";

        const taskId = listItem.dataset.id;
        const updatedTask = {
            taskText: listItem.querySelector("div span").innerText,
            completed: checkbox.checked,
        };

        try {
            const url = `${apiUrl}/${taskId}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTask)
            });

            if (!response.ok) {
                throw new Error(`Failed to update task in API. Status: ${response.status} - ${response.statusText}`);
            }

            console.log('Task updated in API successfully');
        } catch (error) {
            console.error('Error updating task in API:', error);
        }
    }
}


function findParentListItem(element) {
    let parent = element.parentElement;
    while (parent && parent.tagName !== "LI") {
        parent = parent.parentElement;
    }
    return parent;
}

function updateToDoItems(e) {
    console.log("value:",e)
    const listItem = e.closest("li");
    listItem.classList.add("editing");
    todoValue.value = listItem.querySelector("div span").innerText;
    updateText = listItem.querySelector("div span");
    addUpdateClick.onclick = updateOnSelectionItems;
    addUpdateClick.className = "fa-solid fa-arrows-rotate";
}

async function updateOnSelectionItems() {
    updateText.innerText = todoValue.value;
    alert("Task updated successfully");

    const listItem = findParentListItem(updateText);
    listItem.classList.remove("editing");

    const taskId = listItem.dataset.id;
    const updatedTask = {
        taskText: todoValue.value,
        completed: listItem.querySelector("input").checked,
    };

    try {
        const url = `${apiUrl}/${taskId}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });

        if (!response.ok) {
            throw new Error(`Failed to update task in API. Status: ${response.status} - ${response.statusText}`);
        }

        alert("Task updated successfully");

        addUpdateClick.onclick = createToDoData;
        addUpdateClick.className = "fa-solid fa-circle-plus";
        todoValue.value = "";
    } catch (error) {
        console.error('Error updating task in API:', error);
    }
}


async function updateTaskInAPI(taskId, updatedTask) {
    console.log(taskId)
    const url = `${apiUrl}/${taskId}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });

        if (!response.ok) {
            throw new Error(`Failed to update task in API. Status: ${response.status} - ${response.statusText}`);
        }

        console.log('Task updated in API successfully');
    } catch (error) {
        console.error('Error updating task in API:', error);
    }
}

// function deleteToDoItems(e) {
//     let listItem = e.closest("li");
//     let deleteValue = listItem.querySelector("div span").innerText;

//     if (confirm(`Do you want to delete this ${deleteValue}?`)) {
//         listItem.remove();
//         saveTasksToApi();
//     }
// }


async function deleteToDoItems(e) {
    let listItem = e.closest("li");
    let taskId = listItem.dataset.id;
    let deleteValue = listItem.querySelector("div span").innerText;

    if (confirm(`Do you want to delete this ${deleteValue}?`)) {
        try {
            const url = `${apiUrl}/${taskId}`;
            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete task from API. Status: ${response.status} - ${response.statusText}`);
            }

            listItem.remove();
            alert("Task deleted successfully");
        } catch (error) {
            console.error('Error deleting task from API:', error);
        }
    }
}




// function removeAllItems() {
//     if (confirm("Do you want to remove all tasks?")) {
//         while (listItems.firstChild) {
//             listItems.removeChild(listItems.firstChild);
//             addUpdateClick.className = "fa-solid fa-circle-plus";
//             todoValue.value = "";
            
//         }
//         saveTasksToApi();
//     }
// }

async function removeAllItems() {
    if (confirm("Do you want to remove all tasks?")) {
        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete all tasks from API. Status: ${response.status} - ${response.statusText}`);
            }

            while (listItems.firstChild) {
                listItems.removeChild(listItems.firstChild);
            }
            alert("All tasks deleted successfully");
        } catch (error) {
            console.error('Error deleting all tasks from API:', error);
        }
    }
}




async function saveTasksToApi() {
    const tasks = Array.from(listItems.children).map((li, index) => {
        const taskText = li.querySelector("div span").innerText;
        const completed = li.querySelector("input").checked;
        const id = li.dataset.id || ++taskIdCounter;
        li.dataset.id = id;
        return { taskText, completed, id };
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tasks)
        });

        if (!response.ok) {
            throw new Error(`Failed to save tasks to API. Status: ${response.status} - ${response.statusText}`);
        }

        console.log('Tasks saved to API successfully');
    } catch (error) {
        console.error('Error saving tasks to API:', error);
    }
}



async function loadTasksFromApi() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to load tasks from API. Status: ${response.status} - ${response.statusText}`);
        }
        const tasks = await response.json();

        tasks.forEach(({ taskText, completed, id}) => {
            taskIdCounter = Math.max(taskIdCounter, id); 
            const li = createListItem(taskText, completed, id );
            listItems.appendChild(li);
        });

        console.log('Tasks loaded from API successfully');
    } catch (error) {
        console.error('Error loading tasks from API:', error);
    }
}




function createListItem(taskText, completed, id) {
    const li = document.createElement("li");

    if (!id) {
        id = ++taskIdCounter;
    }

    li.dataset.id = id;

    const todoItems = `<div>
                        <input type="checkbox" onchange="completeToDoItems(this)" ${completed ? 'checked' : ''}>
                        <span>${taskText}</span>
                        </div>
                        <div>
                            <i onclick="updateToDoItems(this)" class="todo-controls fa-regular fa-pen-to-square"></i>
                            <i onclick="deleteToDoItems(this)" class="todo-controls fa-solid fa-eraser disabled"></i>
                        </div>`;

    li.innerHTML = todoItems;

    const checkbox = li.querySelector("input");
    const divElement = li.querySelector("div");

    if (completed) {
        checkbox.checked = true;
        divElement.style.textDecoration = "line-through";
    }

    li.addEventListener("click", function(event) {
        if (!event.target.matches('.todo-controls')) {
            completeToDoItems(li.querySelector("input"));
        }
    });

    return li;
}