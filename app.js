const editor = document.querySelector('#editor');
const thermalPaper = document.querySelector('#thermalPaper');
const templateSelect = document.querySelector('#templateSelect');
const saveStatus = document.querySelector('#saveStatus');
const charCount = document.querySelector('#charCount');
const toast = document.querySelector('#toast');
const emojiNotice = document.querySelector('#emojiNotice');
const previewDialog = document.querySelector('#previewDialog');
const previewContent = document.querySelector('#previewContent');
const previewPaper = document.querySelector('#previewPaper');
let paperWidth = 58;
let toastTimer;
let printRequested = false;

const templates = {
  romantica: 'Para mi amor ❤️\n\nEspero que disfrutes mucho este regalo.\nTe amo muchísimo.\n\nCon amor,\nTu nombre',
  cumpleanos: '¡Feliz cumpleaños! 🎂\n\nQue este nuevo año esté lleno de momentos hermosos, risas y sueños cumplidos.\n\nCon mucho cariño,\nTu nombre',
  aniversario: 'Feliz aniversario 💕\n\nGracias por cada momento compartido y por todo lo que todavía nos queda por vivir.\n\nTe quiero,\nTu nombre',
  gracias: 'Gracias ✨\n\nPor tu cariño, por estar siempre y por hacer que cada día sea un poquito mejor.\n\nCon mucho aprecio,\nTu nombre',
  felicitaciones: '¡Felicitaciones! ⭐\n\nTe merecés todo lo lindo que está por venir. Celebramos este logro con vos.\n\nUn abrazo,\nTu nombre',
  amistad: 'Para una gran amistad 🥰\n\nLa vida es más linda cuando se comparte con alguien como vos. Gracias por tantos momentos.\n\nCon cariño,\nTu nombre',
  personalizada: ''
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}
function persist() {
  localStorage.setItem('thermalDedication', JSON.stringify({ content: editor.innerHTML, paperWidth }));
  saveStatus.textContent = 'Guardado automáticamente';
  updateCount();
}
function updateCount() {
  const count = editor.innerText.replace(/\n/g, '').length;
  charCount.textContent = `${count} ${count === 1 ? 'carácter' : 'caracteres'}`;
  const hasEmoji = /[\u{1F300}-\u{1FAFF}]|❤️|💕|💖|✨/u.test(editor.innerText);
  emojiNotice.classList.toggle('notice-hidden', !hasEmoji);
}
function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem('thermalDedication'));
    if (saved?.content) editor.innerHTML = saved.content;
    if (saved?.paperWidth) setPaperWidth(saved.paperWidth, false);
  } catch { /* Datos locales inválidos: se inicia un mensaje vacío. */ }
  updateCount();
}
function setPaperWidth(width, shouldPersist = true) {
  paperWidth = Number(width);
  thermalPaper.classList.toggle('paper-58', paperWidth === 58);
  thermalPaper.classList.toggle('paper-80', paperWidth === 80);
  previewPaper.classList.toggle('paper-58', paperWidth === 58);
  previewPaper.classList.toggle('paper-80', paperWidth === 80);
  document.querySelectorAll('.paper-option').forEach(button => button.classList.toggle('is-active', Number(button.dataset.width) === paperWidth));
  document.querySelector('#paperBadge').textContent = `${paperWidth} mm`;
  if (shouldPersist) persist();
}
function focusEditor() { editor.focus(); }
function execute(command, value = null) {
  focusEditor();
  if (command === 'selectAll') document.execCommand('selectAll');
  else if (command === 'paste') navigator.clipboard?.readText().then(text => document.execCommand('insertText', false, text));
  else if (command === 'copy' || command === 'cut') document.execCommand(command);
  else document.execCommand(command, false, value);
  persist();
}
function insertText(value) {
  focusEditor();
  if (value === 'separator') value = '\n────────────\n';
  if (value === 'date') value = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' }).format(new Date());
  if (value === 'signature') value = '\n\n____________________\nFirma';
  document.execCommand('insertText', false, value);
  persist();
}

document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => execute(button.dataset.command)));
document.querySelectorAll('[data-insert]').forEach(button => button.addEventListener('click', () => insertText(button.dataset.insert)));
document.querySelectorAll('.paper-option').forEach(button => button.addEventListener('click', () => setPaperWidth(button.dataset.width)));
templateSelect.addEventListener('change', () => { editor.innerText = templates[templateSelect.value]; persist(); focusEditor(); });
document.querySelector('#fontFamily').addEventListener('change', event => execute('fontName', event.target.value));
document.querySelector('#fontSize').addEventListener('change', event => execute('fontSize', event.target.value));
document.querySelector('#textColor').addEventListener('input', event => execute('foreColor', event.target.value));
document.querySelector('#lineHeight').addEventListener('change', event => { focusEditor(); document.execCommand('formatBlock', false, 'p'); editor.style.lineHeight = event.target.value; persist(); });
editor.addEventListener('input', persist);
editor.addEventListener('keyup', updateCount);
document.querySelector('#clearMessage').addEventListener('click', () => { editor.innerHTML = ''; templateSelect.value = 'personalizada'; persist(); focusEditor(); showToast('Contenido borrado'); });
document.querySelector('#newMessage').addEventListener('click', () => { editor.innerHTML = ''; templateSelect.value = 'personalizada'; persist(); focusEditor(); showToast('Nuevo mensaje listo'); });
document.querySelector('#saveMessage').addEventListener('click', () => { persist(); showToast('Mensaje guardado en este dispositivo'); });
function openPreview() { previewContent.innerHTML = editor.innerHTML || '<span style="color:#aaa">Tu mensaje aparecerá aquí</span>'; previewDialog.showModal(); }
function printMessage() {
  if (printRequested) return;
  printRequested = true;
  window.print();
}
document.querySelector('#previewMessage').addEventListener('click', openPreview);
document.querySelector('#closePreview').addEventListener('click', () => previewDialog.close());
document.querySelector('#closePreviewBottom').addEventListener('click', () => previewDialog.close());
document.querySelector('#printMessage').addEventListener('click', printMessage);
document.querySelector('#printFromPreview').addEventListener('click', () => { previewDialog.close(); printMessage(); });
window.addEventListener('beforeprint', () => { document.documentElement.style.setProperty('--print-width', `${paperWidth}mm`); });
window.addEventListener('afterprint', () => { printRequested = false; });
restore();
