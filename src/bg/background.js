var historyItemsToKeep = 4;
var downloadHistoryItemsToKeep = 4;


// Events
chrome.history.onVisited.addListener(pageVisitedEvent);
chrome.downloads.onChanged.addListener(fileStateChangedEvent);
chrome.runtime.onStartup.addListener(updateValues)
chrome.runtime.onInstalled.addListener(updateValues)

function pageVisitedEvent(item)
{
	trimVisitedPagesHistory();
}

function fileStateChangedEvent()
{
	// This will trim only the files with state 'completed'	
	trimFilesHistory();
}

function trimFilesHistory()
{
	chrome.downloads.search({ state : 'complete', orderBy: ["-endTime"] }, function(fileItems)
	{
		if (fileItems.length > downloadHistoryItemsToKeep)
		{
			for (var i = downloadHistoryItemsToKeep; i < fileItems.length; i++)
			{
				chrome.downloads.erase({ id: fileItems[i].id, state: 'complete', endTime: fileItems[i].endTime });
			}
		}
	});
}

function trimVisitedPagesHistory()
{
	chrome.history.search({ text: "" }, function(entries) {
		var sortedEntries = entries.sort(function(a,b) { return a.lastVisitTime < b.lastVisitTime });

		if (sortedEntries.length > historyItemsToKeep)
		{	
			for (var i = historyItemsToKeep; i < sortedEntries.length; i++)
			{
				chrome.history.deleteUrl( { url : sortedEntries[i].url });
			}
		}
	});
}

function updateValues()
{
	var optionsToGet = ["historyLimitNumber", "downloadLimitNumber"];

	chrome.storage.local.get(optionsToGet,	function(options) {
		historyItemsToKeep = options.historyLimitNumber == null ? 4 : options.historyLimitNumber;
		downloadHistoryItemsToKeep = options.downloadLimitNumber == null ? 4 : options.downloadLimitNumber;
	});
}