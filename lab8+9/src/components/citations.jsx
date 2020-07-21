import React from 'react'

export function Citations() {
	return (
		<div className="container p-5">
			<div className="row">
				<div className="col text-center">
					<h2 className="mb-4">Citations</h2>

					<p className="font-weight-bold">External resources</p>
					<ul className="mb-3">
						<li>
							Hyundai Sonata - Image from{' '}
							<a href="https://driving.ca/hyundai/sonata">
								https://driving.ca/hyundai/sonata
							</a>
						</li>
						<li>
							Honda CRV - Image from{' '}
							<a href="https://www.motortrend.com/cars/honda/cr-v/2015/">
								https://www.motortrend.com/cars/honda/cr-v/2015/
							</a>
						</li>
					</ul>

					<p className="font-weight-bold">Technologies</p>
					<ul>
						<li>React</li>
						<li>Bootstrap</li>
						<li>Font awesome</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
