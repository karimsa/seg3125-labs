import moment from 'moment'

export function formatNum(n) {
	let string = String(n)
	for (let i = string.length - 3; i > 0; i -= 3) {
		string = string.substr(0, i) + ', ' + string.substr(i)
	}
	return string
}

export function formatDate(d) {
	return moment(d).format('MMM D, YYYY hh:ss A z')
}
