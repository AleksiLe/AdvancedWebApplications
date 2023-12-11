import express, {Express, Request, Response} from "express"

const app: Express = express()
const port: number = 3000

interface Vehicle {
    model: string,
    color: string,
    year: number,
    power: number,
}

interface Car extends Vehicle {
    bodyType: string,
    wheelCount: number
}

interface Boat extends Vehicle {
    draft: number
}

interface Plane extends Vehicle {
    wingspan: number
}

let vehicles: Vehicle[] = []

app.use(express.json())

app.get('/hello', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.get('/vehicle/search/:model', (req: Request, res: Response) => {
    try {
        const model: string = req.params.model
        const filteredVehicles: Vehicle[] = vehicles.filter(vehicle => vehicle.model === model)
        if (filteredVehicles.length === 0) {
            res.status(404).send(`No vehicles found with model ${model}`)
        }
        else {
            res.status(200).send(filteredVehicles)
        }
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

app.post('/vehicle/add', (req: Request, res: Response) => {
    try {
        if (req.body.bodyType) {
            const newVehicle: Car = req.body
            vehicles.push(newVehicle)
        }
        else if (req.body.draft) {
            const newVehicle: Boat = req.body
            vehicles.push(newVehicle)
        }
        else if (req.body.wingspan) {
            const newVehicle: Plane = req.body
            vehicles.push(newVehicle)
        }
        else {
            const newVehicle: Vehicle = req.body
            vehicles.push(newVehicle)
        }
        console.log(vehicles)
        res.status(201).send(`Vehicle added`)
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})