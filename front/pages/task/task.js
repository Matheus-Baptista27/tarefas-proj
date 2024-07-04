firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        // redirciona a página de login se o usuário não estiver autenticado
        window.location.href = "../auth/login.html";
    }
});

if (!isNewTask()) {
    const uid = getTaskUid();
    findTaskByUid(uid);
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    });
}

function getTaskUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid');
}

function isNewTask() {
    return !getTaskUid();
}

function findTaskByUid(uid) {
    showLoading();

    TaskService.findByUid(uid)
        .then(task => {
            hideLoading();
            if (task) {
                console.log(task); 
                fillFormWithTaskData(task);
                toggleSaveButtonDisable();
            } else {
                alert("Documento não encontrado");
                window.location.href = "../home/home.html";
            }
        })
        .catch(error => {
            hideLoading();
            console.error("Erro ao recuperar documento:", error);
            alert('Erro ao recuperar documento');
            window.location.href = "../home/home.html";
        });
}

function saveTask() {
    showLoading();

    const user = firebase.auth().currentUser;

    if (user) {
        const task = createTask(user);

        if (isNewTask()) {
            TaskService.save(task)
                .then(() => {
                    hideLoading();
                    window.location.href = "../home/home.html";
                })
                .catch(() => {
                    hideLoading();
                    alert('Erro ao salvar tarefa');
                });
        } else {
            const uid = getTaskUid();
            TaskService.update(task, uid)
                .then(() => {
                    hideLoading();
                    window.location.href = "../home/home.html";
                })
                .catch(() => {
                    hideLoading();
                    alert('Erro ao atualizar tarefa');
                });
        }
    } else {
        hideLoading();
        alert('Usuário não autenticado');
        window.location.href = "../auth/login.html";
    }
}

function createTask(user) {
    return {
        type: form.typeOpen().checked ? "open" : "closed",
        date: form.date().value,
        taskType: form.taskType().value,
        description: form.description().value,
        user: {
            uid: user.uid
        }
    };
}

function fillFormWithTaskData(task) {
    form.date().value = task.date;
    form.taskType().value = task.taskType;
    form.description().value = task.description;
    if (task.type === "closed") {
        form.typeClosed().checked = true;
    } else {
        form.typeOpen().checked = true;
    }
}

function onChangeDate() {
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? "block" : "none";

    toggleSaveButtonDisable();
}

function onChangeTaskType() {
    const taskType = form.taskType().value;
    form.taskTypeRequiredError().style.display = !taskType ? "block" : "none";

    toggleSaveButtonDisable();
}

function toggleSaveButtonDisable() {
    form.saveButton().disabled = !isFormValid();
}

function isFormValid() {
    const date = form.date().value;
    if (!date) {
        return false;
    }

    const taskType = form.taskType().value;
    if (!taskType) {
        return false;
    }

    return true;
}

const form = {
    date: () => document.getElementById('date'),
    dateRequiredError: () => document.getElementById('date-required-error'),
    description: () => document.getElementById('description'),
    taskType: () => document.getElementById('task-type'),
    taskTypeRequiredError: () => document.getElementById('task-type-required-error'),
    typeOpen: () => document.getElementById('open'),
    typeClosed: () => document.getElementById('closed'),
    saveButton: () => document.getElementById('save-button'),
};