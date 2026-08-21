function showEmpty(block) {
  const emptyMessage = 'No content fragment selected. Use the Universal Editor to select a content fragment.';
  block.innerHTML = `<div class="content-fragment-empty">${emptyMessage}</div>`;
}

function showError(block, message) {
  block.innerHTML = `<div class="content-fragment-error">Error: ${message}</div>`;
}

function createDisplay(contentfragment) {
  const cfDiv = document.createElement('div');

  const prHeading = document.createElement('h1');
  prHeading.innerHTML = contentfragment.data.pressReleaseByPath.item.title;

  const prDate = document.createElement('p');
  prDate.innerHTML = contentfragment.data.pressReleaseByPath.item.date;

  const prContent = document.createElement('div');
  prContent.innerHTML = contentfragment.data.pressReleaseByPath.item.content.plaintext;

  cfDiv.appendChild(prHeading);
  cfDiv.appendChild(prDate);
  cfDiv.appendChild(prContent);

  return cfDiv;
}

export default async function decorate(block) {
  // Get the content fragment path from the UE generated content in the DOM
  const cfPath = block.querySelector('a')?.textContent;
  if (!cfPath) {
    showEmpty(block);
    return;
  }

  try {
    const gqlUrl = 'https://author-p219104-e2263158.adobeaemcloud.com/graphql/execute.json/www-site/pr-by-path;path=/content/dam/www-site/release-2';

    const response = await fetch(gqlUrl);
    const contentFragment = await response.json();
    if (!contentFragment) {
      showError(block, 'Content fragment not found');
    }
    block.replaceChildren(createDisplay(contentFragment));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Content Fragment block error:', error);
    showError(block, 'Failed to load content fragment');
  }
}
