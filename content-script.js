chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const issueTitle = document.querySelector(
    ".gh-header .gh-header-title .markdown-title"
  ).innerText;

  const issueId = document.querySelector(
    ".gh-header .gh-header-title span"
  ).innerText;

  const issueType = "bugfix";

  sendResponse({
    id: "grab",
    data: {
      issueId,
      issueTitle,
      issueType,
    },
  });
});
