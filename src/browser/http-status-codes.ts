// - CSV with codes: https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
// - https://httpwg.org/specs/rfc9110.html

// Informational responses (100 – 199)
export const STATUS_CONTINUE = 100;
export const STATUS_SWITCHING_PROTOCOLS = 101;
export const STATUS_PROCESSING = 102;
export const STATUS_EARLY_HINTS = 103;

// Successful responses (200 – 299)
export const STATUS_OK = 200;
export const STATUS_CREATED = 201;
export const STATUS_ACCEPTED = 202;
export const STATUS_NON_AUTHORITATIVE_INFORMATION = 203;
export const STATUS_NO_CONTENT = 204;
export const STATUS_RESET_CONTENT = 205;
export const STATUS_PARTIAL_CONTENT = 206;
export const STATUS_MULTI_STATUS = 207;
export const STATUS_ALREADY_REPORTED = 208;
export const STATUS_IM_USED = 226;

// Redirection messages (300 – 399)
export const STATUS_MULTIPLE_CHOICES = 300;
export const STATUS_MOVED_PERMANENTLY = 301;
export const STATUS_FOUND = 302;
export const STATUS_SEE_OTHER = 303;
export const STATUS_NOT_MODIFIED = 304;
export const STATUS_USE_PROXY = 305;
export const STATUS_TEMPORARY_REDIRECT = 307;
export const STATUS_PERMANENT_REDIRECT = 308;

// Client error responses (400 – 499)
export const STATUS_BAD_REQUEST = 400;
export const STATUS_UNAUTHORIZED = 401;
export const STATUS_PAYMENT_REQUIRED = 402;
export const STATUS_FORBIDDEN = 403;
export const STATUS_NOT_FOUND = 404;
export const STATUS_METHOD_NOT_ALLOWED = 405;
export const STATUS_NOT_ACCEPTABLE = 406;
export const STATUS_PROXY_AUTHENTICATION_REQUIRED = 407;
export const STATUS_REQUEST_TIMEOUT = 408;
export const STATUS_CONFLICT = 409;
export const STATUS_GONE = 410;
export const STATUS_LENGTH_REQUIRED = 411;
export const STATUS_PRECONDITION_FAILED = 412;
export const STATUS_CONTENT_TOO_LARGE = 413;
export const STATUS_URI_TOO_LONG = 414;
export const STATUS_UNSUPPORTED_MEDIA_TYPE = 415;
export const STATUS_RANGE_NOT_SATISFIABLE = 416;
export const STATUS_EXPECTATION_FAILED = 417;
export const STATUS_MISDIRECTED_REQUEST = 421;
export const STATUS_UNPROCESSABLE_CONTENT = 422;
export const STATUS_LOCKED = 423;
export const STATUS_FAILED_DEPENDENCY = 424;
export const STATUS_TOO_EARLY = 425;
export const STATUS_UPGRADE_REQUIRED = 426;
export const STATUS_PRECONDITION_REQUIRED = 428;
export const STATUS_TOO_MANY_REQUESTS = 429;
export const STATUS_REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
export const STATUS_UNAVAILABLE_FOR_LEGAL_REASONS = 451;

// Server error responses (500 – 599)
export const STATUS_INTERNAL_SERVER_ERROR = 500;
export const STATUS_NOT_IMPLEMENTED = 501;
export const STATUS_BAD_GATEWAY = 502;
export const STATUS_SERVICE_UNAVAILABLE = 503;
export const STATUS_GATEWAY_TIMEOUT = 504;
export const STATUS_HTTP_VERSION_NOT_SUPPORTED = 505;
export const STATUS_VARIANT_ALSO_NEGOTIATES = 506;
export const STATUS_INSUFFICIENT_STORAGE = 507;
export const STATUS_LOOP_DETECTED = 508;
export const STATUS_NETWORK_AUTHENTICATION_REQUIRED = 511;
