# 第 5 篇 · 多语言绑定概览：同一套 Gherkin，四处落地

> feature 文件是完全通用的（换语言一行不改），变的只是"绑定层"。本篇速览 JavaScript、Python、.NET 三条主流路线的最小可跑工程（Java 见第 4 篇），并给出选型建议。

---

## 一、选型总览

| 绑定 | 语言 | 安装 | 写法风格 | 适用 |
| --- | --- | --- | --- | --- |
| Cucumber-JVM | Java/Kotlin | Maven/Gradle | `@When(...)` 注解 | 企业后端（本系列主线） |
| **Cucumber-JS** | JS/TS | npm | `When(..., fn)` 函数 | 前端 E2E / Node 服务 |
| **behave** | Python | pip | `@when` 装饰器 | Python 测试团队 |
| **Reqnroll** | C#/.NET | NuGet | `[When(...)]` 特性 | .NET 团队（SpecFlow 继任） |
| Behat | PHP | composer | 类似 | PHP 项目 |

> **.NET 特别提醒**：SpecFlow 已于 **2024-12-31 停止维护**（仓库删除、VS 插件下架），官方推荐的继任者是开源的 **Reqnroll**——语法与 SpecFlow 高度兼容，提供迁移文档。

## 二、Cucumber-JS（JavaScript）

### 2.1 工程搭建

```bash
mkdir cucumber-js-demo && cd cucumber-js-demo
npm init -y
npm install --save-dev @cucumber/cucumber      # 写作时点 13.x
```

目录约定：

```text
cucumber-js-demo/
├── features/
│   ├── login.feature                 # 特性文件(与 Java 完全通用)
│   └── step_definitions/
│       └── login.steps.js            # 步骤绑定
├── cucumber.mjs                      # 可选配置文件
└── package.json
```

### 2.2 步骤绑定（对应第 4 篇的登录场景）

`features/step_definitions/login.steps.js`：

```js
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert');

const users = {};        // 演示用内存用户库

Given('已注册用户 {string} 的密码为 {string}', function (username, password) {
  users[username] = password;
});

When('用户使用账号 {string} 密码 {string} 登录', function (username, password) {
  this.loginOk = users[username] === password;
});

Then('登录应成功', function () {
  assert.strictEqual(this.loginOk, true);
});

Then('登录应失败', function () {
  assert.strictEqual(this.loginOk, false);
});
```

要点：

- 占位符与 Java 相同（`{string}`/`{int}`/`{float}`），参数按顺序传入回调；
- 回调用**普通函数**（不是箭头函数）——`this` 是每个场景独立的世界（World），场景间状态隔离的机制与 Java 版一致；
- DataTable 用 `table.hashes()`（字典列表）/`table.rowsHash()`；DocString 作为最后一个参数 `function (json) {...}`。

### 2.3 配置与运行

`cucumber.mjs`（可选）：

```js
export default {
  default: {
    format: ['progress-bar', 'html:cucumber-report.html'],
    tags: 'not @wip',                 // 默认跳过 @wip 场景
  },
};
```

```bash
npx cucumber-js                                   # 跑全部
npx cucumber-js --tags "@冒烟测试"                 # 按标签过滤
```

## 三、behave（Python）

```bash
pip install behave
```

```text
behave-demo/
└── features/
    ├── login.feature                 # 同一套 feature 文件
    └── steps/
        └── login_steps.py
```

`features/steps/login_steps.py`：

```python
from behave import given, when, then

@given('已注册用户 "{username}" 的密码为 "{password}"')
def step_impl(context, username, password):
    context.users = getattr(context, "users", {})
    context.users[username] = password

@when('用户使用账号 "{username}" 密码 "{password}" 登录')
def step_impl(context, username, password):
    context.login_ok = context.users.get(username) == password

@then('登录应成功')
def step_impl(context):
    assert context.login_ok is True
```

```bash
behave                       # 运行 features/ 下所有场景
behave features/login.feature --tags=@冒烟测试
```

要点：步骤状态放在 `context`（每场景新建）；参数占位写在双引号里由 behave 提取；behave 同样支持 Gherkin 多语言关键词（feature 文件用 `# language:` 声明，具体中文关键词可用性以官方 i18n 文档为准）。

## 四、Reqnroll（C#/.NET）

```bash
dotnet new install Reqnroll.Templates        # 安装项目模板
dotnet new reqnroll -n BddDemo               # 生成带示例的工程
dotnet test                                  # 直接运行示例场景
```

步骤绑定用特性标注：

```csharp
[When("用户使用账号 {string} 密码 {string} 登录")]
public void WhenLogin(string username, string password) { ... }
```

Reqnroll 内置与 JUnit/pytest 类似的并行与报告机制，从 SpecFlow 迁移有官方指南，绑定代码几乎原样可用。

## 五、选型建议

1. **跟随主技术栈**：被测系统是 Java 后端就 Cucumber-JVM，前端 E2E 就 Cucumber-JS——绑定层要调用被测系统的驱动/客户端，语言一致省一半力气；
2. **feature 文件跨语言共享**：全栈项目里前端（JS）与后端（Java）可以共用同一批场景，各自绑定各自的自动化；
3. **先小后大**：从一个真实模块（如登录）试点，跑通"Example Mapping → feature → 绑定 → CI"全流程，再推广；
4. **绑定层就是自动化测试代码**：API 测试用 HTTP 客户端、UI 测试用 Playwright/Selenium——Cucumber 只管"编排"，不管"怎么访问系统"。

## 六、小结

- 语法一套，绑定四家：Java 注解 / JS 回调 / Python 装饰器 / C# 特性，心智完全相同；
- 每场景独立实例（或 World/context）是所有实现共有的隔离机制；
- .NET 团队注意 SpecFlow 已 EOL，新项目直接上 Reqnroll；
- 选型跟着被测系统走，场景文件天然跨语言共享。

下一篇上"大菜"：5 个不同业务形态的完整场景案例。

---

*导航：[系列目录](./index.md) · 上一篇：[第 4 篇 · Cucumber 实战（Java）](./04-cucumber-java.md) · 下一篇：[第 6 篇 · 场景案例合集](./06-case-studies.md)*
