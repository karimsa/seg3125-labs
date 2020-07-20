import $ from 'jquery'
import React, { forwardRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import moment from 'moment'
import ms from 'ms'

import { Vehicles } from '../models/vehicles'
import { Bookings } from '../models/bookings'

const NUM_STEPS = 4
const INSURANCE_OFFERINGS = [
	{
		title: 'Minimum insured',
		price: 5,
		planID: 'min',
	},

	{
		title: 'Basic insurance',
		price: 8,
		planID: 'basic',
	},

	{ title: 'Premium insurance', price: 10, planID: 'premium' },
]

function formatNum(n) {
	let string = String(n)
	for (let i = string.length - 3; i > 0; i -= 3) {
		string = string.substr(0, i) + ', ' + string.substr(i)
	}
	return string
}

function formatDate(d) {
	return moment(d).format('MMM D, YYYY hh:ss A z')
}

function DateTimeInput({ value, onChange }) {
	return (
		<div className="input-group">
			<input
				type="date"
				className="form-control"
				value={moment(value).format('YYYY-MM-DD')}
				onChange={(evt) => {
					console.warn(evt.target.value)
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
						<span>${price} per hour</span>
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
	})

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
							Book a vehicle
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
												Confirm your vehicle
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
														<th>Price per hour:</th>
														<td></td>
														<td>$ {vehicle.price.toFixed(2)} (USD)</td>
													</tr>
													<tr>
														<th>Price per km:</th>
														<td></td>
														<td>$ {vehicle.pricePerKm.toFixed(2)} (USD)</td>
													</tr>
													<tr>
														<th>Amount driven:</th>
														<td></td>
														<td>{formatNum(vehicle.amountDriven)} km</td>
													</tr>
													<tr>
														<th>Year of make:</th>
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
												Confirm your insurance
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
														title={offering.title}
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

											{/* <div className="mb-3">
												<InsuranceCard
													title="Minimum insured"
													price={5}
													isSelected={booking.insurancePlan === 'min'}
													onClick={() =>
														setBooking({
															...booking,
															insurancePlan: 'min',
														})
													}
												/>
											</div>

											<div className="mb-3">
												<InsuranceCard
													title="Basic insurance"
													price={8}
													isSelected={booking.insurancePlan === 'basic'}
													onClick={() =>
														setBooking({
															...booking,
															insurancePlan: 'basic',
														})
													}
												/>
											</div>

											<InsuranceCard
												title="Premium insurance"
												price={10}
												isSelected={booking.insurancePlan === 'premium'}
												onClick={() =>
													setBooking({
														...booking,
														insurancePlan: 'premium',
													})
												}
											/> */}
										</div>
										<div className="col d-flex align-items-center">
											<p className="lead text-center">
												{{
													min: `This level of insurance only covers tire changes.`,
													basic: `This level of insurance gives you access to roadside assistance.`,
													premium: `This level of insurance will cover damages up to $1000.`,
												}[booking.insurancePlan] || (
													<div className="alert alert-danger" role="alert">
														Sorry, something went wrong.
													</div>
												)}
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
												Confirm pickup &amp; dropoff times
											</h5>
										</div>
									</div>

									<div className="row justify-content-center">
										<div className="col">
											<div className="form-group">
												<label className="col-form-label">Pickup time</label>
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
												<label className="col-form-label">Dropoff time</label>
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
														<th>Trip length:</th>
														<td className="px-2" />
														<td>{ms(bookingTimeLength, { long: true })}</td>
													</tr>
													<tr>
														<th>Estimated cost:</th>
														<td />
														<td>
															$
															{(
																(bookingTimeLength / (1000 * 60 * 60)) *
																vehicle.price
															).toFixed(2)}
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
											<h5 className="font-weight-bold">Summary of booking</h5>
										</div>
									</div>

									<div className="row">
										<div className="col">
											<p className="text-center">
												Pickup from{' '}
												<span className="font-weight-bold text-primary">
													{vehicle.location.address}
												</span>{' '}
												at{' '}
												<span className="font-weight-bold text-primary">
													{formatDate(booking.timeStart)}
												</span>
												.
											</p>
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
														<th>Vehicle:</th>
														<td className="px-2"></td>
														<td>
															{vehicle.manufacturer} {vehicle.model}{' '}
															{vehicle.year}
														</td>
													</tr>
													<tr>
														<th>Located at:</th>
														<td className="px-2"></td>
														<td>{vehicle.location.address}</td>
													</tr>
													<tr>
														<th>Price per hour:</th>
														<td></td>
														<td>$ {vehicle.price.toFixed(2)} (USD)</td>
													</tr>
													<tr>
														<th>Price per km:</th>
														<td></td>
														<td>$ {vehicle.pricePerKm.toFixed(2)} (USD)</td>
													</tr>
													<tr>
														<th>Insurance plan:</th>
														<td />
														<td>
															{activeInsurancePlan.title} ($
															{activeInsurancePlan.price.toFixed(2)})
														</td>
													</tr>
													<tr>
														<th>Pickup time:</th>
														<td className="px-2" />
														<td>{formatDate(booking.timeStart)}</td>
													</tr>
													<tr>
														<th>Dropoff time:</th>
														<td className="px-2" />
														<td>
															{formatDate(booking.timeEnd)} (
															{ms(bookingTimeLength, { long: true })})
														</td>
													</tr>
													<tr>
														<th>Trip length:</th>
														<td className="px-2" />
														<td>{ms(bookingTimeLength, { long: true })}</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>

									<div className="row border-top mt-3 pt-3">
										<div className="col">
											<div className="d-flex justify-content-between">
												<p className="font-weight-bold mb-0 small">
													Estimated cost
												</p>
												<p className="mb-0 small">
													$
													{(
														(bookingTimeLength / (1000 * 60 * 60)) *
														vehicle.price
													).toFixed(2)}
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
							<p className="text-muted mb-0 small text-center">
								Your credit card will be charged $
								{(
									(bookingTimeLength / (1000 * 60 * 60)) * vehicle.price +
									50
								).toFixed(2)}{' '}
								as a deposit until the end of the trip.
							</p>
						) : (
							<div></div>
						)}

						<div>
							{step !== 0 && (
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setStep((s) => s - 1)}
								>
									Back
								</button>
							)}
							{step !== NUM_STEPS - 1 ? (
								<button
									type="button"
									className="btn btn-success"
									onClick={() => setStep((s) => s + 1)}
								>
									Next
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
									Create booking
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
