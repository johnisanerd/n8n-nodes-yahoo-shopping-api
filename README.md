# n8n-nodes-yahoo-shopping-api

An [n8n](https://n8n.io/) community node that searches Yahoo Shopping and returns product listings with prices, sellers, and images. It is backed by the [Yahoo Shopping API](https://apify.com/johnvc/yahoo-shopping-search-scraper?fpr=9n7kx3) on [Apify](https://apify.com?fpr=9n7kx3) and bills per page processed, so there are no subscriptions and no minimums.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Output](#output) · [Example workflows](#example-workflows) · [Pricing](#pricing) · [Resources](#resources)

## What it does

Give the node a search query, and it returns one item per Yahoo Shopping product with its title, price, sale price, seller, product link, and thumbnail. You can filter by price range and merchant, sort the results, and page through them. It also works as an **AI Agent tool**, so an agent can look up products and prices on demand. This is great for **price monitoring**, market research, and competitive analysis.

- Search Yahoo Shopping for any product query
- Filter by minimum and maximum price, and by merchant
- Sort by price, relevancy, popularity, or discount percentage
- Choose how much data to return per product: Simplified, Raw, or Selected Fields

## Installation

Follow the n8n [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/):

1. In n8n, open **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-yahoo-shopping-api` as the npm package name.
4. Agree to the risks of using community nodes, then select **Install**.

After it installs, the **Yahoo Shopping** node appears in the nodes panel.

> n8n Cloud only allows verified community nodes. Until this node is verified, install it on a self-hosted n8n instance.

## Credentials

You need a free [Apify account](https://apify.com?fpr=9n7kx3) and an API token.

1. Sign in to the [Apify Console](https://console.apify.com?fpr=9n7kx3).
2. Open **Settings > Integrations** and copy your **Personal API token**.
3. In n8n, create a new **Apify API** credential and paste the token.
4. Use the credential's **Test** button to confirm it works.

The node also supports **Apify OAuth2** if you prefer to connect that way.

## Operations

**Product > Search** returns Yahoo Shopping products for a query.

| Parameter | Description |
| --- | --- |
| Search Query | The product query to search for, for example `coffee`. Required. |
| Minimum Price / Maximum Price | Constrain results to a USD range. Use `0.00` for no bound. |
| Sort By / Sort Direction | Sort by price, relevancy, popularity, or discount percentage. |
| Merchants | Comma-separated merchant IDs to restrict results to specific sellers. |
| Results per Page / Maximum Pages | Control page size (up to 60) and how many pages to fetch. |
| Output | How much data to return: Simplified, Raw, or Selected Fields. |

## Output

Each product is returned as its own n8n item, flattened across all fetched pages. The **Output** parameter lets you choose how much to return:

- **Simplified** (default): a compact object with `title`, `price`, `salePrice`, `seller`, `productLink`, `thumbnail`, `productId`, and `position`. This mode is also used automatically when the node runs as an AI Agent tool, to keep responses small.
- **Raw**: every field the API returns for each product, using the original field names below.
- **Selected Fields**: pick exactly which fields to include.

### Fields (Raw and Selected Fields)

| Field | Type | Description |
| --- | --- | --- |
| `query` | string | The query that produced this product |
| `page_number` | integer | The result page this product came from |
| `position` | integer | Rank of the product on its page |
| `product_id` | string | Yahoo Shopping product identifier |
| `title` | string | Product name |
| `seller` | string | Merchant or seller name |
| `price` | number | Current price in USD |
| `sale_price` | number | Discounted price when on sale |
| `link` | string | Direct URL to the product page |
| `thumbnail` | string | Product image URL |

## Example workflows

### 1. Price monitoring

1. **Schedule Trigger** (daily).
2. **Yahoo Shopping**: search your tracked product with a price range.
3. **Postgres**: store `price` and `sale_price` with the run date to chart trends.

### 2. Build a competitive price sheet

1. **Read** a list of product queries.
2. **Yahoo Shopping**: search each query, sorted by price ascending.
3. **Google Sheets**: append `title`, `seller`, `price`, and `link` to a comparison sheet.

### 3. Let an AI Agent find deals

1. **AI Agent** node.
2. Attach **Yahoo Shopping** as a tool.
3. Ask "Find headphones under 100 and tell me who sells them cheapest." The agent calls the node (in Simplified mode) and returns matching products.

## Pricing

This node calls the [Yahoo Shopping API](https://apify.com/johnvc/yahoo-shopping-search-scraper?fpr=9n7kx3) on Apify, which is billed **pay-per-page-processed**, with no subscription and no minimums. Apify also includes a free monthly usage tier that covers typical volumes. See the [Actor page](https://apify.com/johnvc/yahoo-shopping-search-scraper?fpr=9n7kx3) for current rates.

## Resources

- [Yahoo Shopping API on Apify](https://apify.com/johnvc/yahoo-shopping-search-scraper?fpr=9n7kx3)
- [npm package](https://www.npmjs.com/package/n8n-nodes-yahoo-shopping-api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Apify n8n integration guide](https://docs.apify.com/platform/integrations/n8n)

## License

[MIT](LICENSE.md)
