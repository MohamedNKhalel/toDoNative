let mainBtn =  document.querySelector('.main-btn');
let addBtn = document.getElementById('addBtn');
let titleInput =  document.getElementById('titleInput');
let descInput =  document.getElementById('descInput');
let taskLayout = document.querySelector('.add-task-layout');
let closeLyaout = document.querySelector(".fa-xmark-circle");
let addForm =  document.querySelector('.add-form');
let updateBtn = document.getElementById('updateBtn');
let taskIndex = 0;
let idCounter =0;
let tasks = [];
let tableTasks = [];
let clearTableBtn = document.getElementById('clearTableBtn');
let notification = document.getElementById('notification');
// start cheking the localStorage not empty so that we can benefit from the resistant data 
if(localStorage.getItem('tasks') !=  null ){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    displayTasks()
    
}
if(localStorage.getItem('tableTasks') != null){
    tableTasks = JSON.parse(localStorage.getItem('tableTasks'));
    idCounter = JSON.parse(localStorage.getItem('taskId'))
    displayTasksTable();
    console.log(idCounter);
}
//end cheking the localStorage not empty so that we can benefit from the resistant data 


//start opening the modal 
mainBtn.addEventListener('click',()=>{
    taskLayout.classList.toggle('d-none');
    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none')
})
//end opening the modal 


//start showing and hiding the modal 
closeLyaout.addEventListener('click',()=>{
    closeForm()
})
taskLayout.addEventListener('click',()=>{
    closeForm()
})
addForm.addEventListener('click',(e)=>{
    e.stopPropagation()
})
//end showing and hiding the modal 

clearTableBtn.addEventListener('click',()=>{
    clearTable();
})

// start function to clear the table content if not needed with ensurning the running tasks can't be deleted 
function clearTable(){
    const table = document.getElementById("tableTasks");
        if(tasks.length >0){
            alert(`can't delete while some tasks are running!`)
        }else{
            if(confirm('are you sure ? your data will be lost !')){
                while (table.rows.length > 1) {  
                    table.deleteRow(table.rows.length-1);
                }
                console.log(table.rows.length-1);
                
                localStorage.removeItem('taskId');
                localStorage.removeItem('tableTasks');
            }
        }
}
// start function to clear the table content if not needed with ensurning the running tasks can't be deleted 


// start verifying the inputs are not empty 
titleInput.addEventListener('input',checkForm)
descInput.addEventListener('input',checkForm)
function checkForm(){
    if(titleInput.value != '' && descInput.value != ''){
        addBtn.disabled = false;
        return true
    }
    else{
        console.log("none");
        addBtn.disabled = true;
        return false;
    }
}
// end verifying the inputs are not empty 

// when click on the notification it disappears 
notification.addEventListener('click',()=>{
    // notification.classList.add('d-none')
    notification.style.opacity = 0;
})


// start function to add tasks to the localStorage and the array of the tasks and display the tasks and table content 
function addTask(){
    let checking =checkForm()
    if(checking == true){
        let task={
            title:titleInput.value,
            desc:descInput.value,
            date:new Date().toLocaleString(),
            status:"running",
            id:idCounter,
            running:true
        };
        tasks.push(task);
        tableTasks.push(task);
        idCounter++;
        notification.classList.add('bg-success');
        notification.innerHTML = `<i class="fas fa-check-circle fa-xl text-white pe-2"></i> Task added successfully`;
        notification.style.opacity = 1;
        setTimeout(() => {
            notification.classList.remove('bg-success');
            notification.style.opacity = 0;
        }, 3000);
        localStorage.setItem('tasks',JSON.stringify(tasks));
        localStorage.setItem('tableTasks',JSON.stringify(tableTasks));
        localStorage.setItem('taskId' , JSON.stringify(idCounter))
        console.log(tableTasks);
        console.log(tasks);
        displayTasks();
        displayTasksTable();
        closeForm();
        addBtn.disabled =true;
    }
}
// end function to add tasks to the localStorage and the array of the tasks and display the tasks and table content 

// start dynamic table to display tasks 
function displayTasksTable(){
    let box = ``;
    for(let i = 0 ; i < tableTasks.length ; i++){
        box+=`
        <tr>
            <td class="text-muted fw-bold">${i+1}</td>
            <td class="text-uppercase">${tableTasks[i].title}</td>
            <td>${tableTasks[i].date}</td>
            <td class="text-uppercase">${tableTasks[i].status}</td>
        </tr>
        `
    }

    document.querySelector('.table-content').innerHTML = box;
}
// end dynamic table to display tasks 


// start tasks container 
function displayTasks(){
    let cartoona = ``;
    for(let i = 0 ; i < tasks.length ; i++){
        cartoona+=`
        <div class="col-md-4">
                        <div class="my-card rounded-2 shadow bg-body-tertiary">
                            <div class="head d-flex justify-content-between align-items-center px-3 py-2 bg-dark-subtle">
                                <h3 class="text-capitalize">${tasks[i].title}</h3>
                                <i class="fa fa-list-dots cursor-pointer" data-bs-toggle="dropdown"></i>
                                <ul class="dropdown-menu">
                                    <li><a onclick="openUpdateForm(${i})" class="dropdown-item cursor-pointer">Edit</a></li>
                                    <li><a onclick="deleteTask(${i},${tasks[i].id})" class="dropdown-item cursor-pointer">Delete</a></li>
                                </ul>
                            </div>
                            <div class="body text-center  p-2">
                                <p>${tasks[i].desc}</p>
                            </div>
                            <div  class="footer bg-body-secondary p-2">
                                <div  onclick="completeTask(${tasks[i].id},${i})" class="text-center cursor-pointer">
                                    <i class="fa-regular fa-circle-check"></i>
                                    <span>Mark as completed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `
    }

    document.querySelector('.task-row').innerHTML = cartoona;
}
// end tasks container 

//start function to clear form inputs 
function closeForm(){
    titleInput.value = '';
    descInput.value = '';
    taskLayout.classList.add('d-none');
}
//end function to clear form inputs 

//start interaction with table to display completed tasks 
function completeTask(id,index){
    tableTasks[id].status = 'completed';
    tableTasks[id].running = false;
    notification.classList.add('bg-success');
    notification.innerHTML = `<i class="fas fa-check-circle fa-xl text-white pe-2"></i> Task Completed`;
    notification.style.opacity = 1;
    setTimeout(() => {
        notification.classList.remove('bg-success');
        notification.style.opacity = 0;
    }, 3000);
    tasks.splice(index , 1);
    displayTasks();
    displayTasksTable();
    localStorage.setItem('tasks',JSON.stringify(tasks));
    localStorage.setItem('tableTasks',JSON.stringify(tableTasks));
}
//start interaction with table to display completed tasks 

//start function to delete tasks from the main conatiner 
function deleteTask(index,id){
    notification.classList.add('bg-success');
    notification.innerHTML = `<i class="fas fa-check-circle fa-xl text-white pe-2"></i> Task deleted successfully`;
    notification.style.opacity = 1;
    setTimeout(() => {
        notification.classList.remove('bg-success');
        notification.style.opacity = 0;
    }, 3000);
    tasks.splice(index ,1);
    tableTasks[id].status = 'deleted';
    tableTasks[id].running = false;
    localStorage.setItem('tasks',JSON.stringify(tasks))
    localStorage.setItem('tableTasks',JSON.stringify(tableTasks))
    displayTasks()
    displayTasksTable()
}
//end function to delete tasks from the main conatiner 


//start function to open update form modal with dynamic buttons changes from add to edit 
function openUpdateForm(index) 
{   
    taskIndex = index;
    taskLayout.classList.toggle('d-none');
    updateBtn.classList.remove('d-none');
    addBtn.classList.add('d-none');
    titleInput.value = tasks[index].title;
    descInput.value = tasks[index].desc;
}
//end function to open update form with dynamic buttons changes from add to edit 


// start function=> after openning the modal press the confirmation button to submit update 
function updateTask(){
    tasks[taskIndex].title = titleInput.value;
    tasks[taskIndex].desc = descInput.value;
    notification.classList.add('bg-warning');
        notification.innerHTML = `<i class="fas fa-check-circle fa-xl text-white pe-2"></i> Task updated successfully`;
        notification.style.opacity = 1;
        setTimeout(() => {
            notification.classList.remove('bg-warning');
            notification.style.opacity = 0;
        }, 3000);
    localStorage.setItem('tasks',JSON.stringify(tasks));
    displayTasks();
    closeForm();
}
// end function=> after openning the modal press the confirmation button to submit update 

