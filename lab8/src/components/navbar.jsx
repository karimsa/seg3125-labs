/** @jsx jsx */

import { Link, useLocation } from 'react-router-dom'
import { jsx, css } from '@emotion/core'
import classNames from 'classnames'

export function Navbar() {
	const location = useLocation()

	return (
		<nav
			className="navbar navbar-expand-lg navbar-dark bg-light"
			css={css`
				background-color: var(--primary) !important;
			`}
		>
			<div className="container-fluid">
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
					<p className="small text-white mb-0 text-center mr-auto ml-4">
						Created by{' '}
						<a
							className="text-white border-bottom border-white"
							href="https://alibhai.co"
							rel="noreferrer noopener"
							target="_blank"
						>
							Karim Alibhai
						</a>
						. See{' '}
						<Link
							className="text-white border-bottom border-white"
							to="/citations"
						>
							works cited
						</Link>
						.
					</p>

					<ul className="navbar-nav ml-auto">
						<li className="nav-item px-2">
							<Link
								to="/"
								className={classNames('nav-link', {
									active: location.pathname === '/',
								})}
							>
								<i className="mr-2 fas fa-search" />
								Search
							</Link>
						</li>
						<li className="nav-item px-2">
							<Link
								to="/bookings"
								className={classNames('nav-link', {
									active: location.pathname === '/bookings',
								})}
							>
								<i className="mr-2 fas fa-bars" />
								Bookings
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	)
}
