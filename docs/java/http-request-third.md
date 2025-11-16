# Java 调用第三方 HTTP 接口

## 一览（方法/库）

1. Java 11 `HttpClient`（JDK 内置，支持 HTTP/2 & async）
2. `HttpURLConnection`（JDK 老方法，低级，不推荐）
3. Apache `HttpClient`（成熟、企业级，阻塞）
4. OkHttp3（高性能，移动端/服务端常用）
5. Retrofit（基于 OkHttp，声明式、强类型）
6. Spring `RestTemplate`（阻塞、简单；已被 WebClient 替代）
7. Spring `WebClient`（非阻塞、Reactive，Spring 推荐的新方式）
8. Spring Cloud `OpenFeign`（声明式 + 与 Spring Boot 集成好）
9. Hutool `HttpUtil`（工具化、代码极简，适合快速脚本）
10. AsyncHttpClient（基于 Netty，超高并发场景）
11. gRPC / Thrift（不是 HTTP/REST，但适用于点对点高效 RPC）

---

## 关键示例与说明（带优缺点与配置要点）

### 1) Java 11 `HttpClient`（推荐：非 Spring、想用标准 API）

```java
HttpClient client = HttpClient.newBuilder()
    .version(HttpClient.Version.HTTP_2)
    .connectTimeout(Duration.ofSeconds(5))
    .build();

HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/data"))
    .header("Authorization", "Bearer " + token)
    .GET()
    .build();

// 同步
HttpResponse<String> resp = client.send(req, BodyHandlers.ofString());
// 异步
client.sendAsync(req, BodyHandlers.ofString())
      .thenApply(HttpResponse::body)
      .thenAccept(System.out::println);
```

优点：标准库、支持 HTTP/2、内建 async（CompletableFuture）、无外部依赖。
缺点：功能没有 OkHttp 丰富（拦截器之类），但已很成熟。

---

### 2) Apache `HttpClient`

```java
CloseableHttpClient client = HttpClients.custom()
    .setDefaultRequestConfig(RequestConfig.custom()
        .setConnectTimeout(5000).setSocketTimeout(10000).build())
    .setConnectionManager(new PoolingHttpClientConnectionManager())
    .build();

HttpGet get = new HttpGet("https://api.example.com/data");
get.addHeader("Accept", "application/json");
try (CloseableHttpResponse resp = client.execute(get)) {
    String body = EntityUtils.toString(resp.getEntity());
}
```

优点：企业级、功能齐全（连接池、代理、身份认证、multipart、流式上传下载）。
缺点：API 比 OkHttp 稍笨重，但非常稳健。

---

### 3) OkHttp3（推荐：性能好、移动端与服务端都常用）

```java
OkHttpClient client = new OkHttpClient.Builder()
    .connectTimeout(5, TimeUnit.SECONDS)
    .readTimeout(10, TimeUnit.SECONDS)
    .build();

Request request = new Request.Builder()
    .url("https://api.example.com/data")
    .header("Authorization", "Bearer " + token)
    .build();

try (Response response = client.newCall(request).execute()) {
    String body = response.body().string();
}
```

优点：轻量、连接复用、拦截器（可用于签名/日志）、支持 WebSocket、Android 优选。
缺点：需外部依赖，但生态成熟。

---

### 4) Retrofit（基于 OkHttp，强类型/声明式客户端）

```java
public interface ApiService {
  @GET("users/{id}")
  Call<User> getUser(@Path("id") long id);
}
// 构建
Retrofit retrofit = new Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .addConverterFactory(JacksonConverterFactory.create())
    .client(okHttpClient)
    .build();
ApiService svc = retrofit.create(ApiService.class);
User user = svc.getUser(123).execute().body();
```

优点：接口化、易测、和 OkHttp + Jackson/Gson 无缝配合。
场景：客户端 SDK、安卓或需要强类型请求/响应时首选。

---

### 5) Spring `RestTemplate`（阻塞、简单）

```java
RestTemplate rt = new RestTemplate();
String s = rt.getForObject("https://api.example.com/data", String.class);
```

说明：Spring 官方在新项目中推荐用 `WebClient`（Reactive），但 `RestTemplate` 仍广泛使用于同步场景。若用 Spring Boot 且不需要 reactive，这仍可接受。

---

### 6) Spring `WebClient`（推荐：Spring 应用、尤其是 Reactive）

```java
WebClient wc = WebClient.builder()
    .baseUrl("https://api.example.com")
    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token)
    .build();

Mono<String> mono = wc.get().uri("/data")
    .retrieve()
    .bodyToMono(String.class);

String body = mono.block(); // 如果在阻塞环境使用 block()
```

优点：非阻塞、支持 backpressure、和 Reactor 生态集成（Flux/Mono）、支持 HTTP/2。
缺点：学习曲线和编程模型与传统阻塞不同。

---

### 7) Spring Cloud `OpenFeign`（推荐：Spring 微服务 + 声明式）

```java
@FeignClient(name = "weather", url = "https://api.example.com")
public interface WeatherClient {
    @GetMapping("/v1/daily")
    WeatherResp getDaily(@RequestParam("lat") double lat, @RequestParam("lon") double lon);
}
```

优点：声明式（像调用本地方法），可与 Spring Boot 自动集成、支持拦截器、支持 Ribbon/LoadBalancer、容易与 Resilience4j/Retry/CircuitBreaker 结合。
缺点：增加了对 Spring Cloud 的依赖；底层 HTTP 客户端可定制（OkHttp/Apache）。

---

### 8) Hutool `HttpUtil`（快速脚本、工具化）

```java
String body = HttpUtil.get("https://api.example.com/data");
Map map = JSONUtil.toBean(body, Map.class);
```

优点：极简 API、适合小工具或脚本。
缺点：不适合复杂场景（限于工具类的便利性）。

---

### 9) AsyncHttpClient（Netty，超高并发非阻塞）

适合高并发、低延迟的非阻塞场景（比如并发抓取、大流量网关）。API 更贴近 Netty 风格，复杂度高。

---

## 哪个最推荐？

> **没有“单一最优”，取决于项目场景**。总结推荐策略：

- **Spring Boot 微服务（同步/常见企业后台）**：

  - 若你想用声明式、代码简洁、易维护：**OpenFeign + Resilience4j（或 Spring Retry）**。
  - 若你更喜欢传统阻塞方式且不想引入 Feign：**RestTemplate（但新项目建议迁移）或 Apache HttpClient/OkHttp 封装的客户端**。

- **Spring Boot / 想用 Reactive（非阻塞）**：**WebClient**（与 Reactor/Project Reactor 生态配合）。

- **非 Spring、希望使用标准 API**：**Java 11 `HttpClient`**（原生、支持 HTTP/2、async）。

- **需要高性能/Android/客户端 SDK**：**OkHttp + Retrofit**（Retrofit 用于构建强类型 SDK；OkHttp 用于高性能请求）。

- **简单脚本或工具**：**Hutool HttpUtil**（快速、少样板代码）。

- **超高并发 / 非阻塞底层**：**AsyncHttpClient（Netty）** 或 WebClient（依赖 Reactor Netty）。

---

## 实战建议 / 最佳实践（所有方案都适用）

- **设置超时（connect/read）**，避免线程泄露或长时间挂起。
- **连接池**：频繁请求用连接池（OkHttp、Apache HttpClient 都支持）。
- **重试 & 幂等性**：对幂等请求（GET、PUT、DELETE）可安全重试；POST 通常不可盲目重试。
- **熔断与限流**：使用 Resilience4j / Sentinel / Hystrix（已停更）做 circuit-breaker + bulkhead。
- **统一错误处理**：把 HTTP 错误码映射成自定义异常，便于上层处理/重试。
- **超大/流式响应**：用流式 API（InputStream、ResponseBody.stream）避免 OOM。
- **日志与上报**：记录请求 ID、URL、状态码、耗时（但不要在生产记录敏感 header）。
- **安全**：TLS 配置、证书校验、避免把 token 写入日志。支持 mTLS 时需配置 keystore。
- **测试**：使用 WireMock、MockWebServer（OkHttp 提供）或 Spring 的 MockRestServiceServer 做单元测试。
- **监控**：记录调用耗时（Histogram）、失败率，用 Prometheus/Zipkin 链路追踪。

---

## 简短决策表（快速选择）

- 想要声明式、Spring + 微服务 → **OpenFeign**
- 想要 Reactive（非阻塞）→ **WebClient**
- 非 Spring、标准且要 HTTP/2 & async → **Java 11 HttpClient**
- Android / SDK / 强类型接口 → **Retrofit + OkHttp**
- 性能、拦截器、稳定可靠 → **OkHttp** 或 **Apache HttpClient**
- 快速脚本 → **Hutool**

---

下面给你**完整、可复制运行**的示例与说明，覆盖三种常用方案：**RestTemplate（同步，Spring 传统）**、**WebClient（Reactive，Spring 推荐）**、**OkHttp3（高性能、轻量）**。每一节都有：

- 依赖（Maven）
- 推荐的 `Bean` / 客户端 构建代码（连接池 / 超时 / 拦截器）
- 常见使用示例（GET/POST/流/异步）
- 错误处理、重试、注意事项
- 小示例：把第三方返回的 JSON（你之前贴的天气结构）解析成 `WeatherDayDTO` 列表的思路/示例代码

> 注：Spring 官方已表明 `RestTemplate` 不再增加新特性，新的推荐方式是 `WebClient`（Reactive）。如果你在 Spring 生态新项目优先考虑 `WebClient`；但 `RestTemplate` 在很多同步场景仍然可用。([Home][1])

---

# 依赖（Maven）

```xml
<dependencies>
  <!-- Spring: RestTemplate (spring-boot-starter-web) -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>

  <!-- Spring WebClient (reactive) -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
  </dependency>

  <!-- OkHttp3 -->
  <dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>4.10.0</version>
  </dependency>
  <dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>logging-interceptor</artifactId>
    <version>4.10.0</version>
  </dependency>

  <!-- Jackson (JSON binding) -->
  <dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
  </dependency>
</dependencies>
```

---

# 共享 DTO（示例：WeatherDayDTO）

（你之前同意的 POJO，方便各客户端的映射）

```java
import lombok.Data;
import java.util.List;

@Data
public class WeatherDayDTO {
    private String date;
    private List<Double> location; // [lat, lng]
    private Temperature temp08h20h;
    private Temperature temp20h32h;
    private String skycon;
    private String skycon08h20h;
    private String skycon20h32h;
    private String comfort;

    @Data
    public static class Temperature {
        private double max;
        private double min;
        private double avg;
    }
}
```

---

# 1) RestTemplate（同步、传统 Spring）

- 何时用：你需要快速实现同步 API 调用、项目已有大量阻塞代码，或想在短期内兼容旧代码。
- 注意：Spring 官方推荐迁移到 `WebClient`，但 `RestTemplate` 仍然可用。([Home][1])

## 推荐 `RestTemplate` Bean（使用 Apache HttpClient 做连接池）

```java
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.client.config.RequestConfig;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
        cm.setMaxTotal(200);
        cm.setDefaultMaxPerRoute(50);

        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(5000)
                .setSocketTimeout(10000)
                .setConnectionRequestTimeout(2000)
                .build();

        CloseableHttpClient httpClient = HttpClients.custom()
                .setConnectionManager(cm)
                .setDefaultRequestConfig(requestConfig)
                .evictIdleConnections(30, java.util.concurrent.TimeUnit.SECONDS)
                .build();

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
        // 也可以 factory.setConnectTimeout(...);
        return new RestTemplate(factory);
    }
}
```

## 基本使用示例

```java
@Autowired
private RestTemplate restTemplate;

// GET -> String
String s = restTemplate.getForObject("https://api.example.com/data", String.class);

// GET -> POJO
MyResponse resp = restTemplate.getForObject("https://api.example.com/data/{id}", MyResponse.class, id);

// exchange（可操作 headers、method）
HttpHeaders headers = new HttpHeaders();
headers.set("Authorization", "Bearer " + token);
HttpEntity<Void> entity = new HttpEntity<>(headers);
ResponseEntity<String> response = restTemplate.exchange("https://api.example.com/data", HttpMethod.GET, entity, String.class);
```

## 自定义错误处理（ResponseErrorHandler）

```java
public class MyErrorHandler implements ResponseErrorHandler {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return (response.getStatusCode().series() == HttpStatus.Series.CLIENT_ERROR ||
                response.getStatusCode().series() == HttpStatus.Series.SERVER_ERROR);
    }

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        // 解析错误 body、抛出自定义异常
        String body = new String(response.getBody().readAllBytes(), StandardCharsets.UTF_8);
        throw new RuntimeException("Remote error: " + response.getStatusCode() + " body:" + body);
    }
}
```

并在 `RestTemplate` 中设置 `restTemplate.setErrorHandler(new MyErrorHandler());`

## 重试（Spring Retry 或 RetryTemplate）

示例使用 `RetryTemplate`（同步场景）：

```java
RetryTemplate retry = RetryTemplate.builder()
    .maxAttempts(3)
    .fixedBackoff(2000)
    .retryOn(Exception.class)
    .build();

String result = retry.execute(ctx ->
    restTemplate.getForObject("https://api.example.com/data", String.class)
);
```

## 将第三方天气 JSON 解析成 `WeatherDayDTO`（RestTemplate + Jackson）

```java
String json = restTemplate.getForObject(weatherUrl, String.class);
ObjectMapper mapper = new ObjectMapper();
JsonNode root = mapper.readTree(json);

List<WeatherDayDTO> list = new ArrayList<>();
JsonNode daily = root.path("result").path("daily");
JsonNode t08 = daily.path("temperature_08h_20h");
JsonNode t20 = daily.path("temperature_20h_32h");
JsonNode sky = daily.path("skycon");
JsonNode sky08 = daily.path("skycon_08h_20h");
JsonNode sky20 = daily.path("skycon_20h_32h");
JsonNode comfort = daily.path("life_index").path("comfort");
JsonNode location = root.path("location");
List<Double> loc = Arrays.asList(location.get(0).asDouble(), location.get(1).asDouble());

for (int i = 0; i < t08.size(); i++) {
    WeatherDayDTO dto = new WeatherDayDTO();
    dto.setDate(t08.get(i).get("date").asText());
    dto.setLocation(loc);

    WeatherDayDTO.Temperature tt1 = new WeatherDayDTO.Temperature();
    tt1.setMax(t08.get(i).get("max").asDouble());
    tt1.setMin(t08.get(i).get("min").asDouble());
    tt1.setAvg(t08.get(i).get("avg").asDouble());
    dto.setTemp08h20h(tt1);

    WeatherDayDTO.Temperature tt2 = new WeatherDayDTO.Temperature();
    tt2.setMax(t20.get(i).get("max").asDouble());
    tt2.setMin(t20.get(i).get("min").asDouble());
    tt2.setAvg(t20.get(i).get("avg").asDouble());
    dto.setTemp20h32h(tt2);

    dto.setSkycon(sky.get(i).get("value").asText());
    dto.setSkycon08h20h(sky08.get(i).get("value").asText());
    dto.setSkycon20h32h(sky20.get(i).get("value").asText());
    dto.setComfort(comfort.get(i).get("desc").asText());

    list.add(dto);
}
```

---

# 2) WebClient（Reactive，Spring 推荐的新方式）

- 何时用：新项目或需要非阻塞/响应式（高并发、流式处理、HTTP/2）时优先选。
- 官方文档示例与配置说明见 Spring WebClient 的配置页。([Home][2])

> 关于超时与 Reactor Netty 的配置，有很多细节（connect/read/write/responseTimeout），通常用 `TcpClient` 或 `HttpClient` 配置并通过 `ReactorClientHttpConnector` 注入 `WebClient`。关于 timeout 的实战指导和注意点可参考相关文章（如 Baeldung）。([Baeldung on Kotlin][3])

## 推荐 Bean（带超时）

```java
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import reactor.netty.http.client.HttpClient;
import reactor.netty.tcp.TcpClient;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;

@Bean
public WebClient webClient() {
    TcpClient tcpClient = TcpClient.create()
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
            .doOnConnected(conn -> conn.addHandlerLast(new ReadTimeoutHandler(10))
                                        .addHandlerLast(new WriteTimeoutHandler(10)));

    HttpClient httpClient = HttpClient.from(tcpClient)
            .responseTimeout(Duration.ofSeconds(10));

    return WebClient.builder()
            .clientConnector(new ReactorClientHttpConnector(httpClient))
            .baseUrl("https://api.example.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
}
```

## 基本使用（Reactive 风格）

```java
@Autowired
private WebClient webClient;

// 非阻塞：返回 Mono<YourDto>
Mono<MyResponse> mono = webClient.get()
    .uri(uriBuilder -> uriBuilder.path("/data").queryParam("id", id).build())
    .retrieve()
    .onStatus(HttpStatus::is4xxClientError, resp -> Mono.error(new RuntimeException("4xx")))
    .bodyToMono(MyResponse.class);

// 获取结果（阻塞方式，不推荐在 reactive pipeline 之外频繁使用）
MyResponse result = mono.block(); // 小心：会阻塞当前线程
```

## POST 示例（发送 JSON）

```java
Mono<ResponseEntity<MyResponse>> resp = webClient.post()
    .uri("/submit")
    .bodyValue(requestBody) // 可传 POJO，自动序列化
    .retrieve()
    .toEntity(MyResponse.class);
```

## 错误处理与重试

```java
import reactor.util.retry.Retry;

// retry with exponential backoff
Mono<MyResponse> call = webClient.get().uri("/data")
    .retrieve()
    .bodyToMono(MyResponse.class)
    .retryWhen(Retry.backoff(3, Duration.ofMillis(500))
                    .filter(throwable -> !(throwable instanceof ClientErrorException)))
    .onErrorResume(e -> Mono.empty());
```

## 流式响应（Flux）

```java
Flux<Item> stream = webClient.get()
    .uri("/stream")
    .retrieve()
    .bodyToFlux(Item.class);
stream.subscribe(item -> { /* process item */ });
```

## 将天气 JSON 映射成 DTO（示例，WebClient + Jackson）

你可以让 `WebClient` 直接拿到字符串然后用 `ObjectMapper` 解析（或直接 `bodyToMono(JsonNode.class)`）：

```java
String json = webClient.get().uri(weatherUrl).retrieve().bodyToMono(String.class).block();
ObjectMapper mapper = new ObjectMapper();
JsonNode root = mapper.readTree(json);
// 同上 RestTemplate 解析逻辑 -> 构造 List<WeatherDayDTO>
```

**提示**：在 reactive 管道里直接使用 `bodyToMono(JsonNode.class)`，然后用 `.flatMapMany()` / `.map()` 在 Flux/Mono 中转换为 DTO 列表（非阻塞链式处理）。

---

# 3) OkHttp3（独立客户端，性能强、Android/SDK 常用）

- 何时用：非 Spring 应用、需要高性能并发连接、移动端或自己要写一个轻量 HTTP SDK。OkHttp 官方文档说明它支持同步 & 异步调用，并强调拦截器机制。([Square Open Source][4])

## 客户端构建（复用单例）

```java
import okhttp3.*;

OkHttpClient client = new OkHttpClient.Builder()
    .connectTimeout(5, TimeUnit.SECONDS)
    .readTimeout(10, TimeUnit.SECONDS)
    .writeTimeout(10, TimeUnit.SECONDS)
    .connectionPool(new ConnectionPool(10, 5, TimeUnit.MINUTES))
    .addInterceptor(new HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY))
    .build();
```

## 同步 GET 示例

```java
Request request = new Request.Builder()
    .url("https://api.example.com/data")
    .header("Authorization", "Bearer " + token)
    .get()
    .build();

try (Response response = client.newCall(request).execute()) {
    if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
    String json = response.body().string(); // 注意：读取后流关闭
    // 用 Jackson 解析 json -> DTO
}
```

## 异步调用（非阻塞回调）

```java
client.newCall(request).enqueue(new Callback() {
    @Override
    public void onFailure(Call call, IOException e) {
        // 处理失败
    }
    @Override
    public void onResponse(Call call, Response response) throws IOException {
        try (ResponseBody body = response.body()) {
            if (!response.isSuccessful()) {
                // 处理错误
            } else {
                String json = body.string();
            }
        }
    }
});
```

## 流式下载（避免 OOM）

```java
try (Response response = client.newCall(request).execute()) {
    try (InputStream is = response.body().byteStream()) {
        Files.copy(is, Paths.get("file.bin"), StandardCopyOption.REPLACE_EXISTING);
    }
}
```

## Multipart 上传

```java
RequestBody requestBody = new MultipartBody.Builder()
    .setType(MultipartBody.FORM)
    .addFormDataPart("file", "data.bin",
        RequestBody.create(new File("..."), MediaType.parse("application/octet-stream")))
    .addFormDataPart("param", "value")
    .build();

Request req = new Request.Builder().url(uploadUrl).post(requestBody).build();
```

## 拦截器（日志 / 添加 header / 统一签名）

OkHttp 的拦截器是强大的机制，用来记录/修改请求与响应或实现自动重试（但要小心幂等性）。官方文档和社区多篇文章都强调了拦截器的作用。([Square Open Source][5])

示例拦截器（添加 Authorization header）：

```java
public class AuthInterceptor implements Interceptor {
    private final String token;
    public AuthInterceptor(String token) { this.token = token; }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request original = chain.request();
        Request req = original.newBuilder()
                .header("Authorization", "Bearer " + token)
                .build();
        return chain.proceed(req);
    }
}
```

## 将天气 JSON 映射成 DTO（OkHttp + Jackson）

```java
Request request = new Request.Builder().url(weatherUrl).get().build();
try (Response response = client.newCall(request).execute()) {
    String json = response.body().string();
    ObjectMapper mapper = new ObjectMapper();
    JsonNode root = mapper.readTree(json);
    // reuse 上面 RestTemplate 示例中把 JsonNode -> List<WeatherDayDTO> 的转换逻辑
}
```

---

# 小结比较（要点）

- **RestTemplate**

  - 优点：API 简单、阻塞风格、项目迁移成本低。
  - 缺点：不再是 Spring 的重点（未来方向是 `WebClient`）。适合传统同步场景。([Home][1])

- **WebClient**

  - 优点：非阻塞、支持 HTTP/2、与 Reactor 生态良好、用于高并发与流式场景最佳。
  - 缺点：需要理解 Reactive 编程（Mono/Flux），误用 `.block()` 会导致阻塞并丧失优势。官方文档与社区文章有大量 timeout/connector 的配置示例。([Home][2])

- **OkHttp3**

  - 优点：轻量、高性能、优秀的拦截器机制、Android 与独立 Java 应用常用。支持同步/异步。官方文档说明其拦截器与使用方式。([Square Open Source][4])
  - 缺点：需要手写很多样板（或自己封装），不是 Spring 特化（你可以在 Spring 中用它作为底层 HTTP 客户端）。

---

# 最佳实践（通用）

1. **单例化客户端**（OkHttpClient、WebClient、RestTemplate）并复用。
2. **设置合理超时**（connect/read/write/response）。
3. **连接池**：频繁调用启用连接池（HttpClient/OkHttp/Netty）。
4. **关闭响应体**：读完 `ResponseBody` 必须关闭，避免连接泄露。
5. **重试策略**：仅对幂等请求做重试；用指数退避并设置最大尝试次数。
6. **熔断/限流**：外部服务不稳定时使用 Resilience4j / Sentinel。
7. **日志与敏感数据**：避免把完整 Authorization/token 写入生产日志。
8. **测试**：用 WireMock 或 MockWebServer 做 HTTP 层单元测试。
