import React from 'react'
import { render } from 'react-dom'
import useSWR from 'swr'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { axios } from './axios'

function ProgressBar({ width, className = '', children }) {
	return (
		<div className={`progress ${className}`}>
			<div
				className="progress-bar"
				role="progressbar"
				style={{ width: `${width}%` }}
				aria-valuenow={width}
				aria-valuemin="0"
				aria-valuemax="100"
			>
				{children}
			</div>
		</div>
	)
}

function App() {
	const { data: summary, error, mutate: updateSummary, isValidating } = useSWR('/surveys/summary', async () => {
		await new Promise(r => setTimeout(r, 250))
		const { data } = await axios.get('/surveys/summary')
		return data
	})

	if (error) {
		return (
			<div className="container my-5">
				<div className="row mb-5">
					<div className="col">
						<div className="alert alert-danger" role="alert">
							{String(error)}
						</div>
					</div>
				</div>
			</div>
		)
	}
	if (!summary) {
		return (
			<div className="container my-5">
				<div className="row">
					<div className="col">
						<div className="spinner-border text-primary" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="container my-5">
			<div className="row mb-5">
				<div className="col">
					<h1 className="text-center">Results Dashboard • Bootstrap Feedback Survey</h1>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<div className="form-group mt-0 row">
						<div className="col">
							<p className="lead">There have been <span className="badge badge-pill badge-primary">{summary.numResponses}</span> responses to the survey so far.</p>
						</div>
						<div className="col-auto">
							<button
								type="button"
								className="btn btn-primary"
								disabled={isValidating}
								onClick={() => updateSummary()}
							>
								<i className="fas fa-sync mr-2" />
								{isValidating ? 'Fetching results ...' : 'Update results'}
							</button>
						</div>
					</div>

					<div className="form-group">
						<p className="lead">"Overall, how useful do you find the Bootstrap Docs to learn how Bootstrap works?"</p>
						<ProgressBar width={summary.usefulness / 5 * 100}>
							{Math.round(summary.usefulness * 10) / 10}{' / 5'}
						</ProgressBar>
					</div>

					<div className="form-group">
						<p className="lead font-weight-bold">"What component do you love the most?"</p>
						{[
							['grid', 'Grid components (row, col)'],
							['typography', 'Typography'],
							['buttons', 'Buttons'],
							['alerts', 'Alerts'],
							['modals', 'Modals'],
							['none', 'None of the above'],
						].map(([key, label]) => (
							<div key={key} className="d-flex align-items-center row mb-3">
								<p className="col-2 mb-0">{label}</p>
								<div className="col">
									<ProgressBar width={100 * ((summary.favourites[key] || 0) / summary.numResponses)}>
										{summary.favourites[key] || 0}
										{' '}
										{summary.favourites[key] === 1 ? 'person' : 'people'}
									</ProgressBar>
								</div>
							</div>
						))}
					</div>

					<div className="form-group">
						<p className="lead font-weight-bold">"Select the Bootstrap features that you wish you had more exposure to"</p>
						{[
							['bundling-with-bootstrap', 'Bundling with Bootstrap'],
							['code-splitting', 'Code splitting'],
							['icons', 'Bootrap Icons'],
							['expo', 'Bootrap Expo'],
							['themes', 'Bootrap Themes'],
						].map(([key, label]) => (
							<div key={key} className="d-flex align-items-center row mb-3">
								<p className="col-2 mb-0">{label}</p>
								<div className="col">
									<ProgressBar width={100 * ((summary.moreExposure[key] || 0) / summary.numResponses)}>
										{summary.moreExposure[key] || 0}{' '}{summary.moreExposure[key] === 1 ? 'person' : 'people'}
									</ProgressBar>
								</div>
							</div>
						))}
					</div>

					<div className="form-group">					
						<p className="lead font-weight-bold">"Please indicate how much you rely on the following features in production"</p>
						{[
							['tooltips', 'Tooltips'],
							['modals', 'Modals'],
							['formValidation', 'Form validation'],
							['popOvers', 'Popovers'],
							['progressBars', 'Progress bars'],
							['scrollspy', 'Scrollspy'],
						].map(([key, label]) => (
							<div key={key} className="d-flex align-items-center row mb-3">
								<p className="col-2 mb-0">{label}</p>
								<div className="col">
									<ProgressBar
										width={100 * (summary.featureReliance[key] / summary.numResponses / 2)}
									>{Math.round((summary.featureReliance[key] / summary.numResponses / 2) * 10) / 10}{' / 3'}</ProgressBar>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

render(<App />, document.getElementById('app'))
