function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    });
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        user.getIdToken().then(token => console.log(token));
        findTasks(user);
    }
});

function newTask() {
    window.location.href = "../task/task.html";
}

function findTasks(user) {
    showLoading();
    TaskService.findByUser(user)
        .then(tasks => {
            hideLoading();
            addTasksToScreen(tasks);
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao recuperar tarefas');
        });
}

function addTasksToScreen(tasks) {
    const orderedList = document.getElementById('tasks');
    orderedList.innerHTML = '';

    tasks.forEach(task => {
        const li = createTaskListItem(task);
        li.appendChild(createDeleteButton(task));

        li.appendChild(createParagraph(formatDate(task.date)));
        li.appendChild(createParagraph(task.type));
        if (task.description) {
            li.appendChild(createParagraph(task.description));
        }

        orderedList.appendChild(li);
    });
}

function createTaskListItem(task) {
    const li = document.createElement('li');
        li.classList.add(task.type === 'closed' ? 'closed' : 'open');
        li.id = task.uid;
        li.addEventListener('click', () => {
            window.location.href = "../task/task.html?uid=" + task.uid;
        })
        return li;
}

function createDeleteButton(task) {
    const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Remover";
        deleteButton.classList.add('outline', 'danger');
        deleteButton.addEventListener('click', event => {
            event.stopPropagation();
            askRemoveTask(task);
        })
        return deleteButton;
}

function createParagraph(value) {
        const element = document.createElement('p');
        element.innerHTML = value;
        return element;    
}

function askRemoveTask(task) {
    const shouldRemove = confirm('Deseja remover a Tarefa?');
    if (shouldRemove) {
        removeTask(task);
    }
}

function removeTask(task) {
    showLoading();

    TaskService.remove(task)
        .then(() => {
            hideLoading();
            document.getElementById(task.uid).remove();
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao remover tarefa');
        });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}