chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Get title from gitlab
  let titleSelector = document.querySelector('.gl-heading-1');

  if (!titleSelector) {
    // try github
    titleSelector = document.querySelector('[data-testid="issue-title"]');
  }

  const issueTitle = titleSelector?.innerText.replaceAll("\"", '\'') || '?';

  let idSelector = 
    document.querySelector('a[data-testid="work-item-drawer-ref-link"]') // Get #id from gitlab's splitted view
    || document.querySelector('[data-component="PH_Title"] span') // Get #id from github;

  if (!idSelector) {
    idSelector = document.querySelectorAll('li:last-child[class="gl-breadcrumb-item gl-breadcrumb-item-sm"]') // Get #id from gitlab

    const lastNode = idSelector[0];

    if (lastNode) {
      idSelector = lastNode?.childNodes?.[0];
    }
  }

  const issueId = idSelector?.innerText?.replace('patv', '') || '?';

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
