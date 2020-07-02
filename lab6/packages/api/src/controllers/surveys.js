export function createSurveyController({ app, db }) {
	app.post('/surveys', async (req, res) => {
		try {
			await db.insert(req.body)
			res.json(req.body)
		} catch (err) {
			res.status(500)
			res.json({
				error: String(err.message || err).split('\n')[0],
			})
		}
	})
}
