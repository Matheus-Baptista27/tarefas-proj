const TaskService = {
    findByUser: user => {
        return new Promise(async (resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open(
                "GET",
                "http://localhost:3000/tasks",
                true
            );

            xhr.setRequestHeader('Authorization', await firebase.auth().currentUser.getIdToken())

            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status != 200) {
                        reject(this.responseText);
                    }
                    console.log(this.responseText);
                }
            };

            xhr.send();
        }) 
    },
    /*return firebase.firestore()
            .collection('tasks')
            .where('user.uid', '==', user.uid)
            .orderBy('date', 'desc')
            .get()
            .then(snapshot => {
                return snapshot.docs.map(doc => ({
                    ...doc.data(),
                    uid: doc.id
                }));
            });*/ 
    findByUid: uid => {
        return firebase.firestore()
            .collection("tasks")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.exists ? { ...doc.data(), uid: doc.id } : null;
            });
    },

    remove: task => {
        return firebase.firestore()
            .collection("tasks")
            .doc(task.uid)
            .delete();
    },

    save: task => {
        return firebase.firestore()
            .collection('tasks')
            .add(task);
    },

    update: (task, uid) => {
        return firebase.firestore()
            .collection('tasks')
            .doc(uid)
            .set(task, { merge: true});
    }
};


// Exportando TaskService globalmente
window.TaskService = TaskService;
