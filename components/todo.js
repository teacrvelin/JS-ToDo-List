export class Todo
{
    // Inicijalizacija DOM elemenata
    constructor(...params)
    {
        for (const element of params) {
            this[element] = document.querySelector('#' + element);
        }

        this.storageKey = 'tasks';
    }
    // Inicijalizacija aplikacije
    init()
    {
        this.checkStorage();
        this.addListeners();
    }
    // Provjeri da li ima spremljena lista u lokalnoj pohrani i ako ima, rekonsturiraj listu
    checkStorage()
    {
        if(window.localStorage !== undefined){
            let tasks = localStorage.getItem(this.storageKey);

            if(tasks !== null){
                tasks = JSON.parse(tasks);

                for (const [key, value] of Object.entries(tasks)) {
                    const item = this.createItem(value.name);
                          item.dataset.createDate = value.createDate;
                    
                    if(value.done){
                        item.classList.add('done')
                        item.querySelector('input').checked = true;
                        item.dataset.doneDate = value.doneDate;
                    }

                    this.todoList.appendChild(item);
                }
            }
        } else {
            alert('Tvoj preglednik ne podržava lokalnu pohranu!');
        }
    }
    // Dodavanje event listener-a 
    addListeners()
    {
        this.taskInput.addEventListener('keyup', this.pressEnter);
        this.addTask.addEventListener('click', this.addNewTask);
        this.saveTaskList.addEventListener('click', this.saveList);
        this.deleteTaskList.addEventListener('click', this.deleteList);
    }
    // Dodavanje novog taska pritiskom na tipku enter
    pressEnter = (event) =>
    {
        if(event.keyCode === 13){
            this.addNewTask(event);
        }
    }
    // Dodavanje novog taska
    addNewTask = (event) =>
    {
        event.preventDefault();

        const task = this.taskInput.value;

        if(!task){
            alert('Unesite task!');
            return false;
        }

        const item = this.createItem(task);

        this.todoList.appendChild(item);

        this.resetInput();
        
    }
    // Spremanje liste taskova u storage
    saveList = (event) =>
    {
        event.preventDefault();

        if(window.localStorage !== undefined){
            const li = this.todoList.querySelectorAll('li');

            if(li.length > 0){

                const tasks = {};
                for (let i = 0; i < li.length; i++) {
                    const doneDate = (li[i].dataset.doneDate) ? li[i].dataset.doneDate : null;
                    const checkbox = li[i].querySelector('input');

                    tasks['task'+ (i + 1)] = {
                        name: checkbox.nextSibling.textContent,
                        done: checkbox.checked,
                        createDate: li[i].dataset.createDate,
                        doneDate: doneDate
                    };
                }

                localStorage.setItem(this.storageKey, JSON.stringify(tasks));
                
                return true;
            }

            alert('Niste dodali niti jedan task!!!!');
            
        } else {
            alert('Tvoj preglednik ne podržava lokalnu pohranu!');
        }
    }
    // Brisanje liste taskova iz storage-a
    deleteList(event)
    {
        event.preventDefault();
        console.log('radi');
    }
    // Kreiranje novog elementa liste kao novi task
    createItem(task)
    {
        const item = document.createElement('li');
              item.innerText = task;
              item.dataset.createDate = this.createTimestamp();

        this.addCheckbox(item);
        this.addRemoveTaskBtn(item);

        return item;
    }
    // Dodaj checkbox u li element
    addCheckbox(item)
    {
        const checkbox = document.createElement('input');
              checkbox.setAttribute('type', 'checkbox');
              checkbox.addEventListener('change', this.markDone);

        item.prepend(checkbox);
        //item.insertBefore(checkbox, item.firstChild);
    }
    // Dodaj gumb za brisanje pojedinog taska
    addRemoveTaskBtn(item)
    {
        const btn = document.createElement('button');
              btn.setAttribute('type', 'button');
              btn.innerText = 'x';
              btn.addEventListener('click', this.removeItem);

        item.appendChild(btn);
    }
    // Označi task rješenim/nerješenim
    markDone = (event) =>
    {
        const checkbox = event.target;
        const item = checkbox.parentNode;

        item.classList.toggle('done');
        
        if(checkbox.checked){
            item.dataset.doneDate = this.createTimestamp();
        } else {
            item.dataset.doneDate = '';
        }  
    }
    // Izbriši tekst u input polji i napravi fokus na njega
    resetInput()
    {
        this.taskInput.value = '';
        this.taskInput.focus();
    }
    // Izbriši task iz liste
    removeItem = (event) =>
    {
        const btn = event.target;
        const li = btn.parentNode;

        if(!li.classList.contains('done')){
            li.remove();
        }
    }
    // Kreiraj timestamp
    createTimestamp()
    {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}