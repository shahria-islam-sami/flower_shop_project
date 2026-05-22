const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const databaseRoutingConnectionString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perfect_flower_shop_db';

mongoose.connect(databaseRoutingConnectionString)
    .then(() => console.log('Connected to target MongoDB storage container engine established safely.'))
    .catch(err => console.error('Database configuration layer connectivity fault parameters details:', err));

const FlowerArrangementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, required: true },
    active: { type: Boolean, default: false }
}, { timestamps: true });

const FlowerArrangementModel = mongoose.model('FlowerProduct', FlowerArrangementSchema);

app.post('/api/flowers', async (req, res) => {
    try {
        const structuralNewInstance = new FlowerArrangementModel(req.body);
        const committedDocumentResponse = await structuralNewInstance.save();
        res.status(201).json(committedDocumentResponse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/flowers', async (req, res) => {
    try {
        const collectedDocumentsIndex = await FlowerArrangementModel.find().sort({ createdAt: -1 });
        res.json(collectedDocumentsIndex);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/flowers/:id', async (req, res) => {
    try {
        const alteredDocumentResult = await FlowerArrangementModel.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(alteredDocumentResult);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.delete('/api/flowers/:id', async (req, res) => {
    try {
        await FlowerArrangementModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, operationalMessage: "Target record erased from partitions data memory cleanly." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const EXECUTION_PORT = process.env.PORT || 5000;
app.listen(EXECUTION_PORT, () => {
    console.log(`Perfect Web Application Live Stream Operating At: http://localhost:${EXECUTION_PORT}`);
});