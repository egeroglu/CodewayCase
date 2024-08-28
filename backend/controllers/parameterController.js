import firestore from '../db.js';
import Parameter from '../models/Parameter.js';

export const addParameter = async (req, res, next) => {
    try {
        const data = req.body;
        const parameterKey = data.parameter_key;

        const parameterRef = firestore.collection('parameters').doc(parameterKey);
        const docSnapshot = await parameterRef.get();

        if (docSnapshot.exists) {
            res.status(400).send('A parameter with this key already exists.');
        } else {
            await parameterRef.set(data);
            res.send('Record saved successfully with ID: ' + parameterKey);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const getAllParameters = async (req, res, next) => {
    try {
        const parameters = await firestore.collection('parameters');
        const data = await parameters.get();
        const parametersArray = [];
        if (data.empty) {
            res.status(404).send('No parameter record found');
        } else {
            data.forEach(doc => {
                const parameter = new Parameter(
                    doc.data().parameter_key,
                    doc.data().value,
                    doc.data().description,
                    doc.data().create_date
                );
                parametersArray.push(parameter);
            });
            res.send(parametersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const getParameter = async (req, res, next) => {
    try {
        const id = req.params.id;
        const parameter = await firestore.collection('parameters').doc(id);
        const data = await parameter.get();
        if (!data.exists) {
            res.status(404).send('Parameter with the given key not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const updateParameter = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const newParameterKey = data.parameter_key;

        const parameterRef = firestore.collection('parameters').doc(id);
        const docSnapshot = await parameterRef.get();

        if (!docSnapshot.exists) {
            return res.status(404).send('Parameter with the given key not found.');
        }

        if (newParameterKey !== id) {
            const existingParameterRef = firestore.collection('parameters').doc(newParameterKey);
            const existingDocSnapshot = await existingParameterRef.get();

            if (existingDocSnapshot.exists) {
                return res.status(400).send('A parameter with this key already exists.');
            }
        }

        await parameterRef.delete();
        const newParameterRef = firestore.collection('parameters').doc(newParameterKey);

        const updatedData = {
            ...docSnapshot.data(),
            ...data
        };

        await newParameterRef.set(updatedData);

        res.send('Parameter record updated successfully with new ID: ' + newParameterKey);
    } catch (error) {
        res.status(400).send(error.message);
    }
};


export const deleteParameter = async (req, res, next) => {
    try {
        const id = req.params.id;

        const parameterRef = firestore.collection('parameters').doc(id);
        const docSnapshot = await parameterRef.get();

        if (!docSnapshot.exists) {
            return res.status(404).send('Parameter with the given key not found.');
        }

        await parameterRef.delete();
        res.send('Record deleted successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};
