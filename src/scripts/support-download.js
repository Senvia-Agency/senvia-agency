const windowsHelp = 'Abre SENVIA-suporte.exe, escolhe Install / Instalar e confirma o pedido de administrador do Windows.';
const linuxHelp = "Na pasta do download, abre um terminal e executa:\ntar -xzf SENVIA-suporte.tar.gz\nchmod +x SENVIA-suporte\nsudo ./SENVIA-suporte -install\nMantém SENVIA-suporte e SENVIA-suporte.msh na mesma pasta. A partilha do ambiente de trabalho depende da sessão gráfica e das permissões do sistema.";
const downloads = {
  'windows-x64': { label: 'Windows', filename: 'SENVIA-suporte.exe', help: windowsHelp },
  'windows-arm64': { label: 'Windows ARM64', filename: 'SENVIA-suporte.exe', help: windowsHelp },
  'windows-x86': { label: 'Windows 32 bits', filename: 'SENVIA-suporte.exe', help: windowsHelp },
  macos: { label: 'macOS', filename: 'SENVIA-suporte.zip', help: 'Abre o ZIP e executa o pacote de instalação incluído. Nas Definições do Sistema → Privacidade e Segurança, dá ao agente as permissões de Acessibilidade e Gravação do ecrã. Se o macOS bloquear o pacote, contacta a SENVIA para verificar a origem antes de continuar. O ZIP inclui também uma opção de desinstalação.' },
  'linux-x64': { label: 'Linux x64', filename: 'SENVIA-suporte.tar.gz', help: linuxHelp },
  'linux-arm64': { label: 'Linux ARM64', filename: 'SENVIA-suporte.tar.gz', help: linuxHelp },
};
const select = document.querySelector('#support-system');
const link = document.querySelector('#support-download');
const detection = document.querySelector('#support-detection');
const filename = document.querySelector('#support-filename');
const installHelp = document.querySelector('#support-install-help');
const platformHelp = document.querySelector('#support-platform-help');
let manuallySelected = false;
function render(key) {
  const item = downloads[key];
  if (!item || !(link instanceof HTMLAnchorElement)) return;
  // o botão principal e os outros botões de download da página levam ao mesmo ficheiro
  document.querySelectorAll('.support-dl').forEach((a) => {
    a.href = `https://suporte.senvia.pt/download/${key}/${item.filename}`;
    const label = a.querySelector('span');
    if (label) label.textContent = `Descarregar para ${item.label}`;
  });
  if (!link.classList.contains('support-dl')) {
    link.href = `https://suporte.senvia.pt/download/${key}/${item.filename}`;
    link.querySelector('span').textContent = `Descarregar para ${item.label}`;
  }
  if (filename) filename.textContent = item.filename;
  if (installHelp) installHelp.textContent = item.help;
  // o computador 3D mostra o sistema escolhido
  document.dispatchEvent(new CustomEvent('support:os', { detail: { key, filename: item.filename } }));
}
if (select instanceof HTMLSelectElement) {
  select.addEventListener('change', () => {
    manuallySelected = true;
    render(select.value);
    detection.textContent = 'Versão escolhida por ti.';
    platformHelp.textContent = 'Instala esta versão no computador que vai receber assistência.';
  });
  const ua = navigator.userAgent;
  const mobile = /Android|iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let key = 'windows-x64';
  if (mobile) {
    detection.textContent = 'Estás num telemóvel ou tablet.';
    platformHelp.textContent = 'Abre senvia.pt/suporte no computador que vai receber assistência. Também podes escolher acima a versão para outro computador.';
  } else if (/Windows/i.test(ua)) {
    key = /ARM64|aarch64/i.test(ua) ? 'windows-arm64' : 'windows-x64';
    detection.textContent = 'Windows identificado · confirma a versão.';
  } else if (/Mac/i.test(navigator.platform || ua)) {
    key = 'macos';
    detection.textContent = 'macOS identificado · pacote para Apple Silicon e Intel.';
    platformHelp.textContent = 'O mesmo pacote serve computadores Apple Silicon e Intel.';
  } else if (/Linux/i.test(ua)) {
    key = /aarch64|arm64/i.test(ua) ? 'linux-arm64' : 'linux-x64';
    detection.textContent = 'Linux identificado · confirma a arquitetura.';
    platformHelp.textContent = 'Confirma se o processador é x64 ou ARM64 antes de instalar.';
  } else {
    detection.textContent = 'Não foi possível identificar o sistema. Escolhe abaixo.';
    platformHelp.textContent = 'Seleciona o sistema do computador que vai receber assistência.';
  }
  select.value = key;
  render(key);
  if (!mobile && navigator.userAgentData?.getHighEntropyValues) {
    navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness']).then(({ architecture, bitness }) => {
      if (manuallySelected || !/Windows|Linux/i.test(ua)) return;
      const os = /Windows/i.test(ua) ? 'windows' : 'linux';
      const exact = architecture === 'arm' && bitness === '64' ? `${os}-arm64` : architecture === 'x86' && bitness === '64' ? `${os}-x64` : os === 'windows' && architecture === 'x86' && bitness === '32' ? 'windows-x86' : null;
      if (exact && exact in downloads) {
        select.value = exact;
        render(exact);
        detection.textContent = `Sistema identificado: ${select.selectedOptions[0].textContent}.`;
        platformHelp.textContent = 'Podes escolher outra versão se o download for para um computador diferente.';
      }
    }).catch(() => {});
  }
}
