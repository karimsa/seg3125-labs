/** @jsx jsx */

import $ from 'jquery'
import { useState, useEffect, useRef } from 'react'
import GoogleMapReact from 'google-map-react'
import { jsx, css } from '@emotion/core'
import PropTypes from 'prop-types'

import { useCurrentLocation } from '../hooks/location'
import { useLocalValue } from '../hooks/local-storage'
import { Vehicles } from '../models/vehicles'
import { useAsyncAction } from '../hooks/state'
import { useTooltip } from './tooltip'
import { BookingModal } from './booking-modal'

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

function resolveAddress(google, address) {
	return new Promise((resolve, reject) => {
		if (google && address) {
			google.geocoder.geocode({ address }, (res, status) => {
				if (status === 'OK') {
					resolve(res[0].geometry.location)
				} else {
					reject(new Error(`Failed to resolve address: ${address}`))
				}
			})
		} else {
			reject(new Error(`API has not loaded yet`))
		}
	})
}

function useBookingModal() {
	const modalRef = useRef()
	const [vehicle, setActiveVehicle] = useState()

	useEffect(() => {
		if (vehicle) {
			$(modalRef.current).modal('show')
			$(modalRef.current).on('hidden.bs.modal', () => {
				setActiveVehicle()
			})
			return () => $(modalRef.current).modal('hide')
		}
	}, [vehicle, modalRef])

	return [
		vehicle && <BookingModal ref={modalRef} vehicle={vehicle} />,
		{
			setActiveVehicle,
		},
	]
}

function VehicleMarker({ vehicle, onClick }) {
	const tooltipProps = useTooltip()

	return (
		<img
			src={vehicle.imageURL}
			css={css`
				height: ${vehicle.imageWidth}rem;
				width: auto;
			`}
			onClick={onClick}
			title={`${vehicle.manufacturer} ${vehicle.model} ${vehicle.year}`}
			{...tooltipProps}
		/>
	)
}
VehicleMarker.propTypes = {
	vehicle: Vehicles.propType,
	onClick: PropTypes.func.isRequired,
}

export function Search() {
	const currentLocationState = useCurrentLocation()
	const [zoomLevel, setZoomLevel] = useLocalValue('zoom', 16)
	const [defaultZoom] = useState(() => zoomLevel)
	const [mapCenter, setMapCenter] = useState()
	const [google, setMapsAPI] = useState()
	const [BookingModal, { setActiveVehicle }] = useBookingModal()

	// Tooltips
	const minInputTooltipProps = useTooltip()
	const maxInputTooltipProps = useTooltip()

	// Search parameters
	const [address, setAddress] = useLocalValue('address', '')
	const [carType, setCarType] = useLocalValue('car-type', 'all')
	const [priceRange, setPriceRange] = useLocalValue('price-range', {
		min: 0,
		max: 100,
	})

	// Search
	const [addressCoords, { fetch: fetchSearch }] = useAsyncAction(resolveAddress)
	const searchState = Vehicles.useVehicles({
		carType,
		price: priceRange,
	})

	useEffect(() => {
		if (currentLocationState.data && !mapCenter) {
			setMapCenter(currentLocationState.data)
		}
	}, [currentLocationState.data])
	useEffect(() => {
		if (google && address && !addressCoords.data) {
			fetchSearch(google, address)
		}
	}, [google, address, addressCoords.data])

	const error = currentLocationState.error
	const nonFatalErr = searchState.error || addressCoords.error

	if (error) {
		return (
			<div className="container-fluid flex-grow-1 d-flex justify-content-center">
				<div className="row flex-grow-1">
					<div className="col d-flex align-items-center justify-content-center">
						<div className="alert alert-danger" role="alert">
							{String(error.message || error)}
						</div>
					</div>
				</div>
			</div>
		)
	}
	if (searchState.isValidating) {
		return (
			<div className="container-fluid flex-grow-1 d-flex justify-content-center">
				<div className="row flex-grow-1">
					<div className="col d-flex align-items-center justify-content-center">
						<p>Loading ...</p>
					</div>
				</div>
			</div>
		)
	}
	if (!mapCenter) {
		return (
			<div className="container-fluid flex-grow-1 d-flex justify-content-center">
				<div className="row flex-grow-1">
					<div className="col d-flex align-items-center justify-content-center">
						<h3>
							To use this application, please enable access to your location
							above.
						</h3>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="container-fluid flex-grow-1 d-flex justify-content-center px-0">
			<div className="row flex-grow-1 no-gutters">
				<div className="col-3 bg-white p-3">
					<p className="font-weight-bold mb-3">Search for vehicles</p>

					<form
						onSubmit={(evt) => {
							evt.preventDefault()
							fetchSearch(google, address)
						}}
					>
						{nonFatalErr && (
							<div className="form-group">
								<div className="alert alert-danger" role="alert">
									{String(nonFatalErr.message || nonFatalErr)}
								</div>
							</div>
						)}

						<div className="form-group d-none">
							<label htmlFor="" className="col-form-label">
								Location
							</label>
							<input
								type="text"
								className="form-control"
								placeholder="Enter an address to use instead of your location"
								value={address}
								onChange={(evt) => setAddress(evt.target.value)}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="carType" className="col-form-label">
								<i className="mr-2 fas fa-car-side" />
								Vehicle type
							</label>
							<select
								id="carType"
								className="form-control"
								value={carType}
								onChange={(evt) => setCarType(evt.target.value)}
							>
								<option value="all">All</option>
								<option value="sedan">Sedan</option>
								<option value="suv">SUV</option>
							</select>
						</div>

						<div className="form-group">
							<label htmlFor="priceRange" className="col-form-label">
								<i className="mr-2 fas fa-dollar-sign" />
								Price range
							</label>
							<div className="input-group" id="priceRange">
								<input
									type="number"
									className="form-control"
									min="0"
									max="30"
									step="1"
									placeholder="Min"
									value={priceRange.min}
									onChange={(evt) =>
										setPriceRange({
											min: evt.target.value,
											max: priceRange.max,
										})
									}
									{...minInputTooltipProps}
								/>
								<input
									type="number"
									className="form-control"
									min="0"
									max="100"
									step="1"
									placeholder="Max"
									value={priceRange.max}
									onChange={(evt) =>
										setPriceRange({
											min: priceRange.min,
											max: evt.target.value,
										})
									}
									{...maxInputTooltipProps}
								/>
							</div>
							<p className="small d-flex justify-content-between px-1 text-secondary">
								<span>Minimum</span>
								<span>Maximum</span>
							</p>
						</div>

						{/* <div className="form-group text-center">
							<button
								type="submit"
								className="btn btn-primary"
								disabled={isLoading}
							>
								<i className="mr-2 fas fa-search" />
								Search
							</button>
						</div> */}
					</form>
				</div>
				<div className="col">
					{BookingModal}

					<GoogleMapReact
						bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
						defaultZoom={defaultZoom}
						center={mapCenter}
						onChange={({ zoom, center }) => {
							setZoomLevel(zoom)
							setMapCenter(center)
						}}
						yesIWantToUseGoogleMapApiInternals={true}
						onGoogleApiLoaded={({ map, maps }) => {
							setMapsAPI({ map, maps, geocoder: new maps.Geocoder() })
						}}
					>
						{searchState.data &&
							searchState.data.map((vehicle) => (
								<VehicleMarker
									key={vehicle.id}
									lat={vehicle.location.lat}
									lng={vehicle.location.lng}
									vehicle={vehicle}
									onClick={() => setActiveVehicle(vehicle)}
								/>
							))}
					</GoogleMapReact>
				</div>
			</div>
		</div>
	)
}
