function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    });
}


document.addEventListener('DOMContentLoaded', function () {
    const tasksInfo = document.getElementById('tasks-info');


    //carregar tarefas do Firestore
    function loadTasks() {
        const user = firebase.auth().currentUser;
        if (user) {
            const tasksRef = firebase.firestore().collection('tasks').where('userId', '==', user.uid);
            tasksRef.get().then((querySnapshot) => {
                tasksInfo.innerHTML = '';
                if (querySnapshot.empty) {
                    tasksInfo.innerHTML = '<p>Você não tem tarefas criadas.</p>';
                } else {
                    querySnapshot.forEach((doc) => {
                        const task = doc.data();
                        const taskElement = document.createElement('div');
                        taskElement.innerHTML = `
                            <h3>${task.title}</h3>
                            <p>${task.description}</p>
                            <p>Status: ${task.status}</p>
                        `;
                        tasksInfo.appendChild(taskElement);
                    });
                }
            }).catch((error) => {
                console.error('Erro ao carregar tarefas: ', error);
                tasksInfo.innerHTML = '<p>Erro ao carregar tarefas.</p>';
            });
        } else {
            tasksInfo.innerHTML = '<p>Você precisa estar logado para ver suas tarefas.</p>';
        }
    }


   
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            loadTasks();
        } else {
            tasksInfo.innerHTML = '<p>Você precisa estar logado para ver suas tarefas.</p>';
        }
    });
});
