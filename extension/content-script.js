chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Get title from gitlab
  let titleSelector = document.querySelector('.gl-heading-1');

  if (!titleSelector) {
    // try github
    titleSelector = document.querySelector('[data-testid="issue-title"]');
  }

  const issueTitle = titleSelector?.innerText || '?';

  // Get #id from gitlab
  let idSelector = document.querySelector('.router-link-exact-active');

  if (!idSelector) {
    // try github
    idSelector = document.querySelector('[data-component="PH_Title"] span');
  }

  const issueId = idSelector?.innerText || '?';

  let issueType = '';
  document.querySelectorAll('a[class="gl-label-link gl-link gl-label-link-underline"]').forEach((node) => {
    const labelGroup = node?.childNodes?.[0]?.innerText?.toLowerCase().trim();

    if (labelGroup === 'type') {
      issueType =
        node?.childNodes?.[1]?.innerText?.toLowerCase().trim() ||
        node?.childNodes?.[2]?.innerText?.toLowerCase().trim();
    }
  });

  sendResponse({
    id: 'grab',
    data: {
      issueId,
      issueTitle,
      issueType
    }
  });
});
