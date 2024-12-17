console.info('Run grab-git-infos content script');
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let titleSelector = document.querySelector('.detail-page-description h1.title');
  if (!titleSelector) {
    // try github
    titleSelector = document.querySelector('.gh-header .gh-header-title .markdown-title');
  }
  const issueTitle = titleSelector?.innerText || '?';

  let idSelector = document.querySelector('li[data-testid="breadcrumb-current-link"]');
  if (!idSelector) {
    // try github
    idSelector = document.querySelector('.gh-header .gh-header-title span');
  }

  const issueId = idSelector?.innerText || '?';

  var issueType = "" ;
  document.querySelectorAll( 'aside .issuable-show-labels .gl-link.gl-label-link').forEach((node)=>{ 
      const labelGroup = node?.childNodes?.[0]?.innerText?.toLowerCase().trim();
      if(labelGroup === 'type'){
        issueType = node?.childNodes?.[1]?.innerText?.toLowerCase().trim() || node?.childNodes?.[2]?.innerText?.toLowerCase().trim();
      }
  })

  sendResponse({
    id: 'grab',
    data: {
      issueId,
      issueTitle,
      issueType
    }
  });
});
