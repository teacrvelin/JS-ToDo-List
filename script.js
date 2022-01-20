import {Todo} from './components/todo.js';

(function(){
    "use strict";

    const todo = new Todo('taskInput', 'addTask', 'todoList', 'saveTaskList', 'deleteTaskList'); 
    todo.init();
    
    //window.addEventListener('load', todo.init());
    console.log(todo);
})();
