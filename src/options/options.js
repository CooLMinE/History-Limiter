$(document).ready(function() {
	loadOptions();

	$('#submit').click(saveOptions);
});

function loadOptions()
{
	var optionsToGet = ["historyLimitNumber", "downloadLimitNumber"];

	chrome.storage.local.get(optionsToGet,	function(options) {
		$('#historyLimitNumber').val(options.historyLimitNumber == null ? 4 : options.historyLimitNumber);
		$('#downloadLimitNumber').val(options.downloadLimitNumber == null ? 4 : options.downloadLimitNumber);
	});
}

function saveOptions()
{
	var hLimit = $('#historyLimitNumber').val();
	var dLimit = $('#downloadLimitNumber').val();

	if (isValidNumber(hLimit) && isValidNumber(dLimit))
	{
		chrome.storage.local.set({ historyLimitNumber: hLimit, downloadLimitNumber: dLimit}, 
			function() {
				chrome.extension.getBackgroundPage().historyItemsToKeep = hLimit;
				chrome.extension.getBackgroundPage().downloadHistoryItemsToKeep = dLimit;
				displaySuccess("Changes have been saved")
		});	
	}
	else
	{
		displayError("Input is not valid");
	}
}

function displayError(message)
{
	$('#messages').css("color","red")
	displayMessage(message);
}

function displaySuccess(message)
{	
	$('#messages').css("color","green")
	displayMessage(message);
}

function displayMessage(message)
{	
	$('#messages').text(message);
	$('#messages').fadeIn(1000);
	$('#messages').fadeOut(2000);
}

function isValidNumber(input)
{
	var value = $.trim(input);
	var isDigit = $.isNumeric(value);

	return isDigit && value >= 0;
}