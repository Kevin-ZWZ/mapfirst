/* MapFirst keeps every decision on the user's device. No account or API is required. */
(() => {
  'use strict';

  const KEY = 'mapfirst.canvas.v1';
  const FIELDS = ['decision', 'options', 'unknowns', 'hypothesis', 'experiment', 'evidence', 'update'];
  const form = document.getElementById('decision-form');
  const status = document.getElementById('save-status');
  const progressNumber = document.getElementById('progress-number');
  const progressFill = document.getElementById('progress-fill');
  const progressMessage = document.getElementById('progress-message');

  const sample = {
    decision: '未来三个月，我要不要尝试做一个 AI 工具产品？',
    options: '继续当前工作，业余验证想法\n做一款小工具并公开发布\n先加入相关团队学习',
    unknowns: '目标用户是否真的有这个问题？\n他们目前如何解决？\n是否愿意持续使用或付费？',
    hypothesis: '独立创作者愿意用简单工具记录内容实验；如果 10 次访谈里少于 3 人有此痛点，就重新选题。',
    experiment: '7 天内访谈 10 位创作者，做一个可点击原型，请其中 3 位完成一次任务。',
    evidence: '',
    update: ''
  };

  function readForm() {
    return Object.fromEntries(FIELDS.map(key => [key, form.elements[key].value.trim()]));
  }

  function applyData(data) {
    for (const key of FIELDS) form.elements[key].value = typeof data[key] === 'string' ? data[key] : '';
    updateProgress();
  }

  function setStatus(message) {
    status.textContent = message;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(readForm()));
      setStatus('已保存在本机');
    } catch {
      setStatus('本地保存不可用，请导出 JSON');
    }
    updateProgress();
  }

  function updateProgress() {
    const data = readForm();
    const count = FIELDS.slice(1).filter(key => data[key]).length;
    progressNumber.innerHTML = `${count}<span>/6</span>`;
    progressFill.style.width = `${count / 6 * 100}%`;
    progressMessage.textContent = !data.decision
      ? '从一个具体问题开始。'
      : count < 2 ? '先列出选项与信息缺口。'
      : count < 4 ? '把判断写成可验证的小实验。'
      : count < 6 ? '行动后记录事实，再调整下一步。'
      : '完成一轮！需要时继续更新这张画布。';
  }

  function makePrompt(data) {
    return `你是我的决策研究助手，不是替我做决定的裁判。请先指出信息缺口、反例和需要核实的事实，再给出一个低成本的七天验证计划。不要编造数据；请明确标注推测。\n\n【我的问题】\n${data.decision || '（待填写）'}\n\n【目前看到的选项】\n${data.options || '（待填写）'}\n\n【信息缺口】\n${data.unknowns || '（待填写）'}\n\n【关键假设与证伪条件】\n${data.hypothesis || '（待填写）'}\n\n【已计划的小实验】\n${data.experiment || '（待填写）'}\n\n请按以下顺序回答：1. 我可能漏掉的选项；2. 最值得核实的五个问题；3. 每个关键假设的反证；4. 一个七天内可执行的最小实验；5. 复盘时该记录的指标。`;
  }

  function downloadJson(data) {
    const payload = JSON.stringify({ format: 'mapfirst', version: 1, exportedAt: new Date().toISOString(), canvas: data }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `mapfirst-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  form.addEventListener('input', save);

  document.getElementById('copy-prompt').addEventListener('click', async () => {
    const prompt = makePrompt(readForm());
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus('AI 提问模板已复制');
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = prompt;
      fallback.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.append(fallback);
      fallback.select();
      const copied = document.execCommand('copy');
      fallback.remove();
      setStatus(copied ? 'AI 提问模板已复制' : '复制失败，请尝试导出 JSON');
    }
  });

  document.getElementById('export-json').addEventListener('click', () => {
    downloadJson(readForm());
    setStatus('JSON 已导出');
  });

  document.getElementById('import-json').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error('文件超过 1 MB');
      const parsed = JSON.parse(await file.text());
      if (parsed.format !== 'mapfirst' || parsed.version !== 1 || !parsed.canvas || typeof parsed.canvas !== 'object') {
        throw new Error('不是 MapFirst v1 文件');
      }
      for (const key of FIELDS) if (parsed.canvas[key] !== undefined && typeof parsed.canvas[key] !== 'string') throw new Error('字段格式有误');
      applyData(parsed.canvas);
      save();
      setStatus('JSON 已导入');
    } catch (error) {
      setStatus(`导入失败：${error.message}`);
    } finally {
      event.target.value = '';
    }
  });

  document.getElementById('load-example').addEventListener('click', () => {
    if (FIELDS.some(key => form.elements[key].value.trim()) && !confirm('加载示例会覆盖当前画布，继续吗？')) return;
    applyData(sample);
    save();
    setStatus('示例已加载');
  });

  document.getElementById('clear-data').addEventListener('click', () => {
    if (!confirm('确定清空当前画布吗？此操作无法撤销。')) return;
    form.reset();
    try { localStorage.removeItem(KEY); } catch { /* Storage may be blocked. */ }
    updateProgress();
    setStatus('画布已清空');
    form.elements.decision.focus();
  });

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') applyData(saved);
  } catch { setStatus('本地数据无法读取'); }
  updateProgress();
})();
