// ==UserScript==
// @name        GitHub Move Build Status first
// @version     1.0.0
// @description A userscript that moves the build status icons to first position for easy overview of multiple PR statuses
// @license     MIT
// @author      Klaus Eckelt
// @namespace   https://github.com/keckelt
// @match       https://github.com/*pulls
// @icon        data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='16' viewBox='0 0 16 16' width='16'%3E%3Cpath d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z'%3E%3C/path%3E%3C/svg%3E
// @run-at      document-end
//
// @description 19/05/2025, 10:46:06
// ==/UserScript==

(() => {
  "use strict";

  const maxRetries = 20; // Try for about 10 seconds (20 * 500ms)
  let retries = 0;

  function moveElements() {
    const elements = document.querySelectorAll("details.commit-build-statuses");
    // console.log(`Attempt ${retries + 1}: Found ${elements.length} build status elements.`);

    if (elements.length > 0) {
      elements.forEach((element) => {
        const parent = element.parentNode;
        if (parent) {
          parent.insertBefore(element, parent.firstChild);
        }
      });
      return true; // Elements found and processed
    }
    return false; // Elements not found yet
  }

  function highlightElements() {
    const approved = "approval";
    const changesRequested = "requesting changes";
    const wating = "Review required";
    const reviewStatus = [
      { label: approved, color: "#66C2A5" },
      { label: changesRequested, color: "#F05268" },
      { label: wating, color: "#FBE156" },
    ];

    let found = false;

    for (const status of reviewStatus) {
      const elements = document.querySelectorAll(
        `[aria-label*="${status.label}" i]`
      );
      // console.log(
      //   `Attempt ${retries + 1}: Found ${elements.length} elements with label "${status.label}".`
      // );
      found = found || elements.length > 0;
      elements.forEach((element) => {
        element.style.setProperty('color', status.color, 'important')
      });
    }
    return found;
  }

  const intervalId = setInterval(() => {
    if ((moveElements() && highlightElements()) || retries >= maxRetries) {
      clearInterval(intervalId);
      if (
        retries >= maxRetries &&
        !document.querySelector("details.commit-build-statuses")
      ) {
        // console.log(
        //   'Max retries reached. Elements "details.commit-build-statuses" not found.'
        // );
      } else if (document.querySelector("details.commit-build-statuses")) {
        // console.log("Elements successfully moved.");
      }
    }
    retries++;
  }, 500); // Check every 500 milliseconds
})();
