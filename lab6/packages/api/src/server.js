import * as fs from 'fs'
import * as path from 'path'
import * as http from 'http'

import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import * as bodyParser from 'body-parser'

import { createSurveyController } from './controllers/surveys'

const dbPath = path.resolve(__dirname, 'data.json')

class DataStore {
	constructor() {
		try {
			this.data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
		} catch (error) {
			if (error.code !== 'ENOENT') {
				throw error
			}
			this.data = []
		}
	}
	insert(row) {
		this.data.push(row)
		return fs.promises.writeFile(dbPath, JSON.stringify(this.data, null, '\t') + '\n')
	}
	find() {
		return this.data.slice()
	}
}

const db = new DataStore()
const app = express()
const server = http.createServer(app)

app.use(morgan('dev'))
app.use(cors({
	origin(origin, done) {
		done(null, { origin: true })
	},
}))
app.use(bodyParser.json())

createSurveyController({ app, db })

server.listen(Number(process.env.PORT || 8080), () => {
	console.log(`Listening on :${server.address().port}`)
})
