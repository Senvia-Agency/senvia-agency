const windowsHelp = 'Abra SENVIA-suporte.exe, escolha Install / Instalar e confirme o pedido de administrador do Windows.';
const linuxHelp = "Na pasta do download, abra um terminal e execute:\ntar -xzf SENVIA-suporte.tar.gz\nchmod +x SENVIA-suporte\nsudo ./SENVIA-suporte -install\nMantenha SENVIA-suporte e SENVIA-suporte.msh na mesma pasta. A partilha do ambiente de trabalho depende da sessão gráfica e das permissões do sistema.";
const downloads = {
  'windows-x64': { label: 'Windows', filename: 'SENVIA-suporte.exe', help: windowsHelp },
  'windows-arm64': { label: 'Windows ARM64', filename: 'SENVIA-suporte.exe', help: windowsHelp },
  'windows-x86': { label: 'Windows 32 bits', filename: 'SENVIA-suporte.exe', help: windowsHelp },
  macos: { label: 'macOS', filename: 'SENVIA-suporte.zip', help: 'Abra o ZIP e execute o pacote de instalação incluído. Nas Definições do Sistema → Privacidade e Segurança, conceda ao agente as permissões de Acessibilidade e Gravação do ecrã. Se o macOS bloquear o pacote, contacte a SENVIA para verificar a origem antes de prosseguir. O ZIP inclui também uma opção de desinstalação.' },
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
  link.href = `https://suporte.senvia.pt/download/${key}/${item.filename}`;
  link.querySelector('span').textContent = `Descarregar para ${item.label}`;
  filename.textContent = item.filename;
  installHelp.textContent = item.help;
}
if (select instanceof HTMLSelectElement) {
  select.addEventListener('change', () => {
    manuallySelected = true;
    render(select.value);
    detection.textContent = 'Versão escolhida por si.';
    platformHelp.textContent = 'Instale esta versão no computador que vai receber assistência.';
  });
  const ua = navigator.userAgent;
  const mobile = /Android|iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let key = 'windows-x64';
  if (mobile) {
    detection.textContent = 'Está num dispositivo móvel.';
    platformHelp.textContent = 'Abra senvia.pt/suporte no computador que vai receber assistência. Também pode escolher a versão para outro computador acima.';
  } else if (/Windows/i.test(ua)) {
    key = /ARM64|aarch64/i.test(ua) ? 'windows-arm64' : 'windows-x64';
    detection.textContent = 'Windows identificado · confirme a versão abaixo.';
  } else if (/Mac/i.test(navigator.platform || ua)) {
    key = 'macos';
    detection.textContent = 'macOS identificado · pacote para Apple Silicon e Intel.';
    platformHelp.textContent = 'O mesmo pacote inclui suporte para computadores Apple Silicon e Intel.';
  } else if (/Linux/i.test(ua)) {
    key = /aarch64|arm64/i.test(ua) ? 'linux-arm64' : 'linux-x64';
    detection.textContent = 'Linux identificado · confirme a arquitetura abaixo.';
    platformHelp.textContent = 'Confirme se o processador é x64 ou ARM64 antes de instalar.';
  } else {
    detection.textContent = 'Não foi possível identificar o sistema. Escolha abaixo.';
    platformHelp.textContent = 'Selecione o sistema do computador que vai receber assistência.';
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
        platformHelp.textContent = 'Pode escolher outra versão se o download for para um computador diferente.';
      }
    }).catch(() => {});
  }
}
