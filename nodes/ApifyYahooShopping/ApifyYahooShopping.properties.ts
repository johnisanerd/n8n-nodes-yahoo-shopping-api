import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

/**
 * Build the Apify Actor input from node parameters.
 * Only the real Actor inputs are sent; the Output / Fields parameters shape the
 * data we return, they are not part of the Actor input.
 */
export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	defaultInput: Record<string, any>,
): Record<string, any> {
	const input: Record<string, any> = {
		...defaultInput,
		query: context.getNodeParameter('query', itemIndex),
		min_price: context.getNodeParameter('min_price', itemIndex, '0.00'),
		max_price: context.getNodeParameter('max_price', itemIndex, '0.00'),
		limit: context.getNodeParameter('resultsPerPage', itemIndex, 60),
		max_pages: context.getNodeParameter('max_pages', itemIndex, 1),
	};

	const sortBy = context.getNodeParameter('sort_by', itemIndex, '') as string;
	if (sortBy) {
		input.sort_by = sortBy;
		input.order_by = context.getNodeParameter('order_by', itemIndex, 'DESC');
	}

	const merchants = context.getNodeParameter('merchants', itemIndex, '') as string;
	if (merchants) {
		input.merchants = merchants;
	}

	return input;
}

const resourceProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Product',
				value: 'product',
			},
		],
		default: 'product',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search products on yahoo shopping',
				description: 'Search Yahoo Shopping and return one item per product',
			},
		],
		default: 'search',
	},
];

const actorProperties: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. coffee',
		description: 'The product query to search Yahoo Shopping for',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Minimum Price',
		name: 'min_price',
		type: 'string',
		default: '0.00',
		placeholder: 'e.g. 50',
		description: 'Minimum price in USD. Use 0.00 for no lower bound.',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Price',
		name: 'max_price',
		type: 'string',
		default: '0.00',
		placeholder: 'e.g. 200',
		description: 'Maximum price in USD. Use 0.00 for no upper bound.',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Sort By',
		name: 'sort_by',
		type: 'options',
		default: '',
		options: [
			{ name: 'Default (Relevance)', value: '' },
			{ name: 'Discount Percentage', value: 'discountPercentage' },
			{ name: 'Popularity', value: 'popularity' },
			{ name: 'Price', value: 'price' },
			{ name: 'Relevancy', value: 'relevancy' },
		],
		description: 'How to sort the results',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Sort Direction',
		name: 'order_by',
		type: 'options',
		default: 'DESC',
		options: [
			{ name: 'Ascending', value: 'ASC' },
			{ name: 'Descending', value: 'DESC' },
		],
		description: 'Sort direction, applied when a Sort By field is chosen',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['search'],
				sort_by: ['discountPercentage', 'popularity', 'price', 'relevancy'],
			},
		},
	},
	{
		displayName: 'Merchants',
		name: 'merchants',
		type: 'string',
		default: '',
		placeholder: 'e.g. amazon,walmart',
		description: 'Comma-separated merchant IDs to restrict results to specific sellers',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Results per Page',
		name: 'resultsPerPage',
		type: 'number',
		default: 60,
		typeOptions: { minValue: 1, maxValue: 60 },
		description: 'How many results per page (maximum 60)',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Pages',
		name: 'max_pages',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 0 },
		description: 'How many pages to fetch. Use 0 for no limit.',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
];

const outputProperties: INodeProperties[] = [
	{
		displayName: 'Output',
		name: 'output',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
		options: [
			{
				name: 'Raw',
				value: 'raw',
				description: 'Return every field the API produces for each product',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose exactly which fields to return',
			},
			{
				name: 'Simplified',
				value: 'simplified',
				description: 'Return a compact set of the most useful product fields',
			},
		],
		default: 'simplified',
		description: 'How much data to return for each product',
	},
	{
		displayName: 'Fields to Include',
		name: 'fields',
		type: 'multiOptions',
		displayOptions: {
			show: { resource: ['product'], operation: ['search'], output: ['selected'] },
		},
		options: [
			{ name: 'Link', value: 'link' },
			{ name: 'Page Number', value: 'page_number' },
			{ name: 'Position', value: 'position' },
			{ name: 'Price', value: 'price' },
			{ name: 'Product ID', value: 'product_id' },
			{ name: 'Query', value: 'query' },
			{ name: 'Sale Price', value: 'sale_price' },
			{ name: 'Seller', value: 'seller' },
			{ name: 'Thumbnail', value: 'thumbnail' },
			{ name: 'Title', value: 'title' },
		],
		default: ['title', 'price', 'sale_price', 'seller', 'link'],
		description: 'Which fields to return when Output is set to Selected Fields',
	},
];

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'API Key',
				value: 'apifyApi',
			},
			{
				name: 'OAuth2',
				value: 'apifyOAuth2Api',
			},
		],
		default: 'apifyApi',
		description: 'Choose which authentication method to use',
	},
];

export const properties: INodeProperties[] = [
	...resourceProperties,
	...actorProperties,
	...outputProperties,
	...authenticationProperties,
];
