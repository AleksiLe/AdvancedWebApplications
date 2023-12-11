"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
let vehicles = [];
app.use(express_1.default.json());
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});
app.get('/vehicle/search/:model', (req, res) => {
    try {
        const model = req.params.model;
        const filteredVehicles = vehicles.filter(vehicle => vehicle.model === model);
        if (filteredVehicles.length === 0) {
            res.status(404).send(`No vehicles found with model ${model}`);
        }
        else {
            res.status(200).send(filteredVehicles);
        }
    }
    catch (error) {
        res.status(400).send("Something went wrong");
    }
});
app.post('/vehicle/add', (req, res) => {
    try {
        if (req.body.bodyType) {
            const newVehicle = req.body;
            vehicles.push(newVehicle);
        }
        else if (req.body.draft) {
            const newVehicle = req.body;
            vehicles.push(newVehicle);
        }
        else if (req.body.wingspan) {
            const newVehicle = req.body;
            vehicles.push(newVehicle);
        }
        else {
            const newVehicle = req.body;
            vehicles.push(newVehicle);
        }
        console.log(vehicles);
        res.status(201).send(`Vehicle added`);
    }
    catch (error) {
        res.status(400).send("Something went wrong");
    }
});
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
