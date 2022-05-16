/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.34.976 on 2022-03-08 09:25:10.

export namespace Backend {
	interface PostInitializer
		extends ApplicationListener<ApplicationReadyEvent> {}

	interface Customer extends DatedObject<Customer>, Labeled {
		email: string;
		readingCycle: ReadingCycleType;
		readings: Reading[];
	}

	interface Fields {}

	interface CustomerPublicView extends DomainObject<Customer> {
		email: string;
	}

	interface MailExclusion extends DatedObject<MailExclusion> {
		deliveryPoint: string;
	}

	interface MailNotification extends DatedObject<MailNotification> {
		deliveryPoint: string;
		email: string;
		failedCreation: Date;
		params: any;
		mail: Mail;
	}

	interface MailNotificationSender {}

	interface MailTemplate extends DatedObject<MailTemplate> {
		json: string;
		html: string;
		subject: string;
		lastEditor: string;
	}

	interface MailTemplateEditDto {
		json: string;
		html: string;
		subject: string;
	}

	interface Reading extends DatedObject<Reading> {
		barcode: string;
		deliveryPoint: string;
		deviceType: string;
		datalakeResponseCode: DatalakeResponseCode;
		token: string;
		customer: Customer;
		note: string;
		record1: number;
		record1File: File;
		record1StateAi: boolean;
		record1evaluatedAi: Date;
		record2: number;
		record2File: File;
		record2StateAi: boolean;
		record2evaluatedAi: Date;
		state: ReadingState;
		sentToAi: Date;
		evaluatedAdmin: Date;
		sentToSap: Date;
		responseFromSap: Date;
		definiteEvaluation: Date;
		twoTariff: boolean;
	}

	interface EvaluationDto {
		note: string;
	}

	interface ReadingKafkaDto {
		name: string;
		timestamp: string;
		reported: number;
	}

	interface ReadingKafkaDtoBuilder {}

	interface ReadingKafkaResponseDto {
		name: string;
		status: boolean;
	}

	interface ReadingPublicView extends DatedObject<Reading> {
		barcode: string;
		deliveryPoint: string;
		datalakeResponseCode: DatalakeResponseCode;
		token: string;
		customer: Customer;
		note: string;
		record1: number;
		record1File: File;
		record2: number;
		record2File: File;
		state: ReadingState;
		record1evaluatedAi: Date;
		record2evaluatedAi: Date;
		evaluatedAdmin: Date;
	}

	interface ReadingSubmitDto {
		token: string;
		record1: number;
		record1File: File;
		record2: number;
		record2File: File;
	}

	interface DevSecurityInitializer extends WebSecurityAutoconfig {}

	interface Labeled {
		id: string;
		label: string;
	}

	interface Mail extends AuthoredObject<Mail> {
		subject: string;
		content: string;
		state: MailState;
		identifier: string;
		contentType: string;
		to: string;
		sent: boolean;
		error: string;
	}

	interface File extends AuthoredObject<File> {
		name: string;
		contentType: string;
		size: number;
		permanent: boolean;
	}

	interface ObjectPostProcessor<T> {}

	interface AuthenticationConfiguration {
		authenticationManager: AuthenticationManager;
		applicationContext: ApplicationContext;
		objectPostProcessor: ObjectPostProcessor<any>;
		globalAuthenticationConfigurers: GlobalAuthenticationConfigurerAdapter[];
	}

	interface AuthenticationTrustResolver {}

	interface ApplicationContext
		extends EnvironmentCapable,
			ListableBeanFactory,
			HierarchicalBeanFactory,
			MessageSource,
			ApplicationEventPublisher,
			ResourcePatternResolver {
		parent: ApplicationContext;
		id: string;
		displayName: string;
		autowireCapableBeanFactory: AutowireCapableBeanFactory;
		applicationName: string;
		startupDate: number;
	}

	interface ContentNegotiationStrategy {}

	interface WebSecurityAutoconfig extends WebSecurityConfigurerAdapter {
		objectPostProcessor: ObjectPostProcessor<any>;
		authenticationConfiguration: AuthenticationConfiguration;
		trustResolver: AuthenticationTrustResolver;
		applicationContext: ApplicationContext;
		contentNegotationStrategy: ContentNegotiationStrategy;
	}

	interface ApplicationListener<E> extends EventListener {}

	interface ApplicationReadyEvent extends SpringApplicationEvent {
		applicationContext: ConfigurableApplicationContext;
	}

	interface DatedObject<ROOT> extends DomainObject<ROOT>, Dated<ROOT> {}

	interface DomainObject<ROOT> extends Domain<ROOT>, Projectable<ROOT> {}

	interface UserReference {
		id: string;
		name: string;
	}

	interface TenantReference {
		id: string;
		name: string;
	}

	interface AuthenticationManager {}

	interface GlobalAuthenticationConfigurerAdapter
		extends SecurityConfigurer<
			AuthenticationManager,
			AuthenticationManagerBuilder
		> {}

	interface AutowireCapableBeanFactory extends BeanFactory {}

	interface Environment extends PropertyResolver {
		activeProfiles: string[];
		defaultProfiles: string[];
	}

	interface BeanFactory {}

	interface ClassLoader {}

	interface EnvironmentCapable {
		environment: Environment;
	}

	interface ListableBeanFactory extends BeanFactory {
		beanDefinitionCount: number;
		beanDefinitionNames: string[];
	}

	interface HierarchicalBeanFactory extends BeanFactory {
		parentBeanFactory: BeanFactory;
	}

	interface MessageSource {}

	interface ApplicationEventPublisher {}

	interface ResourcePatternResolver extends ResourceLoader {}

	interface WebSecurityConfigurerAdapter
		extends WebSecurityConfigurer<WebSecurity> {}

	interface EventListener {}

	interface ConfigurableApplicationContext
		extends ApplicationContext,
			Lifecycle,
			Closeable {
		active: boolean;
		environment: ConfigurableEnvironment;
		beanFactory: ConfigurableListableBeanFactory;
		applicationStartup: ApplicationStartup;
	}

	interface SpringApplication {
		sources: string[];
		mainApplicationClass: Class<any>;
		resourceLoader: ResourceLoader;
		webApplicationType: WebApplicationType;
		initializers: ApplicationContextInitializer<any>[];
		listeners: ApplicationListener<any>[];
		additionalProfiles: string[];
		applicationStartup: ApplicationStartup;
		classLoader: ClassLoader;
		allSources: any[];
	}

	interface SpringApplicationEvent extends ApplicationEvent {
		args: string[];
		springApplication: SpringApplication;
	}

	interface AuthoredObject<ROOT> extends DatedObject<ROOT>, Authored<ROOT> {}

	interface PropertyResolver {}

	interface ResourceLoader {
		classLoader: ClassLoader;
	}

	interface ConfigurableEnvironment
		extends Environment,
			ConfigurablePropertyResolver {
		systemProperties: { [index: string]: any };
		propertySources: MutablePropertySources;
		systemEnvironment: { [index: string]: any };
	}

	interface ConfigurableListableBeanFactory
		extends ListableBeanFactory,
			AutowireCapableBeanFactory,
			ConfigurableBeanFactory {
		beanNamesIterator: Iterator<string>;
		configurationFrozen: boolean;
	}

	interface ApplicationStartup {}

	interface Lifecycle {
		running: boolean;
	}

	interface Closeable extends AutoCloseable {}

	interface Class<T>
		extends Serializable,
			GenericDeclaration,
			Type,
			AnnotatedElement {}

	interface ApplicationContextInitializer<C> {}

	interface ApplicationEvent extends EventObject {
		timestamp: number;
	}

	interface Dated<ROOT> extends Domain<ROOT> {
		created: Date;
		deleted: Date;
		updated: Date;
	}

	interface Domain<ROOT> extends Projectable<ROOT> {
		id: string;
	}

	interface Projectable<ROOT> {}

	interface SecurityConfigurer<O, B> {}

	interface AuthenticationManagerBuilder
		extends AbstractConfiguredSecurityBuilder<
				AuthenticationManager,
				AuthenticationManagerBuilder
			>,
			ProviderManagerBuilder<AuthenticationManagerBuilder> {
		object: AuthenticationManager;
		defaultUserDetailsService: UserDetailsService;
		configured: boolean;
		orBuild: AuthenticationManager;
	}

	interface WebSecurityConfigurer<T> extends SecurityConfigurer<Filter, T> {}

	interface WebSecurity
		extends AbstractConfiguredSecurityBuilder<Filter, WebSecurity>,
			SecurityBuilder<Filter>,
			ApplicationContextAware {
		object: Filter;
		privilegeEvaluator: WebInvocationPrivilegeEvaluator;
		expressionHandler: SecurityExpressionHandler<FilterInvocation>;
		orBuild: Filter;
		applicationContext: ApplicationContext;
	}

	interface MutablePropertySources extends PropertySources {}

	interface ConfigurableConversionService
		extends ConversionService,
			ConverterRegistry {}

	interface ConfigurablePropertyResolver extends PropertyResolver {
		conversionService: ConfigurableConversionService;
	}

	interface Iterator<E> {}

	interface AccessControlContext {
		domainCombiner: DomainCombiner;
	}

	interface TypeConverter {}

	interface ConversionService {}

	interface BeanExpressionResolver {}

	interface ConfigurableBeanFactory
		extends HierarchicalBeanFactory,
			SingletonBeanRegistry {
		accessControlContext: AccessControlContext;
		typeConverter: TypeConverter;
		tempClassLoader: ClassLoader;
		beanClassLoader: ClassLoader;
		applicationStartup: ApplicationStartup;
		conversionService: ConversionService;
		cacheBeanMetadata: boolean;
		beanExpressionResolver: BeanExpressionResolver;
		beanPostProcessorCount: number;
		registeredScopeNames: string[];
	}

	interface AutoCloseable {}

	interface Serializable {}

	interface GenericDeclaration extends AnnotatedElement {
		typeParameters: TypeVariable<any>[];
	}

	interface Type {
		typeName: string;
	}

	interface AnnotatedElement {
		annotations: Annotation[];
		declaredAnnotations: Annotation[];
	}

	interface EventObject extends Serializable {
		source: any;
	}

	interface Authored<ROOT> extends Dated<ROOT> {
		deletedBy: UserReference;
		deletedByTenant: TenantReference;
		updatedByTenant: TenantReference;
		updatedBy: UserReference;
		createdByTenant: TenantReference;
		createdBy: UserReference;
	}

	interface UserDetailsService {}

	interface Filter {}

	interface WebInvocationPrivilegeEvaluator {}

	interface SecurityExpressionHandler<T> extends AopInfrastructureBean {
		expressionParser: ExpressionParser;
	}

	interface FilterInvocation {
		chain: FilterChain;
		request: HttpServletRequest;
		response: HttpServletResponse;
		fullRequestUrl: string;
		httpResponse: HttpServletResponse;
		httpRequest: HttpServletRequest;
		requestUrl: string;
	}

	interface ApplicationContextAware extends Aware {}

	interface PropertySources extends Iterable<PropertySource<any>> {}

	interface ConverterRegistry {}

	interface DomainCombiner {}

	interface SingletonBeanRegistry {
		singletonCount: number;
		singletonMutex: any;
		singletonNames: string[];
	}

	interface TypeVariable<D> extends Type, AnnotatedElement {
		name: string;
		bounds: Type[];
		genericDeclaration: D;
		annotatedBounds: AnnotatedType[];
	}

	interface Annotation {}

	interface AbstractConfiguredSecurityBuilder<O, B>
		extends AbstractSecurityBuilder<O> {
		sharedObjects: { [index: string]: any };
		orBuild: O;
	}

	interface ProviderManagerBuilder<B>
		extends SecurityBuilder<AuthenticationManager> {}

	interface ExpressionParser {}

	interface AopInfrastructureBean {}

	interface FilterChain {}

	interface HttpServletRequest extends ServletRequest {
		method: string;
		parts: Part[];
		trailerFieldsReady: boolean;
		/**
		 * @deprecated
		 */
		requestedSessionIdFromUrl: boolean;
		requestedSessionIdFromURL: boolean;
		requestedSessionIdValid: boolean;
		requestedSessionIdFromCookie: boolean;
		session: HttpSession;
		cookies: Cookie[];
		userPrincipal: Principal;
		servletPath: string;
		authType: string;
		headerNames: Enumeration<string>;
		remoteUser: string;
		requestURI: string;
		requestURL: StringBuffer;
		pathInfo: string;
		contextPath: string;
		queryString: string;
		trailerFields: { [index: string]: string };
		pathTranslated: string;
		httpServletMapping: HttpServletMapping;
		requestedSessionId: string;
	}

	interface HttpServletResponse extends ServletResponse {
		status: number;
		trailerFields: Supplier<{ [index: string]: string }>;
		headerNames: string[];
	}

	interface SecurityBuilder<O> {}

	interface Aware {}

	interface AnnotatedType extends AnnotatedElement {
		type: Type;
		annotatedOwnerType: AnnotatedType;
	}

	interface Part {
		name: string;
		size: number;
		inputStream: any;
		contentType: string;
		headerNames: string[];
		submittedFileName: string;
	}

	interface HttpSession {
		id: string;
		creationTime: number;
		/**
		 * @deprecated
		 */
		valueNames: string[];
		/**
		 * @deprecated
		 */
		sessionContext: HttpSessionContext;
		attributeNames: Enumeration<string>;
		new: boolean;
		servletContext: ServletContext;
		lastAccessedTime: number;
		maxInactiveInterval: number;
	}

	interface Cookie extends Cloneable, Serializable {
		name: string;
		value: string;
		comment: string;
		domain: string;
		maxAge: number;
		path: string;
		secure: boolean;
		version: number;
		httpOnly: boolean;
	}

	interface Principal {
		name: string;
	}

	interface Enumeration<E> {}

	interface StringBuffer
		extends AbstractStringBuilder,
			Serializable,
			Comparable<StringBuffer>,
			CharSequence {
		length: number;
	}

	interface HttpServletMapping {
		pattern: string;
		servletName: string;
		mappingMatch: MappingMatch;
		matchValue: string;
	}

	interface Locale extends Cloneable, Serializable {}

	interface ServletContext {
		classLoader: ClassLoader;
		majorVersion: number;
		minorVersion: number;
		serverInfo: string;
		/**
		 * @deprecated
		 */
		servletNames: Enumeration<string>;
		/**
		 * @deprecated
		 */
		servlets: Enumeration<Servlet>;
		sessionTimeout: number;
		attributeNames: Enumeration<string>;
		contextPath: string;
		initParameterNames: Enumeration<string>;
		jspConfigDescriptor: JspConfigDescriptor;
		servletRegistrations: { [index: string]: ServletRegistration };
		requestCharacterEncoding: string;
		responseCharacterEncoding: string;
		virtualServerName: string;
		effectiveMajorVersion: number;
		sessionCookieConfig: SessionCookieConfig;
		defaultSessionTrackingModes: SessionTrackingMode[];
		effectiveMinorVersion: number;
		effectiveSessionTrackingModes: SessionTrackingMode[];
		servletContextName: string;
		filterRegistrations: { [index: string]: FilterRegistration };
	}

	interface AsyncContext {
		timeout: number;
		request: ServletRequest;
		response: ServletResponse;
	}

	interface ServletRequest {
		protocol: string;
		scheme: string;
		inputStream: any;
		locale: Locale;
		contentLength: number;
		contentLengthLong: number;
		contentType: string;
		reader: any;
		localPort: number;
		localName: string;
		characterEncoding: string;
		attributeNames: Enumeration<string>;
		asyncStarted: boolean;
		dispatcherType: DispatcherType;
		servletContext: ServletContext;
		parameterMap: { [index: string]: string[] };
		serverName: string;
		serverPort: number;
		remoteAddr: string;
		parameterNames: Enumeration<string>;
		secure: boolean;
		asyncSupported: boolean;
		asyncContext: AsyncContext;
		remotePort: number;
		remoteHost: string;
		localAddr: string;
		locales: Enumeration<Locale>;
	}

	interface Supplier<T> {}

	interface ServletOutputStream extends OutputStream {
		ready: boolean;
	}

	interface PrintWriter extends Writer {}

	interface ServletResponse {
		locale: Locale;
		outputStream: ServletOutputStream;
		contentType: string;
		characterEncoding: string;
		writer: PrintWriter;
		committed: boolean;
		bufferSize: number;
	}

	interface Iterable<T> {}

	interface PropertySource<T> {
		name: string;
		source: T;
	}

	interface AbstractSecurityBuilder<O> extends SecurityBuilder<O> {
		object: O;
	}

	/**
	 * @deprecated
	 */
	interface HttpSessionContext {
		/**
		 * @deprecated
		 */
		ids: Enumeration<string>;
	}

	interface Cloneable {}

	interface AbstractStringBuilder extends Appendable, CharSequence {}

	interface CharSequence {}

	interface Servlet {
		servletConfig: ServletConfig;
		servletInfo: string;
	}

	interface JspConfigDescriptor {
		taglibs: TaglibDescriptor[];
		jspPropertyGroups: JspPropertyGroupDescriptor[];
	}

	interface ServletRegistration extends Registration {
		mappings: string[];
		runAsRole: string;
	}

	interface SessionCookieConfig {
		name: string;
		path: string;
		comment: string;
		domain: string;
		maxAge: number;
		secure: boolean;
		httpOnly: boolean;
	}

	interface FilterRegistration extends Registration {
		servletNameMappings: string[];
		urlPatternMappings: string[];
	}

	interface OutputStream extends Closeable, Flushable {}

	interface Writer extends Appendable, Closeable, Flushable {}

	interface Appendable {}

	interface Comparable<T> {}

	interface ServletConfig {
		servletName: string;
		servletContext: ServletContext;
		initParameterNames: Enumeration<string>;
	}

	interface TaglibDescriptor {
		taglibLocation: string;
		taglibURI: string;
	}

	interface JspPropertyGroupDescriptor {
		buffer: string;
		pageEncoding: string;
		includePreludes: string[];
		urlPatterns: string[];
		isXml: string;
		includeCodas: string[];
		elIgnored: string;
		deferredSyntaxAllowedAsLiteral: string;
		defaultContentType: string;
		trimDirectiveWhitespaces: string;
		errorOnUndeclaredNamespace: string;
		scriptingInvalid: string;
	}

	interface Registration {
		name: string;
		className: string;
		initParameters: { [index: string]: string };
	}

	interface Flushable {}

	namespace eas {
		export type Language = 'CZECH' | 'ENGLISH' | 'GERMAN' | 'SLOVAK';
	}

	type ReadingCycleType = 'CYCLE_1C';

	type DatalakeResponseCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

	type ReadingState =
		| 'PRECREATED'
		| 'SUBMITTED'
		| 'VERIFIED'
		| 'NOT_VERIFIED'
		| 'DECLINED'
		| 'DECLINED_SAP';

	type Role = 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER';

	type MailState = 'QUEUED' | 'SENT' | 'CANCELED' | 'ERROR';

	type WebApplicationType = 'NONE' | 'SERVLET' | 'REACTIVE';

	type DispatcherType = 'FORWARD' | 'INCLUDE' | 'REQUEST' | 'ASYNC' | 'ERROR';

	type MappingMatch =
		| 'CONTEXT_ROOT'
		| 'DEFAULT'
		| 'EXACT'
		| 'EXTENSION'
		| 'PATH';

	type SessionTrackingMode = 'COOKIE' | 'URL' | 'SSL';
}
