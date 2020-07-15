import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'regenerator-runtime/runtime'
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'

import './styles.css'
import { Navbar } from './components/navbar'
import { Search } from './components/search'

if (location.protocol !== 'https:') {
	location.protocol = 'https:'
}

function NotFound() {
	return (
		<div className="container">
			<div className="row">
				<div className="col">
					<h1>404 - Not found</h1>
					<p className="lead">A page doesn&apos;t exist at this URL.</p>
					<Link to="/" className="btn btn-primary">
						Back to home
					</Link>
				</div>
			</div>
		</div>
	)
}

function App() {
	return (
		<BrowserRouter>
			<Navbar />

			<main className="flex-grow-1 d-flex">
				<Switch>
					<Route path="/" component={Search} exact />
					<Route component={NotFound} />
				</Switch>
			</main>
		</BrowserRouter>
	)
}

render(<App />, document.getElementById('app'))
