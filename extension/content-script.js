chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let issueId;
  let issueType = '';
  let issueTitle;

  // Get title dom node and determine if it is gitlab or github
  let titleSelector = document.querySelector('.gl-heading-1');
  if (titleSelector) {
    // Get issue title value (text)
    issueTitle = titleSelector?.innerText?.trim() || '';

    // Get issus id value (#123)
    let idSelector = document.querySelector('a[data-testid="work-item-drawer-ref-link"]'); // Get #id from gitlab's splitted view
    if (!idSelector) {
      idSelector = document.querySelectorAll('li:last-child[class="gl-breadcrumb-item gl-breadcrumb-item-sm"]'); // Get #id from gitlab

      const lastNode = idSelector[0];
      if (lastNode) {
        idSelector = lastNode?.childNodes?.[0];
      }
    }

    issueId = idSelector?.innerText?.replace('patv', '') || ''; // TODO : do it more generic

    // Get issue type from label
    document.querySelectorAll('a[class="gl-label-link gl-link gl-label-link-underline"]').forEach((node) => {
      const labelGroup = node?.childNodes?.[0]?.innerText?.toLowerCase().trim();

      if (labelGroup === 'type') {
        issueType =
          node?.childNodes?.[1]?.innerText?.trim()?.toLowerCase() ||
          node?.childNodes?.[2]?.innerText?.trim()?.toLowerCase();
      }
    });
  } else {
    // Get issue title value (text)
    titleSelector = document.querySelector('[data-testid="issue-title"]');
    issueTitle = titleSelector?.innerText?.trim() || '';

    //  Get issus id value (#123)
    issueId = document.querySelector('[data-component="PH_Title"] span')?.innerText?.trim() || '';

    // Get issue type from label
    issueType =
      document
        .querySelector('div[class*="labelsListContainer"] a[class*="labelLink"] span[class*="Text-Text"]')
        ?.innerText?.trim()
        ?.toLowerCase() || '';
  }

  sendResponse({
    id: 'grab',
    data: {
      issueId,
      issueTitle,
      issueType
    }
  });
});
