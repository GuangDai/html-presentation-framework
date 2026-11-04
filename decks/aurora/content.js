/** Aurora 内容与图形配置。 */
window.AuroraContent = {
  "deckMeta": {
    "documentTitle": "AURORA — 通用生成式多模态时间序列预测框架 (16:9 Presentation)",
    "homeSlide": 1,
    "homeButtonLabel": "⊞ 多路总览 (P2)",
    "homeButtonTitle": "返回第 2 页多路总览图 (快捷键: M)",
    "tocSubtitle": "点击任意章节直达对应精讲页面 · 按 M 键返回总架构 · 按 S 键或双击卡片开启聚光灯聚焦",
    "title": "AURORA",
    "subtitle": "通用生成式多模态时间序列预测框架 (ICLR 2026)",
    "defaultAnimSpeed": "normal"
  },
  "slides": [
    {
      "id": "slide-01",
      "slideNumber": 1,
      "sectionTag": "PART 01 · 问题诊断与范式突破",
      "navTitle": "背景与贡献",
      "layout": "contrast-slide",
      "title": "Aurora: 时间预测面临的多模态不足与本文贡献 ICLR 2026",
      "subtitle": "",
      "connectors": [
        "",
        "",
        ""
      ],
      "challengesSection": {
        "headerTag": "",
        "guideHint": "诊断维度：输入视角 · 跨模态交互 · 生成轨迹",
        "cards": [
          {
            "code": "不足 1",
            "title": "仅时间序列信息不充分",
            "visualKey": "contrast.blindness",
            "diagnostics": [
              {
                "badge": "周期混叠",
                "text": "历史观测视为扁平一维波形，多重潜伏周期相互混叠",
                "outcome": "跨周期相位失锁"
              },
              {
                "badge": "语境盲区",
                "text": "极端气象与节假日等外生驱动力仅存于领域文本",
                "outcome": "突发转折误判"
              }
            ],
            "footerChips": [
              {
                "label": "输入模态",
                "value": "仅 1D 数值序列"
              },
              {
                "label": "相位对齐",
                "value": "隐式混叠"
              },
              {
                "label": "外生感知",
                "value": "缺失"
              }
            ],
            "points": [
              "仅将历史观测视为扁平一维波形，多重潜伏周期混叠导致跨周期同相位关联难以显式对齐。",
              "极端气象、节假日与宏观事件等关键外部驱动力存在于文本中，纯数值模型无法感知此类语境。"
            ]
          },
          {
            "code": "不足 2",
            "title": "现有LLM 面向任务不同,不宜直接用",
            "visualKey": "contrast.redundancy",
            "diagnostics": [
              {
                "badge": " Token 冗余",
                "text": "冻结 ViT 与 BERT 输出数百 Token ，含大量语法与背景噪声",
                "outcome": "有效信号极度稀疏"
              },
              {
                "badge": "空间异构",
                "text": "多模态特征与一维时序分布差异显著，直接硬拼接",
                "outcome": "注意力权重发散"
              }
            ],
            "footerChips": [
              {
                "label": "原始序列",
                "value": "N_raw ≫ K"
              },
              {
                "label": "交互开销",
                "value": "O(N · N_raw)"
              },
              {
                "label": "模态耦合",
                "value": "异构冲突"
              }
            ],
            "points": [
              "冻结的预训练视觉（ViT）与语言（BERT）模型输出数百个 Token ，包含大量无关语法与背景噪声。",
              "异构模态特征空间与一维时间序列存在显著分布差异，简单拼接易导致跨模态注意力权重发散。"
            ]
          },
          {
            "code": "不足 3",
            "title": "传统只能点预测,基于噪声的流匹配生成路径复杂",
            "visualKey": "contrast.noiseStart",
            "diagnostics": [
              {
                "badge": "均值坍缩",
                "text": "MSE 确定性回归仅输出条件期望，抹平未来多峰不确定性",
                "outcome": "丢失分布形态"
              },
              {
                "badge": "无锚起点",
                "text": "常规生成模型从纯高斯白噪声 $\\mathcal{N}(0,I)$ 盲目出发",
                "outcome": "传输路径弯曲易发散"
              }
            ],
            "footerChips": [
              {
                "label": "生成起点",
                "value": "N(0, I) 白噪声"
              },
              {
                "label": "轨迹形态",
                "value": "高曲率漫长"
              },
              {
                "label": "预测输出",
                "value": "单点期望均值"
              }
            ],
            "points": [
              "传统均方误差（MSE）确定性回归仅能输出条件期望均值，无法刻画未来演化的多峰概率分布。",
              "常规生成式模型从纯高斯白噪声 $\\mathcal{N}(0, I)$ 出发，缺乏物理波形先验锚定，传输轨迹弯曲漫长。"
            ]
          }
        ]
      },
      "contributionsSection": {
        "headerTag": "",
        "guideHint": "点击任意卡片直达对应章节精讲 (P2–P7)",
        "cards": [
          {
            "code": "贡献 1",
            "title": "内生一维与二维双视角及外生文本三路协同编码",
            "visualKey": "contrast.auroraFoundation",
            "jumpToSlide": 1,
            "diagnostics": [
              {
                "badge": "频域折叠",
                "text": "FFT 自动识别主导周期 $P$，一维序列折叠为二维周期图",
                "outcome": "同相位纵轴对齐"
              },
              {
                "badge": "三路协同",
                "text": "外生文本 + 1D 局部时序 + 2D 内生周期图并行编码",
                "outcome": "全视角捕获先验"
              }
            ],
            "footerChips": [
              {
                "label": "协同支路",
                "value": "1D + 2D + Text"
              },
              {
                "label": "外部配图",
                "value": "零依赖内生构造"
              },
              {
                "label": "章节索引",
                "value": "P2 / P3 / P4"
              }
            ],
            "points": [
              "无需外部配图：利用快速傅里叶变换自动识别主导周期 $P$，将一维序列折叠为二维周期图像。",
              "构建外生领域文本、一维局部时序与二维内生周期图像三路并行编码架构，全面捕获多源先验。"
            ]
          },
          {
            "code": "贡献 2",
            "title": "蒸馏与双路引导注意力",
            "visualKey": "contrast.distillGuide",
            "jumpToSlide": 4,
            "diagnostics": [
              {
                "badge": "质心提纯",
                "text": "可学习质心查询 $C_0$ 交叉注意力过滤冗长背景 Token ",
                "outcome": "浓缩 K 个核心质心"
              },
              {
                "badge": "双路调制",
                "text": "合成跨模态相关性矩阵 $\\mathrm{Corr}$ 调制中路自注意力",
                "outcome": "精准增强趋势关联"
              }
            ],
            "footerChips": [
              {
                "label": "特征压缩",
                "value": "K ≪ N_raw"
              },
              {
                "label": "注意力引导",
                "value": "Corr 哈达玛调制"
              },
              {
                "label": "章节索引",
                "value": "P5 / P6"
              }
            ],
            "points": [
              "设计可学习质心蒸馏器（Distiller），将冗长视觉与文本特征提纯为 $K$ 个紧凑的核心领域质心。",
              "通过双路引导器生成跨模态相关性矩阵 $\\mathrm{Corr}$，动态调制一维时序主干的多头自注意力权重。"
            ]
          },
          {
            "code": "贡献 3",
            "title": "基于先验库的流匹配生成",
            "visualKey": "contrast.pgfmStraight",
            "jumpToSlide": 6,
            "diagnostics": [
              {
                "badge": "原型锚定",
                "text": "多模态质心软检索周期与趋势原型库合成先验 $\\tilde{\\mathcal{P}}$",
                "outcome": "物理波形生成起点"
              },
              {
                "badge": "直线流场",
                "text": "在未来条件 $X^{\\text{cond}}$ 制导下拟合最优传输速度场 $v_\\theta$",
                "outcome": "少步积分生成分布"
              }
            ],
            "footerChips": [
              {
                "label": "流场起点",
                "value": "合成原型 P̃"
              },
              {
                "label": "传输轨迹",
                "value": "零曲率直线 ODE"
              },
              {
                "label": "章节索引",
                "value": "P7"
              }
            ],
            "points": [
              "以精炼多模态特征检索可学习原型库，合成兼具周期与趋势形态的先验波形 $\\tilde{\\mathcal{P}}$ 作为生成起点。",
              "在未来条件 $X^{\\text{cond}}$ 制导下预测最优传输直线速度场 $v_\\theta$，经少量几步欧拉积分生成预测分布 $\\hat{Y}$。"
            ]
          }
        ]
      },
      "connectorStyle": "arrows",
      "showCardDescriptions": false
    },
    {
      "id": "slide-02",
      "slideNumber": 2,
      "sectionTag": "PART 02 · 全局多路协同拓扑",
      "navTitle": "多路总架构",
      "layout": "architecture-slide",
      "title": "Aurora 算法整体多路架构",
      "subtitle": "",
      "bandDivider": true,
      "encoderBand": {
        "bandTag": "Encoder · 三路跨模态对齐与融合",
        "visualKey": "arch.encoderMultiStream"
      },
      "decoderBand": {
        "bandTag": "Decoder",
        "visualKey": "arch.decoderMultiStream"
      },
      "bandWeights": [
        3,
        2
      ]
    },
    {
      "id": "slide-03",
      "slideNumber": 3,
      "sectionTag": "PART 03 · 中路主干：一维时序流",
      "navTitle": "1D 时序支路",
      "layout": "pipeline-slide",
      "title": "时序一维分块与编码",
      "subtitle": "",
      "cols": 5,
      "showStepCaptions": false,
      "steps": [
        {
          "stepCode": "STEP 1",
          "title": "可逆实例归一化",
          "theme": "sky",
          "visualKey": "stream1d.revin",
          "ioFlow": [
            "非平稳原序列",
            "均值/方差剥离",
            "零均值同分布"
          ],
          "specs": [
            {
              "tag": "物理作用",
              "text": "消除多传感器非平稳偏移与量纲差异",
              "tone": "sky"
            },
            {
              "tag": "逆向闭环",
              "text": "缓存 $(\\mu, \\sigma)$ 供解码末端逆还原",
              "tone": "slate"
            }
          ],
          "chainOp": "零均值单位方差标准化",
          "chainLatex": [
            "\\mu = \\mathrm{Mean}(x_{1:T}),\\; \\sigma = \\mathrm{Std}(x_{1:T})",
            "\\tilde{x}_t = (x_t - \\mu) / (\\sigma + \\epsilon)"
          ],
          "chainDim": "\\mathbb{R}^{T} \\to \\mathbb{R}^{T}",
          "caption": "逐通道减去历史均值 $\\mu$ 并除以标准差 $\\sigma$，消除非平稳偏移与物理量纲差异；统计量缓存用于预测末端逆还原。"
        },
        {
          "stepCode": "STEP 2",
          "title": "序列首部左补零对齐",
          "theme": "sky",
          "visualKey": "stream1d.leftPad",
          "ioFlow": [
            "原长 $T$",
            "左补 $r$ 零",
            "整除长 $NP$"
          ],
          "specs": [
            {
              "tag": "填充位置",
              "text": "仅在序列最左侧填充 $r$ 个零值",
              "tone": "sky"
            },
            {
              "tag": "时序保真",
              "text": "确保最新观测时刻完整落在末尾分块",
              "tone": "blue"
            }
          ],
          "chainOp": "首部余数补零扩展",
          "chainLatex": [
            "r = (P - (T \\bmod P)) \\bmod P",
            "\\tilde{x}_{\\text{pad}} = [\\mathbf{0}_{r},\\; \\tilde{x}_{1:T}]"
          ],
          "chainDim": "\\mathbb{R}^{T} \\to \\mathbb{R}^{N P}",
          "caption": "当序列长度 $T$ 无法被分块长度 $P$ 整除时，在序列最左侧填充 $r$ 个零值，保证最新历史时刻完整落在末尾分块中。"
        },
        {
          "stepCode": "STEP 3",
          "title": "非重叠等长窗口分块",
          "theme": "blue",
          "visualKey": "stream1d.patching",
          "ioFlow": [
            "等齐序列 $NP$",
            "按窗口 $P$ 切块",
            "局部块矩阵 $X_p$"
          ],
          "specs": [
            {
              "tag": "结构重塑",
              "text": "切分为 $N$ 个非重叠连续局部时间块",
              "tone": "blue"
            },
            {
              "tag": "语义粒度",
              "text": "单行保留窗口 $P$ 内短时局部波形",
              "tone": "slate"
            }
          ],
          "chainOp": "一维序列重塑为块矩阵",
          "chainLatex": [
            "N = (T + r) / P",
            "X_{p} = \\mathrm{Reshape}(\\tilde{x}_{\\text{pad}},\\; N,\\; P)"
          ],
          "chainDim": "\\mathbb{R}^{N P} \\to \\mathbb{R}^{N \\times P}",
          "caption": "将补齐后的序列按固定块长 $P$ 切分为 $N$ 个连续局部时间块，每一行代表一个局部时间窗口内的短时波形形态。"
        },
        {
          "stepCode": "STEP 4",
          "title": "嵌入权重线性插值",
          "theme": "blue",
          "visualKey": "stream1d.resample",
          "ioFlow": [
            "预训练核 $W_0$",
            "块长维线性插值",
            "动态核 $W_{\\text{time}}$"
          ],
          "specs": [
            {
              "tag": "动态适配",
              "text": "将基准维度 $P_0$ 连续插值缩放至目标 $P$",
              "tone": "blue"
            },
            {
              "tag": "零重训泛化",
              "text": "单一权重无缝适配任意采样率与周期",
              "tone": "teal"
            }
          ],
          "chainOp": "嵌入核动态线性插值",
          "chainLatex": [
            "\\alpha(p) = (p / P) \\cdot P_0",
            "W_{\\text{time}} = \\mathrm{Interp}_{1\\text{D}}(W_0,\\; P_0 \\to P)"
          ],
          "chainDim": "\\mathbb{R}^{P_0 \\times D} \\to \\mathbb{R}^{P \\times D}",
          "caption": "沿块长维度对预训练嵌入矩阵 $W_0$ 执行线性插值重采样，使模型无需重新训练即可适配不同采样率与窗口长度 $P$。"
        },
        {
          "stepCode": "STEP 5",
          "title": "线性映射生成时序特征",
          "theme": "emerald",
          "visualKey": "stream1d.embedding",
          "ioFlow": [
            "时序块 $X_p$",
            "线性投影",
            "特征 $X^{\\text{time}}$"
          ],
          "specs": [
            {
              "tag": "隐空间对齐",
              "text": "局部块矩阵乘动态权重映射至 $D$ 维",
              "tone": "teal"
            },
            {
              "tag": "下游流向",
              "text": "送入中路双路引导多头自注意力主干",
              "tone": "blue"
            }
          ],
          "chainOp": "矩阵乘法特征投影",
          "chainLatex": [
            "X_{p} \\in \\mathbb{R}^{N \\times P},\\; W_{\\text{time}} \\in \\mathbb{R}^{P \\times D}",
            "X^{\\text{time}} = X_{p}\\, W_{\\text{time}}"
          ],
          "chainDim": "\\mathbb{R}^{N \\times P} \\to \\mathbb{R}^{N \\times D}",
          "caption": "将切分好的时序块矩阵 $X_p$ 与重采样后的嵌入权重 $W_{\\text{time}}$ 相乘，投影至 $D$ 维隐空间生成初始时序特征 $X^{\\text{time}}$。"
        }
      ],
      "uniformColor": "blue"
    },
    {
      "id": "slide-04",
      "slideNumber": 4,
      "sectionTag": "PART 04 · 下路支路：二维内生周期图像流",
      "navTitle": "2D 周期图像",
      "layout": "pipeline-slide",
      "title": "时序的二维内生图像构建与编码",
      "subtitle": "",
      "cols": 7,
      "showStepCaptions": false,
      "steps": [
        {
          "stepCode": "STEP 1",
          "title": "频域提取主导周期",
          "theme": "teal",
          "focal": true,
          "visualKey": "stream2d.dft",
          "ioFlow": [
            "标准化序列",
            "FFT 峰值检索",
            "主导周期 $P$"
          ],
          "specs": [
            {
              "tag": "频谱分析",
              "text": "去除直流分量取最大主频 $f^*$",
              "tone": "teal"
            },
            {
              "tag": "内生周期",
              "text": "自动计算主导周期 $P = \\lfloor T/f^* \\rfloor$",
              "tone": "blue"
            }
          ],
          "chainOp": "频谱峰值识周期",
          "chainLatex": [
            "f^* = \\arg\\max |\\mathrm{FFT}(\\tilde{x})|",
            "P = \\lfloor T / f^* \\rfloor"
          ],
          "chainDim": "\\mathbb{R}^{T} \\to P \\in \\mathbb{Z}^{+}",
          "caption": "去除直流分量后经 FFT 提取幅值最大的非零主频 $f^*$，取整得到主导周期长度 $P$。"
        },
        {
          "stepCode": "STEP 2",
          "title": "二维周期矩阵折叠",
          "theme": "teal",
          "focal": true,
          "visualKey": "stream2d.periodFold",
          "ioFlow": [
            "一维序列",
            "按周期 $P$ 换行",
            "二维网格 $G$"
          ],
          "specs": [
            {
              "tag": "横轴语义",
              "text": "单周期内局部相位连续演进",
              "tone": "teal"
            },
            {
              "tag": "纵轴语义",
              "text": "不同周期的同相位时刻显式对齐",
              "tone": "blue"
            }
          ],
          "chainOp": "按周期换行重排",
          "chainLatex": [
            "K_p = \\lceil T / P \\rceil",
            "G = \\mathrm{Fold}_{2\\text{D}}(\\tilde{x}_{\\text{pad}}, K_p, P)"
          ],
          "chainDim": "\\mathbb{R}^{K_p P} \\to \\mathbb{R}^{K_p \\times P}",
          "caption": "左补零后按周期长度 $P$ 逐行折回为 $K_p$ 行矩阵，使不同周期的同相位点在纵轴对齐。"
        },
        {
          "stepCode": "STEP 3",
          "title": "双线性插值放缩",
          "theme": "sky",
          "visualKey": "stream2d.resize",
          "ioFlow": [
            "动态网格 $G$",
            "2D 双线性插值",
            "标准网格 $I_1$"
          ],
          "specs": [
            {
              "tag": "尺度统一",
              "text": "消除不同数据集 $K_p \\times P$ 尺寸差异",
              "tone": "sky"
            },
            {
              "tag": "标准分辨",
              "text": "统一放缩为 $H \\times W$ 正方形网格",
              "tone": "slate"
            }
          ],
          "chainOp": "二维双线性插值",
          "chainLatex": [
            "G \\in \\mathbb{R}^{K_p \\times P}",
            "I_1 = \\mathrm{Resize}(G, H, W)"
          ],
          "chainDim": "\\mathbb{R}^{K_p \\times P} \\to \\mathbb{R}^{H \\times W}",
          "caption": "通过二维双线性插值将任意尺寸的周期网格 $G$ 统一缩放为 $H \\times W$ 标准正方形网格。"
        },
        {
          "stepCode": "STEP 4",
          "title": "三通道复制扩展",
          "theme": "sky",
          "visualKey": "stream2d.repeat",
          "ioFlow": [
            "单通道图 $I_1$",
            "通道维复制 $\\times 3$",
            "三通道图 $I_3$"
          ],
          "specs": [
            {
              "tag": "接口对齐",
              "text": "沿通道维复制 3 份构造伪彩色图",
              "tone": "sky"
            },
            {
              "tag": "零改结构",
              "text": "无缝对接预训练 RGB 视觉主干",
              "tone": "slate"
            }
          ],
          "chainOp": "通道维复制叠加",
          "chainLatex": [
            "I_1 \\in \\mathbb{R}^{H \\times W \\times 1}",
            "I_3 = \\mathrm{Repeat}(I_1,\\; 3)"
          ],
          "chainDim": "\\mathbb{R}^{H \\times W} \\to \\mathbb{R}^{H \\times W \\times 3}",
          "caption": "将单通道周期灰度矩阵 $I_1$ 沿通道维复制 $3$ 份，构造三通道图像 $I_3$ 以对接预训练视觉模型。"
        },
        {
          "stepCode": "STEP 5",
          "title": "二维网格切块展平",
          "theme": "blue",
          "visualKey": "stream2d.patchFlatten",
          "ioFlow": [
            "图像 $I_3$",
            "$S \\times S$ 网格切块",
            "展平序列 $U_v$"
          ],
          "specs": [
            {
              "tag": "空间分块",
              "text": "切分为 $N_v$ 个非重叠局部图像块",
              "tone": "blue"
            },
            {
              "tag": "局部感受",
              "text": "每块同时包含周期内与跨周期邻域",
              "tone": "teal"
            }
          ],
          "chainOp": "网格分块与展平",
          "chainLatex": [
            "N_v = (H / S) \\cdot (W / S)",
            "U_v = \\mathrm{Patch}(I_3,\\; S^2)"
          ],
          "chainDim": "\\mathbb{R}^{H \\times W \\times 3} \\to \\mathbb{R}^{N_v \\times 3S^2}",
          "caption": "按 $S \\times S$ 像素网格切分为 $N_v$ 个局部图像块，并将每个二维块展平为特征向量。"
        },
        {
          "stepCode": "STEP 6",
          "title": "线性投影与位置编码",
          "theme": "blue",
          "visualKey": "stream2d.posEmbed",
          "ioFlow": [
            "块向量 $U_v$",
            "线性投影 + 位置",
            "视觉 Token $Z_v^{(0)}$"
          ],
          "specs": [
            {
              "tag": "维度对齐",
              "text": "通过 $W_v$ 线性映射至主干维度 $D$",
              "tone": "blue"
            },
            {
              "tag": "坐标感知",
              "text": "叠加可学习二维位置编码 $E_{\\text{pos}}^{2\\text{D}}$",
              "tone": "teal"
            }
          ],
          "chainOp": "投影与空间坐标注入",
          "chainLatex": [
            "U_v W_v \\in \\mathbb{R}^{N_v \\times D}",
            "Z_v^{(0)} = U_v W_v + E_{\\text{pos}}^{2\\text{D}}"
          ],
          "chainDim": "\\mathbb{R}^{N_v \\times 3S^2} \\to \\mathbb{R}^{N_v \\times D}",
          "caption": "通过线性层映射至 $D$ 维并叠加二维可学习空间位置编码 $E_{\\text{pos}}^{2\\text{D}}$，保留相位坐标感知。"
        },
        {
          "stepCode": "STEP 7",
          "title": "冻结 ViT 视觉编码",
          "theme": "emerald",
          "visualKey": "stream2d.vitEncode",
          "ioFlow": [
            "视觉 Token $Z_v^{(0)}$",
            "冻结 ViT 主干",
            "周期纹理 $H^{\\text{vis}}$"
          ],
          "specs": [
            {
              "tag": "参数冻结",
              "text": "复用预训练 ViT 先验，零微调开销",
              "tone": "slate"
            },
            {
              "tag": "特征输出",
              "text": "提取全局跨周期纹理表征 $H^{\\text{vis}}$",
              "tone": "teal"
            }
          ],
          "chainOp": "预训练视觉主干编码",
          "chainLatex": [
            "Z_v^{(0)} \\in \\mathbb{R}^{N_v \\times D}",
            "H^{\\text{vis}} = \\mathrm{ViT}(Z_v^{(0)})"
          ],
          "chainDim": "\\mathbb{R}^{N_v \\times D} \\to \\mathbb{R}^{N_v \\times D}",
          "caption": "输入冻结参数的预训练 Vision Transformer，提取全局跨周期演进纹理特征 $H^{\\text{vis}}$。"
        }
      ],
      "uniformColor": "blue"
    },
    {
      "id": "slide-05",
      "slideNumber": 5,
      "sectionTag": "PART 05 · 多模态特征提纯：质心自适应蒸馏",
      "navTitle": "模态特征蒸馏",
      "layout": "pipeline-slide",
      "title": "文本编码与多模态蒸馏",
      "subtitle": "",
      "cols": 4,
      "steps": [
        {
          "stepCode": "STEP 1",
          "title": "领域文本分词与位置嵌入",
          "theme": "sky",
          "visualKey": "distill.textTokenize",
          "ioFlow": [
            "外生领域文本",
            "子词切分 + 位置",
            " Token 序列 $Z_t^{(0)}$"
          ],
          "specs": [
            {
              "tag": "语境来源",
              "text": "传感器物理属性、节假日与极端气象描述",
              "tone": "sky"
            },
            {
              "tag": "序列构造",
              "text": "切分为 $N_t$ 个子词并叠加位置编码 $E_{\\text{pos}}^{\\text{text}}$",
              "tone": "slate"
            }
          ],
          "chainOp": "子词切分与词向量嵌入",
          "chainLatex": [
            "U_t = \\mathrm{Tokenizer}(\\text{Text})",
            "Z_t^{(0)} = U_t W_e + E_{\\text{pos}}^{\\text{text}}"
          ],
          "chainDim": "\\text{Text} \\to \\mathbb{R}^{N_t \\times D}",
          "caption": "将传感器物理属性、节假日或气象事件描述切分为 $N_t$ 个子词 Token ，映射为词向量并叠加序列位置编码 $E_{\\text{pos}}^{\\text{text}}$。"
        },
        {
          "stepCode": "STEP 2",
          "title": "冻结预训练文本编码",
          "theme": "slate",
          "visualKey": "distill.pretrainedEncode",
          "ioFlow": [
            "文本 Token 输入",
            "冻结 BERT",
            "文本特征 $H^{\\text{text}}$"
          ],
          "specs": [
            {
              "tag": "知识复用",
              "text": "冻结预训练 BERT 权重提取文本表征",
              "tone": "slate"
            },
            {
              "tag": "维度对齐",
              "text": "投影至主干隐空间维度 $D$",
              "tone": "sky"
            }
          ],
          "chainOp": "冻结文本编码器前向提取",
          "chainLatex": [
            "H^{\\text{text}} = \\mathrm{BERT}(Z_t^{(0)})"
          ],
          "chainDim": "\\text{Text} \\to \\mathbb{R}^{N_t \\times D}",
          "caption": "通过冻结的 BERT 提取文本上下文语义特征 $H^{\\text{text}}$，并投影至主干隐空间。"
        },
        {
          "stepCode": "STEP 3",
          "title": "双路交叉注意力蒸馏",
          "theme": "blue",
          "focal": true,
          "colSpan": 2,
          "visualKey": "distill.dualAttention",
          "chainLatex": [
            "\\tilde{X}^{\\text{image}} = \\mathrm{VisionDistill}(R^{\\text{image}}, H^{\\text{vis}})",
            "\\tilde{X}^{\\text{text}} = \\mathrm{TextDistill}(R^{\\text{text}}, H^{\\text{text}})"
          ],
          "chainDim": "\\mathbb{R}^{N_{\\text{raw}} \\times D} \\to \\mathbb{R}^{K \\times D}"
        }
      ],
      "uniformColor": "blue",
      "showStepCaptions": false
    },
    {
      "id": "slide-06",
      "slideNumber": 6,
      "sectionTag": "PART 06 · 跨模态交互：双路引导与三路汇聚",
      "navTitle": "双路引导融合",
      "layout": "pipeline-slide",
      "title": "双路引导的自注意力与特征融合",
      "subtitle": "",
      "cols": 4,
      "showStepCaptions": false,
      "steps": [
        {
          "stepCode": "STEP 1",
          "title": "引导器生成模态得分",
          "theme": "sky",
          "visualKey": "align.guiders",
          "ioFlow": [],
          "specs": [],
          "chainOp": "双线性跨模态关联度计算",
          "chainLatex": [
            "Q^{m}=E_s W^{Q}_{s\\to m},\\quad K^{m}=\\hat{X}^{m}W_m",
            "S_m=Q^{m}(K^{m})^\\top / \\sqrt{d},\\quad m\\in\\{v,t\\}"
          ],
          "chainDim": "",
          "caption": ""
        },
        {
          "stepCode": "STEP 2",
          "focal": true,
          "title": "视觉与文本得分合成引导矩阵",
          "theme": "blue",
          "visualKey": "align.bilinear",
          "ioFlow": [],
          "specs": [],
          "chainOp": "双路相关性矩阵加权合成",
          "chainLatex": [
            "M_{\\text{guide}} = S_v W_g S_{\\text{text}}^\\top",
            "M_{\\text{guide}} = S_v W_g S_v^\\top\\quad (\\text{无文本})"
          ],
          "chainDim": "",
          "caption": ""
        },
        {
          "stepCode": "STEP 3",
          "focal": true,
          "title": "引导矩阵加到注意力得分",
          "theme": "blue",
          "visualKey": "align.mgmsa",
          "ioFlow": [
            "内积 + $\\mathrm{Corr}$",
            "哈达玛调制",
            "引导后 $\\tilde{X}^{\\text{time}}$"
          ],
          "specs": [
            {
              "tag": "哈达玛调制",
              "text": "将 $\\mathrm{Corr}$ 与点积注意力矩阵逐元素相乘 ($\\odot$)",
              "tone": "blue"
            },
            {
              "tag": "深层演化",
              "text": "经 $K$ 层堆叠放大与未来趋势一致的历史块权重",
              "tone": "teal"
            }
          ],
          "chainOp": "相关性调制多头自注意力",
          "chainLatex": [
            "A=\\mathrm{Softmax}((QK^\\top+M_{\\text{guide}})/\\sqrt{d})",
            "\\hat{X}^{\\text{time}}=\\mathrm{Encoder}(X^{\\text{time}};M_{\\text{guide}})"
          ],
          "chainDim": "",
          "caption": "将多模态相关矩阵 $\\mathrm{Corr}$ 与中路标准点积注意力分数逐元素哈达玛积（$\\odot$）调制，经 $K$ 层堆叠演化输出引导后时序特征 $\\tilde{X}^{\\text{time}}$。"
        },
        {
          "stepCode": "STEP 4",
          "title": "多模态特征融合",
          "theme": "emerald",
          "visualKey": "align.fuser",
          "ioFlow": [
            "三路表征",
            "交叉注意力残差",
            "融合 $X^{\\text{fuse}}$"
          ],
          "specs": [
            {
              "tag": "交叉对齐",
              "text": "以 $\\tilde{X}^{\\text{time}}$ 为 Query 分别对齐文本与视觉质心",
              "tone": "teal"
            },
            {
              "tag": "完备表征",
              "text": "残差相加输出兼具局部波形、周期与语境的 $X^{\\text{fuse}}$",
              "tone": "blue"
            }
          ],
          "chainOp": "三路交叉注意力残差融合",
          "chainLatex": [
            "G_v=\\mathrm{MCA}(\\hat{X}^{\\text{time}},\\hat{X}^{\\text{Vision}})",
            "G_t=\\mathrm{MCA}(\\hat{X}^{\\text{time}},\\hat{X}^{\\text{text}})",
            "X^{\\text{fuse}}=\\hat{X}^{\\text{time}}+G_v+G_t"
          ],
          "chainDim": "",
          "caption": "在 Modality Fuser 中以 $\\tilde{X}^{\\text{time}}$ 为 Query，分别与文本质心 $\\tilde{X}^{\\text{text}}$、视觉质心 $\\tilde{X}^{\\text{image}}$ 执行交叉注意力对齐并残差相加，输出 $X^{\\text{fuse}}$。"
        }
      ],
      "uniformColor": "blue"
    },
    {
      "id": "slide-07",
      "slideNumber": 7,
      "sectionTag": "PART 07 · 解码生成：先验原型检索与直线流匹配",
      "navTitle": "条件解码",
      "layout": "pipeline-slide",
      "title": "未来条件解码",
      "subtitle": "",
      "cols": 3,
      "showStepCaptions": false,
      "steps": [
        {
          "stepCode": "STEP 1",
          "title": "复制最后一个融合特征",
          "theme": "blue",
          "visualKey": "decoder.seed",
          "chainLatex": [
            "F=X^{\\text{fuse}},\\quad f_{\\text{last}}=F_{\\text{last}}",
            "C^0=\\mathrm{Repeat}(f_{\\text{last}},N)"
          ],
          "chainDim": ""
        },
        {
          "stepCode": "STEP 2",
          "title": "衰减条件与因果注意力",
          "theme": "blue",
          "visualKey": "decoder.causal",
          "chainLatex": [
            "w_i=2^{-(i-1)},\\quad \\bar C^0_i=w_i C^0_i",
            "C^n=\\mathrm{CausalTransformer}(\\bar C^0)"
          ],
          "chainDim": ""
        },
        {
          "stepCode": "STEP 3",
          "title": "N 层 RoPE 交叉注意力",
          "theme": "blue",
          "visualKey": "decoder.cross",
          "chainLatex": [
            "Q=C^n,\\quad K=F,\\quad V=F",
            "Z=\\mathrm{CrossAttentionStack}_{N}(C^n,F)"
          ],
          "chainDim": ""
        }
      ],
      "uniformColor": "blue"
    },
    {
      "id": "slide-08",
      "slideNumber": 8,
      "sectionTag": "PART 07 · 解码生成：先验原型检索与直线流匹配",
      "navTitle": "原型流匹配生成",
      "layout": "pipeline-slide",
      "title": "先验原型检索与流匹配生成",
      "subtitle": "",
      "cols": 3,
      "showStepCaptions": false,
      "steps": [
        {
          "stepCode": "STEP 1",
          "focal": true,
          "title": "多尺度先验原型库软检索",
          "theme": "teal",
          "visualKey": "decoder.prototype",
          "ioFlow": [
            "质心 $Q_{\\text{mm}}$",
            "原型库检索",
            "先验起点 $\\tilde{\\mathcal{P}}$"
          ],
          "specs": [
            {
              "tag": "基波词典",
              "text": "原型库涵盖正弦/余弦周期基与线性/指数趋势基",
              "tone": "teal"
            },
            {
              "tag": "告别白噪声",
              "text": "加权合成物理先验 $\\tilde{\\mathcal{P}}$ 替代盲目高斯噪声起点",
              "tone": "blue"
            }
          ],
          "chainOp": "多尺度周期与趋势原型检索",
          "chainLatex": [
            "\\alpha_{\\text{proto}} = \\mathrm{Softmax}(Q_{\\text{mm}} B_{\\text{bank}}^\\top / \\sqrt{D})",
            "\\tilde{\\mathcal{P}} = \\alpha_{\\text{proto}}\\, B_{\\text{bank}}"
          ],
          "chainDim": "B_{\\text{bank}} \\in \\mathbb{R}^{M_b \\times D} \\to \\tilde{\\mathcal{P}} \\in \\mathbb{R}^{N_p \\times D}",
          "caption": "以蒸馏后的视觉与文本质心构造查询向量 $Q_{\\text{mm}}$，与可学习原型库 $B_{\\text{bank}}$（涵盖正弦周期基与多项式趋势基）计算相似度，加权合成初始先验原型 $\\tilde{\\mathcal{P}}$。"
        },
        {
          "stepCode": "STEP 2",
          "focal": true,
          "title": "原型锚定条件流匹配速度场学习",
          "theme": "blue",
          "visualKey": "decoder.flowMatching",
          "ioFlow": [
            "起点 $Z_0 = \\tilde{\\mathcal{P}} + \\sigma_0\\epsilon$",
            "AdaLN 条件流网络",
            "直线速度场 $v_\\theta$"
          ],
          "specs": [
            {
              "tag": "直线轨迹",
              "text": "构造从先验 $Z_0$ 到真实分布 $Z_1$ 的零曲率线性插值路径",
              "tone": "blue"
            },
            {
              "tag": "速度回归",
              "text": "通过 AdaLN 注入条件 $X^{\\text{cond}}$，直接回归恒定速度向量",
              "tone": "teal"
            }
          ],
          "chainOp": "最优传输直线速度场回归",
          "chainLatex": [
            "Z_\\tau = (1 - \\tau)(\\tilde{\\mathcal{P}} + \\sigma_0 \\epsilon) + \\tau Z_1",
            "\\mathcal{L}_{\\text{FM}} = \\mathbb{E}\\big\\| v_\\theta(Z_\\tau, \\tau \\mid X^{\\text{cond}}) - (Z_1 - Z_0) \\big\\|_2^2"
          ],
          "chainDim": "v_\\theta \\in \\mathbb{R}^{N_p \\times D}",
          "caption": "以叠加高斯微扰 $\\epsilon$ 的先验原型 $Z_0 = \\tilde{\\mathcal{P}} + \\sigma_0 \\epsilon$ 为流起点，在流时间步 $\\tau \\in [0,1]$ 上通过 AdaLN 注入条件 $X^{\\text{cond}}$，训练网络预测指向真实分布 $Z_1$ 的直线速度向量 $v_\\theta$。"
        },
        {
          "stepCode": "STEP 3",
          "title": "前向欧拉积分与逆归一化还原",
          "theme": "emerald",
          "visualKey": "decoder.eulerOde",
          "ioFlow": [
            "先验 $Z_0$",
            "欧拉积分还原",
            "预测分布 $\\hat{Y}$"
          ],
          "specs": [
            {
              "tag": "少步采样",
              "text": "得益于直线轨迹，仅需少量几步前向欧拉积分即可收敛",
              "tone": "teal"
            },
            {
              "tag": "概率分布",
              "text": "多次噪声微扰采样刻画置信区间，经 $\\mathrm{RevIN}^{-1}$ 还原量纲",
              "tone": "sky"
            }
          ],
          "chainOp": "多步欧拉积分与物理量纲还原",
          "chainLatex": [
            "Z_{\\tau+\\Delta\\tau} = Z_\\tau + \\Delta\\tau\\, v_\\theta(Z_\\tau, \\tau \\mid X^{\\text{cond}})",
            "\\hat{Y} = \\mathrm{RevIN}^{-1}(Z_1 W_{\\text{out}})"
          ],
          "chainDim": "\\mathbb{R}^{N_p \\times D} \\to \\hat{Y} \\in \\mathbb{R}^{H_f}",
          "caption": "推理时从 $\\tau = 0$ 的先验起点 $Z_0$ 出发，沿预测速度场 $v_\\theta$ 执行常微分方程（ODE）欧拉数值积分到达 $\\tau = 1$，经线性投影与 RevIN 逆归一化输出最终预测分布 $\\hat{Y}$。"
        }
      ],
      "uniformColor": "blue"
    },
    {
      "id": "slide-09",
      "slideNumber": 9,
      "navTitle": "批判 1",
      "layout": "bento-slide",
      "title": "批判 1",
      "subtitle": "",
      "bentoCards": [
        {
          "code": "01",
          "title": "存在主张缺乏证据",
          "caption": "关于流匹配初始分布，论文提出：",
          "colSpan": 4,
          "theme": "blue",
          "evidence": {
            "text": "However, current methods still set the initial distributions as Standard Gaussians, which neglects the capability of Flow Matching to work like a stochastic interpolant.",
            "highlight": "Obviously, constructing appropriate prototype as the inital starting point can enhance the intuitiveness and stability of Flow Matching.",
            "translation": "然而，现有方法仍将初始分布设为标准高斯分布，忽视了流匹配作为随机插值器的能力。",
            "translationHighlight": "显然，构造合适的原型作为初始起点，可以增强流匹配的直观性和稳定性。"
          }
        },
        {
          "code": "02",
          "title": "模块设计过于复杂",
          "caption": "模块数量多、设计过于刻意，整体结构复杂。",
          "colSpan": 4,
          "theme": "blue"
        },
        {
          "code": "03",
          "title": "合成语料无法核验",
          "caption": "数据集未公开，语料由 AI 合成，无法验证其合理性。",
          "colSpan": 4,
          "theme": "blue",
          "evidence": {
            "text": "To generate the textual descriptions for the cross-domain multimodal time series corpus, we provide domain descriptions and raw time series for GPT-4, encouraging it generate the descriptions of data characteristics, which are only used for pretraining Aurora."
          },
          "notes": [
            "据 OpenReview，人工监督了 5%，其余 95% 的内容生成没有人工监督。",
            "评价：这种做法很容易偏离真实情况。"
          ]
        }
      ]
    },
    {
      "id": "slide-10",
      "slideNumber": 10,
      "navTitle": "批判 2",
      "layout": "bento-slide",
      "title": "批判 2",
      "subtitle": "",
      "bentoCards": [
        {
          "code": "04",
          "title": "没有任何消融实验",
          "caption": "没有任何消融实验，无法证明任何一个模块是否真的有效，尤其是在模块套模块的情况下。",
          "colSpan": 4,
          "theme": "blue"
        },
        {
          "code": "05",
          "title": "文本语义作用存疑",
          "caption": "独立研究在 Time-MMD 上干预文本内容：",
          "colSpan": 4,
          "theme": "blue",
          "notes": [
            "实验：将原文替换为空、常量、打乱、跨域或含未来值的文本，比较 Aurora、TaTS 和 MM-TSFlib 的预测。",
            "结果：三种模型的平均 MSE 变化均小于 0.5%；最大变化为 +0.16%。Aurora 的变化在 ±0.05% 内。",
            "分析：TaTS 和 MM-TSFlib 的增益受到同路径数值先验影响；Aurora 的文本路径在该实验中对内容不敏感。",
            "启用与禁用文本路径的对比，不能单独证明模型利用了文本语义。",
            "来源：arXiv:2608.22321，§4–5"
          ]
        },
        {
          "code": "06",
          "title": "效果来源有待验证",
          "caption": "猜测效果改善可能来自数据泄露，或 Prototype Bank 引入的先验。",
          "colSpan": 4,
          "theme": "blue",
          "notes": [
            "Prototype 的部分设计与 TimeBase（ICML 2025）中的方法类似：",
            "TimeBase 通过时间序列分解与矩阵学习得到潜在高频基，并用损失项抑制高频基之间过于相似。",
            "序列可表示为高频基的线性组合与低频成分之和。"
          ]
        }
      ]
    }
  ]
};
window.PresentationContent = window.AuroraContent;
