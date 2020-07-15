import React, { useState, useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import useSWR from 'swr'

import { useCurrentLocation } from '../hooks/location'
import { useLocalValue } from '../hooks/local-storage'

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

export function Search() {
	const currentLocationState = useCurrentLocation()
	const [zoomLevel, setZoomLevel] = useLocalValue('zoom', 16)
	const [defaultZoom] = useState(() => zoomLevel)
	const [mapCenter, setMapCenter] = useState()
	const [google, setMapsAPI] = useState()

	// Search parameters
	const [address, setAddress] = useState('')
	const addressCoords = useSWR([address], (address) => {
		return new Promise((resolve, reject) => {
			if (google && address) {
				google.geocoder.geocode({ address }, (res, status) => {
					if (status === 'OK') {
						resolve(res[0].geometry.location)
					} else {
						reject(new Error(`Failed to resolve address: ${address}`))
					}
				})
			}
		})
	})
	const [carType, setCarType] = useLocalValue('car-type', 'all')
	const [priceRange, setPriceRange] = useLocalValue('price-range', {
		min: 0,
		max: 100,
	})

	useEffect(() => {
		if (currentLocationState.data && !mapCenter) {
			setMapCenter(currentLocationState.data)
		}
	}, [currentLocationState.data])
	useEffect(() => {
		if (addressCoords.data) {
			console.warn(addressCoords.data)
		}
	}, [addressCoords.data])

	const error = currentLocationState.error || addressCoords.error

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
					<form>
						<div className="form-group">
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
								Price range
							</label>
							<div className="input-group" id="priceRange">
								<input
									type="number"
									className="form-control"
									min="0"
									max="30"
									step="5"
									placeholder="Min"
									value={priceRange.min}
									onChange={(evt) =>
										setPriceRange({
											min: evt.target.value,
											max: priceRange.max,
										})
									}
								/>
								<input
									type="number"
									className="form-control"
									min="0"
									max="100"
									step="5"
									placeholder="Max"
									value={priceRange.max}
									onChange={(evt) =>
										setPriceRange({
											min: priceRange.min,
											max: evt.target.value,
										})
									}
								/>
							</div>
							<p className="small d-flex justify-content-between px-1 text-secondary">
								<span>Minimum</span>
								<span>Maximum</span>
							</p>
						</div>

						<div className="form-group text-center">
							<button type="submit" className="btn btn-primary">
								<i className="mr-2 fas fa-search" />
								Search
							</button>
						</div>
					</form>
				</div>
				<div className="col">
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
					/>
				</div>
			</div>
		</div>
	)
}