/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HandlerCostRequestDetailResponse {
  Max_volume?: number;
  Min_volume?: number;
  Ratio?: number;
  created_at?: string;
  id?: number;
  price_request_to_costs?: HandlerPriceRequestToCostDetailResponse[];
  status?: number;
}

export interface HandlerCostRequestInfoResponse {
  item_count?: number;
  request_id?: number;
}

export interface HandlerCostResponse {
  id?: number;
  image_url?: string;
  info?: string;
  title?: string;
  type_change?: boolean;
}

export interface HandlerCostsFilterResponse {
  id?: number;
  image_url?: string;
  info?: string;
  title?: string;
}

export interface HandlerCostsRequestsFilterResponse {
  ClosedAt?: string;
  CreatedAt?: string;
  FormedAt?: string;
  Max_volume?: number;
  Min_volume?: number;
  ModeratorID?: number;
  Ratio?: number;
  Status?: number;
  UserID?: number;
  id?: number;
}

export interface HandlerCreateCostRequest {
  info?: string;
  title: string;
  type_change: boolean;
}

export interface HandlerLoginRequest {
  password: string;
  username: string;
}

export interface HandlerLoginResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  user?: HandlerUserInfo;
}

export interface HandlerPriceRequestToCostDetailResponse {
  cost_id?: number;
  cost_price?: number;
  cost_title?: string;
  img?: string;
}

export interface HandlerRefreshTokenRequest {
  refresh_token: string;
}

export interface HandlerRegisterRequest {
  password: string;
  role?: string;
  username: string;
}

export interface HandlerUpdateCostRequest {
  info?: string;
  title?: string;
  type_change?: boolean;
}

export interface HandlerUpdateCostRequestResponse {
  Max_volume?: number;
  Min_volume?: number;
}

export interface HandlerUpdatePriceToRequestConnection {
  cost_price?: number;
}

export interface HandlerUpdateProfileRequest {
  password?: string;
  username?: string;
}

export interface HandlerUserInfo {
  id?: number;
  role?: string;
  username?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title DIA Backend API
 * @version 1.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @externalDocs https://swagger.io/resources/open-api/
 * @contact API Support <support@DIA.example.com> (https://github.com/your-org/DIA_Backend)
 *
 * This is the backend API for DIA (Information and Analytical Data) system.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  costRequestCosts = {
    /**
     * @description Update cost connection details in a cost request
     *
     * @tags cost-request-costs
     * @name CostsUpdate
     * @summary Update cost in request
     * @request PUT:/cost-request-costs/{requestId}/costs/{costId}
     * @secure
     */
    costsUpdate: (
      requestId: number,
      costId: number,
      request: HandlerUpdatePriceToRequestConnection,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/cost-request-costs/${requestId}/costs/${costId}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove a cost from a cost request
     *
     * @tags cost-request-costs
     * @name CostsDelete
     * @summary Remove cost from request
     * @request DELETE:/cost-request-costs/{requestId}/costs/{costId}
     * @secure
     */
    costsDelete: (
      requestId: number,
      costId: number,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/cost-request-costs/${requestId}/costs/${costId}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  costRequests = {
    /**
     * @description Get a list of cost requests with optional filtering
     *
     * @tags cost-requests
     * @name CostRequestsList
     * @summary Get cost requests
     * @request GET:/cost-requests
     * @secure
     */
    costRequestsList: (
      query?: {
        /** Filter by status */
        status?: number;
        /** Filter by date from (YYYY-MM-DD) */
        date_from?: string;
        /** Filter by date to (YYYY-MM-DD) */
        date_to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerCostsRequestsFilterResponse[], Record<string, any>>({
        path: `/cost-requests`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get information about current user's draft request
     *
     * @tags cost-requests
     * @name CostRequestInfoList
     * @summary Get draft request info
     * @request GET:/cost-requests/costRequestInfo
     * @secure
     */
    costRequestInfoList: (params: RequestParams = {}) =>
      this.request<HandlerCostRequestInfoResponse, Record<string, any>>({
        path: `/cost-requests/costRequestInfo`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get detailed information about a specific cost request
     *
     * @tags cost-requests
     * @name CostRequestsDetail
     * @summary Get cost request by ID
     * @request GET:/cost-requests/{id}
     * @secure
     */
    costRequestsDetail: (id: number, params: RequestParams = {}) =>
      this.request<HandlerCostRequestDetailResponse, Record<string, any>>({
        path: `/cost-requests/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing cost request
     *
     * @tags cost-requests
     * @name CostRequestsUpdate
     * @summary Update cost request
     * @request PUT:/cost-requests/{id}
     * @secure
     */
    costRequestsUpdate: (
      id: number,
      request: HandlerUpdateCostRequestResponse,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/cost-requests/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a cost request
     *
     * @tags cost-requests
     * @name CostRequestsDelete
     * @summary Delete cost request
     * @request DELETE:/cost-requests/{id}
     * @secure
     */
    costRequestsDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/cost-requests/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Form a draft cost request into a submitted request
     *
     * @tags cost-requests
     * @name FormUpdate
     * @summary Form cost request
     * @request PUT:/cost-requests/{id}/form
     * @secure
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/cost-requests/${id}/form`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Reject a cost request (moderator action)
     *
     * @tags cost-requests
     * @name RejectUpdate
     * @summary Reject cost request
     * @request PUT:/cost-requests/{id}/reject
     * @secure
     */
    rejectUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/cost-requests/${id}/reject`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Resolve a cost request (moderator action)
     *
     * @tags cost-requests
     * @name ResolveUpdate
     * @summary Resolve cost request
     * @request PUT:/cost-requests/{id}/resolve
     * @secure
     */
    resolveUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/cost-requests/${id}/resolve`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  costs = {
    /**
     * @description Get a list of all cost with optional title search
     *
     * @tags costs
     * @name CostsList
     * @request GET:/costs
     * @secure
     */
    costsList: (
      query?: {
        /** Search cost by title */
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerCostsFilterResponse[], Record<string, any>>({
        path: `/costs`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new cost with the provided data
     *
     * @tags costs
     * @name CostsCreate
     * @summary Create a new cost
     * @request POST:/costs
     * @secure
     */
    costsCreate: (
      request: HandlerCreateCostRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/costs`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get detailed information about a specific cost
     *
     * @tags costs
     * @name CostsDetail
     * @summary Get cost by ID
     * @request GET:/costs/{id}
     * @secure
     */
    costsDetail: (id: number, params: RequestParams = {}) =>
      this.request<HandlerCostResponse, Record<string, any>>({
        path: `/costs/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing cost with new data
     *
     * @tags costs
     * @name CostsUpdate
     * @summary Update cost
     * @request PUT:/costs/{id}
     * @secure
     */
    costsUpdate: (
      id: number,
      request: HandlerUpdateCostRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/costs/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a cost by ID
     *
     * @tags costs
     * @name CostsDelete
     * @summary Delete cost
     * @request DELETE:/costs/{id}
     * @secure
     */
    costsDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/costs/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Add a cost to the current user's draft request
     *
     * @tags costs
     * @name AddToRequestCreate
     * @summary Add cost to draft request
     * @request POST:/costs/{id}/add-to-request
     * @secure
     */
    addToRequestCreate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/costs/${id}/add-to-request`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload and attach an image to a cost
     *
     * @tags costs
     * @name ImageCreate
     * @summary Add image to cost
     * @request POST:/costs/{id}/image
     * @secure
     */
    imageCreate: (
      id: number,
      data: {
        /** Cost image file */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/costs/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Authenticate user and return JWT tokens
     *
     * @tags users
     * @name LoginCreate
     * @summary User login
     * @request POST:/users/login
     */
    loginCreate: (request: HandlerLoginRequest, params: RequestParams = {}) =>
      this.request<HandlerLoginResponse, Record<string, any>>({
        path: `/users/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Logout user (token invalidation)
     *
     * @tags users
     * @name LogoutCreate
     * @summary User logout
     * @request POST:/users/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/users/logout`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get current user's profile information
     *
     * @tags users
     * @name ProfileList
     * @summary Get user profile
     * @request GET:/users/profile
     * @secure
     */
    profileList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/users/profile`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update current user's profile information
     *
     * @tags users
     * @name ProfileUpdate
     * @summary Update user profile
     * @request PUT:/users/profile
     * @secure
     */
    profileUpdate: (
      request: HandlerUpdateProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/users/profile`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get new access token using refresh token
     *
     * @tags users
     * @name RefreshCreate
     * @summary Refresh access token
     * @request POST:/users/refresh
     */
    refreshCreate: (
      request: HandlerRefreshTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerLoginResponse, Record<string, any>>({
        path: `/users/refresh`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new user account and automatically login
     *
     * @tags users
     * @name RegisterCreate
     * @summary Register a new user
     * @request POST:/users/register
     */
    registerCreate: (
      request: HandlerRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerLoginResponse, Record<string, any>>({
        path: `/users/register`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
