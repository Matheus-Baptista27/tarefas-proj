import admin from 'firebase-admin';

export class TaskRepository {

    findByUserUid(uid) {
        return admin.firestore()
            .collection('tasks')
            .where('user.uid', '==', uid)
            .orderBy('date', 'desc')
            .get()
            .then(snapshot => {
                return snapshot.docs.map(doc => ({
                    ...doc.data(),
                    uid: doc.id
                }))
            })
    }

    findByUid(uid) {
        return admin.firestore()
            .collection('tasks')
            .doc(uid)
            .get()
            .then(snapshot => snapshot.data());
    }

    save(task) {
        return admin.firestore()
            .collection('tasks')
            .add(JSON.parse(JSON.stringify(task)))
            .then(response => ({uid: response.id}));
    }

    update(task) {
        return admin.firestore()
        .collection('tasks')
        .doc(task.uid)
        .update({
            date: task.date,
            description: task.description,
            taskType: task.taskType,
             type: task.type
        })
    }

    delete(task) {
        return admin.firestore()
        .collection('tasks')
        .doc(task.uid)
        .delete();
    }

}