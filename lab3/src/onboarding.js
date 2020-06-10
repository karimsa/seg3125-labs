import { html, useEffect, useState } from 'htm/preact/standalone.module.js'

import { Users } from './models/users.js'
import imgStepOne from './images/onboarding-1.png'
import imgStepTwo from './images/onboarding-2.gif'
import imgStepThree from './images/onboarding-3.png'
import imgStepFour from './images/onboarding-4.gif'

const onboardingSteps = [
	{
		title: 'Welcome to Grocer!',
		description: `We're an online grocery shopping application dedicated to making your experience personal and relevant.`,
		image: imgStepOne,
	},
	{
		title: 'Fully customizable',
		description: `You can set your dietary preferences via the settings menu, and never see foods that would waste your time.`,
		image: imgStepTwo,
		pretty: true,
	},
	{
		title: 'Easy to use',
		description: `Select the quantity that you'd like to purchase for each product and get transparent totals for how much you are spending.`,
		image: imgStepThree,
	},
	{
		title: 'Keyword searches',
		description: `Use flexible keyword searches to explore the menu or try an exact query to limit your results.`,
		image: imgStepFour,
		pretty: true,
	},
]

export function Onboarding() {
	const { data: currentUser, mutate: updateUser } = Users.useCurrentUser()
	const [step, setStep] = useState(0)
	useEffect(() => {
		if (step >= onboardingSteps.length) {
			updateUser({
				...currentUser,
				onboarded: true,
			})
		}
	}, [step])

	const currentStep = onboardingSteps[step]

	if (!currentStep) {
		return html`
			<div className="h-100 d-flex align-items-center justify-content-center">
				<div className="spinner-border text-primary" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		`
	}

	return html`
		<div className="container h-100">
			<div className="row align-items-center h-100">
				<div className="col py-5">
					<img src="${currentStep.image}" className="img-fluid ${currentStep.pretty ? 'border rounded-lg shadow' : ''}" />
				</div>
				<div className="col py-5">
					<h2>${currentStep.title}</h2>
					<p className="lead" style="font-size: 1.5rem; ">${currentStep.description}</p>
					<button
						type="button"
						className="btn btn-lg btn-primary mt-5"
						onClick=${() => setStep(step + 1)}
					>
						${step === onboardingSteps.length - 1 ? '🚀 Get Started' : 'Next 👉'}
					</button>
				</div>
			</div>
		</div>
	`
}
