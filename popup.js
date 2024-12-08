const grabCommitTitle = async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    if (tab?.id) {
      const response = await chrome.tabs.sendMessage(tab.id, {
        id: "grab",
        data: "",
      });

      console.log(response);
      document.getElementById("commit-text").innerText = response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const onClickCopy = async () => {
  try {
    console.log("onClickCopy");
    await navigator.clipboard.writeText(
      document.getElementById("commit-text").innerText
    );
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", async (event) => {
  console.log("DOM fully loaded and parsed");

  document.getElementById("copy-button").addEventListener("click", onClickCopy);

  grabCommitTitle();
});
