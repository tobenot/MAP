
## “个人机械飞升程序 (Mechanical Ascension Program，MAP)” 综合设计稿 (React + GitHub Pages 融合版)

**文档版本：** 3.0
**日期：** 2025年6月2日
**核心前端框架：** React
**Web版托管平台：** GitHub Pages

---

### 一、核心设计哲学与架构

1.  **统一前端代码库 (React)：**
    * 采用 **React (v18+)**，以函数组件和Hooks为主要开发模式，构建整个应用的用户界面和核心交互逻辑。
    * 所有工作流的UI和非环境依赖的逻辑都在此React代码库中实现。
2.  **双重部署目标，同一代码基：**
    * **本地版 (Electron 应用)：** 将React前端应用打包成桌面程序。通过Electron的Node.js能力，实现完整的本地文件系统访问权限、执行系统命令、管理本地知识库等。这是功能最全面、数据最安全的核心版本。
    * **Web版 (GitHub Pages)：** 将React前端应用的静态构建包（HTML, CSS, JS）部署到GitHub Pages。提供轻量级、跨平台（包括手机）的访问。功能会因GitHub Pages的静态站点特性和浏览器沙箱限制而有所调整和限制。
3.  **条件化逻辑 (环境感知)：**
    * React组件内部通过逻辑判断（例如，检查`window.mapLocalApi`是否存在，或判断运行环境是否为浏览器标准环境）来区分当前运行环境，动态调整行为和可用功能。
4.  **核心价值定位：**
    * 智能的 **提示词工程引擎** 和个性化的 **工作流程引导者**。
    * 强调 **“万物皆文本”** 的处理思路。核心在于辅助用户高效生成提示词，并清晰引导完成任务步骤，以此减轻认知负担、节省时间。
    * 大部分工作流中，LLM的输出**不强制要求用户“粘贴回来”**由程序进行自动解析，MAP更侧重于引导用户进行下一步或手动利用LLM的输出。
5.  **数据流与状态：**
    * 清晰的单向数据流（在React中）。
    * 组件内部状态由React Hooks管理，全局或跨组件状态由选择的状态管理库（如Zustand）处理。

---

### 二、技术选型

1.  **前端UI框架：**
    * ✅ **React (v18+)**
2.  **本地版外壳：**
    * ✅ **Electron (最新稳定版)**
3.  **本地版后端逻辑 (Electron Main Process)：**
    * ✅ **Node.js (随Electron)**
4.  **状态管理 (React)：**
    * ✅ **Zustand** (推荐，轻量、简洁、对Hooks友好)
    * (备选) Redux Toolkit (功能全面，适合更复杂场景)
    * (备选) React Context API (用于简单的、局部状态共享)
5.  **路由 (React SPA)：**
    * ✅ **React Router (v6+)**
6.  **样式方案：**
    * ✅ **Tailwind CSS** (Utility-first，快速构建定制化界面)
    * (备选) MUI (Material UI), Ant Design, Chakra UI (提供丰富React UI组件)
7.  **HTTP请求：**
    * ✅ **Fetch API** (浏览器原生) 或 **Axios**
8.  **Web版托管：**
    * ✅ **GitHub Pages** (用于部署React应用的静态构建输出)
9.  **构建工具 (React)：**
    * ✅ **Vite** (极速开发体验和优化的构建输出)
10. **(可选) 轻量云服务 (配合GitHub Pages 使用)：**
    * **API代理/简单后端逻辑：** Vercel Serverless Functions, Netlify Functions, Cloudflare Workers (由于GitHub Pages是纯静态托管，任何需要后端逻辑的操作，如安全的API密钥管理和代理对LLM的调用，都需要这类外部服务)。
    * **云存储/数据库 (公共知识库或Web版数据)：** Firebase Realtime DB/Firestore (有免费额度), Supabase (开源Firebase替代品), 或直接从公开的GitHub Repo读取JSON/MD文件。

---

### 三、关键系统组件 (React实现思路)

1.  **React前端UI (共享代码库)：**
    * **描述：** 应用的整体用户界面，由可复用的React函数组件构成。采用模块化设计，包含布局、导航、各个工作流的操作界面、通用UI元素（按钮、输入框、模态框等）。
    * **React实现：** 使用JSX编写视图，通过React Hooks (useState, useEffect, useContext, useReducer等) 管理组件逻辑和状态。
2.  **Electron本地API桥接层 (`contextBridge`)：**
    * **描述：** 在Electron环境中，安全地将Node.js主进程的功能（如文件读写、执行系统命令、访问本地数据库/配置文件）暴露给React前端（渲染进程）。
    * **React实现：** Electron的预加载脚本中使用`contextBridge.exposeInMainWorld('mapLocalApi', { ...nodeFunctions })`。React组件中通过`window.mapLocalApi.functionName()`调用。可以封装成自定义React Hooks (如`useLocalApi`) 来简化组件内的调用。
3.  **工作流引擎 (React核心逻辑)：**
    * **描述：** 负责定义、管理和执行各个工作流的步骤和状态。引导用户按顺序完成工作流的各个阶段，为每个步骤提供清晰指示和必要的输入/输出界面。
    * **React实现：** 使用React的state (useState/useReducer) 或选择的全局状态库 (Zustand) 来管理当前激活的工作流实例、所处阶段、用户在当前工作流中的输入数据等。每个工作流可以是一个父组件，内部根据当前步骤动态渲染不同的子组件和提示信息。
4.  **提示词工程模块 (React核心逻辑)：**
    * **描述：** 根据当前工作流、上下文、用户输入、知识库信息以及预设模板，动态构建和优化LLM提示词。
    * **React实现：** 可以是一系列React组件（用于用户输入和配置）和纯JavaScript工具函数。使用模板字符串或专门的模板引擎处理占位符替换。生成的提示词在UI中清晰展示，并提供复制功能。
5.  **知识库管理模块：**
    * **描述：** 管理和访问本地及云端知识库。本地知识库存储敏感数据、私人笔记、项目文件等；云端知识库存储公开数据（如世界观）。
    * **React实现：**
        * **本地知识库交互 (Electron版)：** React组件通过`mapLocalApi`调用Electron后端接口进行文件/目录的增删改查。
        * **云端知识库交互 (Web版与Electron版)：** React组件使用Fetch/Axios从指定的URL（如GitHub Raw文件链接、云数据库API）异步获取数据，并在UI中展示或用于提示词生成。
6.  **LLM交互模块：**
    * **描述：** 处理与LLM的交互方式，主要包括手动提示词桥接和可选的直接API调用。
    * **React实现：**
        * **手动提示词桥接 (主要模式)：** React组件负责展示生成的提示词和“一键复制”按钮。用户将提示词复制到外部LLM客户端使用。大部分工作流中，程序不直接处理LLM返回的文本。
        * **直接API调用 (可选，针对特定API)：** React组件包含触发API调用的逻辑。
            * **Electron版：** API密钥可由Electron主进程从本地安全配置文件中读取和管理。
            * **GitHub Pages Web版：** 由于无法安全存储密钥，用户需在会话中输入API密钥，或者MAP通过调用部署在Vercel/Netlify等平台的Serverless Function作为代理来安全地发起对LLM API的请求。
7.  **配置管理模块：**
    * **描述：** 存储用户偏好（主题、语言）、API密钥（安全地）、本地知识库路径、自定义工作流配置等。
    * **React实现：**
        * **Electron版：** 通过`mapLocalApi`调用Electron后端，将配置存储在操作系统标准的应用数据目录下的JSON文件中。
        * **GitHub Pages Web版：** 使用浏览器的 `localStorage` 存储非敏感的UI偏好和配置。敏感信息（如临时API密钥）不应持久化存储在`localStorage`。
8.  **快速工作流配置/提示词模板模块：**
    * **描述：** 允许用户方便地定义和管理主要基于提示词生成的工作流模板和序列。
    * **React实现：** 使用React构建表单、列表等UI组件，让用户可以创建、编辑、保存和删除提示词模板（包含动态占位符）以及将模板串联成的工作流序列。这些配置数据：Electron版存本地文件；Web版可存`localStorage`或引导用户导出/导入JSON文件，或通过云服务同步（需额外开发）。

---

### 四、初步工作流设计 (React视角与GitHub Pages考量)

*(工作流描述将更侧重于MAP如何引导和生成提示词，而非处理LLM输出)*

**A. 翻译工作流**

* **React UI组件：** `TranslationWorkflow.js` 包含源文本输入框 (`textarea`)、目标语言选择器 (`select`)、结果展示区 (只读 `div` 或 `textarea`，如果结果由API返回)、“API快速翻译”按钮和“生成手动翻译提示词”按钮。
* **核心逻辑 (条件化)：**
    * **“API快速翻译”按钮 (`onClick` 事件)：**
        * **Electron版：** 调用`mapLocalApi.translateViaApi(text, targetLang)`，该API在主进程中处理密钥和API调用。
        * **GitHub Pages Web版：** 提示用户输入其轻量级LLM的API Key（如果未配置代理），或直接调用通过Serverless Function代理的翻译API。React组件使用Fetch/Axios发起请求，并用state更新结果区。
    * **“生成手动翻译提示词”按钮 (`onClick` 事件)：**
        * React组件根据当前输入的文本和选择的目标语言，调用提示词工程模块生成提示词，并更新到UI上一个专门展示提示词的区域（含复制按钮）。此工作流在MAP中的主要任务完成。
* **数据：** 组件state管理输入文本、目标语言、API返回的翻译结果（如果有）、生成的提示词。

**B. 小说写作工作流 (多工序，不同提示词)**

* **React UI组件：** 主组件 `NovelWriter.js` 管理整体流程状态。包含多个子组件对应不同工序，如 `OutlineGenerator.js`, `CharacterDesigner.js`, `ChapterDrafter.js` 等。可能包含一个简单的文本编辑区（如`textarea`或集成轻量编辑器如`react-quill`的简化版）供用户记录笔记或临时编辑从LLM获取的文本片段（非强制）。文件操作按钮（保存/加载草稿）。
* **核心逻辑 (多步骤引导，React state驱动)：**
    1.  **工序1: 核心构思与大纲生成。**
        * `OutlineGenerator.js` 提供表单让用户输入小说要素。点击按钮后，生成“小说大纲生成”提示词并展示。用户到LLM获取大纲后，可将关键点手动记录到MAP的笔记区或本地文件中。MAP引导进入下一步。
    2.  **后续工序 (角色、世界观、章节撰写、修改润色)：**
        * 每个工序由特定React组件负责，引导用户输入/选择上下文信息（如基于前一步的大纲点、角色卡片信息——这些信息可能由用户手动整理并输入到MAP的表单中，或从MAP管理的本地/云端知识库中读取后由组件填充到提示词生成逻辑中）。
        * MAP为每一步生成高度定制化的提示词并展示。
    * **草稿管理：**
        * **Electron版：** 通过`mapLocalApi`直接读写本地`.md`或`.txt`文件。
        * **GitHub Pages Web版：** 提示用户使用Native File System API手动选择文件进行加载/保存，或引导用户手动复制粘贴内容。`localStorage`仅适合非常短小的片段。
    * **知识库：** React组件从云端（如GitHub上的JSON文件）获取公共世界观数据展示和使用。本地私密知识库主要由Electron版通过`mapLocalApi`访问。

**C. 工作需求拆解执行工作流 (主要本地版)**

* **React UI组件：** `WorkTaskDecomposer.js` 包含需求描述输入区，任务列表展示区（可用React DnD库实现拖拽排序等），笔记区。
* **核心逻辑 (Electron版为主)：**
    * React组件引导用户输入需求，通过`mapLocalApi`可能访问本地项目上下文文件或配置。
    * 为需求澄清、任务拆解、技术方案设计、代码生成/评审等各个环节，生成高度针对性的提示词并展示。
    * 所有敏感数据和交互严格停留在本地。
* **GitHub Pages Web版限制：** 此工作流功能将大幅受限，几乎不可用，除非将其改造为一个非常通用的、不依赖本地文件和内部LLM的“任务笔记”或“通用提示词生成器”的简化版本。UI上会明确提示这些限制。

---

### 五、UI/UX 注意事项

* 利用React的声明式特性和组件化能力，构建模块化、易于维护和测试的UI。
* 使用清晰的视觉提示（如不同的图标、文本标签或界面区域）来区分本地版独有功能和Web版可用功能。
* 对于多步骤工作流，提供清晰的进度指示器（面包屑导航、步骤条等）和每一步的操作指南。
* React组件应处理好加载状态（如API请求时）、错误状态，并向用户提供友好的反馈。
* 确保Web版（GitHub Pages）的响应式设计，使其在移动设备上也能良好查阅和操作受支持的功能。

---

### 六、开发与构建

1.  **项目初始化：** 使用 `Vite` 创建React项目 (`npm create vite@latest my-map-app -- --template react-ts` 若使用TypeScript，推荐)。
2.  **Electron集成：** 后续添加Electron，可使用如 `vite-plugin-electron` 这样的Vite插件来简化开发和构建流程，使得Vite负责React部分的热更新和构建，Electron部分独立管理。
3.  **代码结构：**
    * `src/` 目录下存放所有React前端代码（components, hooks, services, contexts, workflows等）。
    * `electron/` 目录下存放Electron主进程和预加载脚本代码。
4.  **构建脚本 (`package.json`)：**
    * `dev`: 同时启动Vite开发服务器和Electron应用进行本地开发。
    * `build:web`: 构建用于部署到GitHub Pages的纯静态React应用（通常到`dist`或`build`目录）。
    * `build:electron`: 构建Electron应用，并将其打包成可执行文件。
5.  **GitHub Pages部署：**
    * 将`build:web`生成的静态文件推送到GitHub仓库的特定分支（如`gh-pages`）或主分支的`/docs`目录，并在仓库设置中启用GitHub Pages。
    * 配置React Router使用`HashRouter`或正确配置服务器（对于GitHub Pages，通常`HashRouter`更简单，或需要一个`404.html`技巧来配合`BrowserRouter`）。

---

### 七、安全与隐私

* **Electron本地版：** 数据存储和处理均在本地，由用户掌控。通过`contextBridge`暴露的Node.js功能应遵循最小权限原则。
* **GitHub Pages Web版：**
    * 纯静态站点，本身不执行服务器端代码。
    * **API密钥管理是核心挑战：**
        * 对于用户自己付费的轻量级LLM API，若希望在Web版直接调用，用户必须在每次会话中输入密钥，或由用户承担风险将密钥临时存储在浏览器内存中（不推荐持久化到`localStorage`）。
        * 更安全的做法是，这些API调用通过部署在外部的Serverless Function（如Vercel/Netlify Functions）进行代理，密钥安全地存储在这些Function的环境变量中。GitHub Pages前端仅调用这些受保护的代理端点。
    * **本地文件访问：** 仅能通过Native File System API，且需要用户每次明确授权，无法静默访问。
    * 清晰告知用户Web版的数据处理方式和潜在风险。
* **工作数据隔离：** “工作需求拆解执行工作流”的核心功能和数据严格限制在Electron本地版中。

---

### 八、Web版部署 (GitHub Pages) 特别说明

1.  **静态站点：** GitHub Pages仅托管静态文件 (HTML, CSS, JavaScript, 图像等)。React应用在构建后会生成这些静态文件。
2.  **无后端逻辑：** 不能在GitHub Pages服务器上直接运行Node.js、Python等后端代码。所有动态逻辑都在用户的浏览器中通过JavaScript执行。
3.  **路由：** 单页应用（SPA）使用`BrowserRouter`时，在GitHub Pages上刷新非根路径或直接访问深层链接可能导致404。解决方法：
    * 使用`HashRouter`（URL中带`#`号，如`example.com/repo/#/mypath`）。
    * 使用一些技巧，如在GitHub Pages自定义404页面中加入脚本重定向回`index.html`，让React Router接管。
4.  **API调用：**
    * 可以直接调用允许CORS的公共API。
    * 对于需要API密钥或有CORS限制的私有API（如多数LLM API），必须通过外部代理（如上述的Serverless Functions）进行，不能将密钥直接嵌入前端代码。
5.  **本地存储：** 可使用`localStorage`或`sessionStorage`存储少量非敏感数据或用户偏好。敏感信息不宜存放。

---