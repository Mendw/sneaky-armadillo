// Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
var query = `
query ($page: Int, $perPage: Int, $search: String) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media (search: $search, sort: POPULARITY_DESC, type: MANGA) {
      id
      title {
        romaji
      }
      popularity
    }
  }
}
`;
// Define our query variables and values that will be used in the query request
var variables = {
    page: 1,
    perPage: 50
};

// Define the config we'll need for our Api request
var url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

export default async function handler(req, res) {
    let data = await fetch(url, options).then(res => res.json())
    res.status(200).json(data)
}