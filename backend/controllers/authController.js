import firestore from '../db.js';

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usersRef = firestore.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(401).send('Invalid email or password.');
        }

        let user;
        snapshot.forEach(doc => {
            user = doc.data();
        });

        if (user.password === password) {
            res.send({ message: 'Signin successful!', user });
        } else {
            res.status(401).send('Invalid email or password.');
        }
    } catch (error) {
        res.status(500).send('Internal server error.');
    }
};
