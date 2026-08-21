function getAEMHost() {
  let host;
  if (window.location.hostname.endsWith('adobeaemcloud.com')) {
    host = 'https://author-p219104-e2263158.adobeaemcloud.com';
  } else {
    host = 'https://publish-p219104-e2263158.adobeaemcloud.com';
    // or actual public facing domain
  }
  // Remove trailing slash if present
  if (host.endsWith('/')) {
    host = host.slice(0, -1);
  }
  return host;
}

function createDisplay(contentfragment) {
  const cfDiv = document.createElement('div');

  contentfragment.data.pressReleaseList.items.forEach((pr) => {
    const a = document.createElement('a');
    // eslint-disable-next-line no-underscore-dangle
    a.href = pr._path;
    a.innerText = pr.title;

    a.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(e.target.href);
    });
    cfDiv.appendChild(a);
  });

  return cfDiv;
}

export default async function decorate(block) {
  try {
    const gqlUrl = `${getAEMHost()}/graphql/execute.json/www-site/pr-all`;
    const response = await fetch(gqlUrl);
    const contentFragment = await response.json();
    block.replaceChildren(createDisplay(contentFragment));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Content Fragment block error:', error);
  }
}
