const grabCommitTitle = async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });

    if (tab?.id) {
      const response = await chrome.tabs.sendMessage(tab.id, {
        id: 'grab',
        data: ''
      });

      console.log(response);
      const { issueId, issueTitle, issueType } = response.data;

      document.getElementById('commit-text').innerText = `${issueType}(${issueId}): ${issueTitle}`;
      let formattedTitle = issueTitle
        .toLowerCase()
        .replaceAll(/\s/g, '-')
        .replaceAll(':', '-')
        .replaceAll(/\-{2,}/g, '-');

      document.getElementById('branch-text').innerText = `${issueType}/${issueId}-${formattedTitle}`;
    }
  } catch (error) {
    console.error(error);
  }
};

const onClickCopyCommit = async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById('commit-text').innerText);
  } catch (error) {
    console.error(error);
  }
};

const onClickCopyBranch = async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById('branch-text').innerText);
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener('DOMContentLoaded', async (event) => {
  console.log('DOM fully loaded and parsed');

  document.getElementById('commit-copy-button').addEventListener('click', onClickCopyCommit);
  document.getElementById('branch-copy-button').addEventListener('click', onClickCopyBranch);

  grabCommitTitle();
});
