const FeatureReliance = {
	'never-used': 0,
	'alternatives-exist': 1,
	'desperately-need': 2,
}

export function createSurveyController({ app, db }) {
	app.post('/surveys', async (req, res) => {
		try {
			res.json(await db.insert({
				...req.body,
				createdAt: Date.now(),
			}))
		} catch (err) {
			res.status(500)
			res.json({
				error: String(err.message || err).split('\n')[0],
			})
		}
	})
	app.get('/surveys/summary', async (req, res) => {
		try {
			const rows = db.find()
			const summary = rows.reduce((summary, row) => {
				summary.numResponses++
				summary.usefulness += Number(row.usefulness)

				summary.favourites[row.favComponent] = summary.favourites[row.favComponent] || 0
				summary.favourites[row.favComponent]++

				summary.moreExposure[row.featuresForMoreExposure] = summary.moreExposure[row.featuresForMoreExposure] || 0
				summary.moreExposure[row.featuresForMoreExposure]++

				summary.featureReliance.tooltips += FeatureReliance[row['tooltips-reliance']]
				summary.featureReliance.modals += FeatureReliance[row['modals-reliance']]
				summary.featureReliance.formValidation += FeatureReliance[row['form-validation-reliance']]
				summary.featureReliance.popOvers += FeatureReliance[row['popovers-reliance']]
				summary.featureReliance.progressBars += FeatureReliance[row['progress-bar-reliance']]
				summary.featureReliance.scrollspy += FeatureReliance[row['scrollspy-reliance']]

				return summary
			}, {
				numResponses: 0,
				usefulness: 0,
				favourites: {},
				moreExposure: {},
				featureReliance: {
					tooltips: 0,
					modals: 0,
					formValidation: 0,
					popOvers: 0,
					progressBars: 0,
					scrollspy: 0,
				},
			})

			summary.usefulness /= rows.length

			res.json(summary)
		} catch (err) {
			res.status(500)
			res.json({
				error: String(err.message || err).split('\n')[0],
			})
		}
	})
}
