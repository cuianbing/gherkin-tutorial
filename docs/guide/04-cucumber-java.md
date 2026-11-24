# 第 4 篇 · Cucumber 实战：Java 从零跑起来（重点篇）

> 前三篇的 feature 文件还是"纸面文档"，本篇把它们**变成会跑的测试**：搭 Maven 工程 → 写 feature → 写 Step Definitions（绑定代码） → 运行出报告。全程可照抄，约 30 分钟。

---

## 一、环境准备

| 组件 | 要求 | 说明 |
| --- | --- | --- |
| JDK | 17+ | `java -version` 验证 |
| Maven | 3.8+ | `mvn -v` 验证 |
| IDEA | IntelliJ IDEA | 装两个插件：**Gherkin**（语法高亮/校验）与 **Cucumber for Java**（feature ↔ 步骤代码跳转），一般已内置 |

## 二、创建工程与依赖

新建 Maven 工程 `cucumber-demo`，`pom.xml` 完整内容（版本号取写作时点稳定版，学习时刷新即可）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>demo</groupId>
  <artifactId>cucumber-demo</artifactId>
  <version>1.0.0</version>

  <properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <dependencyManagement>
    <dependencies>
      <!-- Cucumber 全家桶统一版本 -->
      <dependency>
        <groupId>io.cucumber</groupId>
        <artifactId>cucumber-bom</artifactId>
        <version>7.34.4</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
      <!-- JUnit 5 统一版本 -->
      <dependency>
        <groupId>org.junit</groupId>
        <artifactId>junit-bom</artifactId>
        <version>5.13.4</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <!-- 解析 feature + 提供步骤注解 -->
    <dependency>
      <groupId>io.cucumber</groupId>
      <artifactId>cucumber-java</artifactId>
      <scope>test</scope>
    </dependency>
    <!-- 作为 JUnit Platform 测试引擎运行 -->
    <dependency>
      <groupId>io.cucumber</groupId>
      <artifactId>cucumber-junit-platform-engine</artifactId>
      <scope>test</scope>
    </dependency>
    <!-- 断言库(Assertions.assertEquals 等) -->
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.junit.platform</groupId>
      <artifactId>junit-platform-launcher</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.5.4</version>
      </plugin>
    </plugins>
  </build>
</project>
```

## 三、目录结构（约定即约定，别发挥）

```text
cucumber-demo/
├── pom.xml
└── src/test/
    ├── java/
    │   └── demo/
    │       ├── RunCucumberTest.java        # 运行入口
    │       └── steps/
    │           └── LoginSteps.java         # 步骤绑定代码
    └── resources/
        ├── features/
        │   └── login.feature               # 特性文件
        └── junit-platform.properties       # Cucumber 配置
```

## 四、写特性文件

`src/test/resources/features/login.feature`：

```gherkin
# language: zh-CN
功能: 账户登录

  规则: 账号密码正确时登录成功

    场景: 正确密码登录
      假如 已注册用户 "tom" 的密码为 "t1234567"
      当 用户使用账号 "tom" 密码 "t1234567" 登录
      那么 登录应成功
      而且 应显示欢迎语 "欢迎回来,tom"

  规则: 密码错误时登录失败

    场景大纲: 各种错误密码的处理
      假如 已注册用户 "tom" 的密码为 "t1234567"
      当 用户使用账号 "tom" 密码 "<输入的密码>" 登录
      那么 登录应失败
      而且 应提示 "<提示信息>"

      例子:
        | 输入的密码  | 提示信息        |
        | wrong123    | 用户名或密码错误 |
        |             | 用户名或密码错误 |
```

> 中文 feature 直接可用（`# language: zh-CN` 可省略，Cucumber 默认探测）。IDEA 里打开若提示 missing steps（黄色下划线），正常——下一步就补上。

## 五、运行入口与配置

`src/test/java/demo/RunCucumberTest.java`：

```java
package demo;

import io.cucumber.junit.platform.engine.Cucumber;

@Cucumber          // 标记:把这个包作为 Cucumber 测试引擎的入口
public class RunCucumberTest {
}
```

`src/test/resources/junit-platform.properties`（Cucumber 的行为配置）：

```properties
cucumber.features=classpath:features
cucumber.glue=demo.steps
cucumber.plugin=pretty, html:target/cucumber-report.html, json:target/cucumber-report.json
cucumber.execution.parallel.enabled=false
```

四个键的含义：

| 键 | 含义 |
| --- | --- |
| `cucumber.features` | 特性文件位置（classpath 下的 features 目录） |
| `cucumber.glue` | 步骤绑定代码所在包（会递归扫描） |
| `cucumber.plugin` | 输出插件：pretty=控制台美化；html=生成报告；json=机读报告 |
| `cucumber.execution.parallel.enabled` | 并行执行开关（入门先关） |

## 六、写步骤绑定代码（核心环节）

Cucumber 把每个步骤按**文本模式**匹配到带注解的方法上。`src/test/java/demo/steps/LoginSteps.java`：

```java
package demo.steps;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.jupiter.api.Assertions;

import java.util.HashMap;
import java.util.Map;

public class LoginSteps {

    // 模拟被测系统:一个内存里的"用户库"与"登录结果"
    private final Map<String, String> users = new HashMap<>();
    private String loginResult;   // success / fail / null
    private String welcomeMsg;

    // ---------- Given:前置状态 ----------
    @Given("已注册用户 {string} 的密码为 {string}")
    public void 注册用户(String username, String password) {
        users.put(username, password);
    }

    // ---------- When:关键动作 ----------
    @When("用户使用账号 {string} 密码 {string} 登录")
    public void 登录(String username, String password) {
        String expected = users.get(username);
        if (expected != null && expected.equals(password)) {
            loginResult = "success";
            welcomeMsg = "欢迎回来," + username;
        } else {
            loginResult = "fail";
        }
    }

    // ---------- Then:断言结果 ----------
    @Then("登录应成功")
    public void 登录成功() {
        Assertions.assertEquals("success", loginResult, "期望登录成功");
    }

    @Then("登录应失败")
    public void 登录失败() {
        Assertions.assertEquals("fail", loginResult, "期望登录失败");
    }

    @Then("应显示欢迎语 {string}")
    public void 校验欢迎语(String expected) {
        Assertions.assertEquals(expected, welcomeMsg);
    }

    @Then("应提示 {string}")
    public void 校验提示(String expected) {
        // 真实项目里这里断言页面/接口返回的错误文案
        Assertions.assertNotNull(loginResult);
        Assertions.assertEquals("fail", loginResult);
    }
}
```

**两个关键机制**：

1. **Cucumber Expressions（参数提取）**：步骤文本里的 `{string}` `{int}` `{float}` `{word}` `{}` 是占位符，运行时把实际值转为方法参数——`当 用户使用账号 "tom" 密码 "x" 登录` 里的 `tom`/`x` 自动变成两个 String 入参。常用占位符速查：

| 表达式 | 匹配 | Java 参数类型 |
| --- | --- | --- |
| `{string}` | 引号字符串（单/双引号） | String |
| `{int}` | 整数（可负） | int / Integer |
| `{float}` | 小数 | float / Float |
| `{word}` | 单个单词 | String |
| `{}`（匿名） | 任意非空文本 | String |

2. **每个场景一个全新的步骤类实例**：`LoginSteps` 的字段在每个场景开始时都是新的——场景之间天然隔离，符合第 3 篇"场景独立性"纪律。

> 步骤文本匹配是**全局唯一**的：两个方法绑同一句文本会启动报错（Duplicate step definition）。

## 七、运行与结果解读

```bash
mvn test
```

期望输出（节选）：

```text
＠规则 账号密码正确时登录成功
  ＠场景 正确密码登录
    ✓ 假如 已注册用户 "tom" 的密码为 "t1234567"
    ✓ 当 用户使用账号 "tom" 密码 "t1234567" 登录
    ✓ 那么 登录应成功
    ✓ 而且 应显示欢迎语 "欢迎回来,tom"

＠规则 密码错误时登录失败
  ＠场景大纲 各种错误密码的处理
    ＠例子 第1行
      ✓ ...

3 Scenarios (3 passed)
8 Steps (8 passed)
```

- 场景大纲的每个例子算一个独立场景；
- 全绿后打开 `target/cucumber-report.html` 查看可读报告；
- **故意改错一个断言**再跑一次：对应场景标红、报告中标出失败步骤与断言差异——这就是"活文档"在工作。

IDEA 中也可直接点 feature 文件步骤左侧的绿色箭头运行单个场景。

## 八、DataTable 与 DocString 的绑定

**数据表**：步骤方法加一个 `io.cucumber.datatable.DataTable` 参数：

```gherkin
当 用户将以下商品加入购物车:
  | 商品 | 数量 | 单价  |
  | 苹果 | 2    | 5.00  |
  | 牛奶 | 1    | 12.50 |
```

```java
import io.cucumber.datatable.DataTable;

@When("用户将以下商品加入购物车:")
public void 加入商品(DataTable table) {
    List<Map<String, String>> rows = table.asMaps();     // [{商品=苹果,数量=2,...}, ...]
    int total = 0;
    for (Map<String, String> row : rows) {
        total += Integer.parseInt(row.get("数量")) * (int) Double.parseDouble(row.get("单价"));
    }
    cartTotal = total;
}
```

常用读取：`table.asList()`（按行）、`table.asMaps()`（首行为表头的字典列表）、`table.rowsHash()`（两列表格转 Map）。

**DocString**：作为 `String` 参数直接接收：

```gherkin
当 系统收到以下下单请求:
  """
  {"items":[{"sku":"A001","qty":2}]}
  """
```

```java
@When("系统收到以下下单请求:")
public void 收到请求(String jsonBody) {
    // 解析 jsonBody 并调用被测系统
}
```

## 九、Hooks：每个场景的前后置

```java
package demo.steps;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;

public class Hooks {

    @Before                                    // 每个场景前执行(可做环境重置/数据准备)
    public void beforeScenario(Scenario scenario) {
        System.out.println("开始场景: " + scenario.getName());
    }

    @After                                     // 每个场景后执行(UI 测试常在此截图)
    public void afterScenario(Scenario scenario) {
        if (scenario.isFailed()) {
            System.out.println("场景失败: " + scenario.getName() + ",附加现场信息");
            // scenario.attach(bytes, "image/png", "screenshot");
        }
    }
}
```

同类钩子可按 tag 过滤：`@Before("@支付相关")` 只对该标签场景生效。注意钩子在**每个场景**执行一次——场景间环境重置正是在这里做（呼应第 3 篇"场景独立性"）。

## 十、中文步骤注解（可选风格）

cucumber-java 内置了中文注解包，方法可以直接用中文注解，读起来与 feature 完全同构：

```java
import io.cucumber.java.zh_cn.假如;
import io.cucumber.java.zh_cn.当;
import io.cucumber.java.zh_cn.那么;

public class LoginStepsZh {

    @假如("已注册用户 {string} 的密码为 {string}")
    public void 注册用户(String username, String password) { /* 同前 */ }

    @当("用户使用账号 {string} 密码 {string} 登录")
    public void 登录(String username, String password) { /* 同前 */ }

    @那么("登录应成功")
    public void 登录成功() { /* 同前 */ }
}
```

`@假设`/`@假定` 是 `@假如` 的等价别名（同一方法可叠加多个别名注解）。与 `@Given/@When/@Then` 效果完全等价，团队统一选一种风格即可。

## 十一、常见问题（FAQ）

| 现象 | 原因与处理 |
| --- | --- |
| 步骤显示 undefined / 建议生成骨架 | 没有匹配的绑定方法：控制台会**直接打印建议的步骤骨架**，复制到步骤类改一改即可 |
| No tests found / feature 没执行 | `cucumber.features` 路径不对，或 feature 文件不在 test resources 编译范围内 |
| Step definition not found | `cucumber.glue` 包名与实际包不一致（注意 `demo.steps` 与类的 package 要一致） |
| Duplicate step definition | 同一句步骤文本被两个方法绑定；删掉重复或改写文本 |
| 控制台中文乱码（Windows） | 确认文件编码 UTF-8；Maven 加 `<argLine>-Dfile.encoding=UTF-8</argLine>` |
| 断言失败但找不到挂在哪个步骤 | 看报告里红色步骤的 stacktrace；pretty 插件输出里有定位 |
| 想并行提速 | 设 `cucumber.execution.parallel.enabled=true` 与并行策略——前提是步骤代码线程安全，入门阶段先别开 |
| 参数类型转换失败 | 文本与 `{int}` 等占位符类型不符；或自定义类型需要 `@ParameterType` 注册转换器 |

## 十二、小结

- 工程四件套：**feature（人读）+ steps（绑定）+ @Cucumber 入口 + junit-platform.properties（配置）**；
- 步骤绑定靠**文本模式匹配 + Cucumber Expressions 参数提取**；步骤文本全局唯一；
- 每场景新建步骤类实例 → 状态天然隔离；环境重置统一放 `@Before`；
- DataTable/DocString 把结构化数据送进绑定层；报告插件输出 HTML/JSON；
- 中文全链路可行：中文 feature + `io.cucumber.java.zh_cn` 中文注解。

下一篇看其他语言怎么接同一套 Gherkin，以及团队怎么选型。

---

*导航：[系列目录](./index.md) · 上一篇：[第 3 篇 · 写出好场景](./03-writing-scenarios.md) · 下一篇：[第 5 篇 · 多语言绑定概览](./05-bindings.md)*
