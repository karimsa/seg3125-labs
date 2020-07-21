import $ from 'jquery'
import React, { forwardRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Vehicles } from '../models/vehicles'
import { Bookings, INSURANCE_OFFERINGS } from '../models/bookings'
import { formatNum, formatDate, formatMs } from '../formatters'
import { I18NSwitch, useI18N, I18NDollar } from '../hooks/i18n'

const NUM_STEPS = 4

function DateTimeInput({ value, onChange }) {
	return (
		<div className="input-group">
			<input
				type="date"
				className="form-control"
				value={moment(value).format('YYYY-MM-DD')}
				onChange={(evt) => {
					const updatedDate = moment(evt.target.value, 'YYYY-MM-DD')
					onChange(
						moment(value)
							.set('date', updatedDate.get('date'))
							.set('month', updatedDate.get('month'))
							.set('year', updatedDate.get('year'))
							.toDate(),
					)
				}}
			/>
			<input
				type="time"
				className="form-control"
				value={moment(value).format('HH:mm')}
				onChange={(evt) => {
					console.warn(evt.target.value)
					const updatedDate = moment(evt.target.value, 'HH:mm')
					onChange(
						moment(value)
							.set('hour', updatedDate.get('hour'))
							.set('minutes', updatedDate.get('minutes'))
							.toDate(),
					)
				}}
			/>
		</div>
	)
}
DateTimeInput.propTypes = {
	value: PropTypes.instanceOf(Date).isRequired,
	onChange: PropTypes.func.isRequired,
}

function InsuranceCard({ title, price, isSelected, onClick }) {
	return (
		<div
			className={classNames('card', {
				'bg-primary border-primary': isSelected,
				'cursor-pointer': !isSelected,
			})}
			onClick={onClick}
		>
			<div className="card-body">
				<div className="row">
					<div
						className={classNames(
							'col font-weight-bold d-flex align-items-center justify-content-between',
							{
								'text-white': isSelected,
							},
						)}
					>
						<span>{title}</span>
						<span>
							<I18NSwitch fr="" default="$" />
							{price} <I18NSwitch fr="$ l'heure" default="per hour" />
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
InsuranceCard.propTypes = {
	title: PropTypes.string.isRequired,
	price: PropTypes.number.isRequired,
	isSelected: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
}

export const BookingModal = forwardRef(function ({ vehicle }, modalRef) {
	const bookingActions = Bookings.useActions()

	const [step, setStep] = useState(0)
	const [booking, setBooking] = useState({
		vehicleID: vehicle.id,
		insurancePlan: 'basic',
		timeStart: new Date(),
		timeEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),

		// lies, all lies
		kmDriven: Math.round(Math.random() * 50),
	})
	const [lang] = useI18N()

	useEffect(() => {
		setBooking({
			...booking,
			vehicleID: vehicle.id,
		})
	}, [vehicle.id])

	const bookingTimeLength = moment(booking.timeEnd).diff(booking.timeStart)
	const activeInsurancePlan = INSURANCE_OFFERINGS.find(
		(o) => o.planID === booking.insurancePlan,
	)

	return (
		<div
			ref={modalRef}
			className="modal fade"
			id="exampleModal"
			tabIndex="-1"
			role="dialog"
			aria-labelledby="carModalLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="carModalLabel">
							<I18NSwitch fr="Réservez un véhicule" default="Book a vehicle" />
						</h5>
						<button
							type="button"
							className="close"
							data-dismiss="modal"
							aria-label="Close"
						>
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body p-0">
						<div className="row">
							<div className="col text-center py-3 mb-3 border-bottom border-muted">
								{[...new Array(NUM_STEPS)].map((_, index) => (
									<p
										key={index}
										className={classNames(
											'px-4 py-3 mx-3 rounded-circle d-inline-block mb-0 border',
											{
												'bg-secondary border-secondary text-white':
													step === index,
												'bg-white border-secondary text-secondary cursor-pointer':
													index > step,
												'bg-success border-success text-white cursor-pointer':
													index < step,
											},
										)}
										onClick={() => setStep(index)}
									>
										{index < step ? (
											<i className="fas fa-check small" />
										) : (
											index + 1
										)}
									</p>
								))}
							</div>
						</div>

						<div className="px-3 pb-3">
							{step === 0 && (
								<React.Fragment>
									<div className="row">
										<div className="col text-center">
											<h5 className="font-weight-bold mb-4">
												<I18NSwitch
													fr="Confirmez votre véhicule"
													default="Confirm your vehicle"
												/>
											</h5>
										</div>
									</div>

									<div className="row">
										<div className="col-4">
											<img
												src={vehicle.imageURL}
												alt={`Image of ${vehicle.manufacturer} ${vehicle.model} ${vehicle.year}`}
												className="img-fluid"
											/>
										</div>
										<div className="col">
											<p className="font-weight-bold">
												{vehicle.manufacturer} {vehicle.model} {vehicle.year}
											</p>

											<table>
												<tbody>
													<tr>
														<th>Located at:</th>
														<td className="px-2"></td>
														<td>{vehicle.location.address}</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch
																fr="Prix par heure:"
																default="Price per hour:"
															/>
														</th>
														<td></td>
														<td>
															<I18NSwitch
																fr={`${vehicle.price.toFixed(2)} $ (USD)`}
																default={`$ ${vehicle.price.toFixed(2)} (USD)`}
															/>
														</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch
																fr="Prix au km:"
																default="Price per km:"
															/>
														</th>
														<td></td>
														<td>
															<I18NSwitch
																fr={`${vehicle.pricePerKm.toFixed(2)} $ (USD)`}
																default={`$ ${vehicle.pricePerKm.toFixed(
																	2,
																)} (USD)`}
															/>
														</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch
																fr="Montant entraîné:"
																default="Amount driven:"
															/>
														</th>
														<td></td>
														<td>{formatNum(vehicle.amountDriven)} km</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch
																fr="Année de fabrication:"
																default="Year of make:"
															/>
														</th>
														<td></td>
														<td>{vehicle.year}</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</React.Fragment>
							)}
							{step === 1 && (
								<React.Fragment>
									<div className="row">
										<div className="col text-center">
											<h5 className="font-weight-bold mb-4">
												<I18NSwitch
													fr="Confirmez votre assurance"
													default="Confirm your insurance"
												/>
											</h5>
										</div>
									</div>

									<div className="row">
										<div className="col">
											{INSURANCE_OFFERINGS.map((offering, index) => (
												<div
													className={classNames({
														'mb-3': index < INSURANCE_OFFERINGS.length,
													})}
													key={offering.planID}
												>
													<InsuranceCard
														title={offering.title[lang] || offering.title.en}
														price={offering.price}
														isSelected={
															booking.insurancePlan === offering.planID
														}
														onClick={() =>
															setBooking({
																...booking,
																insurancePlan: offering.planID,
															})
														}
													/>
												</div>
											))}
										</div>
										<div className="col d-flex align-items-center">
											<p className="lead text-center">
												{activeInsurancePlan.description[lang] ||
													activeInsurancePlan.description.en}
											</p>
										</div>
									</div>
								</React.Fragment>
							)}
							{step === 2 && (
								<React.Fragment>
									<div className="row">
										<div className="col text-center">
											<h5 className="font-weight-bold">
												<I18NSwitch
													fr="Confirmer les heures de ramassage et de dépôt"
													default="Confirm pickup &amp; dropoff times"
												/>
											</h5>
										</div>
									</div>

									<div className="row justify-content-center">
										<div className="col">
											<div className="form-group">
												<label className="col-form-label">
													<I18NSwitch
														fr="Heure de ramassage"
														default="Pickup time"
													/>
												</label>
												<DateTimeInput
													value={booking.timeStart}
													onChange={(timeStart) =>
														setBooking({
															...booking,
															timeStart,
														})
													}
												/>
											</div>

											<div className="form-group">
												<label className="col-form-label">
													<I18NSwitch
														fr="Heure de dépôt"
														default="Dropoff time"
													/>
												</label>
												<DateTimeInput
													value={booking.timeEnd}
													onChange={(timeEnd) =>
														setBooking({
															...booking,
															timeEnd,
														})
													}
												/>
											</div>
										</div>

										<div className="col pt-2 d-flex align-items-center">
											<table>
												<tbody>
													<tr>
														<th>
															<I18NSwitch
																fr="Durée du voyage:"
																default="Trip length:"
															/>
														</th>
														<td className="px-2" />
														<td>{formatMs(bookingTimeLength, lang)}</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch
																fr="Coût estimé:"
																default="Estimated cost:"
															/>
														</th>
														<td />
														<td>
															<I18NDollar
																number={
																	(bookingTimeLength / (1000 * 60 * 60)) *
																	vehicle.price
																}
															/>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</React.Fragment>
							)}
							{step === 3 && (
								<React.Fragment>
									<div className="row">
										<div className="col text-center">
											<h5 className="font-weight-bold">
												<I18NSwitch
													fr="Résumé de la réservation"
													default="Summary of booking"
												/>
											</h5>
										</div>
									</div>

									<div className="row">
										<div className="col">
											<I18NSwitch
												fr={
													<p className="text-center">
														Prise en charge au{' '}
														<span className="font-weight-bold text-primary">
															{vehicle.location.address}
														</span>{' '}
														à{' '}
														<span className="font-weight-bold text-primary">
															{formatDate(booking.timeStart, lang)}
														</span>
														.
													</p>
												}
												default={
													<p className="text-center">
														Pickup from{' '}
														<span className="font-weight-bold text-primary">
															{vehicle.location.address}
														</span>{' '}
														at{' '}
														<span className="font-weight-bold text-primary">
															{formatDate(booking.timeStart, lang)}
														</span>
														.
													</p>
												}
											/>
										</div>
									</div>

									<div className="row pt-2 px-4 pb-4">
										<div className="col">
											<img
												src={vehicle.imageURL}
												alt={`Image of ${vehicle.manufacturer} ${vehicle.model} ${vehicle.year}`}
												className="img-fluid"
											/>
										</div>

										<div className="col-auto d-flex align-items-center">
											<table>
												<tbody>
													<tr>
														<th>
															<I18NSwitch fr="Véhicule:" default="Vehicle:" />
														</th>
														<td className="px-2"></td>
														<td>
															{vehicle.manufacturer} {vehicle.model}{' '}
															{vehicle.year}
														</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch fr="Situé à:" default="Located at:" />
														</th>
														<td className="px-2"></td>
														<td>{vehicle.location.address}</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch
																fr="Prix par heure:"
																default="Price per hour:"
															/>
														</th>
														<td></td>
														<td>
															<I18NDollar number={vehicle.price} /> (USD)
														</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch
																fr="Prix au km:"
																default="Price per km:"
															/>
														</th>
														<td></td>
														<td>
															<I18NDollar number={vehicle.pricePerKm} /> (USD)
														</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch
																fr="Plan d'assurance"
																default="Insurance plan"
															/>
															:
														</th>
														<td />
														<td>
															{activeInsurancePlan.title[lang]} (
															<I18NDollar number={activeInsurancePlan.price} />)
														</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch
																fr="Heure de ramassage"
																default="Pickup time"
															/>
															:
														</th>
														<td className="px-2" />
														<td>{formatDate(booking.timeStart, lang)}</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch
																fr="Heure de dépôt"
																default="Dropoff time"
															/>
															:
														</th>
														<td className="px-2" />
														<td>
															{formatDate(booking.timeEnd, lang)} (
															{formatMs(bookingTimeLength, lang)})
														</td>
													</tr>
													<tr>
														<th>
															<I18NSwitch
																fr="Durée du voyage:"
																default="Trip length:"
															/>
														</th>
														<td className="px-2" />
														<td>{formatMs(bookingTimeLength, lang)}</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>

									<div className="row border-top mt-3 pt-3">
										<div className="col">
											<div className="d-flex justify-content-between">
												<p className="font-weight-bold mb-0 small">
													<I18NSwitch
														default="Estimated cost:"
														fr="Coût estimé:"
													/>
												</p>
												<p className="mb-0 small">
													<I18NDollar
														number={
															(bookingTimeLength / (1000 * 60 * 60)) *
															vehicle.price
														}
													/>
												</p>
											</div>
										</div>
									</div>
								</React.Fragment>
							)}
						</div>
					</div>
					<div className="modal-footer d-flex align-items-center justify-content-between">
						{step === NUM_STEPS - 1 ? (
							<p className="col text-muted m-0 small text-left">
								<I18NSwitch
									fr={
										<>
											Votre carte de crédit sera débitée de{' '}
											<I18NDollar
												number={
													(bookingTimeLength / (1000 * 60 * 60)) *
														vehicle.price +
													50
												}
											/>{' '}
											à titre de dépôt jusqu&apos;à la fin du voyage.
										</>
									}
									default={
										<>
											Your credit card will be charged{' '}
											<I18NDollar
												number={
													(bookingTimeLength / (1000 * 60 * 60)) *
														vehicle.price +
													50
												}
											/>{' '}
											as a deposit until the end of the trip.
										</>
									}
								/>
							</p>
						) : (
							<div className="col"></div>
						)}

						<div className="col text-right">
							{step !== 0 && (
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setStep((s) => s - 1)}
								>
									<I18NSwitch fr="Arrière" default="Back" />
								</button>
							)}
							{step !== NUM_STEPS - 1 ? (
								<button
									type="button"
									className="btn btn-success ml-2"
									onClick={() => setStep((s) => s + 1)}
								>
									<I18NSwitch fr="Prochain" default="Next" />
								</button>
							) : (
								<button
									type="button"
									className="btn btn-primary ml-2"
									onClick={() => {
										bookingActions.insert(booking)
										$(modalRef.current).modal('hide')
									}}
								>
									<I18NSwitch
										fr="Créer une réservation"
										default="Create booking"
									/>
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
})

BookingModal.displayName = 'BookingModal'
BookingModal.propTypes = {
	vehicle: Vehicles.propType,
}
