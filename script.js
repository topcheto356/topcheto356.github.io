$(function () {
	const currencies = ['usd', 'eur', 'aud', 'cad', 'chf', 'nzd', 'bgn'];
	const defaultCurrency = 'USD';

	let allRates = [];
	let renderArray = [];
	let group1 = [];
	let group2 = [];
	let group3 = [];

	const loadData = (data, cur, wantedCurrency) => {
		if (data[cur]) allRates.push(`${data[cur]} ${cur}-${wantedCurrency}`);
		else allRates.push(`${data[wantedCurrency]} ${wantedCurrency}-${cur}`);

		if (allRates.length === (currencies.length - 1) * 2) {
			allRates.sort();
			allRates.forEach((el) => pushToGroups(el));

			const renderData = (group, selector) => {
				$.each(group, function (_, el) {
					const item = $('<p>').text(el);
					item.appendTo(`${selector}`);
				});
				$(`${selector}`).append(`<p>Count:${group.length}</>`);
			};

			const check = (checkArray) => {
				for (let i = 0; i < checkArray.length; i++) {
					let filtered = [];

					for (let j = i + 1; j < checkArray.length; j++) {
						if (
							Number(checkArray[i].split(' ')[0]) + 0.5 >
							Number(checkArray[j].split(' ')[0])
						) {
							filtered.push(checkArray[j]);
						} else break;
					}

					if (filtered.length > renderArray.length) {
						renderArray = [...filtered];
					}
				}
			};

			check([...group1, ...group2]);
			check([...group2, ...group3]);

			renderData(group1, '.render1');
			renderData(group2, '.render2');
			renderData(group3, '.render3');
			renderData(renderArray, '.render4');

			$('.loading').toggle();
			$('.groups').css('display', 'flex');
			$('.array').css('display', 'flex');
		}
	};

	const pushToGroups = (rate) => {
		const num = rate.split(' ')[0];

		if (num <= 1) group1.push(rate);
		else if (num < 1.5) group2.push(rate);
		else group3.push(rate);
	};

	const getData = (el) => {
		$('.selected').replaceWith(
			`<p class="selected">Selected currency: ${el}</p>`
		);

		const wantedCurrency = el.toLowerCase();
		const leftCurrencies = currencies.filter((el) => el !== wantedCurrency);

		$.each(leftCurrencies, function (_, cur) {
			const firstLink = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${cur}/${wantedCurrency}.json`;

			const secondLink = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${wantedCurrency}/${cur}.json`;

			$.getJSON(firstLink)
				.done(function (data) {
					loadData(data, cur, wantedCurrency);
				})
				.fail(function () {
					alert('Error, please try again');
				});
			$.getJSON(secondLink)
				.done(function (data) {
					loadData(data, cur, wantedCurrency);
				})
				.fail(function () {
					alert('Error, please try again');
				});
		});
	};

	getData(defaultCurrency);

	$.each(currencies, function (_, cur) {
		const item = $('<li>')
			.text(cur)
			.on('click', function () {
				const curr = $(this);
				allRates = [];
				group1 = [];
				group2 = [];
				group3 = [];
				renderArray = [];

				$('.groups').toggle();
				$('.groups').find('p').remove();

				$('.array').toggle();
				$('.array').find('p').remove();

				$('.loading').toggle();

				getData(curr[0].outerText);
			});

		item.appendTo('ul');
	});
});
