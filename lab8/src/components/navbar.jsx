/** @jsx jsx */

import { Link, useLocation } from 'react-router-dom'
import { jsx, css } from '@emotion/core'
import classNames from 'classnames'

import { Bookings } from '../models/bookings'
import { useI18N, I18NSwitch } from '../hooks/i18n'

export function Navbar() {
	const location = useLocation()
	const activeBooking = Bookings.useActiveBooking()
	const [i18nLang, setI18NLang] = useI18N()

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
					<I18NSwitch
						default={
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
						}
						fr={
							<p className="small text-white mb-0 text-center mr-auto ml-4">
								Créé par{' '}
								<a
									className="text-white border-bottom border-white"
									href="https://alibhai.co"
									rel="noreferrer noopener"
									target="_blank"
								>
									Karim Alibhai
								</a>
								. Voir{' '}
								<Link
									className="text-white border-bottom border-white"
									to="/citations"
								>
									les ouvrages cités
								</Link>
								.
							</p>
						}
					/>

					<ul className="navbar-nav ml-auto">
						{location.pathname !== '/' && (
							<li className="nav-item px-2">
								<Link
									to="/"
									className={classNames('nav-link', {
										active: location.pathname === '/',
									})}
								>
									<i className="mr-2 fas fa-search" />
									<I18NSwitch
										fr="Retour à la recherche"
										default="Back to search"
									/>
								</Link>
							</li>
						)}
						{/* <li className="nav-item px-2">
							<Link
								to="/bookings"
								className={classNames('nav-link', {
									active: location.pathname === '/bookings',
								})}
							>
								<i className="mr-2 fas fa-bars" />

								<I18NSwitch fr="Réservations" default="Bookings" />
							</Link>
						</li> */}
					</ul>

					<div className="d-flex align-items-center justify-content-center">
						{activeBooking && (
							<div className="col">
								<Link to="/bookings/active" className="btn btn-success">
									<I18NSwitch
										fr="Réservation active"
										default="Active booking"
									/>
								</Link>
							</div>
						)}

						<div className="col-auto pl-2">
							<select
								className="form-control"
								value={i18nLang}
								onChange={(evt) => setI18NLang(evt.target.value)}
							>
								<I18NSwitch
									fr={<option value="en">L&apos;anglais</option>}
									default={<option value="en">English</option>}
								/>
								<I18NSwitch
									fr={<option value="fr">Francais</option>}
									default={<option value="fr">French</option>}
								/>
							</select>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
