(function() {
	const $ = q => [].slice.call(document.querySelectorAll(q))

	const mainPreview = $('#preview img')[0]

	$('#gallery img').forEach(img => {
		img.addEventListener('click', () => {
			mainPreview.src = img.src
		})
	})

	$('#likert-body')[0].innerHTML = [
		'Tooltips',
		'Modals',
		'Form validation',
		'Popovers',
		'Progress',
		'Scrollspy',
	].map((text, index) => `
		<tr>
			<td>${text}</td>
			<td>
				<input type="radio" name="opt-${index}" />
			</td>
			<td>
				<input type="radio" name="opt-${index}" />
			</td>
			<td>
				<input type="radio" name="opt-${index}" />
			</td>
		</tr>
	`).join('')
}())
