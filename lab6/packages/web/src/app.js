import $ from 'jquery'
import 'bootstrap'
import '@babel/polyfill'

import { axios } from './axios'

$(function() {
	const mainPreview = $('#preview img').get(0)

	$('#gallery img').map((_, img) => {
		$(img).on('click', () => {
			mainPreview.src = img.src
		})
	})
	
	$('form').on('submit', async evt => {
		evt.preventDefault()
	
		$('#error-group').addClass('d-none')
	
		try {
			await axios.post('/surveys', $('form').serializeArray().reduce((body, { name, value }) => {
				body[name] = value
				return body
			}, {}))
			$('form').html(`
				<div class="form-group mt-0">
					<div class="alert alert-success text-center mb-0 lead w-100">Thanks for your feedback! We appreciate it.</div>
				</div>
			`)
		} catch (error) {
			$('#error-group .alert')
				.text(error.message)
				.parent()
				.removeClass('d-none')
		}
	})
})
