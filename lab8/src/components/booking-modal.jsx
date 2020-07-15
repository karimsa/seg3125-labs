import React, { forwardRef } from 'react'

export const BookingModal = forwardRef(function ({ vehicle }, modalRef) {
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
			<div className="modal-dialog">
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
					<div className="modal-body">...</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary"
							data-dismiss="modal"
						>
							Close
						</button>
						<button type="button" className="btn btn-primary">
							Save changes
						</button>
					</div>
				</div>
			</div>
		</div>
	)
})

BookingModal.displayName = 'BookingModal'
