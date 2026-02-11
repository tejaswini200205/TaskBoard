const appName = "Task Board"
const savedTasks = localStorage.getItem("tasks");
let tasks = savedTasks ? JSON.parse(savedTasks) : [];

//function to save tasks
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Set app title
document.getElementById("appTitle").textContent = appName;

//Show Tasks Variables
const taskContainer = document.getElementById("taskContainer");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

//Search + Filter Elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

//Clear Button
const clearBtn = document.getElementById("clearBtn");
clearBtn.style.display = "none";

const allFilter = document.getElementById("allFilter");
const pendingFilter = document.getElementById("pendingFilter");
const completedFilter = document.getElementById("completedFilter");

//Filter state variables
let currentFilter = "all";
let searchText = "";

//Button : Click Event - ADD TASK
addTaskBtn.addEventListener("click", function(){
    const taskText = taskInput.value.trim();
    if (taskText == "") return;
    tasks.push({
        text : taskText,
        completed : false
    });
    taskInput.value = "";
    saveTasks();
    renderTasks();
});

//Filter button events
allFilter.addEventListener("click", function(){
    currentFilter = "all";
    renderTasks();
});

pendingFilter.addEventListener("click", function(){
    currentFilter = "pending";
    renderTasks();
});

completedFilter.addEventListener("click", function(){
    currentFilter = "completed";
    renderTasks();
});

//Search Event
searchInput.addEventListener("input", function(){
    if(searchInput.value.trim() === "") {
        // searchText = "";
        // renderTasks();
        clearBtn.style.display = "none";
    }
    else{
        clearBtn.style.display = "inline";
    }
});

//Search Function
function performSearch(){
    searchText = searchInput.value.toLowerCase();
    renderTasks();
}

//Search button click event
searchBtn.addEventListener("click", performSearch);
searchInput.addEventListener("keypress", function(e){
    if (e.key === "Enter"){
        performSearch();
    }
});

//Clear function
clearBtn.addEventListener("click", function(){
    searchInput.value = "";
    searchText = "";
    renderTasks();
});

//Render Function
function renderTasks(){
    taskContainer.innerHTML = "";
    let filteredTasks = tasks;

    //Filter by search text
    if(searchText !== ""){
        filteredTasks = tasks.filter((task) =>
        task.text.toLowerCase().includes(searchText));
    }

    //Filter by Status
    else{
            if(currentFilter == "pending"){
                filteredTasks = filteredTasks.filter((task) => !task.completed);
            }
            if(currentFilter == "completed"){
                filteredTasks = filteredTasks.filter((task) => task.completed);
            }
    }

    //If no task matches 
    if(filteredTasks.length == 0){
        taskContainer.innerHTML = "<p> No tasks found ❌ </p>";
        return;
    }

    filteredTasks.forEach(function(note, index) {
    const taskDiv = document.createElement("div");
    //taskDiv.textContent = note;
    taskDiv.style.border = "1px solid black";
    taskDiv.style.margin = "5px";
    taskDiv.style.padding = "8px";
    taskDiv.style.display = "flex";
    taskDiv.style.justifyContent = "space-between";
    //console.log(tasks);

    const taskText = document.createElement("span");
    taskText.textContent = note.text;
    if(note.completed){
        taskText.style.textDecoration = "line-through";
        taskText.style.color = "gray";
    }

    //Complete button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = note.completed ? "Undo" : "Complete";
    completeBtn.addEventListener("click", function(){
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    });

    //Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function(){
        tasks.splice(index,1);
        saveTasks();
        renderTasks();
    });

    taskDiv.appendChild(taskText);
    taskDiv.appendChild(completeBtn);
    taskDiv.appendChild(deleteBtn);

    taskContainer.appendChild(taskDiv);

});
}

renderTasks();
