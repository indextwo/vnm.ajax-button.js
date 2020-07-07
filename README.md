vnm.ajax-button
============================

A handy jQuery utility for creating ajaxified button actions based on `data` attributes. Built primiarly for my own WP projects and not _really_ for public consumption, but 🤷

### Prerequisites

**VNM Ajax Button** requires jQuery. Download the plugin and make sure to include both in your HTML:

```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.0/jquery.min.js?ver=3.5.0"></script>
<script type="text/javascript" src="jquery.ajax-button.js"></script>
```

This is also built on the assumption that the ajax function will return a `response` object with a value of `success` for any successful actions. Any other value (or lack thereof) will be taken as a failure.

The ajax response can also contain:

 - `trigger`: This will action a `$('body').trigger(data.trigger, data)` - with the full ajax response as the data parameter.
 - `func`: This will attempt to resolve the passed (string) value to a function and execute it. It doesn't taken any parameters.

## Usage

There are a _lot_ of different options, all listed and (mostly) commented in the code, but here's a verbose example:

```html
<div class="ajax-send-container">
	<input type="text" name="useremail" id="useremail" class="whitebg" placeholder="Email" autocomplete="email" />
	
	<button type="button" class="button ajax-send" 
		data-ajaxaction="vnmProfile_resetPassword" 
		data-nonce="<?php echo wp_create_nonce('resetpassword_nonce_action'); ?>" 
		data-sendfields="1"
		data-showsend="1" 
		data-sending="<?php _e('Sending...', 'vnmProfile'); ?>"
		data-showsuccess="1">
			<?php _e('Reset password', 'vnmProfile'); ?>
		</button>
	</div>
</div>
```

 - The class `ajax-send-container` added to the wrapping `<div>` tells the button (with a `data-sendfields` attribute value of `1`) to include the value of ALL fields within it. 
 - `data-ajaxaction` is the ajaxified action to send to the ajax URL. By default this assumes there is a predefined `ajaxObject.ajaxurl` property (assigned via `wp_localize_script()` in WP)
 - `data-nonce` defines a nonce (Number used Once) used for validation in the ajax function
 - `data-sendfields` ensures that all field values within `.ajax-send-container` are sent
 - `data-showsend` triggers a predefined `vnm_page_sending` action (which I jave usually defined elsewhere). You can also define your own triggers with `data-sendtrigger`
 - `data-sending` also triggers a predefined `vnm_page_sending_update` action with the message value.
 - `data-showsuccess` is - you guessed it - triggers a predefined action of `vnm_page_send_done`

## Full list of data parameters

-  `data-ajaxurl`				//	String. Ajax URL. Defaults to ajaxObject.ajaxurl
-  `data-preventdefault`		//	Boolean ("1" or "0"). Defaults to true (so prevents default action). Set to 0 to use on a label where you still want the default action to take place.
-  `data-ajaxaction`			//	String. The ajax action to send to the ajax URL.
-  `data-nonce`				//	String. The nonce to send to the ajax URL.
-  `data-validationtrigger`	//	String. This should be a $(document.body).triggerHandler() that returns a boolean.
-  `data-showsend`				//	Boolean ("1" or "0"). Triggers `vnm_page_sending` action.
-  `data-sending`				//	String. Message to send to `vnm_page_sending_update` action.
-  `data-sendtrigger`			//	String. JS action to trigger at the point of send.
-  `data-showsuccess`			//	Boolean ("1" or "0"). Triggers `vnm_show_message` action if `data-success` is defined; otherwise triggers `vnm_page_send_done`.
-  `data-success`				//	String. Message to pass to `vnm_show_message` once ajax action has responded successfully.
-  `data-successtrigger`		//	String. JS action to trigger at the point of ajax success.
-  `data-successtriggerarray`	//	String. This should be a comma-delimited list of triggers. It will pass any data returned (obj.data), plus this button as a reference (obj.originator)
-  `data-addclasses`			//	String. Classes to add to .ajax-button upon success.
-  `data-removeclasses`		//	String. Classes to remove from .ajax-button upon success.
-  `data-changetext`			//	String. Changes the text() value of the button element upon success.
-  `data-refresh`				//	Boolean ("1" or "0"). Triggers `vnm_page_sending_update` and then document.location.href (including any $_GET parameters) to refresh the current page.
-  `data-refreshparams`		//	String. Additional parameters to be added to the current document's URL upon success.
-  `data-redirect`				//	String. URL to redirect to upon success.
-  `data-fail`					//	Currently unused?
-  `data-failtrigger`			//	String. JS action to trigger upon failure.
-  `data-failalert`			//	Boolean-ish ("1" or "0"). If data-failalert is set (to anything), the `message` sent back from the server will be alert()ed
-  `data-suppressresponse`		//	Boolean ("1" or "0"). If set, nothing will happen upon success. Failure response will be halted after an alert is thrown (if defined).
-  `data-ajaxpost`				//	String. String prepresentation of JSON object of key/value pairs that will be sent directly (no need of fields). All keys and values MUST be in double-quotes! e.g. `data-ajaxpost='{"orderid": "1234578"}'`
-  `data-sendfields`			//	Boolean ("1" or "0"). This will include the values of any input, select & textarea inputs within an .ajax-send-container wrapper that also contains this button
-  `data-ajaxfields`			//	String. String prepresentation of JSON object of key/field ID pairs, where the fields have to be outside of the button's container. All keys and values MUST be in double-quotes! e.g. `data-ajaxfields='{"refund-password": "#refund-pass"}'`
-  `data-confirm`				//	String. If set, a standard browser alert with the attribute's value as the message asking to confirm the action will appear. If dismissed, no further action will be taken.
 
 ## Authors

* [Lawrie Malen](https://github.com/indextwo) at [Very New Media&trade;](http://www.verynewmedia.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details