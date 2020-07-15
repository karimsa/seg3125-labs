/** @jsx jsx */

import { Link } from 'react-router-dom'
import { jsx, css } from '@emotion/core'

export function Navbar() {
	return (
		<nav
			className="navbar navbar-expand-lg navbar-dark bg-light"
			css={css`
				background-color: var(--primary) !important;
			`}
		>
			<div className="container">
				<Link to="/" className="navbar-brand">
					Dash
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbar"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbar">
					<ul className="navbar-nav ml-auto">
						<li className="nav-item">
							<a href="#" className="nav-link active">
								testing
							</a>
						</li>
						<li className="nav-item">
							<a href="#" className="nav-link">
								testing
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	)
}
