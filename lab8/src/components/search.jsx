import $ from 'jquery'
import React, { useState, useEffect, useRef } from 'react'
import GoogleMapReact from 'google-map-react'
import PropTypes from 'prop-types'

import { useCurrentLocation } from '../hooks/location'
import { useLocalValue } from '../hooks/local-storage'
import { Vehicles } from '../models/vehicles'
import { useAsyncAction, useCombinedAsync } from '../hooks/state'
import { useTooltip } from './tooltip'
import { BookingModal } from './booking-modal'
import { I18NSwitch } from '../hooks/i18n'

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
			style={{
				height: `${vehicle.imageWidth}rem`,
				width: 'auto',
			}}
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
	const [advancedSearchEnabled, setAdvancedSearchEnabled] = useLocalValue(
		'advanced-search-enabled',
	)
	const [retryKey, setRetryKey] = useState()

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
	const [manufacturer, setManufacturer] = useState('all')
	const [model, setModel] = useState('all')
	const {
		isValidating,
		error: nonFatalErr,
		data: [manufacturers, models, searchResults],
	} = useCombinedAsync([
		Vehicles.useManufacturers(null, { retryKey }),
		Vehicles.useModels(null, { retryKey }),
		Vehicles.useVehicles(
			{
				carType,
				price: priceRange,
				manufacturer,
				model,
			},
			{
				retryKey,
			},
		),
	])

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

	if (error) {
		return (
			<div className="container-fluid flex-grow-1 d-flex justify-content-center">
				<div className="row flex-grow-1">
					<div className="col d-flex align-items-center justify-content-center">
						<div className="alert alert-danger" role="alert">
							Sorry, the application has failed to load. You can try refreshing
							the page to fix this.
							<a href={location.href}>Refresh</a>
						</div>
					</div>
				</div>
			</div>
		)
	}
	if (isValidating) {
		return (
			<div className="container-fluid flex-grow-1 d-flex justify-content-center">
				<div className="row flex-grow-1">
					<div className="col d-flex align-items-center justify-content-center">
						<div className="spinner-border text-primary" role="status">
							<span className="sr-only">Loading...</span>
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
							<I18NSwitch
								fr="Pour utiliser cette application, veuillez activer l'accès à votre emplacement au dessus."
								default="To use this application, please enable access to your location above."
							/>
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
					<p className="font-weight-bold mb-3">
						<I18NSwitch
							fr="Recherche de véhicules"
							default="Search for vehicles"
						/>
					</p>

					<form
						onSubmit={(evt) => {
							evt.preventDefault()
							fetchSearch(google, address)
						}}
					>
						{nonFatalErr && (
							<div className="form-group">
								<div className="alert alert-danger" role="alert">
									<p>
										Sorry, I failed to fetch results for your search. To fix
										this, you can try again later or click the retry button.
									</p>
									<button
										type="button"
										className="btn btn-primary btn-sm"
										onClick={() => {
											setRetryKey(Date.now())
										}}
									>
										Retry
									</button>
								</div>
							</div>
						)}

						<div className="form-group d-none">
							<label htmlFor="" className="col-form-label">
								<I18NSwitch fr="Emplacement" default="Location" />
							</label>
							<input
								type="text"
								className="form-control"
								placeholder={
									<I18NSwitch
										fr="Entrez une adresse à utiliser à la place de votre emplacement"
										default="Enter an address to use instead of your location"
									/>
								}
								value={address}
								onChange={(evt) => setAddress(evt.target.value)}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="carType" className="col-form-label">
								<i className="mr-2 fas fa-car-side" />
								<I18NSwitch fr="Type de véhicule" default="Vehicle type" />
							</label>
							<select
								id="carType"
								className="form-control"
								value={carType}
								onChange={(evt) => setCarType(evt.target.value)}
							>
								<I18NSwitch
									fr={<option value="all">Tous les véhicules</option>}
									default={<option value="all">All</option>}
								/>
								<I18NSwitch
									fr={<option value="sedan">Les puis</option>}
									default={<option value="sedan">Sedan</option>}
								/>
								<I18NSwitch
									fr={<option value="suv">VLT</option>}
									default={<option value="suv">SUV</option>}
								/>
							</select>
						</div>

						<div className="form-group">
							<label htmlFor="priceRange" className="col-form-label">
								<i className="mr-2 fas fa-dollar-sign" />
								<I18NSwitch
									fr="Échelle des prix (par heure)"
									default="Price range (per hour)"
								/>
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
								<span>
									<I18NSwitch default="Minimum" />
								</span>
								<span>
									<I18NSwitch default="Maximum" />
								</span>
							</p>
						</div>

						{advancedSearchEnabled && (
							<>
								<div className="form-group">
									<label className="col-form-label">
										<I18NSwitch
											fr="Fabricant de véhicule"
											default="Manufacturer"
										/>
									</label>
									<select
										className="form-control"
										value={manufacturer}
										onChange={(evt) => setManufacturer(evt.target.value)}
									>
										<option value="all">All</option>
										{manufacturers.map((manufacturer) => (
											<option key={manufacturer} value={manufacturer}>
												{manufacturer}
											</option>
										))}
									</select>
								</div>

								<div className="form-group">
									<label className="col-form-label">
										<I18NSwitch fr="Modèle de véhicule" default="Model" />
									</label>
									<select
										className="form-control"
										value={model}
										onChange={(evt) => setModel(evt.target.value)}
									>
										<option value="all">All</option>
										{models.map((model) => (
											<option key={model} value={model}>
												{model}
											</option>
										))}
									</select>
								</div>
							</>
						)}

						<div className="form-group text-right">
							{advancedSearchEnabled ? (
								<button
									type="button"
									className="btn btn-link btn-sm small px-0"
									onClick={() => setAdvancedSearchEnabled(false)}
								>
									<I18NSwitch default="Simple search" fr="Recherche simple" />
								</button>
							) : (
								<button
									type="button"
									className="btn btn-link btn-sm small px-0"
									onClick={() => setAdvancedSearchEnabled(true)}
								>
									<I18NSwitch
										default="Advanced search"
										fr="Recherche Avancée"
									/>
								</button>
							)}
						</div>
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
						{searchResults?.map((vehicle) => (
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
