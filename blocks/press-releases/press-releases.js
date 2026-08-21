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

async function loadFragment(cfPath) {
  const gqlUrl = `${getAEMHost()}/graphql/execute.json/www-site/pr-by-path;path=${cfPath}`;
  const response = await fetch(gqlUrl);
  const contentFragment = await response.json();
  const cfDiv = document.createElement('div');

  const prHeading = document.createElement('h1');
  prHeading.innerHTML = contentFragment.data.pressReleaseByPath.item.title;

  const prDate = document.createElement('p');
  prDate.innerHTML = contentFragment.data.pressReleaseByPath.item.date;

  const prContent = document.createElement('div');
  prContent.innerHTML = contentFragment.data.pressReleaseByPath.item.content.plaintext;

  cfDiv.appendChild(prHeading);
  cfDiv.appendChild(prDate);
  cfDiv.appendChild(prContent);

  return cfDiv;
}

function createDisplay(contentfragment) {
  const cfDiv = document.createElement('div');

  const listDiv = document.createElement('div');
  listDiv.classList.add('pr-list');
  const detailDiv = document.createElement('div');
  detailDiv.classList.add('pr-detail');

  contentfragment.data.pressReleaseList.items.forEach((pr) => {
    const a = document.createElement('a');
    // eslint-disable-next-line no-underscore-dangle
    a.href = pr._path;
    a.innerText = pr.title;

    a.addEventListener('click', async (e) => {
      e.preventDefault();
      // eslint-disable-next-line no-underscore-dangle
      detailDiv.replaceChildren(await loadFragment(pr._path));
    });
    listDiv.appendChild(a);
  });

  cfDiv.appendChild(listDiv);
  cfDiv.appendChild(detailDiv);

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
