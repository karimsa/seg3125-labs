import $ from 'jquery'
import React, { useRef, useEffect } from 'react'

import { Bookings, INSURANCE_OFFERINGS } from '../models/bookings'
import { Vehicles } from '../models/vehicles'
import { formatDate } from '../formatters'

export function ActiveBooking() {
	const activeBooking = Bookings.useActiveBooking()
	const { isValidating, data: vehicle } = Vehicles.useVehicleById(
		activeBooking?.vehicleID,
	)

	const modalRef = useRef()
	useEffect(() => {
		return () => {
			$(modalRef.current).modal('hide')
		}
	}, [modalRef])

	const hoursBooked =
		(Date.now() - Number(new Date(activeBooking.timeStart))) / (1000 * 60 * 60)
	const insurancePlan = INSURANCE_OFFERINGS.find(
		(insurance) => insurance.id === activeBooking.planID,
	)

	return (
		<div className="container">
			<div className="row pt-4 justify-content-center">
				<div className="col-auto">
					<div className="card">
						<div className="card-body">
							{isValidating || !activeBooking || !insurancePlan ? (
								<div className="spinner-border text-primary" role="status">
									<span className="sr-only">Loading...</span>
								</div>
							) : (
								<div className="row">
									<div className="col">
										<img src={vehicle.imageURL} className="img-fluid" />
									</div>

									<div className="col d-flex justify-content-center flex-column">
										<div className="row pb-4">
											<div className="col">
												<p className="font-weight-bold">
													{vehicle.manufacturer} {vehicle.model} {vehicle.year}
												</p>
												<p>Picked up {formatDate(activeBooking.timeStart)}</p>
												<p>
													Expected dropoff up{' '}
													{formatDate(activeBooking.timeEnd)}
												</p>
											</div>
										</div>

										<div className="row">
											<div className="col-auto d-flex align-items-center justify-content-between">
												<div
													className="bg-success text-white rounded-circle d-flex flex-column align-items-center justify-content-center text-center"
													style={{ width: '7rem', height: '7rem' }}
												>
													<span style={{ fontSize: '2rem' }}>
														{activeBooking.kmDriven}
													</span>
													<span className="mb-2">km driven</span>
												</div>
												<div
													className="bg-success text-white rounded-circle d-flex flex-column align-items-center justify-content-center text-center ml-3"
													style={{ width: '7rem', height: '7rem' }}
												>
													<span style={{ fontSize: '2rem' }}>
														{(
															activeBooking.kmDriven * vehicle.pricePerKm +
															hoursBooked *
																(vehicle.price + insurancePlan.price)
														).toFixed(2)}
													</span>
													<span className="mb-2">spent</span>
												</div>
											</div>
										</div>
									</div>

									<div className="col-auto d-flex align-items-center">
										<div>
											<button
												type="button"
												className="btn btn-danger"
												onClick={() => {
													$(modalRef.current).modal('show')
												}}
											>
												End booking
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<div
				ref={modalRef}
				className="modal fade"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="endLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="endLabel">
								End booking
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
						<div className="modal-body">
							<p className="lead my-3">
								{/* More lies */}
								To end your vehicle booking, simply tap your key card on the
								car&apos;s reader. The booking will automatically end and this
								page will update.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
