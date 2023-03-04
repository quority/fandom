import { type BaseEndpoint, type RequestManager, sleep } from '@wikiscript/core'
import type { Fandom } from '../strategies'

interface POSTOptions {
	contentType?: 'application/json'
	query?: Record<string, string>
}

export abstract class BaseController<Endpoint extends BaseEndpoint<Fandom>> {
	public abstract readonly controller: string
	public readonly endpoint: Endpoint
	public readonly request: RequestManager

	public static readonly attachmentsDefault = Object.freeze( {
		atMentions: [],
		contentImages: [],
		openGraphs: []
	} )

	public constructor( endpoint: Endpoint ) {
		this.endpoint = endpoint
		this.request = endpoint.wiki.request
	}

	protected get( searchParams: Record<string, string> ): ReturnType<RequestManager[ 'raw' ]> {
		const usp = new URLSearchParams( {
			controller: this.controller,
			...searchParams
		} ).toString()
		const url = new URL( `?${ usp }`, this.endpoint.url )
		return this.raw( url, {
			method: 'GET'
		} )
	}

	protected getUrl( params: Record<string, string> ): URL {
		const searchParams = new URLSearchParams( params ).toString()
		return new URL( `?${ searchParams }`, this.endpoint.url )
	}

	protected post( { method, ...body }: Record<string, unknown> & { method: string }, options: POSTOptions = {} ): ReturnType<RequestManager[ 'raw' ]> {
		const searchParams = new URLSearchParams( {
			controller: this.controller,
			method,
			...options.query
		} ).toString()
		const url = new URL( `?${ searchParams }`, this.endpoint.url )

		let requestBody: string
		if ( options.contentType === 'application/json' ) {
			requestBody = JSON.stringify( body )
		} else {
			requestBody = new URLSearchParams( body as Record<string, string> ).toString()
		}

		return this.raw( url, {
			body: requestBody,
			headers: {
				'content-type': options.contentType ?? 'application/x-www-form-urlencoded'
			},
			method: 'POST'
		} )
	}

	protected async raw( url: string | URL, fetchOptions: NonNullable<Parameters<RequestManager[ 'raw' ]>[ 1 ]>, throttle = 2000 ): ReturnType<RequestManager[ 'raw' ]> {
		const req = await this.request.raw(
			url,
			{
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				...fetchOptions
			},
			{ cookieUrl: this.endpoint.wiki.platform.services }
		)

		if ( req.statusCode === 429 && throttle < 35000 ) {
			await sleep( throttle )
			return this.raw( url, fetchOptions, throttle * 2 )
		} else if ( req.statusCode === 429 ) {
			throw new Error( 'Too many requests.' )
		}

		return req
	}
}
