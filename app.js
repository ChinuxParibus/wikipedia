var $ = require('minified').$,
		$$ = require('minified').$$,
		EE = require('minified').EE,
		HTML = require('minified').HTML;

$(function () {
	var tplPosts = '{{each}}<a class="card" href="https://en.wikipedia.org/?curid={{this.pageID}}" target="_blank"><h3 class="title">{{this.title}}</h3>{{this.extract}}</a>{{/each}}';
	$('input').set('value', '');

	$('#query').onClick(function (){
		var search = $('input').get('value');
		if (!search) {
			$('#message').show().add(
				EE('div', {'className': 'alert alert-error'}, 'Oh, c\'mon... write something to search! >:(')
				).animate({'$$show': 0}, 2000).then(function () {
					$('.alert').remove();
					$('#message').hide();
			});
		} else {
			var urlSearch = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=' + search;
			$.request('GET', urlSearch).then(function (text) {
				var data = $.parseJSON(text);
				var pages = data.query.pages, postList = [];
				for (attr in pages) {
					postList.push(pages[attr]);
				}
				postList = postList.map(function (item) {
					return {
						pageID: item.pageid,
						title: item.title,
						extract: item.extract
					}
				});
				$('#list').fill(HTML(tplPosts, postList));

				return true;
			}).error(function () {
				$('#message').show().add(
				EE('div', {'className': 'alert alert-error'}, 'Oops! Something goes wrong with the request... :\'(')
				).animate({'$$show': 0}, 2000).then(function () {
					$('.alert').remove();
					$('#message').hide();
				});
			});
		}
	});

});
