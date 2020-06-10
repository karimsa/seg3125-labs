import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'
import {
	html,
	render,
} from 'htm/preact/standalone.module.js'

import { Users } from './models/users.js'
import { StoreProvider } from './store.js'
import { Home } from './home.js'
import { Onboarding } from './onboarding.js'

function App() {
	const { data: currentUser } = Users.useCurrentUser()

	if (!currentUser.onboarded) {
		return html`<${Onboarding} />`
	}
	return html`<${Home} />`
}

render(
	html`
		<${StoreProvider}>
			<${App} />
		</${StoreProvider}>
	`,
	document.getElementById('app'),
)
