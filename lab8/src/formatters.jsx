import moment from 'moment'

export function formatNum(n) {
	let string = String(n)
	for (let i = string.length - 3; i > 0; i -= 3) {
		string = string.substr(0, i) + ', ' + string.substr(i)
	}
	return string
}

export function formatDate(d, lang) {
	if (!lang) {
		throw new Error(`Language is required for 'formatDate()'`)
	}
	if (lang === 'fr') {
		return moment(d).format('MMM D, YYYY HH[h]ss z')
	}
	return moment(d).format('MMM D, YYYY hh:ss A z')
}

const Second = 1000
const Minute = 60 * Second
const Hour = 60 * Minute
const Day = 24 * Hour

function msJoin(num, blksize, singular, plural) {
	const n = Math.round(num / blksize)
	return `${n} ${n === 1 ? singular : plural}`
}

export function formatMs(ms, lang) {
	ms = Math.round(ms)

	if (ms >= Day) {
		if (lang === 'fr') {
			return msJoin(ms, Day, 'jour', 'journées')
		}
		return msJoin(ms, Day, 'day', 'days')
	}
	if (ms >= Hour) {
		if (lang === 'fr') {
			return msJoin(ms, Day, 'heure', 'heures')
		}
		return msJoin(ms, Day, 'hour', 'hours')
	}
	if (ms >= Minute) {
		return msJoin(ms, Day, 'minute', 'minutes')
	}
	if (ms >= Second) {
		if (lang === 'fr') {
			return msJoin(ms, Day, 'seconde', 'secondes')
		}
		return msJoin(ms, Day, 'second', 'seconds')
	}
	return ms + ' ms'
}
