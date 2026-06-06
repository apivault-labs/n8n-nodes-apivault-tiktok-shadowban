import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

// Apify actor that does the real work (runs server-side, billed pay-per-event).
const ACTOR_ID = 'apivault_labs~tiktok-shadow-ban-checker';

export class TikTokShadowBan implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TikTok Shadow Ban Checker',
		name: 'tikTokShadowBan',
		icon: 'file:tiktokshadowban.svg',
		group: ['transform'],
		version: 1,
		description:
			'Check TikTok videos for shadow-ban status: multi-signal detection, health score, engagement rate, viral potential and actionable recommendations.',
		defaults: {
			name: 'TikTok Shadow Ban Checker',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'apifyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Video URLs',
				name: 'urls',
				type: 'string',
				default: '',
				required: true,
				placeholder:
					'https://www.tiktok.com/@tiktok/video/7480279424202575159',
				description:
					'One or more TikTok video URLs (full or vm.tiktok.com short links), separated by commas or new lines.',
			},
			{
				displayName: 'Proxy Country',
				name: 'proxyCountry',
				type: 'string',
				default: 'US',
				placeholder: 'US',
				description: 'ISO 2-letter country code for the residential proxy',
			},
			{
				displayName: 'Include Recommendations',
				name: 'includeRecommendations',
				type: 'boolean',
				default: true,
				description:
					'Whether to add a recommendations array to each result with advice based on detected signals',
			},
			{
				displayName: 'Include Batch Summary',
				name: 'includeSummary',
				type: 'boolean',
				default: false,
				description:
					'Whether to append a batch-summary record at the end of the output',
			},
			{
				displayName: 'Max Retries',
				name: 'maxRetries',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 10 },
				default: 5,
				description: 'Per-URL retry attempts with a fresh proxy IP',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const raw = this.getNodeParameter('urls', i) as string;
				const proxyCountry = this.getNodeParameter('proxyCountry', i) as string;
				const includeRecommendations = this.getNodeParameter(
					'includeRecommendations',
					i,
				) as boolean;
				const includeSummary = this.getNodeParameter('includeSummary', i) as boolean;
				const maxRetries = this.getNodeParameter('maxRetries', i) as number;

				const urls = raw
					.split(/[\s,]+/)
					.map((u) => u.trim())
					.filter((u) => u.length > 0);

				if (urls.length === 0) {
					throw new NodeOperationError(
						this.getNode(),
						'No valid TikTok video URLs provided',
						{ itemIndex: i },
					);
				}

				const body = {
					urls,
					includeSummary,
					includeRecommendations,
					maxRetries,
					proxyCountry: (proxyCountry || 'US').trim().toUpperCase(),
				};

				const options: IRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items`,
					body,
					json: true,
				};

				const response = await this.helpers.requestWithAuthentication.call(
					this,
					'apifyApi',
					options,
				);

				const results = Array.isArray(response) ? response : [response];
				for (const result of results) {
					returnData.push({ json: result, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
