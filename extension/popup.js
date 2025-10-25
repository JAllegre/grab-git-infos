const getIssueTypeInfos = (issueType) => {
  switch (issueType) {
    case 'hotfix':
    case 'bug critique':
      return {
        issueTypeEmoji: '🔥',
        issueTypeName: 'hotfix'
      };
    case 'bug':
    case 'bugfix':
      return {
        issueTypeEmoji: '🐛',
        issueTypeName: 'bugfix'
      };
    case 'ergo':
    case 'ui':
    case 'ux':
      return {
        issueTypeEmoji: '🎨',
        issueTypeName: 'ergo'
      };
    case 'enhancement':
    case 'improvement':
      return {
        issueTypeEmoji: '💫',
        issueTypeName: 'enhancement'
      };
    case 'feat':
    case 'feature':
      return {
        issueTypeEmoji: '✨',
        issueTypeName: 'feature'
      };
    case 'config':
    case 'conf':
      return {
        issueTypeEmoji: '🔧',
        issueTypeName: 'config'
      };
    case 'ci':
      return {
        issueTypeEmoji: '🤖',
        issueTypeName: 'ci'
      };
    case 'translation':
      return {
        issueTypeEmoji: '🌍',
        issueTypeName: 'translation'
      };

    case 'dev':
      return {
        issueTypeEmoji: '⭐',
        issueTypeName: 'dev'
      };
    default:
      return {
        issueTypeEmoji: '?',
        issueTypeName: 'unknown'
      };
  }
};

const translate = async (text) => {
  const translatedResponse = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=${encodeURIComponent(text)}`
  );

  const translatedResponseJson = await translatedResponse.json();

  return translatedResponseJson?.[0]?.[0]?.[0] || text;
};

const grabCommitInfos = async () => {
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

      if (!response) {
        console.error('grab-git-info/grabCommitInfos', 'Response is empty');
        return;
      }

      let { issueId, issueTitle, issueType } = response.data;

      try {
        issueTitle = await translate(issueTitle);
      } catch (error) {
        console.error('grab-git-info/grabCommitInfos', 'Unable to translate', error);
      }

      const { issueTypeEmoji, issueTypeName } = getIssueTypeInfos(issueType);
      let titleForCommitText = issueTitle
        .trim()
        .replaceAll(':', ' ')
        .replaceAll('/', ' - ')
        .replaceAll('\\', ' - ')
        .replaceAll(/\s{2,}/g, ' ')
        .replaceAll(/\-{2,}/g, '-');
      titleForCommitText = titleForCommitText[0].toUpperCase() + titleForCommitText.slice(1);

      document.getElementById('commit-text').innerText =
        `${issueTypeEmoji}${issueTypeName}(${issueId}): ${titleForCommitText}`;

      const unusedEnglishWords = [
        'the',
        'a',
        'an',
        'to',
        'for',
        'and',
        'but',
        'or',
        'on',
        'in',
        'with',
        'is',
        'are',
        'of',
        'by',
        'at',
        'from',
        'as',
        'that',
        'this',
        'it',
        'its',
        'be',
        'was',
        'were',
        'which'
      ];

      // Build branch name
      let titleForBranchName = issueTitle
        .trim()
        .toLowerCase()
        .replaceAll(new RegExp(`\\b(${unusedEnglishWords.join('|')})\\b`, 'g'), '')
        .replaceAll(/\s/g, '-')
        .replaceAll(/[:,;/"'\\]/g, '-')
        .replaceAll(/\-{2,}/g, '-');

      titleForBranchName = titleForBranchName.split('-').slice(0, 5).join('-'); // limit to first x words

      document.getElementById('branch-text').innerText = `${issueTypeName}/${issueId}-${titleForBranchName}`;
    }
  } catch (error) {
    console.error(error);
  }
};

const onClickCopyCommit = async () => {
  try {
    // Copy commit text to clipboard
    await navigator.clipboard.writeText(document.getElementById('commit-text').innerText);
  } catch (error) {
    console.error('grab-git-info/onClickCopyCommit', error);
  }
};

const onClickCopyBranch = async () => {
  try {
    // Copy branch name to clipboard
    await navigator.clipboard.writeText(document.getElementById('branch-text').innerText);
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener('DOMContentLoaded', async (event) => {
  console.log('grab-git-info/popus.js', 'DOM fully loaded and parsed');

  document.getElementById('commit-copy-button').addEventListener('click', onClickCopyCommit);
  document.getElementById('branch-copy-button').addEventListener('click', onClickCopyBranch);

  grabCommitInfos();
});
