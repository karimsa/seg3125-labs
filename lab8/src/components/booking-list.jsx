import React from 'react'
import { Link } from 'react-router-dom'

import { Bookings } from '../models/bookings'
import { Vehicles } from '../models/vehicles'

function BookingCard({ booking }) {
	const { isValidating, data: vehicle } = Vehicles.useVehicleById(
		booking.vehicleID,
	)

	if (isValidating) {
		return (
			<div className="card bg-muted">
				<div className="card-body"></div>
			</div>
		)
	}
	return (
		<div className="card">
			<div className="card-body">
				<div className="row">
					<div className="col-3">
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
					</div>
				</div>
			</div>
		</div>
	)
}

export function BookingList() {
	const { isValidating, data: bookings } = Bookings.useBookings()

	return (
		<div className="container h-100 w-100 p-5">
			{isValidating && (
				<div className="row">
					<div className="col">
						<p className="mb-0">Loading ...</p>
					</div>
				</div>
			)}
			{bookings &&
				bookings.map((booking) => (
					<div className="row" key={booking.id}>
						<div className="col">
							<BookingCard booking={booking} />
						</div>
					</div>
				))}
			{bookings?.length === 0 && (
				<div className="row h-100 w-100 align-items-center justify-content-center">
					<div className="col text-center">
						<p className="text-secondary lead">
							You have no bookings yet! You can create a new booking from the
							search.
						</p>
						<Link to="/" className="btn btn-primary">
							Go to search
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}
