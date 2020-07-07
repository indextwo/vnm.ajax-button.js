jQuery(document).ready(function($) {
	
	///
	//	General Ajax send function
	///
	
	$('body').on('click', '.ajax-send', function(e) {
		
		var _this = $(this);
		
		var preventDefault = _this.is('[data-preventdefault]') ? _this.attr('data-preventdefault') : true;
		
		var ajaxAction = _this.is('[data-ajaxaction]') ? _this.attr('data-ajaxaction') : false;
		var ajaxNonce = _this.is('[data-nonce]') ? _this.attr('data-nonce') : false;
		
		var validationTrigger = _this.is('[data-validationtrigger]') ? _this.attr('data-validationtrigger') : false;	//	This should be a $(document.body).triggerHandler() that returns a boolean
		
		var showSend = _this.is('[data-showsend]') ? _this.attr('data-showsend') : false;
		var sendingMessage = _this.is('[data-sending]') ? _this.attr('data-sending') : false;
		
		var sendingTrigger = _this.is('[data-sendtrigger]') ? _this.attr('data-sendtrigger') : false;
		
		var showSuccess = _this.is('[data-showsuccess]') ? _this.attr('data-showsuccess') : false;
		var successMessage = _this.is('[data-success]') ? _this.attr('data-success') : false;
		
		var successTrigger = _this.is('[data-successtrigger]') ? _this.attr('data-successtrigger') : false;
		
		var successTriggerArray = _this.is('[data-successtriggerarray]') ? _this.attr('data-successtriggerarray') : false;	//	This should be a comma-delimited list of triggers. It will pass any data returned (obj.data), plus this button as a reference (obj.originator)
		
		var addClasses = _this.is('[data-addclasses]') ? _this.attr('data-addclasses') : false;
		var removeClasses = _this.is('[data-removeclasses]') ? _this.attr('data-removeclasses') : false;
		
		var changeText = _this.is('[data-changetext]') ? _this.attr('data-changetext') : false;
		
		var successRefresh = _this.is('[data-refresh]') ? _this.attr('data-refresh') : false;
		var refreshParams = _this.is('[data-refreshparams]') ? _this.attr('data-refreshparams') : false;
		
		var successRedirect = _this.is('[data-redirect]') ? _this.attr('data-redirect') : false;
		
		var failureMessage = _this.is('[data-fail]') ? _this.attr('data-fail') : false;				//	Currently unused?
		
		var failTrigger = _this.is('[data-failtrigger]') ? _this.attr('data-failtrigger') : false;

		var failAlert = _this.is('[data-failalert]') ? true : false;								//	If data-failalert is set (to anything), the `message` sent back from the server will be alert()ed
		
		var suppressResponse = _this.is('[data-suppressresponse]') ? _this.attr('data-suppressresponse') : false;
		
		var postString = _this.is('[data-ajaxpost]') ? _this.attr('data-ajaxpost') : false;			//	This should be a JSON object of key/value pairs that will be sent directly (no need of fields). All keys and values MUST be in double-quotes! data-ajaxpost='{"orderid": "1234578"}'
		
		var sendFields = _this.is('[data-sendfields]') ? _this.attr('data-sendfields') : false;		//	This will include the values of any input, select & textarea inputs within an .ajax-send-container wrapper that also contains this button
		
		var ajaxFields = _this.is('[data-ajaxfields]') ? _this.attr('data-ajaxfields') : false;		//	This should be a JSON object of key/field ID pairs, where the fields have to be outside of the button's container. All keys and values MUST be in double-quotes! data-ajaxfields='{"refund-password": "#refund-pass"}'
		
		var confirmAction = _this.is('[data-confirm]') ? _this.attr('data-confirm') : false;
		
		//	Let's check if we want to carry on at all
		
		if (confirmAction) {
			var confirmClick = confirm(confirmAction);
			
			if (!confirmClick) {
				return;
			}
		}
		
		//	Now let's see if a validation trigger is required
		
		if (validationTrigger) {
			var triggerResponse = $('body').triggerHandler(validationTrigger, _this);	//	Use triggerHandler(), as trigger() doesn't return anything
			
			if (!triggerResponse) {
				e.preventDefault();
				return;
			}
		}
		
		//	Now we're going to allow/prevent the default action only AFTER the validation trigger has reported back and/or escaped
		
		if (preventDefault === true || preventDefault != 'false') {
			e.preventDefault();
		}
		
		//	Create the data object
		
		var sendData = {};
		sendData['action'] = ajaxAction;
		
		//	Add a nonce, if defined
		
		if (ajaxNonce) {
			sendData['nonce'] = ajaxNonce;
		}
		
		//	If there's a post string, add that to the sendData
		
		if (postString) {
			var jsonObject = $.parseJSON(postString);
			
			if ($.type(jsonObject) == 'object') {
				$.each(jsonObject, function(key, value) {
					sendData[key] = value;
				});
			}
		}
		
		//	If there are ajax fields, add that to the sendData
		//	For example: '{"refund-pass": "#refund-password-field"}'
		
		if (ajaxFields) {
			var ajaxFieldsJSONObject = $.parseJSON(ajaxFields);
			
			if ($.type(ajaxFieldsJSONObject) == 'object') {
				$.each(ajaxFieldsJSONObject, function(key, fieldID) {
					sendData[key] = $(fieldID).val();
				});
			}
		}
		
		//	If we want to just send all of the fields within the parent container, let's do that
		
		if (sendFields) {
			var sendContainer = $(this).closest('.ajax-send-container');
			
			sendContainer.find('input, select, textarea').each(function(index) {
				var field = $(this);
				var fieldName = field.attr('id');
				
				if (!fieldName || typeof fieldName == 'undefined') {
					fieldName = field.attr('data-id');
				}
				
				var fieldValue = field.val();
				
				if (field.attr('type') == 'checkbox') {
					fieldValue = field.prop('checked');
				}
				
				sendData[fieldName] = fieldValue;
			});
		}
		
		if (showSend) {
			$('body').trigger('vnm_page_sending');
		}
		
		if (sendingTrigger) {
			$('body').trigger(sendingTrigger);
		}
		
		if (showSend && sendingMessage) {
			$('body').trigger('vnm_page_sending_update', [sendingMessage]);
		}
		
		$.ajax({
			url: ajaxObject.ajaxurl,
			type: 'POST',
			data: sendData,
			dataType: 'json',
			
			success:	function(data) {
				
				if (suppressResponse) {
					return;
				}
				
				if (data.response == 'success') {
					
					//	Are we just looking for a refresh?
					
					if (successRefresh) {
						$('body').trigger('vnm_page_sending_update', [successMessage]);
						
						//	Remove any $_GET params from the current URL
						
						var url = document.location.href;
						params = url.split('?');
						
						if (params.length > 1) {
							url = params[0];
						}
						
						var refreshLocation = url;
						
						if (refreshParams) {
							refreshLocation = url + decodeURIComponent(refreshParams);
						}
						
						window.location.href = refreshLocation;
						return;
					}
					
					if (successRedirect) {
						$('body').trigger('vnm_page_sending_update', [successMessage]);
						
						window.location.href = successRedirect;
						return;
					}
					
					//	Show a successful message
					
					if (showSuccess) {
						
						if (successMessage) {
							data.message = successMessage;
						}
						
						$('body').trigger('vnm_show_message', data);
					} else {
						$('body').trigger('vnm_page_send_done');
					}
					
					//	Do we need to add any classes?
					
					if (addClasses) {
						_this.addClass(addClasses);
					}
					
					//	Do we need to remove any classes?
					
					if (removeClasses) {
						_this.removeClass(removeClasses);
					}
					
					//	Should we change the link text?
					
					if (changeText) {
						_this.text(changeText);
					}
					
					//	Is there a data-successtrigger?
					
					if (successTrigger) {
						$('body').trigger(successTrigger, data);
					}
					
					//	Is there an ARRAY of success triggers?
					
					if (successTriggerArray) {
						var successTriggersActualArray = successTriggerArray.split(',');
						
						if ($.type(successTriggersActualArray) == 'array') {
							$.each(successTriggersActualArray, function(index, _trigger) {
								$('body').trigger(_trigger, {"data": data, "originator": _this});
							});
						}
					}
					
					//	Is there an additional returned trigger to set off?
					
					if (data.trigger) {
						$('body').trigger(data.trigger, data);
					}
					
					//	Is there an inline function to carry out?
					
					if (data.func !== '') {
						var tmpFunc = new Function(data.func);
						tmpFunc();
					}
					
				} else {
					
					//	Is there a data-failtrigger? This will get fired regardless of `supressResponse`
					
					if (failTrigger) {
						$('body').trigger(failTrigger, data);
					}
					
					//	If data-failalert is set to anything, throw an alert() for the returned message
					
					if (failAlert) {
						alert(data.message);
					}
					
					if (suppressResponse) {
						return;
					}
					
					console.log('Sending error message');
					console.log(data);
					
					$('body').trigger('vnm_show_error', [data]);
					
				}
				
			},
			
			error:		function(xhr, ajaxOptions, thrownError) {
				console.log(xhr.response);
				console.log(xhr.message);
				console.log(thrownError);
				
				alert(thrownError);
			}
		});
		
	});
});