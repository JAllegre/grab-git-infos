chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let titleSelector = document.querySelector(
    ".detail-page-description h1.title"
  );
  if (!titleSelector) {
    // try github
    titleSelector = document.querySelector(
      ".gh-header .gh-header-title .markdown-title"
    );
  }
  const issueTitle = titleSelector?.innerText || "?";

  let idSelector = document.querySelector(
    'li[data-testid="breadcrumb-current-link"]'
  );
  if (!idSelector) {
    // try github
    idSelector = document.querySelector(
      ".gh-header .gh-header-title span"
    ).innerText;
  }

  const issueId = idSelector?.innerText || "?";

  let typeFound = "?";
  document
    .querySelectorAll(".issuable-show-labels .gl-label-text-scoped")
    .forEach((node) => {
      var currentLabel = node.innerText.trim().toLowerCase();
      switch (currentLabel) {
        case "bug":
          typeFound = "🐛 bugfix";
          break;
        case "feature":
          typeFound = "✨ feature";
          break;
        default:
          typeFound = currentLabel;
      }

      if (currentLabel === "bug" && currentLabel === "feature") {
        typeFound = "bugfix";
      }
    });

  const issueType = typeFound || "?";

  sendResponse({
    id: "grab",
    data: {
      issueId,
      issueTitle,
      issueType,
    },
  });
});
