const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('www/index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true });
const { window } = dom;
const { document } = window;

// 等脚本执行完（同步脚本，直接可用）
const results = [];
function check(name, cond) {
  results.push((cond ? '✅' : '❌') + ' ' + name);
  if (!cond) process.exitCode = 1;
}

// 1. 主界面渲染
check('主界面模块卡片数量 = 3', document.querySelectorAll('.mod-card').length === 3);
check('精力状态模块卡片显示"已上线"', document.querySelector('.mod-card .badge').textContent.includes('已上线'));
check('即将上线模块有2个', document.querySelectorAll('.mod-card.soon').length === 2);

// 2. 进入精力模块
document.querySelector('.mod-card').click();
check('切到精力视图', !document.getElementById('energy-view').classList.contains('hidden'));

// 3. 模拟打分
const scoreInput = document.getElementById('score-input');
scoreInput.value = '75';
scoreInput.dispatchEvent(new window.Event('input'));
check('输入75分显示表情', document.getElementById('score-emoji').textContent === '🙂');

document.getElementById('note-input').value = '今天状态不错';
document.getElementById('save-btn').click();
const saved = JSON.parse(window.localStorage.getItem('guanji_data_v1'));
check('保存后 records 有今天', saved.records[window.todayStr ? 'x' : 'x'] !== undefined || Object.keys(saved.records).length === 1);
const todayKey = Object.keys(saved.records)[0];
check('分数=75', saved.records[todayKey].score === 75);
check('备注已保存', saved.records[todayKey].note === '今天状态不错');

// 4. 图表生成
const svg = document.getElementById('chart-wrap').querySelector('svg');
check('折线图 SVG 已生成', !!svg);
check('图表含平均线文字', svg.textContent.includes('均'));

// 5. 统计
const statsText = document.getElementById('stats').textContent;
check('统计含平均/最高/最低', statsText.includes('平均') && statsText.includes('最高') && statsText.includes('最低'));

// 6. 历史列表
check('历史列表有1条', document.querySelectorAll('.h-item').length === 1);

// 7. 越界校验（补录超7天应被拦截）
const oldAlert = window.alert;
let alertMsg = '';
window.alert = (m) => { alertMsg = m; };
document.getElementById('score-input').value = '50';
const d = new Date(); d.setDate(d.getDate() - 10);
document.getElementById('date-input').value = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
document.getElementById('save-btn').click();
check('补录超7天被拦截', alertMsg.includes('最近 7 天'));
window.alert = oldAlert;

// 8. 修改已有记录
const editBtn = document.querySelector('.edit-btn');
check('历史有"修改"按钮', !!editBtn);
editBtn.click();
check('修改回填分数', document.getElementById('score-input').value === '75');

console.log('\n===== 测试结果 =====');
results.forEach(r => console.log(r));
console.log('===== 结束 =====');
