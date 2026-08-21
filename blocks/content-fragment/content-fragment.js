function showEmpty(block) {
  const emptyMessage = 'No content fragment selected. Use the Universal Editor to select a content fragment.';
  block.innerHTML = `<div class="content-fragment-empty">${emptyMessage}</div>`;
}

function showError(block, message) {
  block.innerHTML = `<div class="content-fragment-error">Error: ${message}</div>`;
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

    const response = fetch(gqlUrl);
    const contentFragment = await response.json();
    if (!contentFragment) {
      showError(block, 'Content fragment not found');
    }
    console.log(contentFragment);
    /*
    Because the content fragment is a reference property,
      we can rewrite the entire block with the content fragment data
    Caution with doing this with default content and inferred elements
      since UE it renders the block with special aue attributes
    Learn more about inferred elements here:
      https://www.aem.live/developer/component-model-definitions#creating-semantic-content-models-for-blocks
    */
    // block.innerHTML = createDisplay(contentFragment);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Content Fragment block error:', error);
    showError(block, 'Failed to load content fragment');
  }
}
