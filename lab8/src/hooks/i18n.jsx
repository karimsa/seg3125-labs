import React, { createContext, useContext, useEffect, useState } from 'react'

const DEFAULT_LANG = localStorage.getItem('i18n-language') || 'en'
const I18NContext = createContext([DEFAULT_LANG])

export function I18NProvider({ children }) {
	const [lang, setLang] = useState(DEFAULT_LANG)
	useEffect(() => {
		localStorage.setItem('i18n-language', lang)
	}, [lang])
	return (
		<I18NContext.Provider value={[lang, setLang]}>
			{children}
		</I18NContext.Provider>
	)
}

export function useI18N() {
	return useContext(I18NContext)
}

export function I18NSwitch(props) {
	const [lang] = useI18N()
	return lang in props ? props[lang] : props.default
}

export function I18NDollar({ number }) {
	const [lang] = useI18N()
	if (lang === 'fr') {
		return `${number.toFixed(2).replace('.', ',')} $`
	}
	return `$ ${number.toFixed(2)}`
}
