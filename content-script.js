chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("request", request);

  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );

  const title = document.querySelector(".gh-header .markdown-title").innerText;

  sendResponse({ id: "grab", data: title });
});
