(function($) {
	$(function(){
		function doInsert() {
			if ($('#chromelater_bar').length > 0)
			{
				var e = $('#chromelater_bar')[0];
				if (e.style.webkitAnimationName == 'slidedown' || e.style.webkitAnimationName == '')
				{
					e.style.webkitAnimationName = 'slideup';
					window.setTimeout(function() {
						$('#chromelater_bar').css('top', '-150px');
					}, 510);
					return false;
				}
				else
				{
					e.style.webkitAnimationName = 'slidedown';
					window.setTimeout(function() {
						$('#chromelater_bar').css('top', '0px');
					}, 510);
				}
				return true;
			}
		
			$('<div id="chromelater_bar"><div class="chromelater_header">ChromeLater&nbsp;&nbsp;&nbsp;<span class="chromelater_small"><a href="http://www.instapaper.com/u">Instapaper &rarr;</a></span></div><div id="chromelater_pages" class="clearfix"></div></div>').prependTo('body');
			requestUpdate();
			return true;
		}
	
		function requestUpdate()
		{
			$('#chromelater_pages div.chromelater_page').remove();
			$('#chromelater_pages div.chromelater_text').remove();
			$('<div class="chromelater_text">Loading...</div>').prependTo('#chromelater_pages');
			chrome.extension.sendRequest("unreads", function(unreads) {
				if (unreads.status == "later")
					setTimeout(requestUpdate, 1000);
				else
				{
					$('#chromelater_pages div.chromelater_text').remove();
					for(var i in unreads.items)
					{
						var obj = unreads.items[i];
						console.log(obj);
						var e = $('<div class="chromelater_page"><a href="{guid}"><img src="http://api.thumbalizr.com/?api_key=ca3d8cc6aafcdf0da723f4b0bb5af0bc&url={link}"/><br/>{title}</a></div>'.replace('{guid}', obj.guid).replace('{link}', obj.link).replace('title', obj.title));
						e.appendTo('#chromelater_pages');
						e.click(function() {
							chrome.extension.sendRequest("queue_update");
							e[0].style.webkitAnimationName = "scale-down";
							location.href = this.children('a').attr('href');
						});
					}
				}
			});
		}
	
		chrome.extension.sendRequest("isBarShown", function(shown) {
			// if (shown) doInsert();
		});

		chrome.extension.onRequest.addListener(
			function(request, sender, sendResponse) {
			    if (request == "switchbar")
				{
					sendResponse({'status': 'ok', 'shownBar': doInsert()});
				}
			}
		);
	});
})(jQuery.noConflict());

